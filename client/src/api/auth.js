// Auth API Module
import apiClient from './client'

export const authApi = {
    signup: (data) => apiClient.post('/auth/signup', data),
    login: (data) => apiClient.post('/auth/login', data),
    me: () => apiClient.get('/auth/me'),
    logout: () => apiClient.post('/auth/logout')
}

export default authApi
