/**
 * AI Providers Integration (Groq, Gemini, OpenRouter)
 */
import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Config
const GROQ_KEY = process.env.GROQ_API_KEY
const GEMINI_KEY = process.env.GEMINI_API_KEY
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY

// Clients
const groq = GROQ_KEY ? new Groq({ apiKey: GROQ_KEY }) : null
const genai = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null

/**
 * Standardized Provider Response Format:
 * { 
 *   content: string | null, 
 *   toolCalls: [{ name, args, id }] | null,
 *   model: string
 * }
 */

export const callGroq = async (messages, tools) => {
    if (!groq) throw new Error("Groq not configured")
    const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant', // Use smaller model to save tokens per day
        messages,
        tools,
        tool_choice: 'auto',
        temperature: 0.7
    })

    const msg = response.choices[0].message
    return {
        content: msg.content,
        toolCalls: msg.tool_calls?.map(tc => ({
            id: tc.id,
            name: tc.function.name,
            args: JSON.parse(tc.function.arguments)
        })),
        model: 'GROQ/Llama-3.3'
    }
}

export const callGemini = async (systemPrompt, history, userMessage, tools) => {
    if (!genai) throw new Error("Gemini not configured")

    const model = genai.getGenerativeModel({
        model: "gemini-1.5-flash", // Using stable 1.5-flash model
        systemInstruction: systemPrompt,
        tools: [{
            functionDeclarations: tools.map(t => ({
                name: t.function.name,
                description: t.function.description,
                parameters: t.function.parameters
            }))
        }]
    })

    // Gemini SDK requires history to start with a 'user' role
    let formattedHistory = history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '(Action performed)' }]
    }))

    const firstUserIndex = formattedHistory.findIndex(m => m.role === 'user')
    if (firstUserIndex !== -1) {
        formattedHistory = formattedHistory.slice(firstUserIndex)
    } else {
        formattedHistory = []
    }

    const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
        }
    })

    const result = await chat.sendMessage(userMessage)
    const response = result.response
    const funcCalls = response.functionCalls()

    return {
        content: response.text(),
        toolCalls: funcCalls?.map((fc, i) => ({
            id: `gemini-${Date.now()}-${i}`,
            name: fc.name,
            args: fc.args
        })),
        model: 'GEMINI/1.5-Flash'
    }
}

export const callOpenRouter = async (messages, tools) => {
    if (!OPENROUTER_KEY) throw new Error("OpenRouter not configured")

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://aicounsellor.vercel.app",
            "X-Title": "AICOUNSELLOR"
        },
        body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct",
            messages,
            tools,
            tool_choice: "auto"
        })
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`OpenRouter error ${response.status}: ${errorText.substring(0, 100)}`)
    }

    const data = await response.json()
    const msg = data.choices[0]?.message
    if (!msg) throw new Error("Empty response from OpenRouter")

    return {
        content: msg.content,
        toolCalls: msg.tool_calls?.map(tc => ({
            id: tc.id,
            name: tc.function.name,
            args: typeof tc.function.arguments === 'string' ? JSON.parse(tc.function.arguments) : tc.function.arguments
        })),
        model: 'OPENROUTER/Gemini-2.0'
    }
}
