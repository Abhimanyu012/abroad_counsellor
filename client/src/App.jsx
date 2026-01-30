// Main App with Routing
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, FlowProvider, useAuth } from './context'

import { Suspense, lazy } from 'react'

// Lazy Load Pages
const LandingPage = lazy(() => import('./pages/Landing'))
const LoginPage = lazy(() => import('./pages/Auth').then(module => ({ default: module.LoginPage })))
const SignupPage = lazy(() => import('./pages/Auth').then(module => ({ default: module.SignupPage })))
const OnboardingPage = lazy(() => import('./pages/Onboarding'))
const DashboardPage = lazy(() => import('./pages/Dashboard'))
const CounsellorPage = lazy(() => import('./pages/Counsellor'))
const UniversitiesPage = lazy(() => import('./pages/Universities'))
const LockedPage = lazy(() => import('./pages/Locked'))
const ProfilePage = lazy(() => import('./pages/Profile'))
const GuidePage = lazy(() => import('./pages/Guide'))

// Loading Spinner
const FullScreenLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

// Protected Route Component
function ProtectedRoute({ children, requireOnboarding = false }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireOnboarding && !user?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

// Public Only Route (redirect to dashboard if logged in)
function PublicOnlyRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated && user?.onboardingComplete) {
    return <Navigate to="/dashboard" replace />
  }

  if (isAuthenticated && !user?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

// App Router
function AppRouter() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/guide" element={<GuidePage />} />

        {/* Auth Routes - redirect if logged in */}
        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        } />
        <Route path="/signup" element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        } />

        {/* Onboarding - requires auth, not onboarding */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } />

        {/* Protected Routes - require auth + onboarding */}
        <Route path="/dashboard" element={
          <ProtectedRoute requireOnboarding>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/counsellor" element={
          <ProtectedRoute requireOnboarding>
            <CounsellorPage />
          </ProtectedRoute>
        } />
        <Route path="/universities" element={
          <ProtectedRoute requireOnboarding>
            <UniversitiesPage />
          </ProtectedRoute>
        } />
        <Route path="/locked" element={
          <ProtectedRoute requireOnboarding>
            <LockedPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute requireOnboarding>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

import { ErrorBoundary } from './components/ErrorBoundary'

// Main App Component
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <FlowProvider>
            <AppRouter />
          </FlowProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}