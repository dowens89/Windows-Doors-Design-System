import React, { forwardRef } from 'react';
export interface InputProps extends
  React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label
          htmlFor={inputId}
          className="font-sans text-[13px] font-medium uppercase tracking-wider text-ink">
          
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`
            w-full px-3 py-3 font-sans text-base text-ink bg-paper border rounded-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand
            disabled:opacity-50 disabled:bg-surface disabled:cursor-not-allowed
            ${error ? 'border-error focus:ring-error' : 'border-hairline hover:border-ink-muted'}
          `}
          {...props} />
        
        {error &&
        <span className="font-sans text-sm text-error mt-0.5">{error}</span>
        }
        {helperText && !error &&
        <span className="font-sans text-sm text-ink-subtle mt-0.5">
            {helperText}
          </span>
        }
      </div>);

  }
);
Input.displayName = 'Input';