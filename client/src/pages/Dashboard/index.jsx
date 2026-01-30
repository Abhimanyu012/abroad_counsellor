
// Dashboard Page - Premium UI
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    User, GraduationCap, DollarSign, Target, Sparkles,
    BookOpen, CheckSquare, Square, Plus, MessageSquare,
    ArrowRight, TrendingUp, Clock, Loader2, Lock, Trash2, Edit2
} from 'lucide-react'
import logo from '../../assets/logo.svg'
import { useAuth, useFlow, STAGES } from '../../context'
import { todosApi, userApi } from '../../api'
import { PageWrapper } from '../../components/ui/PageWrapper'
import { Navbar } from '../../components/layout/Navbar'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StageIndicator } from '../../components/dashboard/StageIndicator'
import { DashboardSkeleton } from '../../components/ui/Skeletons'

// Helper component for stable inline editing
const InlineInput = ({ value, onSave, type = 'text', step, className }) => {
    const [localValue, setLocalValue] = useState(value || '')
    const inputRef = useRef(null)
    const hasSaved = useRef(false)

    useEffect(() => {
        inputRef.current?.focus()
        // Move cursor to end
        if (type === 'text' && inputRef.current) {
            const len = inputRef.current.value.length
            inputRef.current.setSelectionRange(len, len)
        }
    }, [])

    const triggerSave = (val) => {
        if (hasSaved.current) return
        hasSaved.current = true
        onSave(val)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') triggerSave(localValue)
        if (e.key === 'Escape') {
            hasSaved.current = true
            onSave(value) // Cancel by saving original
        }
    }

    return (
        <input
            ref={inputRef}
            type={type}
            step={step}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={() => triggerSave(localValue)}
            onKeyDown={handleKeyDown}
            className={className}
        />
    )
}

export default function DashboardPage() {
    const { user, data, loading: authLoading, setData, updateUser, refreshSelections } = useAuth()
    const { canAccessStage } = useFlow()
    const [newTodo, setNewTodo] = useState('')
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        // Refresh stats on mount
        refreshSelections()
    }, [])

    // Use pre-fetched data
    const todos = data.todos || []
    const selections = data.selections || { shortlisted: 0, locked: 0 }

    // Profile strength from DB (cached) or fallback
    const calculateStrength = () => {
        let score = 0
        if (user?.gpa && user.gpa >= 2.0) score += 25
        if (user?.budget && user.budget > 10000) score += 25
        if ((user?.ielts && user.ielts >= 6.0) || (user?.toefl && user.toefl >= 80)) score += 25
        if (user?.targetCountry) score += 25
        return score
    }
    const profileStrength = calculateStrength()

    if (authLoading) {
        return <DashboardSkeleton />
    }

    const [editingField, setEditingField] = useState(null)
    const [editingValue, setEditingValue] = useState('')
    const [editingTodoId, setEditingTodoId] = useState(null)
    const [editingTodoText, setEditingTodoText] = useState('')

    const handleProfileUpdate = async (field, value) => {
        let val = value
        if (field === 'gpa' || field === 'ielts') val = parseFloat(value)
        if (field === 'budget') val = parseInt(value)

        if (isNaN(val) && (field === 'gpa' || field === 'budget' || field === 'ielts')) {
            setEditingField(null)
            return
        }

        try {
            setIsUpdating(true)
            // Optimistic update
            const updates = { [field]: val }
            updateUser(updates)
            setEditingField(null)

            await userApi.updateProfile(updates)
        } catch (err) {
            console.error('Failed to update profile field:', err)
        } finally {
            setIsUpdating(false)
        }
    }

    const toggleTodo = async (id) => {
        // Optimistic update
        setData(prev => ({
            ...prev,
            todos: prev.todos.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        }))

        try {
            await todosApi.toggle(id)
        } catch (err) {
            console.error('Failed to toggle todo:', err)
            // Optional: Revert optimistic update here
        }
    }

    const deleteTodo = async (id) => {
        // Optimistic update
        setData(prev => ({
            ...prev,
            todos: prev.todos.filter(t => t.id !== id)
        }))

        try {
            await todosApi.delete(id)
        } catch (err) {
            console.error('Failed to delete todo:', err)
        }
    }

    const handleTodoUpdate = async (id, text) => {
        if (!text.trim()) return setEditingTodoId(null)

        // Optimistic update
        setData(prev => ({
            ...prev,
            todos: prev.todos.map(t => t.id === id ? { ...t, task: text } : t)
        }))
        setEditingTodoId(null)

        try {
            await todosApi.update(id, { task: text })
        } catch (err) {
            console.error('Failed to update todo:', err)
        }
    }

    const addTodo = async (e) => {
        e.preventDefault()
        if (!newTodo.trim()) return

        // Create a temporary ID for optimistic UI
        const tempId = `temp-${Date.now()}`
        const newTodoObj = { id: tempId, task: newTodo.trim(), completed: false, priority: 'MEDIUM' }

        setData(prev => ({
            ...prev,
            todos: [newTodoObj, ...prev.todos]
        }))
        setNewTodo('')

        try {
            const res = await todosApi.create(newTodo.trim(), 'MEDIUM')
            // Replace temp ID with real ID
            setData(prev => ({
                ...prev,
                todos: prev.todos.map(t => t.id === tempId ? res.data.todo : t)
            }))
        } catch (err) {
            console.error('Failed to add todo:', err)
            setData(prev => ({
                ...prev,
                todos: prev.todos.filter(t => t.id !== tempId)
            }))
        }
    }

    return (
        <PageWrapper>
            <Navbar />

            <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 group/name">
                                Welcome back,
                                {editingField === 'name' ? (
                                    <InlineInput
                                        value={user?.name}
                                        onSave={(val) => handleProfileUpdate('name', val)}
                                        className="bg-zinc-800 border-violet-500/50 rounded px-3 py-1 text-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                    />
                                ) : (
                                    <>
                                        <span className="text-gradient-premium capitalize">{user?.name || 'Student'}</span>
                                        <button
                                            onClick={() => setEditingField('name')}
                                            className="opacity-0 group-hover/name:opacity-100 p-2 hover:bg-white/10 rounded-full transition-all"
                                        >
                                            <Edit2 className="w-4 h-4 text-zinc-500 hover:text-white" />
                                        </button>
                                    </>
                                )}
                            </h1>
                        </div>
                        <p className="text-zinc-400 mt-1">Here's your study abroad journey overview.</p>
                    </div>
                </div>

                {/* Stage Indicator */}
                <div className="mb-8">
                    <StageIndicator currentStage={user?.currentStage} />
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Profile Summary Widget */}
                    <Card className="bg-white/5 border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center border border-violet-500/20">
                                    <User className="w-5 h-5 text-violet-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Profile Summary</h2>
                            </div>
                            <Link to="/profile">
                                <Button variant="ghost" size="sm" className="text-xs text-zinc-500 hover:text-white">
                                    Full Profile
                                </Button>
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {[
                                { icon: GraduationCap, label: 'GPA', value: user?.gpa, display: `${user?.gpa || '-'}/4.0`, color: 'text-emerald-400', field: 'gpa', type: 'number', step: '0.1' },
                                { icon: GraduationCap, label: 'Degree', value: user?.intendedDegree, display: user?.intendedDegree?.toUpperCase() || '-', color: 'text-indigo-400', field: 'intendedDegree', type: 'text' },
                                { icon: DollarSign, label: 'Budget', value: user?.budget, display: `$${user?.budget?.toLocaleString() || '-'}`, color: 'text-yellow-400', field: 'budget', type: 'number' },
                                { icon: BookOpen, label: 'IELTS', value: user?.ielts, display: user?.ielts || '-', color: 'text-cyan-400', field: 'ielts', type: 'number', step: '0.5' },
                                { icon: Target, label: 'Target', value: user?.targetCountry, display: user?.targetCountry || '-', color: 'text-rose-400', field: 'targetCountry', type: 'text' }
                            ].map((item, i) => (
                                <div key={item.field} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-violet-500/20 transition-all group/item">
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`w-4 h-4 ${item.color}`} />
                                        <span className="text-zinc-400 text-sm">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {editingField === item.field ? (
                                            <InlineInput
                                                value={item.value}
                                                type={item.type}
                                                step={item.step}
                                                onSave={(val) => handleProfileUpdate(item.field, val)}
                                                className="w-24 bg-zinc-800 border-violet-500/50 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                                            />
                                        ) : (
                                            <>
                                                <span className="text-white font-medium text-sm">{item.display}</span>
                                                <button
                                                    onClick={() => setEditingField(item.field)}
                                                    className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                                                >
                                                    <Edit2 className="w-3 h-3 text-zinc-500 hover:text-white" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                            <div className="text-center p-3 bg-white/5 rounded-xl">
                                <div className="text-2xl font-bold text-violet-400">{selections.shortlisted}</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Shortlisted</div>
                            </div>
                            <div className="text-center p-3 bg-white/5 rounded-xl">
                                <div className="text-2xl font-bold text-emerald-400">{selections.locked}</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Locked</div>
                            </div>
                        </div>
                    </Card>

                    {/* Profile Strength Widget */}
                    <Card className="bg-white/5 border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Profile Strength</h2>
                        </div>

                        <div className="flex justify-center mb-8 relative">
                            {/* Using a simple CSS conic gradient for ring */}
                            <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-zinc-900 border-4 border-zinc-800">
                                <svg className="absolute inset-0 w-full h-full -rotate-90 text-emerald-500" viewBox="0 0 100 100">
                                    <circle
                                        cx="50" cy="50" r="45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        strokeDasharray="283"
                                        strokeDashoffset={283 - (283 * profileStrength) / 100}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>

                                <div className="text-center z-10">
                                    <span className="text-3xl font-bold text-white">{profileStrength}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: 'Academic Profile', done: !!user?.gpa },
                                { label: 'Budget Information', done: !!user?.budget },
                                { label: 'Test Scores', done: !!(user?.ielts || user?.toefl) },
                                { label: 'Country Preference', done: !!user?.targetCountry }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${item.done ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}`} />
                                    <span className={`text-sm ${item.done ? 'text-zinc-300' : 'text-zinc-600'}`}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* AI To-Do List Widget */}
                    <Card className="bg-white/5 border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                                <Sparkles className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">AI To-Do List</h2>
                        </div>

                        <form onSubmit={addTodo} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="Add a task..."
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 text-sm transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!newTodo.trim()}
                                className="p-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {todos.length === 0 ? (
                                <div className="text-center py-8">
                                    <Clock className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                                    <p className="text-zinc-600 text-sm">No tasks yet.</p>
                                </div>
                            ) : (
                                todos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all border group ${todo.completed
                                            ? 'bg-zinc-900/50 border-transparent opacity-50'
                                            : 'bg-white/5 border-white/5 hover:border-violet-500/30 hover:bg-white/10'
                                            }`}
                                    >
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleTodo(todo.id)
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {todo.completed ? (
                                                <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                                            ) : (
                                                <Square className="w-5 h-5 text-zinc-600 shrink-0 group-hover:text-violet-400" />
                                            )}
                                        </div>

                                        {editingTodoId === todo.id ? (
                                            <InlineInput
                                                value={todo.task}
                                                onSave={(val) => handleTodoUpdate(todo.id, val)}
                                                className="flex-1 bg-zinc-800 border-violet-500/50 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                                            />
                                        ) : (
                                            <span
                                                onClick={() => {
                                                    setEditingTodoId(todo.id)
                                                    setEditingTodoText(todo.task)
                                                }}
                                                className={`text-sm cursor-pointer flex-1 line-clamp-2 ${todo.completed ? 'text-zinc-500 line-through' : 'text-zinc-300 group-hover:text-white'}`}
                                            >
                                                {todo.task}
                                            </span>
                                        )}

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {todo.priority === 'HIGH' && !todo.completed && (
                                                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded">
                                                    High
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteTodo(todo.id);
                                                }}
                                                className="p-1.5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                                title="Delete task"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <h3 className="text-xl font-bold text-white mt-12 mb-6 text-center md:text-left">Your Next Steps</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { to: '/counsellor', icon: MessageSquare, title: (<div className="flex items-center gap-2"><img src={logo} alt="AICOUNSELLOR" className="w-6 h-6" /><span>AICOUNSELLOR</span></div>), desc: 'Get personalized advice', iconStyle: 'bg-violet-500/10 border-violet-500/20 text-violet-400', stage: STAGES.COUNSELLOR },
                        { to: '/universities', icon: GraduationCap, title: 'University Library', desc: 'Browse 60+ global unis', iconStyle: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400', stage: STAGES.UNIVERSITIES },
                        { to: '/locked', icon: Target, title: 'Final Selection', desc: 'Lock your decision', iconStyle: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', stage: STAGES.LOCKED }
                    ].map((item) => {
                        const isLocked = !canAccessStage(item.stage);
                        return (
                            <Link
                                key={item.to}
                                to={isLocked ? '#' : item.to}
                                className={`group relative h-full rounded-2xl transition-all duration-300 ${isLocked ? 'cursor-not-allowed' : 'hover:-translate-y-1'}`}
                            >
                                <Card className={`h-full border-white/5 transition-all duration-300 ${isLocked ? 'bg-zinc-900/40 opacity-60' : 'bg-white/5 hover:bg-white/[0.07] hover:border-white/20'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${isLocked ? 'bg-zinc-800 border-zinc-700 text-zinc-600' : item.iconStyle}`}>
                                                {isLocked ? (
                                                    <Lock className="w-5 h-5" />
                                                ) : (
                                                    <item.icon className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className={`font-semibold transition-colors ${isLocked ? 'text-zinc-500' : 'text-white group-hover:text-violet-400'}`}>
                                                    {item.title}
                                                </h3>
                                                <p className="text-zinc-500 text-xs mt-0.5">
                                                    {isLocked ? 'Complete previous stage to unlock' : item.desc}
                                                </p>
                                            </div>
                                        </div>
                                        {!isLocked && (
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    {isLocked && (
                                        <div className="absolute top-3 right-3">
                                            <div className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded border border-white/5">
                                                Locked
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </PageWrapper>
    )
}
