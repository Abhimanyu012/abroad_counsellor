// Chat Input Component
import { useState } from 'react'

const ChatInput = ({ onSend, disabled }) => {
    const [input, setInput] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim() && !disabled) {
            onSend(input.trim())
            setInput('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex gap-3 items-center max-w-4xl mx-auto">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your counsellor..."
                    disabled={disabled}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors"
                />
                <button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    className="btn-premium px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </form>
    )
}

export default ChatInput
