/**
 * AI Core - Unified Chat Orchestrator
 */
import prisma from '../../config/db.js'
import { generateSystemPrompt } from './prompts.js'
import { toolDefinitions, executeTool } from './tools.js'
import { callGroq, callGemini, callOpenRouter } from './providers.js'

/**
 * Strips raw tool-call artifacts like <function>...</function> or tool_name>{...}
 * if they leak into the conversational summary.
 */
const sanitizeOutput = (text) => {
    if (!text) return text
    return text
        .replace(/<function[\s\S]*?<\/function>/gi, '')
        .replace(/\w+>\{[\s\S]*?\}<\/function>/gi, '')
        .replace(/([(\[])+(\/|\[|<)?function(\]|:|>)?.*?(\n|$|[)\]])+/gi, '') // "Black-Hole" pattern for any technical markers
        .replace(/(update_todo|manage_tasks|update_user_profile|manage_selections)>[\s\S]*?(\n|$)/gi, '')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s+([.,!?;:])/g, '$1') // Clean up punctuation spaces
        .trim()
}

/**
 * Main chat processor with automatic failover
 */
export const processChat = async (userId, message) => {
    // 1. Fetch User & History
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const history = await prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
    })
    const chronologicalHistory = [...history].reverse()

    // 2. Prepare Context
    const systemPrompt = await generateSystemPrompt(user)
    const messages = [{ role: 'system', content: systemPrompt }]

    for (const m of chronologicalHistory) {
        let metadata = {}
        try { metadata = m.metadata ? JSON.parse(m.metadata) : {} } catch (e) { }
        const trs = metadata.toolResults || []

        if (m.role === 'user') {
            messages.push({ role: 'user', content: m.content })
        } else if (m.role === 'assistant') {
            if (trs.length > 0) {
                // Reconstruct tool calls for history consistency
                messages.push({
                    role: 'assistant',
                    content: m.content,
                    tool_calls: trs.map((tr, idx) => ({
                        id: `hist_${m.id}_${idx}`,
                        type: 'function',
                        function: { name: tr.tool, arguments: JSON.stringify(tr.args) }
                    }))
                })
                // Add tool results
                trs.forEach((tr, idx) => {
                    messages.push({
                        role: 'tool',
                        tool_call_id: `hist_${m.id}_${idx}`,
                        content: JSON.stringify(tr.result)
                    })
                })
            } else {
                messages.push({ role: 'assistant', content: m.content })
            }
        }
    }

    messages.push({ role: 'user', content: message })

    // 3. Failover Execution Loop
    let lastError = null
    let result = null

    const providers = [
        { name: 'GROQ', fn: (msgs = messages) => callGroq(msgs, toolDefinitions) },
        {
            name: 'GEMINI', fn: (msgs = messages) => {
                // Fallback: Gemini turn logic or just skip summary for Gemini for now
                // But let's try to extract from msgs if possible
                const sys = msgs.find(m => m.role === 'system')?.content || systemPrompt
                const userMsg = msgs[msgs.length - 1].content
                const hist = msgs.slice(1, -1)
                return callGemini(sys, hist, userMsg, toolDefinitions)
            }
        },
        { name: 'OPENROUTER', fn: (msgs = messages) => callOpenRouter(msgs, toolDefinitions) }
    ]

    for (const provider of providers) {
        try {
            console.log(`🚀 Attempting ${provider.name}...`)
            result = await provider.fn()
            break
        } catch (err) {
            console.error(`❌ ${provider.name} failed:`, err.message)
            lastError = err
        }
    }

    // 4. Handle Total Failure
    if (!result) {
        return {
            response: "I'm currently having trouble connecting to all my AI providers. Please try again in a moment.",
            model: 'ERROR'
        }
    }

    // 5. Tool Execution & Loop
    let toolResults = []
    let finalContent = result.content

    if (result.toolCalls && result.toolCalls.length > 0) {
        // Execute tools
        for (const tc of result.toolCalls) {
            const toolOutput = await executeTool(tc.name, tc.args, userId)
            toolResults.push({ tool: tc.name, args: tc.args, result: toolOutput })
        }

        // 6. SECOND TURN: Feed results back to AI for a conversational summary
        const toolMessages = [
            ...messages,
            {
                role: 'assistant',
                content: result.content || null,
                tool_calls: result.toolCalls.map(tc => ({
                    id: tc.id,
                    type: 'function',
                    function: { name: tc.name, arguments: JSON.stringify(tc.args) }
                }))
            },
            ...toolResults.map((tr, idx) => ({
                role: 'tool',
                tool_call_id: result.toolCalls[idx].id,
                content: JSON.stringify(tr.result)
            }))
        ]

        try {
            console.log(`🔄 Attempting conversational summary...`)
            // Use the same provider that succeeded
            const summaryProvider = providers.find(p => result.model.startsWith(p.name))
            if (summaryProvider) {
                const summaryResult = await summaryProvider.fn(toolMessages)
                finalContent = summaryResult.content
            }
        } catch (err) {
            console.error(`❌ Summary turn failed:`, err.message)
            // Fallback to generated message if summary fails
            finalContent = toolResults.map(tr => {
                if (tr.tool === 'get_university_info' && tr.result.success) {
                    return `I found details for ${tr.args.university_id}.`
                }
                return tr.result.message
            }).filter(Boolean).join('\n') || "Action completed."
        }
    }

    finalContent = sanitizeOutput(finalContent)
    if (!finalContent) finalContent = "How can I help you further?"

    // 7. Persist to Database
    await prisma.$transaction([
        prisma.chatMessage.create({ data: { userId, role: 'user', content: message } }),
        prisma.chatMessage.create({
            data: {
                userId,
                role: 'assistant',
                content: finalContent,
                metadata: JSON.stringify({ model: result.model, toolResults })
            }
        })
    ])

    // 8. Return to Controller
    return {
        response: finalContent,
        model: result.model,
        toolResults,
        actions: toolResults.map(tr => ({
            type: tr.tool,
            success: tr.result.success !== false,
            message: tr.result.message,
            data: tr.result.university || tr.result.todo || tr.result.universities || null
        }))
    }
}

/**
 * Fetch Chat History
 */
export const getChatHistory = async (userId, limit = 50) => {
    const messages = await prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit
    })

    return messages.reverse().map(m => {
        let metadata = {}
        try { metadata = m.metadata ? JSON.parse(m.metadata) : {} } catch (e) { }

        const trs = metadata.toolResults || []
        return {
            id: m.id,
            role: m.role,
            content: m.content,
            model: metadata.model,
            timestamp: m.createdAt,
            actions: trs.map(tr => ({
                type: tr.tool,
                success: tr.result.success !== false,
                message: tr.result.message,
                data: tr.result.university || tr.result.todo || tr.result.universities || null
            }))
        }
    })
}

/**
 * Clear History
 */
export const clearChatHistory = async (userId) => {
    await prisma.chatMessage.deleteMany({ where: { userId } })
}

export default { processChat, getChatHistory, clearChatHistory }
