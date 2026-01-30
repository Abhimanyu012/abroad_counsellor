// Locked Page - Interactive Decision Dashboard
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, ArrowRight, Lock, Unlock, BookmarkCheck, Trash2, MapPin,
    Star, Calendar, FileText, Loader2, GraduationCap,
    CheckCircle, Trophy, Sparkles, ChevronRight, RefreshCw, BookOpen,
    Building2, Globe, Clock, DollarSign, AlertTriangle
} from 'lucide-react'
import { userApi, selectionsApi } from '../../api'
import { PageWrapper } from '../../components/ui/PageWrapper'
import { Navbar } from '../../components/layout/Navbar'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuth, STAGES } from '../../context'
import confetti from 'canvas-confetti'

export default function LockedPage() {
    const { user, updateUser, refreshSelections } = useAuth()
    const [selections, setSelections] = useState([])
    const [loading, setLoading] = useState(true)
    const [justLocked, setJustLocked] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [checklist, setChecklist] = useState(() => {
        const saved = localStorage.getItem(`checklist_${user?.id}`)
        return saved ? JSON.parse(saved) : {}
    })

    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(`checklist_${user?.id}`, JSON.stringify(checklist))
        }
    }, [checklist, user?.id])

    useEffect(() => {
        loadSelections()
    }, [])

    const loadSelections = async () => {
        try {
            setLoading(true)
            const response = await selectionsApi.getAll()
            const data = response.data?.selections || []
            setSelections(data)

            // Auto-select the locked one, or the first one
            const locked = data.find(s => s.status === 'LOCKED')
            if (locked) {
                setSelectedId(locked.universityId)
            } else if (data.length > 0) {
                setSelectedId(data[0].universityId)
            }
        } catch (err) {
            console.error('Failed to load selections:', err)
        } finally {
            setLoading(false)
        }
    }

    const [unlockModal, setUnlockModal] = useState({ open: false, id: null })

    const handleLock = async (universityId) => {
        try {
            setSelections(prev => prev.map(s =>
                s.universityId === universityId ? { ...s, status: 'LOCKED' } : s
            ))
            setJustLocked(true)
            await selectionsApi.lock(universityId)
            loadSelections()
            refreshSelections()
            setTimeout(() => setJustLocked(false), 2000)
        } catch (err) {
            console.error('Failed to lock:', err)
            loadSelections()
        }
    }

    const handleUnlockTrigger = (universityId) => {
        setUnlockModal({ open: true, id: universityId })
    }

    const executeUnlock = async () => {
        const universityId = unlockModal.id
        setUnlockModal({ open: false, id: null })

        try {
            setSelections(prev => prev.map(s =>
                s.universityId === universityId ? { ...s, status: 'SHORTLISTED' } : s
            ))
            await selectionsApi.unlock(universityId)
            refreshSelections()
            loadSelections()
        } catch (err) {
            console.error('Failed to unlock:', err)
            loadSelections()
        }
    }

    const handleRemove = async (universityId) => {
        if (!confirm('Remove from shortlist?')) return
        try {
            setSelections(prev => prev.filter(s => s.universityId !== universityId))
            await selectionsApi.remove(universityId)
            refreshSelections()
            if (selectedId === universityId) {
                setSelectedId(selections.find(s => s.universityId !== universityId)?.universityId || null)
            }
        } catch (err) {
            console.error('Failed to remove:', err)
        }
    }

    const onStartApplicationHandler = async () => {
        try {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#a78bfa', '#f59e0b', '#10b981']
            })
            await userApi.updateStage(STAGES.COMPLETE)
            updateUser({ ...user, currentStage: STAGES.COMPLETE })
        } catch (err) {
            console.error('Failed to start application:', err)
        }
    }

    const toggleCheckItem = (item) => {
        setChecklist(prev => ({ ...prev, [item]: !prev[item] }))
    }

    const lockedSelection = selections.find(s => s.status === 'LOCKED')
    const shortlistedSelections = selections.filter(s => s.status === 'SHORTLISTED')
    const currentActiveSelection = selections.find(s => s.universityId === selectedId)
    const isComplete = user?.currentStage === STAGES.COMPLETE

    if (isComplete && lockedSelection) {
        return (
            <Stage8View
                university={lockedSelection.university}
                onUnlock={() => handleUnlockTrigger(lockedSelection.universityId)}
                unlockModal={unlockModal}
                onCloseModal={() => setUnlockModal({ open: false, id: null })}
                onConfirmUnlock={executeUnlock}
            />
        )
    }

    if (loading) {
        return (
            <PageWrapper>
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <Navbar />

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] overflow-hidden">

                {/* Sidebar (Shortlist) */}
                <div className="w-full lg:w-96 border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl flex flex-col h-full lg:h-[calc(100vh-64px)] sticky top-16">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <BookmarkCheck className="w-5 h-5 text-violet-400" />
                            My Shortlist
                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-zinc-400">
                                {selections.length}
                            </span>
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {selections.map((selection) => (
                            <SidebarCard
                                key={selection.id}
                                selection={selection}
                                isActive={selectedId === selection.universityId}
                                onClick={() => setSelectedId(selection.universityId)}
                                onRemove={handleRemove}
                            />
                        ))}

                        {selections.length === 0 && (
                            <div className="text-center py-12 px-4">
                                <Building2 className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                <p className="text-zinc-500 text-sm">No universities shortlisted yet.</p>
                                <Link to="/universities">
                                    <Button variant="outline" className="mt-4 w-full">Browse Gallery</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content (Platform View) */}
                <div className="flex-1 overflow-y-auto bg-black">
                    <AnimatePresence mode="wait">
                        {currentActiveSelection ? (
                            <motion.div
                                key={selectedId}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="min-h-full flex flex-col"
                            >
                                <DetailView
                                    selection={currentActiveSelection}
                                    isLockedExists={!!lockedSelection}
                                    onLock={handleLock}
                                    onUnlock={handleUnlockTrigger}
                                    onStart={onStartApplicationHandler}
                                    justLocked={justLocked}
                                    checklist={checklist}
                                    onToggleCheck={toggleCheckItem}
                                />
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                                <Trophy className="w-16 h-16 text-zinc-800 mb-6" />
                                <h2 className="text-2xl font-bold text-white mb-2">Build Your Future</h2>
                                <p className="text-zinc-500 max-w-sm">Select a university from your shortlist to review details and lock your final choice.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Unlock Warning Modal */}
            <AnimatePresence>
                {unlockModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Unlock University?</h3>
                                    <p className="text-sm text-zinc-400">This action has consequences.</p>
                                </div>
                            </div>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Unlocking will <span className="text-white font-bold">remove your application roadmap</span> and delete all AI-generated tasks for this university. You will have to start over if you lock it again.
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    className="flex-1 hover:bg-white/5"
                                    onClick={() => setUnlockModal({ open: false, id: null })}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white border-amber-500/20"
                                    onClick={executeUnlock}
                                >
                                    Yes, Unlock
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageWrapper>
    )
}

function SidebarCard({ selection, isActive, onClick, onRemove }) {
    const uni = selection.university
    const isLocked = selection.status === 'LOCKED'

    return (
        <button
            onClick={onClick}
            className={`w-full group flex items-center gap-4 p-3 rounded-2xl transition-all border ${isActive ? 'bg-white/5 border-white/10' : 'border-transparent hover:bg-white/2'}`}
        >
            <div className={`w-12 h-12 rounded-xl p-1.5 border transition-all ${isActive ? 'bg-white border-white' : 'bg-zinc-900 border-white/5'}`}>
                <img src={uni.logoUrl} alt={uni.name} className="w-full h-full object-contain"
                    onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(uni.name)}&background=333&color=fff`}
                />
            </div>
            <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                        {uni.name}
                    </h3>
                    {isLocked && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                </div>
                <p className="text-[10px] text-zinc-500 truncate lowercase">{uni.city}, {uni.country}</p>
            </div>

            {!isLocked && (
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(uni.id) }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all rounded-lg"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            )}
        </button>
    )
}

function DetailView({ selection, isLockedExists, onLock, onUnlock, onStart, justLocked, checklist, onToggleCheck }) {
    const uni = selection.university
    const isLocked = selection.status === 'LOCKED'

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <div className={`absolute inset-0 bg-linear-to-b ${isLocked ? 'from-amber-600/20 to-black' : 'from-violet-600/20 to-black'}`} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="flex items-end gap-6">
                        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl p-6 shadow-2xl z-10 transition-transform ${isLocked ? 'bg-white rotate-0' : 'bg-zinc-900 -rotate-3'}`}>
                            <img src={uni.logoUrl} alt={uni.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="pb-2">
                            <div className="flex items-center gap-3 mb-2">
                                {isLocked ? (
                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20">
                                        <Trophy className="w-3 h-3 inline mr-1" /> Winning Choice
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-violet-500/10 text-violet-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-violet-500/20">
                                        Shortlisted
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight underline decoration-violet-500/50 decoration-4 underline-offset-8">
                                {uni.name}
                            </h1>
                            <p className="text-zinc-400 mt-4 flex items-center gap-2 text-lg">
                                <MapPin className="w-5 h-5 text-rose-500" />
                                {uni.city}, {uni.country}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isLocked ? (
                            <>
                                <Button onClick={onStart} variant="premium" className="h-14 px-8 text-lg font-black group">
                                    Start Application
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button onClick={() => onUnlock(uni.id)} variant="outline" className="h-14 px-6 border-white/5 hover:bg-white/5">
                                    <Unlock className="w-4 h-4 mr-2" />
                                    Change Choice
                                </Button>
                            </>
                        ) : (
                            !isLockedExists && (
                                <Button onClick={() => onLock(uni.id)} variant="premium" className="h-14 px-10 text-lg font-black shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                                    <Lock className="w-5 h-5 mr-3" />
                                    Lock My Choice
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-8 md:p-12 space-y-12">
                {/* Highlights Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Globe} label="Rank" value={`#${uni.rankingGlobal}`} color="text-blue-400" />
                    <StatCard icon={DollarSign} label="Tuition" value={`$${(uni.tuitionFeeUsd / 1000).toFixed(1)}k`} color="text-emerald-400" />
                    <StatCard icon={Clock} label="Intake" value={uni.intake || 'Fall 2026'} color="text-amber-400" />
                    <StatCard icon={Sparkles} label="Rate" value={`${uni.acceptanceRate}%`} color="text-rose-400" />
                </div>

                {isLocked ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                    >
                        <div className="lg:col-span-2">
                            <ApplicationGuidance university={uni} checklist={checklist} onToggle={onToggleCheck} />
                        </div>
                        <div className="space-y-8">
                            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">Application Timeline</h3>
                            <Timeline />
                            <Card className="bg-linear-to-br from-violet-600/10 to-transparent border-violet-500/10 p-6">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-violet-400" />
                                    AI Preparedness
                                </h4>
                                <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                                    Our AI has analyzed this university's requirements. We've added 4 specific tasks to your dashboard to help you stay ahead.
                                </p>
                                <Link to="/dashboard">
                                    <Button variant="outline" className="w-full text-xs h-9">Go to Dashboard</Button>
                                </Link>
                            </Card>
                        </div>
                    </motion.div>
                ) : (
                    <div className="border border-amber-500/20 bg-amber-500/5 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-[0_0_100px_rgba(245,158,11,0.1)]">
                        <Lock className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Critical Step Required</h2>
                        <p className="text-zinc-400 mb-8 leading-relaxed text-lg">
                            <strong className="text-white">You must lock one university</strong> to proceed. This action transforms your Dashboard into a personalized application manager for <span className="text-amber-400 font-bold">{uni.name}</span>.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left max-w-lg mx-auto">
                            <div className="bg-black/40 p-3 rounded-lg border border-amber-500/10 flex items-center gap-3">
                                <FileText className="w-5 h-5 text-amber-500" />
                                <span className="text-sm text-zinc-300">Unlocks Checklist</span>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-amber-500/10 flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <span className="text-sm text-zinc-300">Activates AI Guide</span>
                            </div>
                        </div>

                        {!isLockedExists && (
                            <Button onClick={() => onLock(uni.id)} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black px-10 h-14 font-black text-lg shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                                <Lock className="w-5 h-5 mr-2" />
                                Confirm & Lock Choice
                            </Button>
                        )}
                        <p className="mt-4 text-xs text-zinc-500 font-medium">You can unlock this later if needed.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl">
            <Icon className={`w-5 h-5 mb-3 ${color}`} />
            <div className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-xl font-bold text-white">{value}</div>
        </div>
    )
}

function Timeline() {
    const steps = [
        { stage: 'Document Prep', date: 'Month 1-2', active: true },
        { stage: 'Submission', date: 'Month 3', active: false },
        { stage: 'AI Review', date: 'Month 4', active: false },
        { stage: 'Visa Process', date: 'Month 6', active: false },
    ]
    return (
        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/5 pl-8">
            {steps.map((s, i) => (
                <div key={i} className="relative">
                    <div className={`absolute -left-[33px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-black ${s.active ? 'bg-violet-400' : 'bg-zinc-800'}`} />
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{s.date}</div>
                    <div className={`text-sm font-bold ${s.active ? 'text-white' : 'text-zinc-500'}`}>{s.stage}</div>
                </div>
            ))}
        </div>
    )
}

function ApplicationGuidance({ university, checklist, onToggle }) {
    const docs = [
        { name: 'Statement of Purpose (SOP)', desc: 'Explain your goals and academic fit.' },
        { name: 'Letters of Recommendation', desc: 'Acquire 2-3 academic references.' },
        { name: 'Academic Transcripts', desc: 'Official grade sheets from high school/college.' },
        { name: 'English Proficiency', desc: 'Proof of IELTS, TOEFL, or Duolingo scores.' },
        { name: 'Financial Guarantee', desc: 'Bank statements or sponsorship letters.' },
    ]

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">Required Documents</h3>
            <div className="grid gap-4">
                {docs.map((doc, i) => (
                    <div
                        key={i}
                        onClick={() => onToggle(doc.name)}
                        className={`group p-5 rounded-2xl cursor-pointer border transition-all ${checklist[doc.name] ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-900/30 border-white/5 hover:border-violet-500/30'}`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${checklist[doc.name] ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                                    {checklist[doc.name] && <CheckCircle className="w-4 h-4 text-black" />}
                                </div>
                                <span className={`text-lg font-bold transition-colors ${checklist[doc.name] ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                    {doc.name}
                                </span>
                            </div>
                            <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">Mandatory</span>
                        </div>
                        <p className="text-sm text-zinc-500 ml-10">
                            {doc.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Stage8View({ university, onUnlock, unlockModal, onCloseModal, onConfirmUnlock }) {
    return (
        <PageWrapper>
            <Navbar />
            <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-24 pb-12 overflow-hidden bg-black">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] -z-10" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] -z-10" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-4xl w-full text-center"
                >
                    <div className="flex justify-center mb-12">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-white p-8 shadow-[0_0_100px_rgba(255,255,255,0.1)] relative z-10">
                                <img src={university.logoUrl} alt={university.name} className="w-full h-full object-contain" />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute -top-6 -right-6 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg z-20"
                            >
                                <Trophy className="w-8 h-8 text-black" />
                            </motion.div>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter italic">
                        Applied! 🎉
                    </h1>
                    <p className="text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        The journey to <span className="text-white font-black">{university.name}</span> has officially begun. You're on your way to {university.country}!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4">
                        {[
                            { icon: Clock, label: 'Started', value: 'Today', sub: 'Application Submitted' },
                            { icon: BookOpen, label: 'Review', value: 'Pending', sub: 'Admin processing' },
                            { icon: GraduationCap, label: 'Intake', value: university.intake || 'Fall 2026', sub: 'Estimated Arrival' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl text-left">
                                <stat.icon className="w-6 h-6 text-violet-400 mb-6" />
                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
                                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-zinc-600">{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link to="/dashboard">
                            <Button className="bg-violet-600 hover:bg-violet-700 h-16 px-12 text-xl font-black shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                                Go to Dashboard
                            </Button>
                        </Link>
                        <button
                            onClick={onUnlock}
                            className="text-zinc-600 hover:text-white transition-colors text-sm font-black uppercase tracking-widest underline underline-offset-8"
                        >
                            Change My Choice
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Unlock Warning Modal */}
            <AnimatePresence>
                {unlockModal?.open && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Unlock University?</h3>
                                    <p className="text-sm text-zinc-400">This action has consequences.</p>
                                </div>
                            </div>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Unlocking will <span className="text-white font-bold">remove your application roadmap</span> and delete all AI-generated tasks for this university. You will have to start over if you lock it again.
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    className="flex-1 hover:bg-white/5"
                                    onClick={onCloseModal}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white border-amber-500/20"
                                    onClick={onConfirmUnlock}
                                >
                                    Yes, Unlock
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageWrapper>
    )
}
