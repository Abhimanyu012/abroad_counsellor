// Form Input Component
const FormInput = ({ label, type = 'text', placeholder, value, onChange, error, required }) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-[14px] text-[#b4b4b4]">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none transition-colors ${error
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-white/20'
                    }`}
            />
            {error && (
                <p className="text-[12px] text-red-400">{error}</p>
            )}
        </div>
    )
}

export default FormInput
