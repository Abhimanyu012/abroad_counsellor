// Tool Service - Functions for AI to call
import prisma from '../config/db.js'

// Lock university selection
export const lockUniversity = async (userId, universityId) => {
    try {
        const result = await prisma.userUniversity.update({
            where: {
                userId_universityId: { userId, universityId }
            },
            data: { status: 'locked' }
        })
        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Add university to shortlist
export const addToShortlist = async (userId, universityId) => {
    try {
        const result = await prisma.userUniversity.create({
            data: {
                userId,
                universityId,
                status: 'shortlisted'
            }
        })
        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Remove from shortlist
export const removeFromShortlist = async (userId, universityId) => {
    try {
        const result = await prisma.userUniversity.delete({
            where: {
                userId_universityId: { userId, universityId }
            }
        })
        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Update user stage
export const updateUserStage = async (userId, newStage) => {
    try {
        const result = await prisma.user.update({
            where: { id: userId },
            data: { stage: newStage }
        })
        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Get user profile for context
export const getUserContext = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                universities: {
                    include: { university: true }
                }
            }
        })
        return { success: true, data: user }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export default {
    lockUniversity,
    addToShortlist,
    removeFromShortlist,
    updateUserStage,
    getUserContext
}
