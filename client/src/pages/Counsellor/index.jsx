// AICOUNSELLOR Page - Chat Interface
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Send, Loader2, Sparkles, ArrowLeft, Trash2,
    Bot, AlertCircle, Wallet, BookOpen, GraduationCap, FileText,
    Menu, X
} from 'lucide-react'
import { useAuth, useFlow, STAGES } from '../../context'
import { counsellorApi, todosApi } from '../../api'
import { PageWrapper } from '../../components/ui/PageWrapper'
import { Button } from '../../components/ui/Button'
import ChatMessage from '../../components/counsellor/ChatMessage'

import { CounsellorSkeleton } from '../../components/ui/Skeletons'

export default function CounsellorPage() {
    const { user } = useAuth()
    const { currentStage, advanceStage } = useFlow()
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [initializing, setInitializing] = useState(true)
    const [error, setError] = useState('')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [clearing, setClearing] = useState(false)

    useEffect(() => {
        const abortController = new AbortController()

        const loadHistory = async () => {
            try {
                // Lazy load strategy: Fetch 10 first for speed
                const res = await counsellorApi.getHistory(10)
                if (abortController.signal.aborted) return

                setMessages(res.data.messages)
                setInitializing(false)

                // Fetch rest in background
                counsellorApi.getHistory(50).then(fullRes => {
                    if (abortController.signal.aborted) return
                    // If user hasn't added new messages yet, update freely
                    setMessages(current => {
                        if (current.length > 10) return current // User chatted, don't overwrite
                        return fullRes.data.messages
                    })
                }).catch(e => {
                    if (!abortController.signal.aborted) {
                        console.error('Background history fetch failed', e)
                    }
                })

            } catch (err) {
                if (!abortController.signal.aborted) {
                    console.error('Failed to load history:', err)
                    setInitializing(false)
                }
            }
        }

        loadHistory()

        // Cleanup: abort on unmount to prevent state updates on unmounted component
        return () => abortController.abort()
    }, [])

    useEffect(() => {
        // Only scroll if we are not initializing (prevent jumpiness)
        if (!initializing) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, initializing])

    if (initializing) {
        return <CounsellorSkeleton />
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        // Advance stage if first engagement
        if (currentStage === STAGES.DASHBOARD) {
            advanceStage()
        }

        const userMessage = input.trim()
        setInput('')
        setError('')

        // Add user message immediately
        setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        }])

        setLoading(true)

        try {
            const res = await counsellorApi.chat(userMessage)

            // Add assistant response
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: res.data.message,
                actions: res.data.actions || [],
                timestamp: new Date()
            }])
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send message')
        } finally {
            setLoading(false)
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }



    const clearChat = async () => {
        if (!window.confirm('Clear all chat history?')) return

        setClearing(true)
        const previousMessages = [...messages]
        setMessages([]) // Optimistic update

        try {
            await counsellorApi.clearHistory()
        } catch (err) {
            console.error('Failed to clear history:', err)
            setError('Failed to clear history on server. Restoring chat.')
            setMessages(previousMessages) // Rollback if failed
        } finally {
            setClearing(false)
            setIsMobileMenuOpen(false) // Close menu on mobile after action
        }
    }

    const handleTaskAction = async (type, identifier) => {
        try {
            if (type === 'DELETE') {
                await todosApi.delete(identifier)
                setMessages(prev => prev.map(msg => ({
                    ...msg,
                    actions: msg.actions?.filter(a => !(a.type === 'manage_tasks' && (a.data.id === identifier || a.data.task === identifier)))
                })))
            } else if (type === 'TOGGLE') {
                await todosApi.toggle(identifier)
                setMessages(prev => prev.map(msg => ({
                    ...msg,
                    actions: msg.actions?.map(a =>
                        (a.type === 'manage_tasks' && (a.data.id === identifier || a.data.task === identifier))
                            ? { ...a, data: { ...a.data, completed: !a.data.completed } }
                            : a
                    )
                })))
            }
        } catch (err) {
            console.error(`Failed to ${type} task:`, err)
            setError(`Failed to update task.`)
        }
    }

    return (
        <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
                <div className="absolute inset-0 grid-bg opacity-[0.15]" />
            </div>

            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/80 z-60 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Shell - Responsive */}
            <aside className={`
                fixed inset-y-0 left-0 z-70 w-[280px] border-r border-white/5 bg-black/90 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-spring
                lg:relative lg:translate-x-0 lg:bg-black/40
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Branding & Mobile Close */}
                <div className="h-[72px] flex items-center justify-between px-6 border-b border-white/5">
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-white uppercase tracking-widest">AICOUNSELLOR</span>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">INTELLIGENCE</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-2 text-zinc-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Vertical Context Intelligence */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 custom-scrollbar">
                    <div className="space-y-2">
                        <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] px-2 mb-3">Live Context</h3>

                        <div className="p-3 rounded-xl bg-white/3 border border-white/6 flex items-center gap-3 group hover:bg-white/5 transition-colors">
                            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">GPA</p>
                                <p className="text-sm font-bold text-white">{user?.gpa || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/3 border border-white/6 flex items-center gap-3 group hover:bg-white/5 transition-colors">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Budget</p>
                                <p className="text-sm font-bold text-white">${user?.budget?.toLocaleString() || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/3 border border-white/6 flex items-center gap-3 group hover:bg-white/5 transition-colors">
                            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Intake</p>
                                <p className="text-sm font-bold text-white">{user?.targetIntakeYear || '2026'}</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/3 border border-white/6 flex items-center gap-3 group hover:bg-white/5 transition-colors">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">SOP Status</p>
                                <p className="text-xs font-bold text-amber-400 uppercase">{user?.sopStatus?.replace('_', ' ') || 'Pending'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] px-2 mb-3">Target Profile</h3>
                        <div className="px-3 py-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                <span className="text-xs font-bold text-zinc-300">{user?.targetCountry || 'International'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                <span className="text-xs font-bold text-zinc-300">{user?.intendedDegree || 'Graduate'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <Button
                        variant="ghost"
                        onClick={clearChat}
                        disabled={clearing}
                        className="w-full justify-start bg-white/3 border border-white/6 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 hover:border-rose-500/20 px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                        {clearing ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />}
                        {clearing ? 'Resetting...' : 'Reset Context'}
                    </Button>
                </div>
            </aside>

            {/* Main Stage */}
            <main className="flex-1 flex flex-col relative min-w-0">
                {/* Minimal Header */}
                <header className="absolute top-0 right-0 left-0 z-40 h-[72px] flex items-center justify-between px-4 lg:px-8 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                    {/* Left Side: Mobile Menu + Back */}
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Link
                            to="/dashboard"
                            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-xs font-medium">Dashboard</span>
                        </Link>
                    </div>

                    <div className="pointer-events-auto flex items-center gap-3 backdrop-blur-sm bg-black/40 px-4 py-2 rounded-full border border-white/5 ml-auto">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                <div
                                    key={s}
                                    className={`h-1.5 rounded-full transition-all duration-700 ${s <= currentStage ? 'w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'w-1.5 bg-white/[0.06]'}`}
                                />
                            ))}
                        </div>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest pl-2 hidden sm:inline">Sequence {currentStage}/8</span>
                    </div>
                </header>

                {/* Chat Area - Expanded Verticality */}
                <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth flex flex-col">
                    <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-24 space-y-8">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-violet-500/20 to-indigo-600/20 rounded-[2.5rem] flex items-center justify-center mb-8 border border-violet-500/30 shadow-[0_0_50px_rgba(139,92,246,0.15)] md:hover:rotate-6 transition-transform duration-700"
                                >
                                    <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-violet-400" />
                                </motion.div>
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                                    Hello, <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-fuchsia-400 to-indigo-400">{user?.name?.split(' ')[0] || 'Explorer'}</span>
                                </h2>
                                <p className="text-zinc-400 max-w-md mx-auto mb-12 text-base md:text-lg font-medium leading-relaxed">
                                    I am ready to orchestrate your journey.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                                    {[
                                        'Recommend universities in USA',
                                        'Create a roadmap for Fall 2026',
                                        'What is a good GPA for MIT?',
                                        "Universities under $30k budget"
                                    ].map((suggestion, i) => (
                                        <motion.button
                                            key={suggestion}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            onClick={() => setInput(suggestion)}
                                            className="group px-5 py-3 bg-white/[0.03] border border-white/5 text-zinc-400 rounded-xl text-xs font-bold hover:border-violet-500/30 hover:bg-white/[0.06] hover:text-white transition-all text-left flex items-center justify-between"
                                        >
                                            <span className="truncate">{suggestion}</span>
                                            <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400 rotate-180" />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10 pb-4">
                                {messages.map((message, index) => (
                                    <ChatMessage
                                        key={message.id || index}
                                        message={message}
                                        onAction={handleTaskAction}
                                    />
                                ))}

                                {loading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="bg-white/3 border border-white/5 rounded-[2rem] px-6 py-4 rounded-tl-sm flex items-center gap-3">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">{error}</span>
                                    </motion.div>
                                )}
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </div>

                {/* Input Area */}
                <div className="relative z-50 bg-[#050505]/80 backdrop-blur-xl border-t border-white/5 p-4 md:p-6 lg:p-8 pb-6 lg:pb-8">
                    <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity duration-500" />
                        <div className="relative flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Command the Master Intelligence..."
                                disabled={loading}
                                className="w-full pl-6 pr-14 md:pr-16 py-4 md:py-5 bg-white/3 border border-white/8 rounded-[2rem] text-sm md:text-[15px] font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/5 transition-all disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="absolute right-2 p-2.5 md:p-3 bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white rounded-full transition-all disabled:opacity-0 disabled:scale-75"
                            >
                                <Send className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
