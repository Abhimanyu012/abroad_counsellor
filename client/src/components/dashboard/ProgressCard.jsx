// Progress Card Component
const ProgressCard = ({ title, current, total, steps = [] }) => {
    const percentage = Math.round((current / total) * 100)

    return (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-semibold text-white">{title}</h3>
                <span className="text-[14px] text-[#999]">{percentage}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Steps */}
            {steps.length > 0 && (
                <div className="mt-4 space-y-2">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step.completed
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white/10 text-white/40'
                                }`}>
                                {step.completed ? '✓' : i + 1}
                            </div>
                            <span className={`text-[13px] ${step.completed ? 'text-white' : 'text-[#999]'}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProgressCard
