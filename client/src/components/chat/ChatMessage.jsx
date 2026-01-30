// Chat Message Component
const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user'

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[80%] p-4 rounded-2xl ${isUser
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white border border-white/10'
                    }`}
            >
                <p className="text-[15px] leading-relaxed">{message.content}</p>
                {message.timestamp && (
                    <p className={`text-[11px] mt-2 ${isUser ? 'text-black/50' : 'text-white/40'}`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                )}
            </div>
        </div>
    )
}

export default ChatMessage
