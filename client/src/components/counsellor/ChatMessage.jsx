
import { motion } from 'framer-motion'
import { User, Bot } from 'lucide-react'
import ActionMessage from './ActionMessage'
import { SimpleMarkdown } from '../ui/SimpleMarkdown'

export default function ChatMessage({ message, onAction }) {
    const isUser = message.role === 'user'

    // Frontend safety sanitization to catch any leaked tags
    const cleanContent = (text) => {
        if (!text) return text
        return text
            .replace(/<function[\s\S]*?<\/function>/gi, '')
            .replace(/\w+>\{[\s\S]*?\}<\/function>/gi, '')
            .replace(/([(\[])+(\/|\[|<)?function(\]|:|>)?.*?(\n|$|[)\]])+/gi, '')
            .replace(/(update_todo|manage_tasks|update_user_profile|manage_selections)>[\s\S]*?(\n|$)/gi, '')
            .trim()
    }

    const sanitizedContent = cleanContent(message.content)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${isUser
                ? 'bg-zinc-800 border border-zinc-700'
                : 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-violet-500/20'
                }`}>
                {isUser ? (
                    <User className="w-4 h-4 text-zinc-400" />
                ) : (
                    <Bot className="w-4 h-4 text-white" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
                {sanitizedContent && (
                    <div className={`inline-block px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed transition-all duration-300 text-left ${isUser
                        ? 'bg-white/[0.06] text-white border border-white/[0.08] rounded-tr-sm'
                        : 'bg-transparent text-[#b4b4b4] pl-0'
                        }`}>
                        {isUser ? (
                            <p className="whitespace-pre-wrap selection:bg-white/20">{sanitizedContent}</p>
                        ) : (
                            <SimpleMarkdown content={sanitizedContent} />
                        )}
                    </div>
                )}

                {/* Actions (Tool Results) */}
                {message.actions && message.actions.length > 0 && (
                    <div className={`mt-3 space-y-3 ${isUser ? 'items-end flex flex-col' : 'w-full'}`}>
                        {message.actions.map((action, idx) => (
                            <ActionMessage key={`${action.type}-${idx}`} action={action} onAction={onAction} />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
