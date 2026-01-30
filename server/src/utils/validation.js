// Validation utilities

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return passwordRegex.test(password)
}

export const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    return phoneRegex.test(phone)
}

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input
    return input.trim().replace(/<[^>]*>/g, '')
}

export default {
    validateEmail,
    validatePassword,
    validatePhone,
    sanitizeInput
}
