// Todo Controller - AI-generated todo list
import prisma from '../../config/db.js'

/**
 * GET /api/todos
 * Get user's todos
 */
export const getTodos = async (req, res) => {
    try {
        const { completed } = req.query

        const where = { userId: req.user.id }
        if (completed !== undefined) {
            where.completed = completed === 'true'
        }

        const todos = await prisma.todo.findMany({
            where,
            orderBy: [
                { completed: 'asc' },
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        const counts = {
            total: todos.length,
            completed: todos.filter(t => t.completed).length,
            pending: todos.filter(t => !t.completed).length
        }

        res.json({ todos, counts })
    } catch (error) {
        console.error('Get todos error:', error)
        res.status(500).json({ error: 'Failed to fetch todos' })
    }
}

/**
 * POST /api/todos
 * Create a new todo
 */
export const createTodo = async (req, res) => {
    try {
        const { task, priority, dueDate } = req.body

        if (!task) {
            return res.status(400).json({ error: 'Task is required' })
        }

        const todo = await prisma.todo.create({
            data: {
                userId: req.user.id,
                task,
                priority: priority || 'MEDIUM',
                dueDate
            }
        })

        res.status(201).json({ message: 'Todo created', todo })
    } catch (error) {
        console.error('Create todo error:', error)
        res.status(500).json({ error: 'Failed to create todo' })
    }
}

/**
 * PUT /api/todos/:id
 * Update a todo
 */
export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params
        const { task, completed, priority, dueDate } = req.body

        // Check ownership
        const existing = await prisma.todo.findFirst({
            where: { id, userId: req.user.id }
        })

        if (!existing) {
            return res.status(404).json({ error: 'Todo not found' })
        }

        const todo = await prisma.todo.update({
            where: { id },
            data: {
                task: task !== undefined ? task : existing.task,
                completed: completed !== undefined ? completed : existing.completed,
                priority: priority !== undefined ? priority : existing.priority,
                dueDate: dueDate !== undefined ? dueDate : existing.dueDate
            }
        })

        res.json({ message: 'Todo updated', todo })
    } catch (error) {
        console.error('Update todo error:', error)
        res.status(500).json({ error: 'Failed to update todo' })
    }
}

/**
 * DELETE /api/todos/:id
 * Delete a todo
 */
export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params

        // Check ownership
        const existing = await prisma.todo.findFirst({
            where: { id, userId: req.user.id }
        })

        if (!existing) {
            return res.status(404).json({ error: 'Todo not found' })
        }

        await prisma.todo.delete({ where: { id } })

        res.json({ message: 'Todo deleted' })
    } catch (error) {
        console.error('Delete todo error:', error)
        res.status(500).json({ error: 'Failed to delete todo' })
    }
}

/**
 * POST /api/todos/:id/toggle
 * Toggle todo completion
 */
export const toggleTodo = async (req, res) => {
    try {
        const { id } = req.params

        const existing = await prisma.todo.findFirst({
            where: { id, userId: req.user.id }
        })

        if (!existing) {
            return res.status(404).json({ error: 'Todo not found' })
        }

        const todo = await prisma.todo.update({
            where: { id },
            data: { completed: !existing.completed }
        })

        res.json({
            message: todo.completed ? 'Task completed!' : 'Task reopened',
            todo
        })
    } catch (error) {
        console.error('Toggle todo error:', error)
        res.status(500).json({ error: 'Failed to toggle todo' })
    }
}

export default { getTodos, createTodo, updateTodo, deleteTodo, toggleTodo }
