// Chat Window Component - Premium Design System
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import ChatMessage from '../counsellor/ChatMessage'

const ChatWindow = ({ messages, loading }) => {
    const bottomRef = useRef(null)

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
            <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                    <ChatMessage
                        key={i}
                        message={msg}
                    />
                ))}
            </AnimatePresence>

            {loading && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-start"
                >
                    <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl rounded-tl-sm flex items-center gap-3 shadow-lg">
                        <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Processing...</span>
                    </div>
                </motion.div>
            )}

            <div ref={bottomRef} className="h-4" />
        </div>
    )
}

export default ChatWindow
