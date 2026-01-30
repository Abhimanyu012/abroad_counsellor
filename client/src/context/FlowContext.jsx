import { createContext, useContext, useMemo } from 'react'
import { useAuth } from './AuthContext'
import { userApi } from '../api'

const FlowContext = createContext(null)

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

export const STAGE_ROUTES = {
    [STAGES.LANDING]: '/',
    [STAGES.AUTH]: '/login',
    [STAGES.ONBOARDING]: '/onboarding',
    [STAGES.DASHBOARD]: '/dashboard',
    [STAGES.COUNSELLOR]: '/counsellor',
    [STAGES.UNIVERSITIES]: '/universities',
    [STAGES.LOCKED]: '/locked',
    [STAGES.COMPLETE]: '/complete'
}

export function FlowProvider({ children }) {
    const { user, updateUser } = useAuth()

    const currentStage = user?.currentStage || STAGES.LANDING
    const onboardingComplete = user?.onboardingComplete || false

    const canAccessStage = (stage) => {
        // Public stages
        if (stage <= STAGES.AUTH) return true

        // Must be logged in for stage 3+
        if (!user) return false

        // Must complete onboarding for stage 4+
        if (stage >= STAGES.DASHBOARD && !onboardingComplete) return false

        // Can access current and previous stages + immediate next stage
        if (stage > currentStage + 1) return false

        return true
    }

    const advanceStage = async () => {
        if (!user || currentStage >= STAGES.COMPLETE) return

        try {
            const nextStage = currentStage + 1
            await userApi.updateStage(nextStage)
            updateUser({ currentStage: nextStage })
            return STAGE_ROUTES[nextStage]
        } catch (error) {
            console.error('Failed to advance stage:', error)
        }
    }

    const getRedirectPath = () => {
        if (!user) return '/login'
        if (!onboardingComplete) return '/onboarding'
        return '/dashboard'
    }

    const value = useMemo(() => ({
        currentStage,
        onboardingComplete,
        canAccessStage,
        advanceStage,
        getRedirectPath,
        STAGES,
        STAGE_ROUTES
    }), [currentStage, onboardingComplete, user])

    return (
        <FlowContext.Provider value={value}>
            {children}
        </FlowContext.Provider>
    )
}

export function useFlow() {
    const context = useContext(FlowContext)
    if (!context) {
        throw new Error('useFlow must be used within FlowProvider')
    }
    return context
}

export default FlowContext
