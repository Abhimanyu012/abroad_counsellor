// User API Module
import apiClient from './client'

export const userApi = {
    getProfile: () => apiClient.get('/user/profile'),
    updateProfile: (data) => apiClient.put('/user/profile', data),
    completeOnboarding: (data) => apiClient.put('/user/onboarding', data),
    updateStage: (stage) => apiClient.put('/user/stage', { stage }),
    resetStage: () => apiClient.post('/user/reset-stage')
}

export default userApi
