// Counsellor Routes
import express from 'express'
import { chat, getHistory, deleteHistory } from './counsellorController.js'
import { authGuard } from '../../middleware/authGuard.js'
import { stageGuard, STAGES } from '../../middleware/stageGuard.js'

const router = express.Router()

// All routes require auth and onboarding completion
router.use(authGuard)
router.use(stageGuard(STAGES.COUNSELLOR))

router.post('/chat', chat)
router.get('/history', getHistory)
router.delete('/history', deleteHistory)

export default router
