import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
  {
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  },
  ref) =>
  {
    const baseStyles =
    'inline-flex items-center justify-center font-sans font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:cursor-not-allowed rounded';
    const variants = {
      primary:
      'bg-brand text-paper hover:bg-brand-hover border border-transparent',
      secondary:
      'bg-paper text-ink border border-hairline hover:bg-surface shadow-raised',
      ghost:
      'bg-transparent text-ink hover:underline border border-transparent',
      accent:
      'bg-accent text-paper hover:bg-[#A34A32] border border-transparent' // Slightly darker terracotta on hover
    };
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg'
    };
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}>
        
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>);

  }
);
Button.displayName = 'Button';