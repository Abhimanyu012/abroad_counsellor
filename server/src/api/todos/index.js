// Todos Routes
import express from 'express'
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodo } from './todosController.js'
import { authGuard } from '../../middleware/authGuard.js'

const router = express.Router()

router.use(authGuard)

router.get('/', getTodos)
router.post('/', createTodo)
router.put('/:id', updateTodo)
router.delete('/:id', deleteTodo)
router.post('/:id/toggle', toggleTodo)

export default router
