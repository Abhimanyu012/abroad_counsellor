// Universities API Module
import apiClient from './client'

export const universitiesApi = {
    getAll: (params = {}) => apiClient.get('/universities', { params }),
    getById: (id) => apiClient.get(`/universities/${id}`),
    getCategorized: () => apiClient.get('/universities/categorized')
}

export default universitiesApi
