// Todos API Module
import apiClient from './client'

export const todosApi = {
    getAll: (completed) => apiClient.get('/todos', { params: { completed } }),
    create: (task, priority, dueDate) =>
        apiClient.post('/todos', { task, priority, dueDate }),
    update: (id, data) => apiClient.put(`/todos/${id}`, data),
    toggle: (id) => apiClient.post(`/todos/${id}/toggle`),
    delete: (id) => apiClient.delete(`/todos/${id}`)
}

export default todosApi
