// Onboarding Page - Premium Split Layout
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    GraduationCap, DollarSign, Globe, BookOpen,
    ArrowRight, Check, Sparkles, User, Calendar
} from 'lucide-react'
import { useAuth } from '../../context'
import { userApi } from '../../api'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const STEPS = [
    {
        id: 1,
        title: 'Academic Profile',
        subtitle: 'Tell us about your educational background',
        icon: GraduationCap,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'Budget',
        subtitle: 'Your financial planning',
        icon: DollarSign,
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: 3,
        title: 'Test Scores',
        subtitle: 'Standardized test achievements',
        icon: BookOpen,
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2673&auto=format&fit=crop'
    },
    {
        id: 4,
        title: 'Preferences',
        subtitle: 'Where do you want to study?',
        icon: Globe,
        image: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2664&auto=format&fit=crop'
    }
]

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Singapore', 'Switzerland', 'France', 'Japan']
const COURSES = ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law', 'Economics', 'Data Science', 'Psychology', 'Architecture', 'Design']

const SelectionChip = ({ selected, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`
            relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border
            ${selected
                ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20 translate-y-[-1px]'
                : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:border-white/10 hover:text-zinc-200'
            }
        `}
    >
        {children}
    </button>
)

export default function OnboardingPage() {
    const navigate = useNavigate()
    const { user, updateUser } = useAuth()

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: user?.name || '',
        educationLevel: 'masters',
        intendedDegree: 'masters',
        gpa: '',
        budget: '',
        fundingPlan: 'self',
        ielts: '',
        toefl: '',
        gre: '',
        gmat: '',
        targetCountry: '',
        targetIntakeYear: '',
        sopStatus: 'not_started',
        preferredCourses: []
    })

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (error) setError('')
    }

    const toggleCourse = (course) => setFormData(prev => ({
        ...prev,
        preferredCourses: prev.preferredCourses.includes(course)
            ? prev.preferredCourses.filter(c => c !== course)
            : [...prev.preferredCourses, course]
    }))

    const validateStep = (currentStep) => {
        switch (currentStep) {
            case 1:
                if (!formData.name?.trim()) return 'Please enter your full name'
                if (!formData.educationLevel) return 'Please select your education level'
                if (!formData.intendedDegree) return 'Please select your intended degree'
                if (!formData.gpa) return 'Please enter your GPA'
                const gpa = parseFloat(formData.gpa)
                if (isNaN(gpa) || gpa < 0 || gpa > 4.0) return 'GPA must be between 0 and 4.0'
                return null
            case 2:
                if (!formData.budget) return 'Please enter your annual budget'
                const budget = parseInt(formData.budget)
                if (isNaN(budget) || budget <= 0) return 'Please enter a valid budget amount'
                return null
            case 3:
                // Optional fields validation if provided
                if (formData.ielts) {
                    const ielts = parseFloat(formData.ielts)
                    if (ielts < 0 || ielts > 9) return 'IELTS score must be between 0 and 9'
                }
                if (formData.toefl) {
                    const toefl = parseInt(formData.toefl)
                    if (toefl < 0 || toefl > 120) return 'TOEFL score must be between 0 and 120'
                }
                return null
            case 4:
                if (!formData.targetCountry) return 'Please select a dream destination'
                if (formData.targetIntakeYear) {
                    const year = parseInt(formData.targetIntakeYear)
                    const currentYear = new Date().getFullYear()
                    if (year < currentYear || year > currentYear + 5) return `Intake year must be between ${currentYear} and ${currentYear + 5}`
                }
                return null
            default:
                return null
        }
    }

    const nextStep = () => {
        const validationError = validateStep(step)
        if (validationError) {
            setError(validationError)
            return
        }

        if (step < 4) setStep(step + 1)
    }

    const prevStep = () => {
        setError('')
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async () => {
        const validationError = validateStep(4)
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        try {
            const response = await userApi.completeOnboarding({
                name: formData.name,
                educationLevel: formData.educationLevel,
                intendedDegree: formData.intendedDegree,
                gpa: parseFloat(formData.gpa),
                budget: parseInt(formData.budget),
                fundingPlan: formData.fundingPlan,
                ielts: formData.ielts ? parseFloat(formData.ielts) : null,
                toefl: formData.toefl ? parseInt(formData.toefl) : null,
                gre: formData.gre ? parseInt(formData.gre) : null,
                gmat: formData.gmat ? parseInt(formData.gmat) : null,
                targetCountry: formData.targetCountry,
                targetIntakeYear: formData.targetIntakeYear ? parseInt(formData.targetIntakeYear) : null,
                sopStatus: formData.sopStatus,
                preferredCourses: formData.preferredCourses
            })
            updateUser(response.data.profile)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to complete onboarding')
        } finally {
            setLoading(false)
        }
    }

    const currentStepData = STEPS[step - 1]

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <Input
                            label="Your Full Name"
                            icon={User}
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="Alex Morgan"
                            required
                        />

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3 block">
                                Highest Education Level <span className="text-violet-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['bachelors', 'masters', 'phd'].map((level) => (
                                    <SelectionChip
                                        key={level}
                                        selected={formData.educationLevel === level}
                                        onClick={() => updateField('educationLevel', level)}
                                    >
                                        <span className="capitalize">{level === 'phd' ? 'PhD' : level}</span>
                                    </SelectionChip>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3 block">
                                Intended Degree <span className="text-violet-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['bachelors', 'masters', 'mba', 'phd'].map((degree) => (
                                    <SelectionChip
                                        key={degree}
                                        selected={formData.intendedDegree === degree}
                                        onClick={() => updateField('intendedDegree', degree)}
                                    >
                                        <span className="uppercase">{degree}</span>
                                    </SelectionChip>
                                ))}
                            </div>
                        </div>

                        <Input
                            label="GPA (4.0 Scale)"
                            icon={GraduationCap}
                            type="number"
                            step="0.01"
                            max="4.0"
                            value={formData.gpa}
                            onChange={(e) => updateField('gpa', e.target.value)}
                            placeholder="3.8"
                            required
                        />
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-6">
                        <Input
                            label="Annual Budget (USD)"
                            icon={DollarSign}
                            type="number"
                            value={formData.budget}
                            onChange={(e) => updateField('budget', e.target.value)}
                            placeholder="50000"
                            required
                        />

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3 block">
                                Funding Plan
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[{ v: 'self', l: 'Self-Funded' }, { v: 'scholarship', l: 'Scholarship' }, { v: 'loan', l: 'Loan' }].map((o) => (
                                    <SelectionChip
                                        key={o.v}
                                        selected={formData.fundingPlan === o.v}
                                        onClick={() => updateField('fundingPlan', o.v)}
                                    >
                                        {o.l}
                                    </SelectionChip>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-zinc-400">
                            <p className="font-medium text-zinc-200 mb-2 flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Average Tuition Costs
                            </p>
                            <div className="space-y-1 pl-5">
                                <div className="flex justify-between">
                                    <span>United States</span>
                                    <span className="text-zinc-200">$50k - 90k</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>United Kingdom</span>
                                    <span className="text-zinc-200">$40k - 70k</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="IELTS Score"
                                type="number"
                                step="0.5"
                                max="9"
                                value={formData.ielts}
                                onChange={(e) => updateField('ielts', e.target.value)}
                                placeholder="7.0"
                            />
                            <Input
                                label="TOEFL Score"
                                type="number"
                                max="120"
                                value={formData.toefl}
                                onChange={(e) => updateField('toefl', e.target.value)}
                                placeholder="100"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="GRE Score"
                                type="number"
                                max="340"
                                value={formData.gre}
                                onChange={(e) => updateField('gre', e.target.value)}
                                placeholder="320"
                            />
                            <Input
                                label="GMAT Score"
                                type="number"
                                max="800"
                                value={formData.gmat}
                                onChange={(e) => updateField('gmat', e.target.value)}
                                placeholder="700"
                            />
                        </div>
                        <p className="text-xs text-zinc-500 pl-1">
                            * Leave blank if tests have not been taken yet.
                        </p>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3 block">
                                Dream Destination <span className="text-violet-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {COUNTRIES.map((c) => (
                                    <SelectionChip
                                        key={c}
                                        selected={formData.targetCountry === c}
                                        onClick={() => updateField('targetCountry', c)}
                                    >
                                        {c}
                                    </SelectionChip>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Target Intake Year"
                                icon={Calendar}
                                type="number"
                                min={new Date().getFullYear()}
                                max={new Date().getFullYear() + 5}
                                value={formData.targetIntakeYear}
                                onChange={(e) => updateField('targetIntakeYear', e.target.value)}
                                placeholder="2026"
                            />
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3 block">
                                    SOP Status
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[{ v: 'not_started', l: 'Not Started' }, { v: 'draft', l: 'Drafting' }, { v: 'ready', l: 'Ready' }].map((o) => (
                                        <SelectionChip
                                            key={o.v}
                                            selected={formData.sopStatus === o.v}
                                            onClick={() => updateField('sopStatus', o.v)}
                                        >
                                            {o.l}
                                        </SelectionChip>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3 block">
                                Areas of Interest
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {COURSES.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => toggleCourse(c)}
                                        className={`
                                            px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                                            ${formData.preferredCourses.includes(c)
                                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                                : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                                            }
                                        `}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            default: return null
        }
    }

    return (
        <div className="min-h-screen bg-black flex font-sans">
            {/* Left Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12">
                <div className="max-w-xl w-full mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-violet-600 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(step / 4) * 100}%` }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            </div>
                            <span className="text-xs font-mono text-zinc-500">0{step}/04</span>
                        </div>

                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">{currentStepData.title}</h1>
                            <p className="text-zinc-400 text-lg">{currentStepData.subtitle}</p>
                        </motion.div>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form Content */}
                    <div className="min-h-[320px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-10 mt-6 border-t border-white/5">
                        <button
                            onClick={prevStep}
                            disabled={step === 1 || loading}
                            className="text-zinc-500 hover:text-zinc-300 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-0"
                        >
                            Back
                        </button>

                        {step < 4 ? (
                            <Button
                                onClick={nextStep}
                                variant="premium"
                                className="px-8 h-12"
                                icon={ArrowRight}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                variant="premium"
                                className="px-8 h-12 bg-emerald-500 hover:bg-emerald-400 border-none shadow-emerald-500/20"
                                loading={loading}
                                icon={Check}
                            >
                                Complete Setup
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-zinc-950 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={currentStepData.image}
                            alt={currentStepData.title}
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-10 max-w-md p-10 text-center">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <currentStepData.icon className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {step === 1 && "Let's personalize your journey"}
                            {step === 2 && "Smart financial planning"}
                            {step === 3 && "Showcase your achievements"}
                            {step === 4 && "Define your future"}
                        </h2>
                        <p className="text-zinc-400 leading-relaxed">
                            {step === 1 && "We'll suggest universities that perfectly match your academic background and aspirations."}
                            {step === 2 && "Get realistic cost estimates and funding options tailored to your budget constraints."}
                            {step === 3 && "Your scores help us calculate acceptance probabilities with high precision."}
                            {step === 4 && "Choose from thousands of world-class institutions in top study destinations."}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
