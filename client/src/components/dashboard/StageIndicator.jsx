// Stage Indicator Component - Shows user's position in the study abroad journey
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, User, Compass, MapPin, Lock, Send, GraduationCap, RotateCcw, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context'
import { userApi } from '../../api'

const JOURNEY_STAGES = [
    { id: 1, name: 'Profile', icon: User, description: 'Set up your basic profile' },
    { id: 4, name: 'Discovery', icon: Compass, description: 'Identify target universities with AI' },
    { id: 6, name: 'Shortlisting', icon: MapPin, description: 'Select and compare your top choices' },
    { id: 7, name: 'Final Pick', icon: Lock, description: 'Commit to your number one choice' },
    { id: 8, name: 'Applying', icon: Send, description: 'Track your application status' },
]

export function StageIndicator({ currentStage = 4 }) {
    const { updateUser } = useAuth()
    const navigate = useNavigate()
    const [isResetting, setIsResetting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // Map internal stages to display stages
    const getDisplayStageIndex = () => {
        if (currentStage <= 3) return 0  // Profile
        if (currentStage <= 5) return 1  // Discovery (includes Counsellor)
        if (currentStage === 6) return 2 // Shortlisting (Universities)
        if (currentStage === 7) return 3 // Locked
        return 4 // Applying
    }

    const activeIndex = getDisplayStageIndex()

    const handleReset = async () => {
        setIsResetting(true)
        try {
            await userApi.resetStage()
            updateUser({ currentStage: 1, onboardingComplete: false })
            navigate('/onboarding')
        } catch (error) {
            console.error('Failed to reset stage:', error)
            setIsResetting(false)
        }
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">

            {/* Reset Confirmation Overlay */}
            {showConfirm && (
                <div className="absolute inset-0 bg-zinc-900/95 z-20 flex flex-col items-center justify-center text-center p-4">
                    <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                    <h4 className="text-white font-bold mb-1">Reset Progress?</h4>
                    <p className="text-xs text-zinc-400 mb-4">This will clear your progress but keep your profile data.</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={isResetting}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/20"
                        >
                            {isResetting ? 'Resetting...' : 'Confirm Reset'}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">Your Journey</h3>
                    {currentStage > 1 && (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Reset Progress"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <span className="text-xs text-violet-400 font-medium">
                    Stage {activeIndex + 1} of {JOURNEY_STAGES.length}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 bg-zinc-800 rounded-full mb-6 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((activeIndex + 1) / JOURNEY_STAGES.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute inset-y-0 left-0 bg-linear-to-r from-violet-500 to-indigo-500 rounded-full"
                />
            </div>

            {/* Stage Pills */}
            <div className="flex items-center justify-between">
                {JOURNEY_STAGES.map((stage, index) => {
                    const isCompleted = index < activeIndex
                    const isActive = index === activeIndex
                    const isUpcoming = index > activeIndex
                    const Icon = stage.icon

                    return (
                        <div key={stage.id} className="flex flex-col items-center flex-1">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                                    relative w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all
                                    ${isCompleted ? 'bg-emerald-500/20 border border-emerald-500/40' : ''}
                                    ${isActive ? 'bg-violet-500 shadow-lg shadow-violet-500/30 scale-110' : ''}
                                    ${isUpcoming ? 'bg-zinc-800 border border-zinc-700' : ''}
                                `}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                ) : (
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                                )}
                                {isActive && (
                                    <div className="absolute -inset-1 rounded-xl bg-violet-500/20 animate-pulse -z-10" />
                                )}
                            </motion.div>
                            <span className={`text-[10px] font-medium text-center ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                                {stage.name}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Current Stage Description */}
            <div className="mt-6 p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-violet-400" />
                    <span className="text-xs text-violet-300">
                        <strong className="text-violet-200">{JOURNEY_STAGES[activeIndex].name}</strong>: {JOURNEY_STAGES[activeIndex].description}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default StageIndicator
