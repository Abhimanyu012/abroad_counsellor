// Selection Controller - Shortlisting & Locking
import prisma from '../../config/db.js'

/**
 * GET /api/selections
 * Get user's selections (shortlisted and locked)
 */
export const getSelections = async (req, res) => {
    try {
        const { status } = req.query

        const where = { userId: req.user.id }
        if (status) {
            where.status = status.toUpperCase()
        }

        const selections = await prisma.selection.findMany({
            where,
            include: {
                university: true
            },
            orderBy: { createdAt: 'desc' }
        })

        const counts = await prisma.selection.groupBy({
            by: ['status'],
            where: { userId: req.user.id },
            _count: { id: true }
        })

        res.json({
            selections,
            counts: {
                shortlisted: counts.find(c => c.status === 'SHORTLISTED')?._count.id || 0,
                locked: counts.find(c => c.status === 'LOCKED')?._count.id || 0,
                total: selections.length
            }
        })
    } catch (error) {
        console.error('Get selections error:', error)
        res.status(500).json({ error: 'Failed to fetch selections' })
    }
}

/**
 * POST /api/selections/shortlist
 * Add university to shortlist
 */
export const shortlistUniversity = async (req, res) => {
    try {
        const { universityId, category, notes } = req.body

        if (!universityId) {
            return res.status(400).json({ error: 'University ID required' })
        }

        // Check if university exists
        const university = await prisma.university.findUnique({
            where: { id: universityId }
        })

        if (!university) {
            return res.status(404).json({ error: 'University not found' })
        }

        // Create or update selection
        const selection = await prisma.selection.upsert({
            where: {
                userId_universityId: {
                    userId: req.user.id,
                    universityId
                }
            },
            update: {
                category,
                notes,
                status: 'SHORTLISTED'
            },
            create: {
                userId: req.user.id,
                universityId,
                status: 'SHORTLISTED',
                category,
                notes
            },
            include: {
                university: true
            }
        })

        res.status(201).json({
            message: `${university.name} added to shortlist`,
            selection
        })
    } catch (error) {
        console.error('Shortlist error:', error)
        res.status(500).json({ error: 'Failed to shortlist university' })
    }
}

/**
 * POST /api/selections/lock
 * Lock a university selection
 */
export const lockUniversity = async (req, res) => {
    try {
        const { universityId } = req.body

        if (!universityId) {
            return res.status(400).json({ error: 'University ID required' })
        }

        // Check if selection exists
        const existing = await prisma.selection.findUnique({
            where: {
                userId_universityId: {
                    userId: req.user.id,
                    universityId
                }
            },
            include: { university: true }
        })

        if (!existing) {
            return res.status(404).json({ error: 'University not in your shortlist' })
        }

        // Update to locked and update user stage
        const [selection] = await prisma.$transaction([
            prisma.selection.update({
                where: { id: existing.id },
                data: { status: 'LOCKED' },
                include: { university: true }
            }),
            prisma.user.update({
                where: { id: req.user.id },
                data: { currentStage: 7 }
            })
        ])

        res.json({
            message: `${selection.university.name} locked! This is now your final choice.`,
            selection
        })
    } catch (error) {
        console.error('Lock error:', error)
        res.status(500).json({ error: 'Failed to lock university' })
    }
}

/**
 * DELETE /api/selections/:universityId
 * Remove from shortlist
 */
export const removeSelection = async (req, res) => {
    try {
        const { universityId } = req.params

        const selection = await prisma.selection.findUnique({
            where: {
                userId_universityId: {
                    userId: req.user.id,
                    universityId
                }
            },
            include: { university: true }
        })

        if (!selection) {
            return res.status(404).json({ error: 'Selection not found' })
        }

        if (selection.status === 'LOCKED') {
            return res.status(400).json({ error: 'Cannot remove locked selection' })
        }

        await prisma.selection.delete({
            where: { id: selection.id }
        })

        res.json({
            message: `${selection.university.name} removed from shortlist`
        })
    } catch (error) {
        console.error('Remove selection error:', error)
        res.status(500).json({ error: 'Failed to remove selection' })
    }
}
/**
 * POST /api/selections/unlock
 * Unlock a university (revert to SHORTLISTED)
 */
export const unlockUniversity = async (req, res) => {
    try {
        const { universityId } = req.body

        if (!universityId) {
            return res.status(400).json({ error: 'University ID required' })
        }

        const existing = await prisma.selection.findUnique({
            where: {
                userId_universityId: {
                    userId: req.user.id,
                    universityId
                }
            },
            include: { university: true }
        })

        if (!existing) {
            return res.status(404).json({ error: 'University not found in selections' })
        }

        if (existing.status !== 'LOCKED') {
            return res.status(400).json({ error: 'University is not locked' })
        }

        const [selection] = await prisma.$transaction([
            prisma.selection.update({
                where: { id: existing.id },
                data: { status: 'SHORTLISTED' },
                include: { university: true }
            }),
            prisma.user.update({
                where: { id: req.user.id },
                data: { currentStage: 6 }
            })
        ])

        res.json({
            message: `${selection.university.name} unlocked and moved back to shortlist.`,
            selection
        })
    } catch (error) {
        console.error('Unlock error:', error)
        res.status(500).json({ error: 'Failed to unlock university' })
    }
}

export default { getSelections, shortlistUniversity, lockUniversity, unlockUniversity, removeSelection }
