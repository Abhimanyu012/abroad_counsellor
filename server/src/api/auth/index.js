// Auth Routes
import express from 'express'
import { signup, login, me, logout } from './authController.js'
import { authGuard } from '../../middleware/authGuard.js'

const router = express.Router()

// Public routes
router.post('/signup', signup)
router.post('/login', login)

// Protected routes
router.get('/me', authGuard, me)
router.post('/logout', authGuard, logout)

export default router
