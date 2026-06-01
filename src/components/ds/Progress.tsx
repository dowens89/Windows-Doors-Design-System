import React from 'react';
export interface ProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}
export function Progress({
  currentStep,
  totalSteps,
  className = ''
}: ProgressProps) {
  const steps = Array.from(
    {
      length: totalSteps
    },
    (_, i) => i + 1
  );
  return (
    <div className={`w-full ${className}`}>
      {/* Mobile view: Compact */}
      <div className="md:hidden flex flex-col gap-2">
        <div className="flex justify-between items-center font-sans text-sm font-medium text-ink">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="h-1 w-full bg-hairline rounded-none">
          <div
            className="h-full bg-brand transition-all duration-300 ease-out"
            style={{
              width: `${currentStep / totalSteps * 100}%`
            }} />
          
        </div>
      </div>

      {/* Desktop view: Numbered steps with connectors */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-hairline -z-10" />

        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          return (
            <div
              key={step}
              className="flex flex-col items-center gap-2 bg-paper px-2">
              
              <div
                className={`
                  w-8 h-8 flex items-center justify-center font-mono text-sm font-medium transition-colors
                  ${isCompleted ? 'bg-brand text-paper' : isCurrent ? 'bg-ink text-paper border-2 border-ink' : 'bg-surface text-ink-muted border border-hairline'}
                `}>
                
                {step}
              </div>
            </div>);

        })}
      </div>
    </div>);

}