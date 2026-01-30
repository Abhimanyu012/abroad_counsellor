
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, noPadding = false }) => {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = React.useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current || isFocused) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className={`relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black text-white shadow-2xl transition-all duration-300 ${hover ? 'hover:shadow-violet-900/20' : ''} ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139,92,246,.15), transparent 40%)`,
                }}
            />
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139,92,246,.4), transparent 40%)`,
                    maskImage: `linear-gradient(black,BLACK)`,
                    WebkitMaskClip: "content-box",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                }}
            />
            <div className={`relative h-full flex flex-col ${noPadding ? '' : 'p-6'}`}>
                {children}
            </div>
        </motion.div>
    );
};

export const GlassCard = ({ children, className = '' }) => (
    <div className={`bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none" />
        <div className="relative z-10">{children}</div>
    </div>
);
