
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'premium', // premium, ghost, danger, outline
    disabled = false,
    loading = false,
    className = '',
    icon: Icon,
    fullWidth = false,
}) => {
    const baseStyles = "relative inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 transition-all duration-150 ease-out active:scale-95";

    const variants = {
        premium: "btn-premium",
        ghost: "btn-ghost",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
        outline: "border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!loading && Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};
