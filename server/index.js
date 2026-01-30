// Server Entry Point
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

// Route imports
import authRoutes from './src/api/auth/index.js'
import userRoutes from './src/api/user/index.js'
import universitiesRoutes from './src/api/universities/index.js'
import selectionsRoutes from './src/api/selections/index.js'
import todosRoutes from './src/api/todos/index.js'
import counsellorRoutes from './src/api/counsellor/index.js'

const app = express()

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
        next()
    })
}

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'AICOUNSELLOR API',
        version: '1.0.0',
        status: 'healthy',
        timestamp: new Date().toISOString()
    })
})

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/universities', universitiesRoutes)
app.use('/api/selections', selectionsRoutes)
app.use('/api/todos', todosRoutes)
app.use('/api/counsellor', counsellorRoutes)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err)
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
})

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`
🚀 AICOUNSELLOR API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Running on: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
})

export default app
