// Form Select Component
const FormSelect = ({ label, options, value, onChange, placeholder, error, required }) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-[14px] text-[#b4b4b4]">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors appearance-none cursor-pointer ${error
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-white/20'
                    }`}
            >
                {placeholder && (
                    <option value="" className="bg-black">{placeholder}</option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-black">
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-[12px] text-red-400">{error}</p>
            )}
        </div>
    )
}

export default FormSelect
