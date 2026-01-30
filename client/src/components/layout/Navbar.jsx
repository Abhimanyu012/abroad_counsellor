
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, MessageSquare, BookOpen, LogOut, Lock, Sparkles, Hexagon } from 'lucide-react';
import { useAuth, useFlow, STAGES } from '../../context';
import { Button } from '../ui/Button';

export const Navbar = () => {
    const { logout, user } = useAuth();
    const { canAccessStage } = useFlow();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, stage: STAGES.DASHBOARD },
        { label: 'Intelligence', path: '/counsellor', icon: MessageSquare, stage: STAGES.COUNSELLOR },
        { label: 'Universities', path: '/universities', icon: BookOpen, stage: STAGES.UNIVERSITIES },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 pointer-events-none">
            {/* Glass Strip */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto mt-4 px-4 pointer-events-auto">
                <div className="h-14 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between px-2 pl-4 shadow-2xl shadow-black/50">
                    {/* Brand */}
                    <Link to="/dashboard" className="flex items-center gap-2.5 group mr-6">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <Hexagon className="w-8 h-8 text-violet-600 fill-violet-600/20 rotate-90" />
                            <span className="absolute text-[10px] font-black text-white">AI</span>
                        </div>
                        <span className="text-sm font-black text-white tracking-[0.2em] hidden sm:block">AICOUNSELLOR</span>
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isLocked = !canAccessStage(item.stage);
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={isLocked ? '#' : item.path}
                                    className={isLocked ? 'cursor-not-allowed' : ''}
                                >
                                    <button
                                        disabled={isLocked}
                                        className={`
                                            relative px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all
                                            ${active
                                                ? 'text-white bg-white/10 shadow-inner'
                                                : isLocked
                                                    ? 'text-zinc-700'
                                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {item.label}
                                        {active && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-500" />
                                        )}
                                    </button>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Profile & Logout */}
                    <div className="flex items-center gap-2 pl-4 border-l border-white/5 ml-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[1px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white uppercase">{user?.name?.charAt(0) || 'U'}</span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all text-[11px] font-bold uppercase tracking-wider"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
