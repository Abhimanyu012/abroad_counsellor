
// Landing Page with Premium Design System
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom'
import {
    GraduationCap, Globe, Users, Sparkles,
    ArrowRight, CheckCircle, Star, MapPin, Zap,
    Twitter, Linkedin, Instagram, X
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
                        <img src={logo} alt="AICOUNSELLOR" className="w-8 h-8 rounded-lg shadow-lg" />
                        <span className="text-lg font-semibold text-white tracking-tight">AICOUNSELLOR</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/guide" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group">
                            How it Works
                            <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-[10px] font-bold text-violet-300 border border-violet-500/30 group-hover:bg-violet-500 group-hover:text-white transition-all">NEW</span>
                        </Link>
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
            <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">

                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
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
                            className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-[0.9]"
                        >
                            Your Personal <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
                                AI Architect
                            </span> <br />
                            for Global Education.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Stop searching. Start applying. Our intelligent guide builds your entire study abroad roadmap—from university selection to visa approval—in seconds.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                        >
                            <Link to="/signup" className="w-full sm:w-auto">
                                <Button variant="premium" className="h-14 px-8 text-lg w-full sm:w-auto shadow-[0_0_30px_rgba(139,92,246,0.3)]" icon={ArrowRight}>
                                    Build My Roadmap
                                </Button>
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto">
                                <Button variant="ghost" className="h-14 px-8 text-lg w-full sm:w-auto">
                                    Login
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 flex items-center justify-center lg:justify-start gap-8"
                        >
                            {STATS.map((stat) => (
                                <div key={stat.label} className="text-left">
                                    <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Column: Animated Chat Mock */}
                    <div className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-violet-600/20 blur-[100px] rounded-full" />
                        <HeroChatMock />
                    </div>
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

            {/* About Section */}
            <section id="about" className="relative py-32 z-10 bg-black/50 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for Ambition.</h2>
                        <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
                            <p>
                                AICOUNSELLOR was born from a simple belief: <span className="text-white font-medium">every student deserves world-class guidance.</span>
                            </p>
                            <p>
                                Traditional consulting is expensive and slow. We replaced it with an intelligent engine that understands your profile, matches you with precision, and builds a personalized roadmap to your dream university.
                            </p>
                            <div className="pt-4 flex items-center gap-4">
                                <div className="pl-4 border-l-2 border-violet-500">
                                    <div className="text-white font-bold">Get personalized advice</div>
                                    <div className="text-sm text-zinc-500">Instant. Unbiased. Free.</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-violet-600/20 blur-[100px] rounded-full" />
                        <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                            <Globe className="w-12 h-12 text-violet-400 mb-6" />
                            <div className="text-2xl font-bold text-white mb-2">Our Mission</div>
                            <p className="text-zinc-400">
                                To democratize access to global education by putting a super-counsellor in every student's pocket.
                            </p>
                        </div>
                    </motion.div>
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
            <footer className="relative py-20 border-t border-white/5 z-10 bg-black/80 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2.5">
                                <span className="text-lg font-bold text-white tracking-tight">AICOUNSELLOR</span>
                            </div>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Empowering students worldwide with AI-driven guidance for their study abroad journey.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-violet-500 hover:text-white transition-all">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-violet-500 hover:text-white transition-all">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-violet-500 hover:text-white transition-all">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6">Product</h4>
                            <ul className="space-y-4 text-sm text-zinc-500">
                                <li><a href="#features" className="hover:text-violet-400 transition-colors">Features</a></li>
                                <li><a href="#destinations" className="hover:text-violet-400 transition-colors">Universities</a></li>
                                <li><Link to="/signup" className="hover:text-violet-400 transition-colors">Pricing</Link></li>
                                <li><Link to="/login" className="hover:text-violet-400 transition-colors">Login</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6">Company</h4>
                            <ul className="space-y-4 text-sm text-zinc-500">
                                <li><a href="#about" className="hover:text-violet-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-violet-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-violet-400 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-violet-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-zinc-500">
                                <li><a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-violet-400 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-violet-400 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-sm text-zinc-600">
                            © 2026 AICOUNSELLOR. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-zinc-600">
                            <span>Made with ❤️ for students.</span>
                        </div>
                    </div>
                </div>
            </footer>

            <GuidePopup />
        </PageWrapper >
    )
}

function GuidePopup() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const hasSeenGuide = localStorage.getItem('seen_guide_popup')
        if (!hasSeenGuide) {
            const timer = setTimeout(() => setShow(true), 3000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleDismiss = () => {
        setShow(false)
        localStorage.setItem('seen_guide_popup', 'true')
    }

    if (!show) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
            >
                <div className="bg-zinc-900/90 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-violet-500 to-indigo-500" />

                    <button onClick={handleDismiss} className="absolute top-3 right-3 text-zinc-500 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">New to AICOUNSELLOR?</h4>
                            <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
                                Not sure where to start? Check our step-by-step guide to master your application journey.
                            </p>
                            <div className="flex gap-3">
                                <Link to="/guide" onClick={handleDismiss}>
                                    <Button className="h-8 px-4 text-xs">View Guide</Button>
                                </Link>
                                <button onClick={handleDismiss} className="text-xs text-zinc-500 hover:text-white transition-colors">
                                    Maybe later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

function HeroChatMock() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'user', content: "I want to do Masters in CS in USA under $40k", delay: 1 }
    ])

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setMessages(prev => [...prev, {
                id: 2,
                role: 'assistant',
                content: "I found 3 great matches for you based on that criteria.",
                type: 'text'
            }])
        }, 2000)

        const timer2 = setTimeout(() => {
            setMessages(prev => [...prev, {
                id: 3,
                role: 'assistant',
                content: null,
                type: 'card',
                data: { name: 'Georgia Tech', rank: '#3', fee: '$32k', match: '95%' }
            }])
        }, 3500)

        const timer3 = setTimeout(() => {
            setMessages(prev => [...prev, {
                id: 4,
                role: 'assistant',
                content: null,
                type: 'card',
                data: { name: 'Purdue University', rank: '#8', fee: '$29k', match: '92%' }
            }])
        }, 4000)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
        }
    }, [])

    return (
        <div className="relative w-full max-w-md mx-auto perspective-1000">
            <motion.div
                initial={{ rotateX: 10, rotateY: -10, scale: 0.9 }}
                animate={{ rotateX: 0, rotateY: 0, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="h-16 border-b border-white/5 flex items-center px-6 gap-4 bg-white/5">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center p-2 shadow-lg">
                        <img src={logo} alt="AI" className="w-full h-full object-contain invert brightness-200" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">AICOUNSELLOR</div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-zinc-400 font-medium">Online & Ready</span>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="p-6 space-y-4 min-h-[400px]">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.type === 'card' ? (
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl w-64 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-white max-w-[70%]">{msg.data.name}</div>
                                        <div className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                                            {msg.data.match}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                                        <div>Rank: <span className="text-white">{msg.data.rank}</span></div>
                                        <div>Fee: <span className="text-white">{msg.data.fee}</span></div>
                                    </div>
                                    <div className="mt-3 text-[10px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
                                        View Details <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            ) : (
                                <div className={`p-4 rounded-2xl text-sm max-w-[85%] leading-relaxed ${msg.role === 'user'
                                    ? 'bg-violet-600 text-white rounded-tr-sm'
                                    : 'bg-white/10 text-zinc-200 rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {messages.length < 4 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-1 pl-4"
                        >
                            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce delay-100" />
                            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce delay-200" />
                        </motion.div>
                    )}
                </div>

                {/* Input Mock */}
                <div className="p-4 border-t border-white/5 bg-black/40">
                    <div className="h-12 bg-white/5 rounded-full border border-white/10 flex items-center px-4 justify-between">
                        <div className="w-24 h-2 bg-white/10 rounded-full" />
                        <div className="w-8 h-8 rounded-full bg-violet-600/50 flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-white/50" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-20 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 p-3 rounded-xl flex items-center gap-3 shadow-2xl"
            >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-xs font-bold text-white">Application Sent</div>
                    <div className="text-[10px] text-zinc-400">USC • Fall 2026</div>
                </div>
            </motion.div>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-8 bottom-32 bg-amber-500/10 backdrop-blur-md border border-amber-500/20 p-3 rounded-xl flex items-center gap-3 shadow-2xl"
            >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Zap className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-xs font-bold text-white">SOP Generated</div>
                    <div className="text-[10px] text-zinc-400">Ready for review</div>
                </div>
            </motion.div>
        </div>
    )
}
