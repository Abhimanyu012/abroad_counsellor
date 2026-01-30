
// Universities Page - premium Vercel-like design
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Filter, GraduationCap, MapPin, DollarSign,
    TrendingUp, Star, BookmarkPlus, Check, Loader2,
    ArrowLeft, ChevronDown, CheckCircle, Globe, Users
} from 'lucide-react'
import { useAuth, useFlow, STAGES } from '../../context'
import { universitiesApi, selectionsApi } from '../../api'
import { PageWrapper } from '../../components/ui/PageWrapper'
import { Navbar } from '../../components/layout/Navbar'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const CATEGORY_COLORS = {
    DREAM: 'from-purple-500 to-pink-500',
    TARGET: 'from-blue-500 to-cyan-500',
    SAFE: 'from-emerald-500 to-green-500'
}

const CATEGORY_TAG_STYLES = {
    DREAM: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    TARGET: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    SAFE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
}

export default function UniversitiesPage() {
    const { user, refreshSelections } = useAuth()
    const { currentStage, advanceStage } = useFlow()

    const [universities, setUniversities] = useState([])
    const [shortlisted, setShortlisted] = useState(new Set())
    const [loading, setLoading] = useState(true)

    const [filters, setFilters] = useState({
        search: '',
        country: '',
        maxTuition: '',
        sortBy: 'rankingGlobal'
    })

    const [countries, setCountries] = useState([])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [uniRes, selRes] = await Promise.all([
                universitiesApi.getAll(),
                selectionsApi.getAll()
            ])

            setUniversities(uniRes.data.universities)
            setCountries(uniRes.data.countries)

            // Track shortlisted
            const shortIds = new Set(selRes.data.selections.map(s => s.universityId))
            setShortlisted(shortIds)
        } catch (err) {
            console.error('Failed to load universities:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleShortlist = async (e, uni) => {
        e.stopPropagation(); // Prevent card click
        if (shortlisted.has(uni.id)) return

        // OPTIMISTIC UI: Update immediately before API call
        setShortlisted(prev => new Set([...prev, uni.id]))

        // Advance stage if first action
        if (currentStage === STAGES.COUNSELLOR) {
            advanceStage()
        }

        // Determine category logic
        let category = 'TARGET'
        if (user?.gpa && uni.minGpa) {
            const diff = user.gpa - uni.minGpa
            if (diff < -0.2) category = 'DREAM'
            else if (diff > 0.3) category = 'SAFE'
        }

        // API call in background - no await blocking UI
        selectionsApi.shortlist(uni.id, category)
            .then(() => {
                // Sync Dashboard counts in background
                if (typeof refreshSelections === 'function') {
                    refreshSelections()
                }
            })
            .catch(err => {
                // ROLLBACK on failure
                console.error('Failed to shortlist:', err)
                setShortlisted(prev => {
                    const next = new Set(prev)
                    next.delete(uni.id)
                    return next
                })
            })
    }

    // MEMOIZED: Filter and sort only recalculates when dependencies change
    const sortedUniversities = useMemo(() => {
        let result = universities

        // Apply filters
        if (filters.search) {
            const search = filters.search.toLowerCase()
            result = result.filter(uni =>
                uni.name.toLowerCase().includes(search) ||
                uni.country.toLowerCase().includes(search) ||
                uni.city.toLowerCase().includes(search)
            )
        }
        if (filters.country) {
            result = result.filter(uni => uni.country === filters.country)
        }
        if (filters.maxTuition) {
            result = result.filter(uni => uni.tuitionFeeUsd <= parseInt(filters.maxTuition))
        }

        // Sort
        return [...result].sort((a, b) => {
            if (filters.sortBy === 'rankingGlobal') return a.rankingGlobal - b.rankingGlobal
            if (filters.sortBy === 'tuitionFeeUsd') return a.tuitionFeeUsd - b.tuitionFeeUsd
            if (filters.sortBy === 'acceptanceRate') return b.acceptanceRate - a.acceptanceRate
            return 0
        })
    }, [universities, filters])

    const getCategory = (uni) => {
        if (!user?.gpa) return null
        const diff = user.gpa - uni.minGpa
        if (diff < -0.2) return 'DREAM'
        if (diff > 0.3) return 'SAFE'
        return 'TARGET'
    }

    // Acceptance Chance based on user profile vs university requirements
    const getAcceptanceChance = (uni) => {
        if (!user?.gpa) return { level: 'Medium', color: 'text-yellow-400 bg-yellow-500/10' }
        const gpaDiff = user.gpa - uni.minGpa
        const hasEnglish = (user.ielts && user.ielts >= (uni.ieltsMin || 6.5)) || (user.toefl && user.toefl >= 90)

        if (gpaDiff >= 0.3 && hasEnglish) return { level: 'High', color: 'text-emerald-400 bg-emerald-500/10' }
        if (gpaDiff < -0.3 || uni.acceptanceRate < 15) return { level: 'Low', color: 'text-red-400 bg-red-500/10' }
        return { level: 'Medium', color: 'text-yellow-400 bg-yellow-500/10' }
    }

    // Cost Level based on user budget vs tuition
    const getCostLevel = (uni) => {
        if (!user?.budget) return { level: 'Medium', color: 'text-yellow-400 bg-yellow-500/10' }
        const ratio = uni.tuitionFeeUsd / user.budget

        if (ratio <= 0.5) return { level: 'Low', color: 'text-emerald-400 bg-emerald-500/10' }
        if (ratio >= 0.9) return { level: 'High', color: 'text-red-400 bg-red-500/10' }
        return { level: 'Medium', color: 'text-yellow-400 bg-yellow-500/10' }
    }

    // Optimized Stagger
    const getStagger = (index) => Math.min(index * 0.05, 0.3);

    // Skeleton Loader
    if (loading) {
        return (
            <PageWrapper>
                <Navbar />
                <div className="relative max-w-[1400px] mx-auto px-6 pt-24 pb-12">
                    {/* Skeleton Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 animate-pulse">
                        <div className="space-y-4">
                            <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                            <div className="h-8 w-64 bg-zinc-800 rounded"></div>
                        </div>
                        <div className="h-10 w-40 bg-zinc-800 rounded"></div>
                    </div>

                    {/* Skeleton Filter */}
                    <div className="sticky top-20 z-40 mb-8 h-14 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl animate-pulse" />

                    {/* Skeleton Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-[320px] rounded-2xl bg-zinc-900/50 border border-white/5 p-5 flex flex-col gap-4 animate-pulse">
                                <div className="flex justify-between">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800" />
                                    <div className="w-16 h-6 rounded-full bg-zinc-800" />
                                </div>
                                <div className="h-6 w-3/4 bg-zinc-800 rounded" />
                                <div className="h-4 w-1/2 bg-zinc-800 rounded" />
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {[...Array(4)].map((_, j) => (
                                        <div key={j} className="h-12 bg-zinc-800/50 rounded" />
                                    ))}
                                </div>
                                <div className="mt-auto h-8 w-full bg-zinc-800 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <Navbar />

            <div className="relative max-w-[1400px] mx-auto px-6 pt-24 pb-12">
                {/* Minimal Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <Link to="/dashboard" className="text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors mb-2 inline-block">
                            &larr; Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Browse Universities</h1>
                        <p className="text-zinc-400 mt-1 text-sm">Discover your future alma mater from our curated list.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-zinc-900/50 rounded-lg border border-white/5 text-sm font-medium text-zinc-300">
                            {sortedUniversities.length} Universities
                        </div>
                        <Link to="/locked">
                            <Button variant="outline" className="h-10 text-sm">
                                View Selections ({shortlisted.size})
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Sticky Filter Bar */}
                <div className="sticky top-20 z-40 mb-8 p-1.5 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col lg:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                            placeholder="Search universities..."
                            className="w-full pl-10 pr-4 h-10 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                        />
                    </div>

                    <div className="h-6 w-px bg-white/10 hidden lg:block" />

                    <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar px-1">
                        <FilterSelect
                            value={filters.country}
                            onChange={(val) => setFilters(f => ({ ...f, country: val }))}
                            label="Country"
                            options={countries.map(c => ({ value: c.name, label: c.name }))}
                        />
                        <FilterSelect
                            value={filters.maxTuition}
                            onChange={(val) => setFilters(f => ({ ...f, maxTuition: val }))}
                            label="Budget"
                            options={[
                                { value: '10000', label: '< $10k' },
                                { value: '25000', label: '< $25k' },
                                { value: '50000', label: '< $50k' },
                            ]}
                        />
                        <FilterSelect
                            value={filters.sortBy}
                            onChange={(val) => setFilters(f => ({ ...f, sortBy: val }))}
                            label="Sort"
                            options={[
                                { value: 'rankingGlobal', label: 'Top Ranked' },
                                { value: 'tuitionFeeUsd', label: 'Low Tuition' },
                                { value: 'acceptanceRate', label: 'High Acceptance' },
                            ]}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence mode="popLayout">
                        {sortedUniversities.map((uni) => {
                            const category = getCategory(uni)
                            const isShortlisted = shortlisted.has(uni.id)

                            return (
                                <motion.div
                                    layout
                                    key={uni.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full"
                                >
                                    <Card className="h-full group hover:bg-zinc-900/50" noPadding>
                                        <div className="p-5 flex flex-col h-full relative z-10">
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center p-1.5 transition-colors group-hover:bg-zinc-800">
                                                    <img
                                                        src={uni.logoUrl}
                                                        alt={uni.name}
                                                        className="w-full h-full object-contain opacity-90 group-hover:opacity-100"
                                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(uni.name)}&background=3f3f46&color=fff&font-size=0.4` }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-zinc-500 border border-white/5 bg-zinc-900/50 px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Star className="w-2.5 h-2.5" />
                                                        #{uni.rankingGlobal}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="mb-4">
                                                <h3 className="font-semibold text-white text-base leading-tight mb-2 group-hover:text-violet-200 transition-colors line-clamp-2">
                                                    {uni.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                                                    <Globe className="w-3 h-3" />
                                                    {uni.city}, {uni.country}
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <StatItem label="Tuition" value={`$${(uni.tuitionFeeUsd / 1000).toFixed(1)}k`} />
                                                <StatItem label="Min GPA" value={uni.minGpa} />
                                            </div>

                                            {/* Evaluation Badges */}
                                            {(() => {
                                                const acceptance = getAcceptanceChance(uni)
                                                const cost = getCostLevel(uni)
                                                return (
                                                    <div className="flex gap-2 mb-4">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${acceptance.color}`}>
                                                            Chance: {acceptance.level}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${cost.color}`}>
                                                            Cost: {cost.level}
                                                        </span>
                                                    </div>
                                                )
                                            })()}

                                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    {category && (
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${CATEGORY_TAG_STYLES[category]}`}>
                                                            {category === 'DREAM' ? 'Reach' : category === 'TARGET' ? 'Target' : 'Safe'}
                                                        </span>
                                                    )}
                                                </div>

                                                <Button
                                                    size="sm"
                                                    onClick={(e) => handleShortlist(e, uni)}
                                                    disabled={isShortlisted}
                                                    variant={isShortlisted ? 'ghost' : 'premium'}
                                                    className={`h-8 px-3 text-xs ${isShortlisted ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : ''}`}
                                                >
                                                    {isShortlisted ? (
                                                        <>
                                                            <Check className="w-3 h-3 mr-1.5" />
                                                            Saved
                                                        </>
                                                    ) : (
                                                        <>
                                                            Add
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </PageWrapper>
    )
}

function StatItem({ label, value }) {
    return (
        <div className="bg-zinc-900/30 rounded px-2.5 py-1.5 border border-white/5">
            <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{label}</div>
            <div className="text-zinc-200 text-xs font-semibold mt-0.5">{value}</div>
        </div>
    )
}

function FilterSelect({ value, onChange, label, options }) {
    return (
        <div className="relative group shrink-0">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 bg-zinc-800/50 hover:bg-zinc-800 border border-white/10 rounded-lg text-xs font-medium text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all cursor-pointer min-w-[100px]"
            >
                <option value="">{label}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
        </div>
    )
}
