
import React from 'react';
import { motion } from 'framer-motion';

export const PageWrapper = ({ children, className = '' }) => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 grid-fade" />
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
            </div>

            {/* Noise Overlay */}
            <div className="noise" />

            {/* Content */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`relative z-10 ${className}`}
            >
                {children}
            </motion.main>
        </div>
    );
};
