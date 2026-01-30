
// Login Page - Premium UI
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import logo from '../../assets/logo.svg'
import { useAuth } from '../../context'
import { PageWrapper } from '../../components/ui/PageWrapper'
import { GlassCard } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login, error } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setLoading(true)

        try {
            const result = await login(email, password)
            navigate(result.redirect || '/dashboard')
        } catch (err) {
            setFormError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageWrapper className="flex items-center justify-center min-h-screen p-4">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="gradient-orb w-[600px] h-[600px] top-[10%] left-[10%] bg-violet-500/10 blur-[100px]" />
                <div className="gradient-orb w-[500px] h-[500px] bottom-[10%] right-[10%] bg-indigo-500/10 blur-[100px]" style={{ animationDelay: '-5s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <img src={logo} alt="AICOUNSELLOR" className="w-10 h-10 rounded-xl shadow-lg" />
                    </Link>
                    <p className="text-zinc-400 mt-3 font-medium">Welcome back! Sign in to continue.</p>
                </div>

                <GlassCard className="backdrop-blur-2xl">
                    <h1 className="text-2xl font-bold text-white mb-8 text-center">Sign In</h1>

                    {(formError || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {formError || error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            icon={Mail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />

                        <Input
                            label="Password"
                            type="password"
                            icon={Lock}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                loading={loading}
                                fullWidth
                                variant="premium"
                                icon={ArrowRight}
                                className="h-12 text-base"
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>

                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-zinc-500 text-xs uppercase tracking-widest font-medium">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <p className="text-center text-zinc-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium hover:underline decoration-violet-400/30 underline-offset-4 transition-all">
                            Create account
                        </Link>
                    </p>
                </GlassCard>
            </motion.div>
        </PageWrapper>
    )
}
