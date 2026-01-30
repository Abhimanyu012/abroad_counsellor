/**
 * AI Tool Definitions and Implementation
 */
import prisma from '../../config/db.js'

/**
 * Tool definitions following OpenAI tool format
 */
export const toolDefinitions = [
    {
        type: 'function',
        function: {
            name: 'get_universities',
            description: 'Search for universities based on country, budget, ranking, or course.',
            parameters: {
                type: 'object',
                properties: {
                    country: { type: "string", description: "Filter by country (e.g., \"USA\", \"UK\")" },
                    name: { type: "string", description: "Search by university name (e.g., \"MIT\", \"Toronto\")" },
                    max_tuition: { type: "number", description: "Maximum yearly tuition in USD" },
                    min_ranking: { type: "number", description: "Maximum global ranking (e.g., top 500)" },
                    course: { type: "string", description: "Subject or field of study" }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'update_user_profile',
            description: 'Update any part of the user\'s profile (GPA, budget, target country, degree, etc).',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    gpa: { type: 'number' },
                    budget: { type: 'number', description: 'Total budget in USD' },
                    targetCountry: { type: 'string' },
                    intendedDegree: { type: 'string', enum: ['Bachelors', 'Masters', 'MBA', 'PhD'] },
                    targetIntakeYear: { type: 'number' },
                    sopStatus: { type: 'string', enum: ['not_started', 'draft', 'ready'] },
                    fundingPlan: { type: 'string', enum: ['self', 'scholarship', 'loan'] },
                    ielts: { type: 'number' },
                    toefl: { type: 'number' }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'manage_selections',
            description: 'Shortlist, Lock, Unlock, or Remove universities from the user\'s list.',
            parameters: {
                type: 'object',
                properties: {
                    action: { type: 'string', enum: ['SHORTLIST', 'LOCK', 'UNLOCK', 'REMOVE'] },
                    university_id: { type: 'string', description: 'ID or Name of the university' },
                    category: { type: 'string', enum: ['DREAM', 'TARGET', 'SAFE'] },
                    reason: { type: 'string', description: 'Context for this selection' }
                },
                required: ['action', 'university_id']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'manage_tasks',
            description: 'Complete CRUD control over the user\'s to-do list.',
            parameters: {
                type: 'object',
                properties: {
                    action: { type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE', 'TOGGLE'] },
                    task_id: { type: 'string', description: 'Required for UPDATE, DELETE, TOGGLE' },
                    task: { type: 'string', description: 'Task description for CREATE/UPDATE' },
                    priority: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
                    due_date: { type: 'string', description: 'YYYY-MM-DD' },
                    completed: { type: 'boolean' }
                },
                required: ['action']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_university_info',
            description: 'Get deep details about one specific university.',
            parameters: {
                type: 'object',
                properties: {
                    university_id: { type: 'string', description: 'ID or Name of the university' }
                },
                required: ['university_id']
            }
        }
    }
]

/**
 * Main Tool Executor
 */
export const executeTool = async (name, args, userId) => {
    console.log(`🔧 Master Tool Call: ${name}`, args)
    try {
        switch (name) {
            case 'get_universities': return await searchUniversities(args, userId)
            case 'update_user_profile': return await updateUserProfile(args, userId)
            case 'manage_selections': return await manageSelections(args, userId)
            case 'manage_tasks': return await manageTasks(args, userId)
            case 'get_university_info': return await getUniversityDetail(args)
            default: throw new Error(`Tool ${name} not found`)
        }
    } catch (error) {
        console.error(`❌ Tool ${name} failed:`, error.message)
        return { success: false, error: error.message }
    }
}

// --- Tool Implementations ---

async function searchUniversities({ country, name, max_tuition, min_ranking, course }, userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const where = {}
    if (country) where.country = { contains: country, mode: 'insensitive' }
    if (name) where.name = { contains: name, mode: 'insensitive' }
    if (max_tuition) where.tuitionFeeUsd = { lte: max_tuition }
    if (min_ranking) where.rankingGlobal = { lte: min_ranking }

    let universities = await prisma.university.findMany({
        where,
        orderBy: { rankingGlobal: 'asc' },
        take: 12
    })

    if (course) {
        universities = universities.filter(u =>
            u.popularCourses?.toLowerCase().includes(course.toLowerCase())
        )
    }

    // Smart Fallback: If no results and budget was a constraint, auto-return without budget limit
    let fallbackMessage = ""
    if (universities.length === 0 && max_tuition) {
        const budgetCheckWhere = { ...where }
        delete budgetCheckWhere.tuitionFeeUsd

        // Auto-fetch universities without the budget constraint
        universities = await prisma.university.findMany({
            where: budgetCheckWhere,
            orderBy: { rankingGlobal: 'asc' },
            take: 12
        })

        if (universities.length > 0) {
            fallbackMessage = ` (Note: Your $${max_tuition.toLocaleString()} budget didn't match any universities. Showing top options regardless of budget.)`
        }
    }

    const results = universities.map(u => ({
        id: u.id,
        name: u.name,
        country: u.country,
        tuition: u.tuitionFeeUsd,
        ranking: u.rankingGlobal,
        category: (user.gpa - u.minGpa > 0.3) ? 'SAFE' : (user.gpa < u.minGpa ? 'DREAM' : 'TARGET')
    }))

    return {
        success: true,
        count: results.length,
        universities: results,
        message: `Found ${results.length} universities.${fallbackMessage}`
    }
}

async function updateUserProfile(updates, userId) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: updates
    })
    return { success: true, message: "✅ Profile updated successfully.", profile: user }
}

async function manageSelections({ action, university_id, category, reason }, userId) {
    const uni = await prisma.university.findFirst({
        where: { OR: [{ id: university_id }, { name: { contains: university_id, mode: 'insensitive' } }] }
    })
    if (!uni) throw new Error("University not found")

    switch (action) {
        case 'SHORTLIST': {
            await prisma.selection.upsert({
                where: { userId_universityId: { userId, universityId: uni.id } },
                update: { category, notes: reason, status: 'SHORTLISTED' },
                create: { userId, universityId: uni.id, status: "SHORTLISTED", category, notes: reason }
            });
            const mappedUni = {
                id: uni.id, name: uni.name, country: uni.country, city: uni.city,
                tuition: uni.tuitionFeeUsd, ranking: uni.rankingGlobal, minGpa: uni.minGpa
            };
            return { success: true, message: `✅ Shortlisted ${uni.name}.`, university: mappedUni };
        }

        case 'LOCK': {
            await prisma.$transaction([
                prisma.selection.updateMany({ where: { userId, status: 'LOCKED' }, data: { status: 'SHORTLISTED' } }),
                prisma.selection.upsert({
                    where: { userId_universityId: { userId, universityId: uni.id } },
                    update: { status: 'LOCKED' },
                    create: { userId, universityId: uni.id, status: 'LOCKED' }
                }),
                prisma.user.update({ where: { id: userId }, data: { currentStage: 7 } }),
                prisma.todo.createMany({
                    data: [
                        { userId, task: `Draft Statement of Purpose (SOP) for ${uni.name}`, priority: 'HIGH', dueDate: uni.deadline ? new Date(new Date(uni.deadline).getTime() - 30 * 24 * 60 * 60 * 1000) : undefined },
                        { userId, task: `Request Letters of Recommendation (2 LORs)`, priority: 'HIGH', dueDate: uni.deadline ? new Date(new Date(uni.deadline).getTime() - 45 * 24 * 60 * 60 * 1000) : undefined },
                        { userId, task: `Compile Academic Transcripts & Certificates`, priority: 'MEDIUM', dueDate: uni.deadline ? new Date(new Date(uni.deadline).getTime() - 20 * 24 * 60 * 60 * 1000) : undefined },
                        { userId, task: `Finalize Financial Proof (Bank Statements/Loans)`, priority: 'HIGH', dueDate: uni.deadline ? new Date(new Date(uni.deadline).getTime() - 15 * 24 * 60 * 60 * 1000) : undefined },
                        { userId, task: `Submit Application to ${uni.name}`, priority: 'HIGH', dueDate: uni.deadline ? new Date(uni.deadline) : undefined },
                        { userId, task: `Student Visa Preparation (Post-Submission)`, priority: 'MEDIUM' }
                    ]
                })
            ]);
            const mappedUni = {
                id: uni.id, name: uni.name, country: uni.country, city: uni.city,
                tuition: uni.tuitionFeeUsd, ranking: uni.rankingGlobal, minGpa: uni.minGpa
            };
            return { success: true, message: `🔒 Final choice locked: ${uni.name}.`, university: mappedUni };
        }

        case 'UNLOCK':
            await prisma.$transaction([
                prisma.selection.update({
                    where: { userId_universityId: { userId, universityId: uni.id } },
                    data: { status: 'SHORTLISTED' }
                }),
                prisma.user.update({ where: { id: userId }, data: { currentStage: 6 } })
            ])
            return { success: true, message: `🔓 Unlocked ${uni.name}. You are now in Shortlisting stage.`, university: uni }

        case 'REMOVE':
            await prisma.selection.delete({
                where: { userId_universityId: { userId, universityId: uni.id } }
            })
            return { success: true, message: `🗑️ Removed ${uni.name} from your list.` }

        default:
            throw new Error(`Action ${action} not supported`)
    }
}

async function manageTasks({ action, task_id, task, priority, due_date, completed }, userId) {
    switch (action) {
        case 'CREATE':
            const newTodo = await prisma.todo.create({
                data: { userId, task, priority: priority || 'MEDIUM', dueDate: due_date ? new Date(due_date) : undefined }
            })
            return { success: true, message: `📝 Task added: ${task}`, todo: newTodo }

        case 'UPDATE':
            const updatedTodo = await prisma.todo.update({
                where: { id: task_id, userId },
                data: { task, priority, dueDate: due_date ? new Date(due_date) : undefined, completed }
            })
            return { success: true, message: `🔄 Task updated: ${updatedTodo.task}`, todo: updatedTodo }

        case 'DELETE':
            await prisma.todo.delete({ where: { id: task_id, userId } })
            return { success: true, message: "🗑️ Task deleted." }

        case 'TOGGLE':
            const current = await prisma.todo.findFirst({ where: { id: task_id, userId } })
            const toggled = await prisma.todo.update({
                where: { id: task_id },
                data: { completed: !current.completed }
            })
            return { success: true, message: toggled.completed ? "✅ Task completed!" : "⏳ Task reopened.", todo: toggled }

        default:
            throw new Error(`Action ${action} not supported`)
    }
}

async function getUniversityDetail({ university_id }) {
    const uni = await prisma.university.findFirst({
        where: { OR: [{ id: university_id }, { name: { contains: university_id, mode: 'insensitive' } }] }
    })
    if (!uni) throw new Error("University not found");
    const mappedUni = {
        id: uni.id, name: uni.name, country: uni.country, city: uni.city,
        tuition: uni.tuitionFeeUsd, ranking: uni.rankingGlobal, minGpa: uni.minGpa,
        acceptanceRate: uni.acceptanceRate, popularCourses: uni.popularCourses,
        requiredDocs: uni.requiredDocs, website: uni.website
    };
    return { success: true, university: mappedUni, message: `Details for ${uni.name} loaded successfully.` };
}
