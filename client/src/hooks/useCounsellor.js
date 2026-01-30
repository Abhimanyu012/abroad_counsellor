// useCounsellor hook - AI chat interactions
import { useState, useCallback } from 'react'
import { counsellorApi } from '../api'

export const useCounsellor = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const sendMessage = useCallback(async (content) => {
        setLoading(true)
        setError(null)

        // Add user message
        const userMessage = { role: 'user', content, timestamp: new Date() }
        setMessages(prev => [...prev, userMessage])

        try {
            const { data } = await counsellorApi.sendMessage(content)
            const assistantMessage = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, assistantMessage])
            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const loadHistory = useCallback(async () => {
        try {
            const { data } = await counsellorApi.getHistory()
            setMessages(data.messages || [])
        } catch (err) {
            setError(err.message)
        }
    }, [])

    const clearChat = useCallback(async () => {
        try {
            await counsellorApi.clearHistory()
            setMessages([])
        } catch (err) {
            setError(err.message)
        }
    }, [])

    return { messages, loading, error, sendMessage, loadHistory, clearChat }
}

export default useCounsellor
