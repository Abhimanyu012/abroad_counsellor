// Selections Routes
import express from 'express'
import { getSelections, shortlistUniversity, lockUniversity, unlockUniversity, removeSelection } from './selectionsController.js'
import { authGuard } from '../../middleware/authGuard.js'
import { stageGuard, STAGES } from '../../middleware/stageGuard.js'

const router = express.Router()

// All routes require authentication and onboarding completion
router.use(authGuard)
router.use(stageGuard(STAGES.DASHBOARD))

router.get('/', getSelections)
router.post('/shortlist', shortlistUniversity)
router.post('/lock', lockUniversity)
router.post('/unlock', unlockUniversity)
router.delete('/:universityId', removeSelection)

export default router
