// Form Stepper Component - for multi-step forms
const FormStepper = ({ steps, currentStep, onStepClick }) => {
    return (
        <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                    {/* Step circle */}
                    <button
                        onClick={() => onStepClick?.(index)}
                        disabled={index > currentStep}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium transition-all ${index < currentStep
                                ? 'bg-emerald-500 text-white'
                                : index === currentStep
                                    ? 'bg-white text-black'
                                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                            }`}
                    >
                        {index < currentStep ? '✓' : index + 1}
                    </button>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                        <div className={`w-12 h-[2px] mx-2 ${index < currentStep ? 'bg-emerald-500' : 'bg-white/10'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    )
}

export default FormStepper
