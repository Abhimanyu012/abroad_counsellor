
import { motion } from 'framer-motion'
import { PageWrapper } from '../../components/ui/PageWrapper'
import { Link } from 'react-router-dom'
import {
    User, Search, ListChecks, Lock, Map,
    ArrowRight, Star, ShieldCheck, FileText, Upload,
    CheckCircle, Brain, Target, TrendingUp
} from 'lucide-react'
import { Button } from '../../components/ui/Button'

const STEPS = [
    {
        id: 1,
        title: "Build Your Comprehensive Profile",
        description: "Your journey starts with data. Input your GPA, standardized test scores (IELTS/TOEFL), budget preferences, and target countries. Our AI analyzes your profile strength against millions of data points to calculate your precise acceptance chances.",
        features: ["Gap Analysis", "Budget Optimization", "Trend Matching", "Eligibility Check"],
        icon: User,
        color: "bg-blue-500",
        visual: "profile",
        gradient: "from-blue-500 to-cyan-400"
    },
    {
        id: 2,
        title: "Discover Your Best Fits",
        description: "Stop guessing. Our AI scans thousands of universities globally to find programs that match your academic profile and financial goals. Filter by ranking, tuition fee, and 'Match Score'—a personalized metric indicating your likelihood of admission.",
        features: ["Scholarship Finder", "ROI Calculator", "Alumni Insights", "Program Comparison"],
        icon: Search,
        color: "bg-violet-500",
        visual: "search",
        gradient: "from-violet-500 to-fuchsia-500"
    },
    {
        id: 3,
        title: "Shortlist & Compare",
        description: "Curate your list of favorites. Compare universities side-by-side on key metrics like location, ROI, and curriculum. Move them to your shortlist to track them closely and get ready for the final decision.",
        features: ["Side-by-Side View", "Curriculum Analysis", "Cost Breakdown", "Deadline Tracking"],
        icon: ListChecks,
        color: "bg-pink-500",
        visual: "shortlist",
        gradient: "from-pink-500 to-rose-400"
    },
    {
        id: 4,
        title: "Lock Your Target",
        description: "The pivotal moment. Select your absolute top choice and 'Lock' it. This signals our AI to generate a hyper-specific roadmap tailored to that university's unique requirements, deadlines, and documentation needs.",
        features: ["Decision Locking", "AI Roadmap Generation", "Priority Support", "Document Checklist"],
        icon: Lock,
        color: "bg-amber-500",
        visual: "lock",
        gradient: "from-amber-500 to-orange-400"
    },
    {
        id: 5,
        title: "Execute Your Roadmap",
        description: "Follow a step-by-step Kanban board generated just for you. From drafting the perfect SOP to visa interview prep, our AI guides you through every single task until you land on campus.",
        features: ["SOP Builder", "Visa Interview Prep", "Flights & Accommodation", "Pre-departure Briefing"],
        icon: Map,
        color: "bg-emerald-500",
        visual: "roadmap",
        gradient: "from-emerald-500 to-teal-400"
    }
]

const AI_CAPABILITIES = [
    {
        title: "The Analyst",
        description: "Deconstructs your profile into 50+ data points to calculate realistic acceptance probabilities.",
        icon: Brain,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        title: "The Strategist",
        description: "Identifies hidden opportunities and 'reach' schools where your strengths maximize your chances.",
        icon: Target,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20"
    },
    {
        title: "The Mentor",
        description: "Predicts future trends to guide your roadmap, from electives to internships.",
        icon: TrendingUp,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    }
]

const WORKFLOW_STAGES = [
    {
        id: 1,
        title: "Profile & Discovery",
        desc: "Steps 1-2",
        color: "bg-blue-500",
        icon: User
    },
    {
        id: 2,
        title: "Decision Making",
        desc: "Steps 3-4",
        color: "bg-amber-500",
        icon: Lock
    },
    {
        id: 3,
        title: "Execution",
        desc: "Step 5",
        color: "bg-emerald-500",
        icon: Map
    }
]

// Abstract Visual Components
const VisualProfile = () => (
    <div className="relative w-full h-full bg-zinc-900 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[200px] bg-zinc-800 rounded-2xl p-4 space-y-3 border border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <User size={20} />
                </div>
                <div className="flex-1">
                    <div className="h-2 w-16 bg-zinc-700 rounded mb-1.5" />
                    <div className="h-1.5 w-10 bg-zinc-700/50 rounded" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>GPA</span> <span className="text-white font-bold">3.8/4.0</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "95%" }}
                        className="h-full bg-blue-500 rounded-full"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>IELTS</span> <span className="text-white font-bold">7.5</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        transition={{ delay: 0.2 }}
                        className="h-full bg-blue-500 rounded-full"
                    />
                </div>
            </div>
        </div>
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -right-2 top-10 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md"
        >
            High Probability
        </motion.div>
    </div>
)

const VisualSearch = () => (
    <div className="relative w-full h-full bg-zinc-900 flex flex-col items-center justify-center p-6">
        <div className="space-y-3 w-full max-w-[220px]">
            {[1, 2].map((i) => (
                <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-zinc-800 rounded-xl p-3 border border-white/5 flex gap-3 items-center"
                >
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-2 w-24 bg-zinc-700 rounded" />
                        <div className="h-1.5 w-12 bg-zinc-700/50 rounded" />
                    </div>
                    <div className="text-xs font-bold text-violet-400">92%</div>
                </motion.div>
            ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none" />
    </div>
)

const VisualShortlist = () => (
    <div className="relative w-full h-full bg-zinc-900 flex flex-col items-center justify-center p-6">
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-zinc-800 rounded-2xl p-4 border border-pink-500/30 shadow-2xl shadow-pink-500/10 w-full max-w-[200px]"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-pink-500 fill-pink-500" />
                </div>
                <div className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    #1 Choice
                </div>
            </div>
            <div className="h-2.5 w-3/4 bg-white/20 rounded mb-2" />
            <div className="h-2 w-1/2 bg-white/10 rounded" />
        </motion.div>
    </div>
)

const VisualLock = () => (
    <div className="relative w-full h-full bg-zinc-900 flex flex-col items-center justify-center p-6">
        <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="relative w-32 h-32 rounded-full border-4 border-amber-500/20 flex items-center justify-center"
        >
            <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
                <Lock className="w-12 h-12 text-amber-500" />
            </motion.div>
            <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full" />
        </motion.div>
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold"
        >
            Decision Locked
        </motion.div>
    </div>
)

const VisualRoadmap = () => (
    <div className="relative w-full h-full bg-zinc-900 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[200px] space-y-3">
            <motion.div
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
            >
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <ShieldCheck className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-200 line-through decoration-emerald-500/50">Shortlist Finalized</span>
            </motion.div>
            <motion.div
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800 border border-white/5"
            >
                <div className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center">
                    <FileText className="w-3 h-3 text-zinc-500" />
                </div>
                <span className="text-xs font-medium text-zinc-300">Draft SOP</span>
            </motion.div>
            <motion.div
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800 border border-white/5"
            >
                <div className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center">
                    <Upload className="w-3 h-3 text-zinc-500" />
                </div>
                <span className="text-xs font-medium text-zinc-300">Upload Docs</span>
            </motion.div>
        </div>
    </div>
)

const VISUALS = {
    profile: VisualProfile,
    search: VisualSearch,
    shortlist: VisualShortlist,
    lock: VisualLock,
    roadmap: VisualRoadmap
}

export default function GuidePage() {
    return (
        <PageWrapper>
            <div className="max-w-5xl mx-auto px-6 py-24 relative">
                {/* Navigation - Fixed Top Left */}
                <Link to="/" className="fixed top-6 left-6 z-50">
                    <Button variant="ghost" icon={ArrowRight} iconPosition="left" className="bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white rounded-full px-4 h-10 shadow-xl transition-all hover:scale-105">
                        Back to Home
                    </Button>
                </Link>

                {/* Header */}
                <div className="text-center mb-32 space-y-6 pt-12">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-violet-300 backdrop-blur-md"
                    >
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_10px_rgba(167,139,250,0.5)]" />
                        User Guide
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white tracking-tight"
                    >
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
                            Study Abroad Journey
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        A step-by-step guide to turning your global education dreams into reality with AICOUNSELLOR.
                    </motion.p>
                </div>

                {/* Workflow Overview */}
                <div className="mb-32">
                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 max-w-4xl mx-auto">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 hidden md:block opacity-20" />

                        {WORKFLOW_STAGES.map((stage, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center bg-zinc-900 border border-white/5 p-6 rounded-2xl w-full md:w-64"
                            >
                                <div className={`w-12 h-12 rounded-full ${stage.color} bg-opacity-20 flex items-center justify-center mb-4 border border-white/10`}>
                                    <stage.icon className={`w-5 h-5 text-white`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{stage.title}</h3>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{stage.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* AI Capabilities Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-32">
                    {AI_CAPABILITIES.map((cap, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-2xl border ${cap.border} ${cap.bg} backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
                        >
                            <div className={`w-12 h-12 rounded-xl ${cap.bg} flex items-center justify-center mb-4 border ${cap.border}`}>
                                <cap.icon className={`w-6 h-6 ${cap.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{cap.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">{cap.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Timeline */}
                <div className="relative space-y-32 before:absolute before:inset-y-0 before:left-6 md:before:left-1/2 before:-translate-x-px before:w-0.5 before:bg-gradient-to-b before:from-violet-500/50 before:via-white/10 before:to-transparent">
                    {STEPS.map((step, index) => {
                        const VisualComponent = VISUALS[step.visual]

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7, delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row items-center gap-12 md:gap-20 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'
                                    }`}
                            >
                                {/* Marker */}
                                <div className="absolute left-6 md:left-1/2 -translate-x-[22px] md:-translate-x-1/2 w-11 h-11 rounded-full border-4 border-black bg-zinc-900 z-10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                    <step.icon className="w-5 h-5 text-white relative z-10" />
                                    <div className={`absolute inset-0 rounded-full opacity-40 ${step.color} blur-md`} />
                                </div>

                                {/* Visual Side */}
                                <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-0 flex justify-center">
                                    <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl group relative">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                                        <VisualComponent />
                                    </div>
                                </div>

                                {/* Text Side */}
                                <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:text-left' : 'md:text-left'}`}>
                                    <div className="inline-flex items-center gap-2 mb-4 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                                        <span className={`w-2 h-2 rounded-full ${step.color}`} />
                                        Step 0{step.id}
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-6 leading-tight">{step.title}</h3>
                                    <p className="text-zinc-400 text-lg leading-relaxed mb-8">{step.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {step.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                                                <CheckCircle className={`w-4 h-4 ${step.color.replace('bg-', 'text-')}`} />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-40 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden text-center max-w-4xl mx-auto shadow-2xl shadow-violet-600/20"
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to apply?</h2>
                            <p className="text-violet-100 text-lg mb-10 max-w-lg mx-auto">
                                Join thousands of students who have simplified their journey with our extensive data and AI guidance.
                            </p>
                            <Link to="/signup">
                                <Button className="bg-white text-violet-600 hover:bg-white/90 h-14 px-10 text-lg font-bold shadow-xl rounded-full">
                                    Start Your Journey <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    )
}
