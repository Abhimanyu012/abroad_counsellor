// Stage Guards and Constants
export const STAGES = {
    LANDING: 1,
    AUTH: 2,
    ONBOARDING: 3,
    DASHBOARD: 4,
    COUNSELLOR: 5,
    UNIVERSITIES: 6,
    LOCKED: 7,
    COMPLETE: 8
}

export const STAGE_NAMES = {
    1: 'Landing',
    2: 'Authentication',
    3: 'Onboarding',
    4: 'Dashboard',
    5: 'AICOUNSELLOR',
    6: 'University Selection',
    7: 'Locked Selections',
    8: 'Complete'
}

// Stage requirements - what must be true to access each stage
export const STAGE_REQUIREMENTS = {
    [STAGES.LANDING]: () => true, // Always accessible
    [STAGES.AUTH]: () => true, // Always accessible
    [STAGES.ONBOARDING]: (user) => !!user, // Must be logged in
    [STAGES.DASHBOARD]: (user) => user?.onboardingComplete === true,
    [STAGES.COUNSELLOR]: (user) => user?.onboardingComplete === true,
    [STAGES.UNIVERSITIES]: (user) => user?.onboardingComplete === true,
    [STAGES.LOCKED]: (user) => user?.onboardingComplete === true,
    [STAGES.COMPLETE]: (user) => user?.currentStage >= STAGES.COMPLETE
}

/**
 * Stage Guard Middleware
 * Blocks access to stages based on user's current progress
 */
export const stageGuard = (requiredStage) => {
    return async (req, res, next) => {
        try {
            const user = req.user

            // Check if user exists for protected stages
            if (requiredStage >= STAGES.ONBOARDING && !user) {
                return res.status(401).json({
                    error: 'Authentication required',
                    redirect: '/login',
                    requiredStage,
                    currentStage: STAGES.AUTH
                })
            }

            // Check onboarding completion for stages 4+
            if (requiredStage >= STAGES.DASHBOARD && !user.onboardingComplete) {
                return res.status(403).json({
                    error: 'Complete onboarding first',
                    message: 'You need to complete your profile before accessing this feature',
                    redirect: '/onboarding',
                    requiredStage,
                    currentStage: STAGES.ONBOARDING
                })
            }

            // Check stage progression
            if (user && user.currentStage < requiredStage - 1) {
                const redirectStage = user.currentStage + 1
                const redirectPath = getStageRedirect(redirectStage)

                return res.status(403).json({
                    error: 'Stage not unlocked',
                    message: `Complete ${STAGE_NAMES[user.currentStage]} first`,
                    redirect: redirectPath,
                    requiredStage,
                    currentStage: user.currentStage
                })
            }

            next()
        } catch (error) {
            console.error('Stage guard error:', error)
            res.status(500).json({ error: 'Stage verification failed' })
        }
    }
}

/**
 * Get redirect path for a stage
 */
export const getStageRedirect = (stage) => {
    const redirects = {
        [STAGES.LANDING]: '/',
        [STAGES.AUTH]: '/login',
        [STAGES.ONBOARDING]: '/onboarding',
        [STAGES.DASHBOARD]: '/dashboard',
        [STAGES.COUNSELLOR]: '/counsellor',
        [STAGES.UNIVERSITIES]: '/universities',
        [STAGES.LOCKED]: '/locked',
        [STAGES.COMPLETE]: '/complete'
    }
    return redirects[stage] || '/dashboard'
}

/**
 * Determine next stage for user
 */
export const getNextStage = (user) => {
    if (!user) return STAGES.AUTH
    if (!user.onboardingComplete) return STAGES.ONBOARDING
    if (user.currentStage < STAGES.COMPLETE) return user.currentStage + 1
    return STAGES.COMPLETE
}

export default { STAGES, STAGE_NAMES, stageGuard, getStageRedirect, getNextStage }
