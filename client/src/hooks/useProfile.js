// useProfile hook - User profile management
import { useState, useCallback, useEffect } from 'react'
import { userApi } from '../api'

export const useProfile = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProfile = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await userApi.getProfile()
            setProfile(data.profile)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const updateProfile = useCallback(async (updates) => {
        setLoading(true)
        try {
            const { data } = await userApi.updateProfile(updates)
            setProfile(data.profile)
            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const updateOnboarding = useCallback(async (onboardingData) => {
        setLoading(true)
        try {
            const { data } = await userApi.updateOnboarding(onboardingData)
            setProfile(data.profile)
            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    return { profile, loading, error, fetchProfile, updateProfile, updateOnboarding }
}

export default useProfile
