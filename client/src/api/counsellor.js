// Counsellor API Module
import apiClient from './client'

export const counsellorApi = {
    chat: (message) => apiClient.post('/counsellor/chat', { message }),
    getHistory: (limit = 50) => apiClient.get(`/counsellor/history?limit=${limit}`),
    clearHistory: () => apiClient.delete('/counsellor/history')
}

export default counsellorApi
