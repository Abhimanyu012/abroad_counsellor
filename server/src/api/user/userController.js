// User Controller - Profile & Onboarding
import prisma from '../../config/db.js'
import { STAGES } from '../../middleware/stageGuard.js'

/**
 * GET /api/user/profile
 * Get user profile
 */
export const getProfile = async (req, res) => {
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
                createdAt: true,
                _count: {
                    select: {
                        selections: true,
                        todos: true
                    }
                }
            }
        })

        // Add new fields with defaults (backwards compatible)
        const profile = {
            ...user,
            intendedDegree: user.intendedDegree || null,
            targetIntakeYear: user.targetIntakeYear || null,
            sopStatus: user.sopStatus || 'not_started',
            fundingPlan: user.fundingPlan || null
        }

        res.json({ profile })
    } catch (error) {
        console.error('Get profile error:', error)
        res.status(500).json({ error: 'Failed to fetch profile' })
    }
}

/**
 * PUT /api/user/profile
 * Update user profile
 */
// Helper to calculate profile strength
// Helper to calculate profile strength
/*
const calculateStrength = (user) => {
    let score = 0
    if (user.gpa && user.gpa >= 2.0) score += 25
    if (user.budget && user.budget > 10000) score += 25
    if ((user.ielts && user.ielts >= 6.0) || (user.toefl && user.toefl >= 80)) score += 25
    if (user.targetCountry) score += 25
    return score
}
*/

/**
 * PUT /api/user/profile
 * Update user profile
 */
export const updateProfile = async (req, res) => {
    try {
        const { name, gpa, budget, ielts, toefl, gre, gmat, targetCountry, preferredCourses, educationLevel, intendedDegree, targetIntakeYear, sopStatus, fundingPlan } = req.body

        // First update to get the new values
        const dataToUpdate = {
            name,
            gpa: gpa ? parseFloat(gpa) : undefined,
            budget: budget ? parseInt(budget) : undefined,
            ielts: ielts ? parseFloat(ielts) : undefined,
            toefl: toefl ? parseInt(toefl) : undefined,
            gre: gre ? parseInt(gre) : undefined,
            gmat: gmat ? parseInt(gmat) : undefined,
            targetCountry,
            preferredCourses: Array.isArray(preferredCourses) ? preferredCourses.join(',') : preferredCourses,
            educationLevel,
            intendedDegree,
            targetIntakeYear: targetIntakeYear ? parseInt(targetIntakeYear) : undefined,
            sopStatus,
            fundingPlan
        }

        /*
        // Calculate strength based on merged data
        const currentData = await prisma.user.findUnique({ where: { id: req.user.id } })
        const mergedData = { ...currentData, ...dataToUpdate }

        // Remove undefined keys for accurate strength calc
        Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key])
        const finalMerged = { ...currentData, ...dataToUpdate }

        const strength = calculateStrength(finalMerged)
        */

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...dataToUpdate,
                // profileStrength: strength
            },
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
                educationLevel: true,
                // profileStrength: true
            }
        })

        res.json({ message: 'Profile updated', profile: user })
    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({ error: 'Failed to update profile' })
    }
}

/**
 * PUT /api/user/onboarding
 * Complete onboarding - updates profile and advances stage
 */
export const completeOnboarding = async (req, res) => {
    try {
        const {
            name,
            gpa,
            budget,
            ielts,
            toefl,
            gre,
            gmat,
            targetCountry,
            preferredCourses,
            educationLevel,
            intendedDegree,
            targetIntakeYear,
            sopStatus,
            fundingPlan
        } = req.body

        // Validate required fields
        if (!gpa || !budget || !targetCountry) {
            return res.status(400).json({
                error: 'Required fields missing',
                required: ['gpa', 'budget', 'targetCountry']
            })
        }

        const numericGpa = parseFloat(gpa)
        const numericBudget = parseInt(budget)
        const numericIelts = ielts ? parseFloat(ielts) : null
        const numericToefl = toefl ? parseInt(toefl) : null

        // Calculate initial strength
        /*
        const strength = calculateStrength({
            gpa: numericGpa,
            budget: numericBudget,
            ielts: numericIelts,
            toefl: numericToefl,
            targetCountry
        })
        */

        // Update user with onboarding data
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name,
                gpa: numericGpa,
                budget: numericBudget,
                ielts: numericIelts,
                toefl: numericToefl,
                gre: gre ? parseInt(gre) : null,
                gmat: gmat ? parseInt(gmat) : null,
                targetCountry,
                preferredCourses: Array.isArray(preferredCourses) ? preferredCourses.join(',') : (preferredCourses || null),
                educationLevel,
                intendedDegree,
                targetIntakeYear: targetIntakeYear ? parseInt(targetIntakeYear) : null,
                sopStatus,
                fundingPlan,
                onboardingComplete: true,
                currentStage: STAGES.DASHBOARD, // Advance to dashboard
                currentStage: STAGES.DASHBOARD, // Advance to dashboard
                // profileStrength: strength
            },
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
                educationLevel: true,
                // profileStrength: true
            }
        })

        res.json({
            message: 'Onboarding complete! Welcome to your dashboard.',
            profile: user,
            redirect: '/dashboard'
        })
    } catch (error) {
        console.error('Onboarding error:', error)
        res.status(500).json({ error: 'Failed to complete onboarding' })
    }
}

/**
 * PUT /api/user/stage
 * Update user's current stage
 */
export const updateStage = async (req, res) => {
    try {
        const { stage } = req.body

        if (!stage || stage < 1 || stage > 8) {
            return res.status(400).json({ error: 'Invalid stage' })
        }

        // Only allow advancing to next stage or staying at current
        if (stage > req.user.currentStage + 1) {
            return res.status(400).json({ error: 'Cannot skip stages' })
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { currentStage: stage },
            select: {
                id: true,
                currentStage: true
            }
        })

        res.json({ message: 'Stage updated', currentStage: user.currentStage })
    } catch (error) {
        console.error('Update stage error:', error)
        res.status(500).json({ error: 'Failed to update stage' })
    }
}

export default { getProfile, updateProfile, completeOnboarding, updateStage }
