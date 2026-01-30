
import React from 'react';

export const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    name,
    error,
    icon: Icon,
    required = false
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {label} {required && <span className="text-violet-500">*</span>}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
            w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
            ${Icon ? 'pl-11' : ''}
            text-zinc-100 placeholder:text-zinc-600 outline-none
            focus:border-violet-500/50 focus:bg-white/10 focus:ring-1 focus:ring-violet-500/20
            transition-all duration-200
            ${error ? 'border-red-500/50 focus:border-red-500' : ''}
          `}
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
