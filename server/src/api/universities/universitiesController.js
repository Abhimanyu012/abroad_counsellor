// Universities Controller
import prisma from '../../config/db.js'

/**
 * GET /api/universities
 * Get all universities with optional filters
 */
export const getUniversities = async (req, res) => {
    try {
        const {
            country,
            maxTuition,
            minGpa,
            maxGpa,
            search,
            sortBy = 'rankingGlobal',
            sortOrder = 'asc',
            limit = 50,
            offset = 0
        } = req.query

        // Build where clause
        const where = {}

        if (country) {
            where.country = country
        }

        if (maxTuition) {
            where.tuitionFeeUsd = { lte: parseInt(maxTuition) }
        }

        if (minGpa) {
            where.minGpa = { lte: parseFloat(minGpa) }
        }

        if (maxGpa) {
            where.minGpa = {
                ...where.minGpa,
                gte: parseFloat(maxGpa)
            }
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Get universities
        const universities = await prisma.university.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            take: parseInt(limit),
            skip: parseInt(offset)
        })

        // Get total count
        const total = await prisma.university.count({ where })

        // Get unique countries for filter
        const countries = await prisma.university.groupBy({
            by: ['country'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } }
        })

        res.json({
            universities,
            total,
            countries: countries.map(c => ({ name: c.country, count: c._count.id })),
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: parseInt(offset) + universities.length < total
            }
        })
    } catch (error) {
        console.error('Get universities error:', error)
        res.status(500).json({ error: 'Failed to fetch universities' })
    }
}

/**
 * GET /api/universities/:id
 * Get single university by ID
 */
export const getUniversity = async (req, res) => {
    try {
        const { id } = req.params

        const university = await prisma.university.findUnique({
            where: { id }
        })

        if (!university) {
            return res.status(404).json({ error: 'University not found' })
        }

        res.json({ university })
    } catch (error) {
        console.error('Get university error:', error)
        res.status(500).json({ error: 'Failed to fetch university' })
    }
}

/**
 * GET /api/universities/categorized
 * Get universities categorized as Dream/Target/Safe based on user profile
 */
export const getCategorizedUniversities = async (req, res) => {
    try {
        const user = req.user

        if (!user.gpa) {
            return res.status(400).json({ error: 'Complete your profile first' })
        }

        const universities = await prisma.university.findMany({
            where: user.targetCountry ? { country: user.targetCountry } : {},
            orderBy: { rankingGlobal: 'asc' }
        })

        // Categorize based on user's GPA vs university requirements
        const categorized = {
            dream: [],   // User GPA < minGpa - 0.2
            target: [],  // User GPA within 0.2 of minGpa
            safe: []     // User GPA > minGpa + 0.2
        }

        for (const uni of universities) {
            const gpaDiff = user.gpa - uni.minGpa

            // Also consider budget
            const totalCost = uni.tuitionFeeUsd + uni.livingCostUsd
            const affordable = !user.budget || totalCost <= user.budget

            if (gpaDiff < -0.2 || (!affordable && gpaDiff < 0)) {
                categorized.dream.push({ ...uni, category: 'DREAM', affordable })
            } else if (gpaDiff >= -0.2 && gpaDiff <= 0.3) {
                categorized.target.push({ ...uni, category: 'TARGET', affordable })
            } else {
                categorized.safe.push({ ...uni, category: 'SAFE', affordable })
            }
        }

        res.json({
            categorized,
            userProfile: {
                gpa: user.gpa,
                budget: user.budget,
                targetCountry: user.targetCountry
            },
            counts: {
                dream: categorized.dream.length,
                target: categorized.target.length,
                safe: categorized.safe.length,
                total: universities.length
            }
        })
    } catch (error) {
        console.error('Get categorized error:', error)
        res.status(500).json({ error: 'Failed to categorize universities' })
    }
}

export default { getUniversities, getUniversity, getCategorizedUniversities }
