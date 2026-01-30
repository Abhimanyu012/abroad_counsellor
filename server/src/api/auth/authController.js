// Auth Controller - Full authentication logic
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../config/db.js'
import { STAGES, getStageRedirect } from '../../middleware/stageGuard.js'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'
const JWT_EXPIRES_IN = '7d'

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * POST /api/auth/signup
 * Create new user account
 */
export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' })
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name: name || null,
                currentStage: STAGES.ONBOARDING // Start at onboarding after signup
            },
            select: {
                id: true,
                email: true,
                name: true,
                currentStage: true,
                onboardingComplete: true
            }
        })

        // Generate token
        const token = generateToken(user.id)

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user,
            redirect: getStageRedirect(user.currentStage)
        })
    } catch (error) {
        console.error('Signup error:', error)
        res.status(500).json({ error: 'Failed to create account' })
    }
}

/**
 * POST /api/auth/login
 * Authenticate user
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        // Generate token
        const token = generateToken(user.id)

        // Determine redirect based on stage
        let redirect = '/dashboard'
        if (!user.onboardingComplete) {
            redirect = '/onboarding'
        }

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                currentStage: user.currentStage,
                onboardingComplete: user.onboardingComplete,
                gpa: user.gpa,
                budget: user.budget,
                ielts: user.ielts,
                targetCountry: user.targetCountry
            },
            redirect
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Login failed' })
    }
}

/**
 * GET /api/auth/me
 * Get current user profile
 */
export const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
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
                educationLevel: true,
                createdAt: true
            }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({
            user,
            redirect: getStageRedirect(
                user.onboardingComplete ? user.currentStage : STAGES.ONBOARDING
            )
        })
    } catch (error) {
        console.error('Me error:', error)
        res.status(500).json({ error: 'Failed to fetch user' })
    }
}

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
export const logout = async (req, res) => {
    res.json({ message: 'Logged out successfully' })
}

export default { signup, login, me, logout }
