import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Read universities data
    const dataPath = join(__dirname, '../data/universities.json')
    const universitiesData = JSON.parse(readFileSync(dataPath, 'utf-8'))

    console.log(`📚 Found ${universitiesData.length} universities to seed`)

    // Clear existing universities
    await prisma.university.deleteMany()
    console.log('🗑️  Cleared existing universities')

    // Insert universities (convert arrays to comma-separated strings for SQLite)
    for (const uni of universitiesData) {
        await prisma.university.create({
            data: {
                id: uni.id,
                name: uni.name,
                country: uni.country,
                city: uni.city,
                logoUrl: uni.logo_url,
                website: uni.website,
                rankingGlobal: uni.ranking_global,
                rankingCountry: uni.ranking_country,
                minGpa: uni.min_gpa,
                ieltsMin: uni.ielts_min,
                toeflMin: uni.toefl_min,
                greMin: uni.gre_min,
                gmatMin: uni.gmat_min,
                tuitionFeeUsd: uni.tuition_fee_usd,
                livingCostUsd: uni.living_cost_usd,
                acceptanceRate: uni.acceptance_rate,
                deadline: uni.deadline,
                // Convert arrays to comma-separated strings for SQLite
                popularCourses: uni.popular_courses?.join(',') || null,
                requiredDocs: uni.required_docs?.join(',') || null
            }
        })
    }

    console.log(`✅ Seeded ${universitiesData.length} universities`)
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
