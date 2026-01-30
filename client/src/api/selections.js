// Selections API Module
import apiClient from './client'

export const selectionsApi = {
    getAll: (status) => apiClient.get('/selections', { params: { status } }),
    shortlist: (universityId, category, notes) =>
        apiClient.post('/selections/shortlist', { universityId, category, notes }),
    lock: (universityId) =>
        apiClient.post('/selections/lock', { universityId }),
    unlock: (universityId) =>
        apiClient.post('/selections/unlock', { universityId }),
    remove: (universityId) =>
        apiClient.delete(`/selections/${universityId}`)
}

export default selectionsApi
