
import {
    CheckCircle, BookmarkPlus, Lock, ListPlus, Search,
    MapPin, Wallet, BookOpen, ExternalLink, Calendar, Trash2, User, TrendingUp, Globe, GraduationCap
} from 'lucide-react'
import { Card } from '../ui/Card'

// Sub-components for specific actions
const UniversityCard = ({ university, success }) => {
    if (!university) return null

    // Calculate Acceptance Chance based on category (from AI tool results)
    const getChanceBadge = () => {
        const cat = university.category
        if (cat === 'SAFE') return { level: 'High', color: 'text-emerald-400 bg-emerald-500/10' }
        if (cat === 'DREAM') return { level: 'Low', color: 'text-red-400 bg-red-500/10' }
        return { level: 'Medium', color: 'text-yellow-400 bg-yellow-500/10' }
    }

    // Calculate Cost Level based on tuition
    const getCostBadge = () => {
        const tuition = university.tuition || university.tuitionFeeUsd || 0
        if (tuition < 25000) return { level: 'Low', color: 'text-emerald-400 bg-emerald-500/10' }
        if (tuition > 50000) return { level: 'High', color: 'text-red-400 bg-red-500/10' }
        return { level: 'Medium', color: 'text-yellow-400 bg-yellow-500/10' }
    }

    const chance = getChanceBadge()
    const cost = getCostBadge()

    return (
        <div className={`relative group transition-all duration-500 hover:-translate-y-1`}>
            <div className="relative h-full bg-white/2 rounded-2xl p-6 flex flex-col border border-white/4 group-hover:bg-white/4 group-hover:border-white/8 transition-all">
                <div className="flex justify-between items-start mb-5">
                    <div className="flex-1">
                        <h4 className="font-semibold text-white text-[17px] leading-tight mb-2">
                            {university.name}
                        </h4>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#777]" />
                            <span className="text-sm text-[#999]">{university.city ? `${university.city}, ` : ''}{university.country}</span>
                        </div>
                    </div>
                    {university.ranking && (
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-medium text-[#777] tracking-widest mb-1.5">Rank</span>
                            <div className="flex items-center justify-center min-w-[3rem] px-2.5 py-1 rounded-lg bg-white/4 border border-white/6 text-white font-mono text-sm font-medium">
                                #{university.ranking}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] text-[#777] font-medium uppercase tracking-wider flex items-center gap-1.5">
                            <Wallet className="w-3 h-3" /> Tuition
                        </span>
                        <span className="text-sm text-[#b4b4b4]">${(university.tuition || university.tuitionFeeUsd)?.toLocaleString() || 'N/A'}<span className="text-[11px] text-[#777]">/yr</span></span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] text-[#777] font-medium uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3" /> GPA
                        </span>
                        <span className="text-sm text-[#b4b4b4]">{university.minGpa || '3.0'}+</span>
                    </div>
                </div>

                {/* Evaluation Badges */}
                <div className="flex gap-2 mt-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${chance.color}`}>
                        Chance: {chance.level}
                    </span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${cost.color}`}>
                        Cost: {cost.level}
                    </span>
                    {university.category && (
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${university.category === 'DREAM' ? 'text-violet-400 bg-violet-500/10' :
                            university.category === 'SAFE' ? 'text-emerald-400 bg-emerald-500/10' :
                                'text-cyan-400 bg-cyan-500/10'
                            }`}>
                            {university.category === 'DREAM' ? 'Reach' : university.category}
                        </span>
                    )}
                </div>

                {success && (
                    <div className="mt-5 pt-4 border-t border-white/4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] text-[#b4b4b4] font-medium uppercase tracking-widest">
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            <span>Selection Saved</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    )
}

const TodoCard = ({ todo, message, onAction }) => (
    <div className={`bg-zinc-900/60 backdrop-blur-md border rounded-2xl p-4 flex items-start gap-4 transition-all duration-300 hover:bg-zinc-900/80 group ${todo?.completed ? 'border-emerald-500/10' : 'border-violet-500/10 hover:border-violet-500/30'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 group-hover:scale-110 transition-transform ${todo?.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-violet-500/10 border-violet-500/20'}`}>
            {todo?.completed ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Calendar className="w-5 h-5 text-violet-400" />}
        </div>
        <div className="flex-1 pt-0.5">
            <div className="flex items-center justify-between gap-4">
                <h4 className={`text-sm font-bold tracking-tight transition-colors ${todo?.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>{todo?.task || "New task identified"}</h4>
                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${todo?.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                    {todo?.priority || 'Medium'}
                </div>
            </div>
            <p className="text-xs text-zinc-500 mt-1 pb-1">{message || "Strategy updated."}</p>

            <div className="mt-3 flex items-center justify-between">
                {todo?.dueDate ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <div className={`w-1 h-1 rounded-full ${todo?.completed ? 'bg-zinc-600' : 'bg-violet-400'}`} />
                        <span>Target: {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                ) : <div />}

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onAction && onAction('TOGGLE', todo.id || todo.task)}
                        className={`p-1.5 rounded-lg border transition-all ${todo?.completed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400'}`}
                        title={todo?.completed ? "Mark as Incomplete" : "Mark as Complete"}
                    >
                        <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onAction && onAction('DELETE', todo.id || todo.task)}
                        className="p-1.5 bg-white/5 border border-white/10 text-zinc-400 rounded-lg hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-400 transition-all"
                        title="Delete Task"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
)

const GenericAction = ({ action }) => {
    const icons = {
        manage_selections: Lock,
        manage_tasks: ListPlus,
        update_user_profile: CheckCircle,
        get_university_info: Search,
        get_universities: Search
    }
    const Icon = icons[action.type] || CheckCircle
    const isSuccess = action.success

    // Custom styling based on content/action
    let colorClass = isSuccess
        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
        : 'bg-red-500/5 border-red-500/20 text-red-400'

    const msg = action.message?.toLowerCase() || ''
    if (msg.includes('unlock') || msg.includes('reopened')) {
        colorClass = 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    } else if (msg.includes('remove') || msg.includes('delete')) {
        colorClass = 'bg-rose-500/10 border-rose-500/30 text-rose-400'
    } else if (action.type === 'get_universities' && action.message?.includes('Found 0')) {
        colorClass = 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400'
    }

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm border ${colorClass} backdrop-blur-sm transition-all hover:bg-opacity-20`}>
            <Icon className="w-4 h-4 shrink-0" />
            <span>{action.message || action.type}</span>
        </div>
    )
}

// Profile Update Card - Shows what was changed
const ProfileUpdateCard = ({ profile, message }) => {
    if (!profile) return null

    const fields = [
        { key: 'name', label: 'Name', icon: User },
        { key: 'gpa', label: 'GPA', icon: GraduationCap },
        { key: 'budget', label: 'Budget', icon: Wallet, format: v => `$${v?.toLocaleString()}` },
        { key: 'targetCountry', label: 'Country', icon: Globe },
        { key: 'ielts', label: 'IELTS', icon: BookOpen },
        { key: 'toefl', label: 'TOEFL', icon: BookOpen },
        { key: 'intendedDegree', label: 'Degree', icon: GraduationCap },
        { key: 'targetIntakeYear', label: 'Intake', icon: Calendar },
        { key: 'fundingPlan', label: 'Funding', icon: Wallet },
        { key: 'sopStatus', label: 'SOP Status', icon: BookOpen }
    ]

    // Filter to only show fields that exist in the profile response
    const shownFields = fields.filter(f => profile[f.key] !== undefined && profile[f.key] !== null)

    return (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-white text-sm">Profile Updated</h4>
                    <p className="text-xs text-zinc-500">{message || 'Your profile has been updated successfully.'}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {shownFields.slice(0, 6).map(({ key, label, icon: Icon, format }) => (
                    <div key={key} className="flex items-center gap-2 px-3 py-2 bg-white/2 rounded-lg border border-white/4">
                        <Icon className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs text-zinc-500">{label}:</span>
                        <span className="text-xs text-white font-medium">
                            {format ? format(profile[key]) : profile[key]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ActionMessage({ action, onAction }) {
    if (!action.success) return <GenericAction action={action} />

    const { type, data, message } = action

    if (data) {
        // Profile Update Card
        if (type === 'update_user_profile' && data) {
            return <ProfileUpdateCard profile={data} message={message} />
        }

        // University Card (Search results, Info, Selection updates)
        if (type === 'get_university_info' || (type === 'manage_selections' && data.name)) {
            return <UniversityCard university={data} success={message?.includes('Shortlisted') || message?.includes('locked')} />
        }

        // Task Card
        if (type === 'manage_tasks' && data.task) {
            return <TodoCard todo={data} message={message} onAction={onAction} />
        }

        // List of Universities
        if (type === 'get_universities' && Array.isArray(data)) {
            if (data.length === 0) return <GenericAction action={action} />
            return (
                <div className="space-y-3 w-full">
                    <span className="text-xs text-zinc-500 block px-1 uppercase tracking-wider font-medium">{message}</span>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                        {data.map(uni => (
                            <UniversityCard key={uni.id} university={uni} />
                        ))}
                    </div>
                </div>
            )
        }
    }

    return <GenericAction action={action} />
}
