
// Landing Page with Premium Design System
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    GraduationCap, Globe, Users, Sparkles,
    ArrowRight, CheckCircle, Star, MapPin, Zap
} from 'lucide-react'
import { PageWrapper } from '../../components/ui/PageWrapper'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

// Animation Config
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: "easeOut" }
}

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
}

const STATS = [
    { value: '61+', label: 'Universities' },
    { value: '15+', label: 'Countries' },
    { value: 'AI', label: 'Powered' }
]

const FEATURES = [
    {
        icon: Sparkles,
        title: 'AICOUNSELLOR Intelligence',
        description: 'Chat with our intelligent AI to shortlist universities and create personalized checklists.'
    },
    {
        icon: GraduationCap,
        title: 'Smart Matching',
        description: 'Get matched to "Dream", "Target", and "Safe" schools based on your unique profile.'
    },
    {
        icon: Globe,
        title: 'Global Coverage',
        description: 'Explore top universities across USA, UK, Canada, Australia, Germany and more.'
    }
]

const DESTINATIONS = [
    { country: 'USA', flag: '🇺🇸', count: 15 },
    { country: 'UK', flag: '🇬🇧', count: 12 },
    { country: 'Canada', flag: '🇨🇦', count: 6 },
    { country: 'Australia', flag: '🇦🇺', count: 5 },
    { country: 'Germany', flag: '🇩🇪', count: 3 },
    { country: 'Others', flag: '🌍', count: 20 }
]

export default function LandingPage() {
    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], [0, -50])

    return (
        <PageWrapper>
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="gradient-orb w-[800px] h-[800px] -top-[400px] left-[20%] bg-violet-500/20 blur-[120px]" />
                <div className="gradient-orb w-[600px] h-[600px] top-[40%] -right-[200px] bg-indigo-500/10 blur-[100px]" style={{ animationDelay: '-5s' }} />
            </div>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 w-full z-50 glass-nav"
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-white tracking-tight">AICOUNSELLOR</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'Destinations', 'About'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
                        </Link>
                        <Link to="/signup">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                        <span className="text-xs font-medium text-violet-200">AI-Powered Study Abroad Assistant</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6"
                    >
                        <span className="text-gradient-premium">AICOUNSELLOR</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Plan your study-abroad journey with a guided AI counsellor.
                        Get personalized university recommendations, manage applications, and track deadlines.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/signup" className="w-full sm:w-auto">
                            <Button variant="premium" className="h-12 px-8 text-base w-full sm:w-auto" icon={ArrowRight}>
                                Initialize AI
                            </Button>
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto">
                            <Button variant="ghost" className="h-12 px-8 text-base w-full sm:w-auto">
                                Sign In
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Beam Divider */}
                    <div className="w-full max-w-3xl mx-auto mt-20 beam-border h-px bg-white/5" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-wrap items-center justify-center gap-12 md:gap-20 mt-12"
                    >
                        {STATS.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-32 z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div {...fadeInUp} className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why Choose Us?</h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            We combine advanced AI with comprehensive data to simplify every step of your application process.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {FEATURES.map((feature, index) => (
                            <Card key={feature.title} className="bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-6 border border-violet-500/20">
                                    <feature.icon className="w-6 h-6 text-violet-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Destinations Section */}
            <section id="destinations" className="relative py-32 bg-black/50 z-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div {...fadeInUp} className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Popular Destinations</h2>
                        <p className="text-zinc-400 text-lg">Explore opportunities in top education hubs around the world.</p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {DESTINATIONS.map((dest, index) => (
                            <motion.div
                                key={dest.country}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white/5 border border-white/5 hover:border-violet-500/30 rounded-2xl p-6 text-center transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">{dest.flag}</div>
                                    <div className="text-white font-medium mb-1">{dest.country}</div>
                                    <div className="text-xs text-zinc-500 group-hover:text-violet-300 transition-colors">{dest.count} universities</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 z-10">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-black p-12 md:p-20 text-center">
                        <div className="absolute inset-0 bg-violet-600/10 blur-[100px]" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                Ready to Shape Your Future?
                            </h2>
                            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                                Join thousands of students who have found their perfect university match with AICOUNSELLOR.
                            </p>
                            <Link to="/signup">
                                <Button variant="premium" className="h-14 px-10 text-lg rounded-full shadow-xl shadow-violet-500/20">
                                    Create Free Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 border-t border-white/5 z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-zinc-400" />
                            </div>
                            <span className="text-sm font-semibold text-zinc-300">AICOUNSELLOR</span>
                        </div>
                        <p className="text-sm text-zinc-600">
                            © 2026 AICOUNSELLOR. built with ❤️ and AI.
                        </p>
                    </div>
                </div>
            </footer>
        </PageWrapper >
    )
}
