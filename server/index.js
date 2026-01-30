// Server Entry Point
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true)

        // Allow development origins
        if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('0.0.0.0')) {
            return callback(null, true)
        }

        // Check against CLIENT_URL (comma-separated) if provided
        if (process.env.CLIENT_URL) {
            const allowedOrigins = process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
            const normalizedOrigin = origin.replace(/\/$/, '')
            if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true)
        }

        // Allow Netlify and Render hosting domains
        if (origin.includes('.netlify.app') || origin.includes('render.com')) return callback(null, true)

        // Otherwise reject
        console.log(`CORS blocked for origin: ${origin}`)
        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
// Safely handle preflight OPTIONS requests without registering a '*' route
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        // run the cors middleware for this request and then end with 204
        return cors(corsOptions)(req, res, () => res.sendStatus(corsOptions.optionsSuccessStatus || 204))
    }
    next()
})

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
