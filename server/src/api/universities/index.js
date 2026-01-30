// Universities Routes
import express from 'express'
import { getUniversities, getUniversity, getCategorizedUniversities } from './universitiesController.js'
import { authGuard } from '../../middleware/authGuard.js'
import { optionalAuth } from '../../middleware/authGuard.js'

const router = express.Router()

// Public route - anyone can browse
router.get('/', optionalAuth, getUniversities)
router.get('/categorized', authGuard, getCategorizedUniversities)
router.get('/:id', optionalAuth, getUniversity)

export default router
