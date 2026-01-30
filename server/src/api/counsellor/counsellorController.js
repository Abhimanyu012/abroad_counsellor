import { processChat, getChatHistory, clearChatHistory } from '../../services/ai/index.js'

/**
 * POST /api/counsellor/chat
 * Send message to AICOUNSELLOR
 */
export const chat = async (req, res) => {
    try {
        const { message } = req.body

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' })
        }

        // Check if user has completed onboarding
        if (!req.user.onboardingComplete) {
            return res.status(403).json({
                error: 'Complete your profile first',
                redirect: '/onboarding'
            })
        }

        const result = await processChat(req.user.id, message)

        res.json({
            message: result.response,
            actions: result.actions,
            toolResults: result.toolResults
        })
    } catch (error) {
        console.error('Chat error:', error)

        // Handle specific Groq errors
        if (error.message?.includes('API key')) {
            return res.status(500).json({ error: 'AI service configuration error' })
        }


        res.status(500).json({
            error: 'Failed to process message',
            details: error.message,
            stack: error.stack
        })
    }
}

/**
 * GET /api/counsellor/history
 * Get chat history
 */
export const getHistory = async (req, res) => {
    try {
        const { limit = 50 } = req.query
        const messages = await getChatHistory(req.user.id, parseInt(limit))

        res.json({ messages })
    } catch (error) {
        console.error('Get history error:', error)
        res.status(500).json({ error: 'Failed to fetch history' })
    }
}

/**
 * DELETE /api/counsellor/history
 * Clear chat history
 */
export const deleteHistory = async (req, res) => {
    try {
        await clearChatHistory(req.user.id)
        res.json({ message: 'Chat history cleared' })
    } catch (error) {
        console.error('Delete history error:', error)
        res.status(500).json({ error: 'Failed to clear history' })
    }
}

export default { chat, getHistory, deleteHistory }
