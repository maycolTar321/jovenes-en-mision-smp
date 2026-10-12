import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, stepLabels }) => {
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full mb-8">
      {/* Percentage text */}
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-2">
        <span>Paso {currentStep} de {totalSteps}: {stepLabels[currentStep - 1]}</span>
        <span className="text-[#214C3B] font-bold">{percentage}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-stone-200/80 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#16382D] to-[#214C3B] transition-all duration-500 rounded-full shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center mt-3">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={label} className="flex flex-col items-center flex-1 text-center">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted 
                    ? 'bg-[#16382D] text-white' 
                    : isCurrent 
                      ? 'bg-[#214C3B] text-white ring-4 ring-[#214C3B]/20 shadow' 
                      : 'bg-stone-200 text-stone-500'
                }`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span className={`text-[11px] mt-1 line-clamp-1 max-w-[80px] hidden sm:block ${
                isCurrent ? 'font-semibold text-stone-900' : 'text-stone-500'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
