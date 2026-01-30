import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { authApi, todosApi, selectionsApi } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [data, setData] = useState({ todos: [], selections: { shortlisted: 0, locked: 0 } })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Check auth status on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            return
        }

        try {
            // Parallelize initial data fetching
            const [userRes, todosRes, selectionsRes] = await Promise.all([
                authApi.me(),
                todosApi.getAll(),
                selectionsApi.getAll()
            ])

            setUser(userRes.data.user)
            setData({
                todos: todosRes.data.todos,
                selections: selectionsRes.data.counts
            })

        } catch (err) {
            console.error('Auth check failed:', err)
            // If auth fails, clear everything
            if (err.response?.status === 401) {
                localStorage.removeItem('token')
                setUser(null)
            }
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            setError(null)
            const response = await authApi.login({ email, password })
            localStorage.setItem('token', response.data.token)
            setUser(response.data.user)

            // background fetch other data
            Promise.all([todosApi.getAll(), selectionsApi.getAll()])
                .then(([t, s]) => setData({ todos: t.data.todos, selections: s.data.counts }))
                .catch(console.error)

            return response.data
        } catch (err) {
            const message = err.response?.data?.error || 'Login failed'
            setError(message)
            throw new Error(message)
        }
    }

    const signup = async (email, password, name) => {
        try {
            setError(null)
            const response = await authApi.signup({ email, password, name })
            localStorage.setItem('token', response.data.token)
            setUser(response.data.user)
            return response.data
        } catch (err) {
            const message = err.response?.data?.error || 'Signup failed'
            setError(message)
            throw new Error(message)
        }
    }

    const logout = () => {
        // OPTIMISTIC LOGOUT: Clear state and storage INSTANTLY
        localStorage.removeItem('token')
        setUser(null)
        setData({ todos: [], selections: { shortlisted: 0, locked: 0 } }) // Clear ghost data
        setError(null)

        // Fire API call in background (don't await)
        authApi.logout().catch(() => {
            // Ignore logout errors - user is already logged out client-side
        })

        // Navigation handled by ProtectedRoute detecting null user
    }

    const updateUser = (updates) => {
        setUser(prev => prev ? { ...prev, ...updates } : null)
    }

    // Helper to refresh selections data (for after shortlist/lock actions)
    const refreshSelections = async () => {
        try {
            const res = await selectionsApi.getAll()
            setData(prev => ({ ...prev, selections: res.data.counts }))
        } catch (err) {
            console.error('Failed to refresh selections:', err)
        }
    }

    const value = useMemo(() => ({
        user,
        data,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
        setData,
        checkAuth,
        refreshSelections
    }), [user, data, loading, error])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export default AuthContext
