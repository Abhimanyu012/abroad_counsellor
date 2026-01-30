
import React from 'react';

export const DashboardSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#050505] relative overflow-hidden">
            {/* Background - Static to match loaded state */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
            </div>

            {/* Navbar Placeholder */}
            <div className="h-20 border-b border-white/5 bg-black/50 backdrop-blur-md relative z-50 flex items-center px-6">
                <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
                <div className="ml-auto flex gap-4">
                    <div className="w-24 h-4 rounded bg-white/5 animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-8 z-10">
                {/* Header */}
                <div className="mb-10 space-y-3">
                    <div className="w-64 h-8 rounded-xl bg-white/5 animate-pulse" />
                    <div className="w-48 h-4 rounded-lg bg-white/5 animate-pulse" />
                </div>

                {/* Stage Indicator */}
                <div className="mb-8 h-12 rounded-full bg-white/5 animate-pulse w-full max-w-2xl" />

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Profile Summary Skeleton */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
                            <div className="w-32 h-5 rounded-lg bg-white/10 animate-pulse" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div className="h-20 rounded-xl bg-white/5 animate-pulse" />
                            <div className="h-20 rounded-xl bg-white/5 animate-pulse" />
                        </div>
                    </div>

                    {/* Strength Skeleton */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
                            <div className="w-32 h-5 rounded-lg bg-white/10 animate-pulse" />
                        </div>
                        <div className="flex justify-center py-4">
                            <div className="w-32 h-32 rounded-full bg-white/5 animate-pulse border-4 border-white/5" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-white/10" />
                                    <div className="w-full h-4 rounded bg-white/5 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Todo Skeleton */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
                            <div className="w-32 h-5 rounded-lg bg-white/10 animate-pulse" />
                        </div>
                        <div className="h-10 rounded-lg bg-white/5 animate-pulse mb-4" />
                        <div className="space-y-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-12 mb-6 w-48 h-6 rounded-lg bg-white/5 animate-pulse" />
                <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export const CounsellorSkeleton = () => {
    return (
        <div className="flex h-screen bg-[#050505] overflow-hidden">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:flex w-[280px] border-r border-white/5 bg-black/40 flex-col p-4 space-y-6">
                <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse" />

                <div className="space-y-4 pt-4">
                    <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Main Chat Skeleton */}
            <div className="flex-1 flex flex-col relative">
                {/* Header */}
                <div className="h-[72px] border-b border-white/5 flex items-center justify-end px-8">
                    <div className="w-32 h-8 rounded-full bg-white/5 animate-pulse" />
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-8 space-y-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`flex gap-4 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-xl bg-white/5 animate-pulse shrink-0" />
                            <div className={`w-1/2 h-24 rounded-2xl bg-white/5 animate-pulse ${i % 2 === 0 ? 'rounded-tr-sm' : 'rounded-tl-sm'}`} />
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-white/5">
                    <div className="h-14 rounded-[2rem] bg-white/5 animate-pulse" />
                </div>
            </div>
        </div>
    )
}
