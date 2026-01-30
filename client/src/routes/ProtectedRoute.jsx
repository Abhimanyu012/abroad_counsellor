// Protected Route - Redirects based on auth and stage
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, useFlow, FLOW_STAGES } from '../context'

const ProtectedRoute = ({ children, requiredStage = FLOW_STAGES.AUTH }) => {
    const { user, loading } = useAuth()
    const { stage, canAccessStage } = useFlow()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    // Not logged in - redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // User doesn't have access to this stage
    if (!canAccessStage(requiredStage)) {
        // Redirect to appropriate page based on current stage
        if (stage === FLOW_STAGES.ONBOARDING) {
            return <Navigate to="/onboarding" replace />
        }
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default ProtectedRoute
