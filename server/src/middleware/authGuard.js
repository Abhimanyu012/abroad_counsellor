// Auth Guard Middleware - JWT verification
import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'

export const authGuard = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const token = authHeader.split(' ')[1]

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET)

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                currentStage: true,
                onboardingComplete: true,
                gpa: true,
                budget: true,
                ielts: true,
                toefl: true,
                gre: true,
                gmat: true,
                targetCountry: true,
                preferredCourses: true,
                educationLevel: true
            }
        })

        if (!user) {
            return res.status(401).json({ error: 'User not found' })
        }

        // Attach user to request
        req.user = user
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' })
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' })
        }
        console.error('Auth guard error:', error)
        res.status(500).json({ error: 'Authentication failed' })
    }
}

// Optional auth - doesn't fail if no token, just doesn't set user
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next()
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                currentStage: true,
                onboardingComplete: true
            }
        })

        if (user) {
            req.user = user
        }
    } catch (error) {
        // Silently continue without user
    }
    next()
}

export default authGuard
