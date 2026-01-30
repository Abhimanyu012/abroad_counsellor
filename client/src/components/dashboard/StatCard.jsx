// Stat Card Component
const StatCard = ({ title, value, icon, trend }) => {
    return (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[13px] text-[#999] uppercase tracking-wider">{title}</p>
                    <p className="text-[32px] font-bold text-white mt-2">{value}</p>
                    {trend && (
                        <p className={`text-[13px] mt-1 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend > 0 ? '+' : ''}{trend}% from last month
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StatCard
