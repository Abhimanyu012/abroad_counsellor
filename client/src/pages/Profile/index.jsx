// Profile Page - Edit User Profile
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    User, GraduationCap, DollarSign, BookOpen, Globe,
    ArrowLeft, Save, Loader2, CheckCircle, AlertCircle
} from 'lucide-react'
import { useAuth } from '../../context'
import { userApi } from '../../api'
import { PageWrapper } from '../../components/ui/PageWrapper'
import { Navbar } from '../../components/layout/Navbar'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Singapore', 'Switzerland', 'France', 'Japan']
const COURSES = ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law', 'Economics', 'Data Science', 'Psychology', 'Architecture', 'Design']
const EDUCATION_LEVELS = ['bachelors', 'masters', 'phd']
const INTENDED_DEGREES = ['bachelors', 'masters', 'mba', 'phd']
const SOP_STATUS_OPTIONS = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'draft', label: 'Draft' },
    { value: 'ready', label: 'Ready' }
]
const FUNDING_OPTIONS = [
    { value: 'self', label: 'Self-Funded' },
    { value: 'scholarship', label: 'Scholarship-Dependent' },
    { value: 'loan', label: 'Loan-Dependent' }
]

const InputField = ({ label, required, icon: Icon, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
            {label} {required && <span className="text-violet-400">*</span>}
        </label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />}
            <input
                {...props}
                className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors`}
            />
        </div>
    </div>
)

export default function ProfilePage() {
    const navigate = useNavigate()
    const { user, updateUser } = useAuth()

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        educationLevel: 'masters',
        intendedDegree: 'masters',
        gpa: '',
        budget: '',
        ielts: '',
        toefl: '',
        gre: '',
        gmat: '',
        targetCountry: '',
        targetIntakeYear: '',
        preferredCourses: [],
        sopStatus: 'not_started',
        fundingPlan: 'self'
    })

    useEffect(() => {
        if (user) {
            const courses = user.preferredCourses
                ? (typeof user.preferredCourses === 'string'
                    ? user.preferredCourses.split(',').map(c => c.trim())
                    : user.preferredCourses)
                : []

            setFormData({
                name: user.name || '',
                educationLevel: user.educationLevel || 'masters',
                intendedDegree: user.intendedDegree || 'masters',
                gpa: user.gpa?.toString() || '',
                budget: user.budget?.toString() || '',
                ielts: user.ielts?.toString() || '',
                toefl: user.toefl?.toString() || '',
                gre: user.gre?.toString() || '',
                gmat: user.gmat?.toString() || '',
                targetCountry: user.targetCountry || '',
                targetIntakeYear: user.targetIntakeYear?.toString() || '',
                preferredCourses: courses,
                sopStatus: user.sopStatus || 'not_started',
                fundingPlan: user.fundingPlan || 'self'
            })
        }
    }, [user])

    const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))
    const toggleCourse = (course) => setFormData(prev => ({
        ...prev,
        preferredCourses: prev.preferredCourses.includes(course)
            ? prev.preferredCourses.filter(c => c !== course)
            : [...prev.preferredCourses, course]
    }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        if (!formData.gpa || !formData.budget || !formData.targetCountry) {
            setError('GPA, Budget, and Target Country are required')
            return
        }

        setSaving(true)
        try {
            const response = await userApi.updateProfile({
                name: formData.name,
                educationLevel: formData.educationLevel,
                intendedDegree: formData.intendedDegree,
                gpa: parseFloat(formData.gpa),
                budget: parseInt(formData.budget),
                ielts: formData.ielts ? parseFloat(formData.ielts) : null,
                toefl: formData.toefl ? parseInt(formData.toefl) : null,
                gre: formData.gre ? parseInt(formData.gre) : null,
                gmat: formData.gmat ? parseInt(formData.gmat) : null,
                targetCountry: formData.targetCountry,
                targetIntakeYear: formData.targetIntakeYear ? parseInt(formData.targetIntakeYear) : null,
                preferredCourses: formData.preferredCourses,
                sopStatus: formData.sopStatus,
                fundingPlan: formData.fundingPlan
            })
            updateUser(response.data.profile)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    return (
        <PageWrapper>
            <Navbar />

            <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-12">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/dashboard" className="text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors mb-2 inline-flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white tracking-tight mt-2">Edit Profile</h1>
                    <p className="text-zinc-400 mt-1">Update your information to get better university recommendations.</p>
                </div>

                {/* Success Message */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Profile updated successfully! AI recommendations will be recalculated.
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        {/* Personal Info */}
                        <Card className="bg-white/5 border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center border border-violet-500/20">
                                    <User className="w-5 h-5 text-violet-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <InputField
                                    label="Full Name"
                                    icon={User}
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="Your name"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Current Education Level
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {EDUCATION_LEVELS.map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => updateField('educationLevel', level)}
                                                className={`py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${formData.educationLevel === level
                                                    ? 'bg-violet-600 border-violet-500 text-white'
                                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                    }`}
                                            >
                                                {level === 'phd' ? 'PhD' : level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Academic Profile */}
                        <Card className="bg-white/5 border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Academic Profile</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <InputField
                                    label="GPA (4.0 Scale)"
                                    required
                                    type="number"
                                    step="0.1"
                                    max="4"
                                    value={formData.gpa}
                                    onChange={(e) => updateField('gpa', e.target.value)}
                                    placeholder="3.8"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Intended Degree <span className="text-violet-400">*</span>
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {INTENDED_DEGREES.map((degree) => (
                                            <button
                                                key={degree}
                                                type="button"
                                                onClick={() => updateField('intendedDegree', degree)}
                                                className={`py-2.5 rounded-xl border text-xs font-medium uppercase transition-all ${formData.intendedDegree === degree
                                                    ? 'bg-emerald-600 border-emerald-500 text-white'
                                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                    }`}
                                            >
                                                {degree}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <InputField
                                    label="Target Intake Year"
                                    type="number"
                                    min="2025"
                                    max="2030"
                                    value={formData.targetIntakeYear}
                                    onChange={(e) => updateField('targetIntakeYear', e.target.value)}
                                    placeholder="2026"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        SOP Status
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {SOP_STATUS_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => updateField('sopStatus', option.value)}
                                                className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${formData.sopStatus === option.value
                                                    ? 'bg-cyan-600 border-cyan-500 text-white'
                                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Test Scores */}
                        <Card className="bg-white/5 border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                                    <BookOpen className="w-5 h-5 text-cyan-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Test Scores</h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <InputField
                                    label="IELTS"
                                    type="number"
                                    step="0.5"
                                    max="9"
                                    value={formData.ielts}
                                    onChange={(e) => updateField('ielts', e.target.value)}
                                    placeholder="7.0"
                                />
                                <InputField
                                    label="TOEFL"
                                    type="number"
                                    max="120"
                                    value={formData.toefl}
                                    onChange={(e) => updateField('toefl', e.target.value)}
                                    placeholder="100"
                                />
                                <InputField
                                    label="GRE"
                                    type="number"
                                    max="340"
                                    value={formData.gre}
                                    onChange={(e) => updateField('gre', e.target.value)}
                                    placeholder="320"
                                />
                                <InputField
                                    label="GMAT"
                                    type="number"
                                    max="800"
                                    value={formData.gmat}
                                    onChange={(e) => updateField('gmat', e.target.value)}
                                    placeholder="700"
                                />
                            </div>
                            <p className="text-xs text-zinc-500 mt-3">Leave blank if not taken yet.</p>
                        </Card>

                        {/* Budget & Funding */}
                        <Card className="bg-white/5 border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
                                    <DollarSign className="w-5 h-5 text-yellow-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Budget & Funding</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <InputField
                                    label="Annual Budget (USD)"
                                    required
                                    icon={DollarSign}
                                    type="number"
                                    value={formData.budget}
                                    onChange={(e) => updateField('budget', e.target.value)}
                                    placeholder="50000"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Funding Plan
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {FUNDING_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => updateField('fundingPlan', option.value)}
                                                className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${formData.fundingPlan === option.value
                                                    ? 'bg-yellow-600 border-yellow-500 text-white'
                                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Preferences */}
                        <Card className="bg-white/5 border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center border border-rose-500/20">
                                    <Globe className="w-5 h-5 text-rose-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Preferences</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Dream Destination <span className="text-violet-400">*</span>
                                    </label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {COUNTRIES.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => updateField('targetCountry', c)}
                                                className={`py-2 rounded-xl border text-xs font-medium transition-all ${formData.targetCountry === c
                                                    ? 'bg-rose-600 border-rose-500 text-white'
                                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Areas of Interest
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {COURSES.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => toggleCourse(c)}
                                                className={`py-2 px-3 rounded-full border text-xs font-medium transition-all ${formData.preferredCourses.includes(c)
                                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-4">
                            <Link to="/dashboard">
                                <Button variant="ghost" type="button">Cancel</Button>
                            </Link>
                            <Button
                                type="submit"
                                variant="premium"
                                loading={saving}
                                icon={Save}
                                className="px-8"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </PageWrapper >
    )
}
