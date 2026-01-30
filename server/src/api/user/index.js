// User Routes
import express from 'express'
import { getProfile, updateProfile, completeOnboarding, updateStage } from './userController.js'
import { authGuard } from '../../middleware/authGuard.js'

const router = express.Router()

// All routes require authentication
router.use(authGuard)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/onboarding', completeOnboarding)
router.put('/stage', updateStage)

export default router
