import React from 'react';
import { Check } from 'lucide-react';
export type BadgeVariant = 'neutral' | 'verified' | 'accreditation';
export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}
export function Badge({
  variant = 'neutral',
  children,
  className = ''
}: BadgeProps) {
  const baseStyles =
  'inline-flex items-center font-sans text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-sm';
  const variants = {
    neutral: 'bg-surface text-ink-muted border border-hairline',
    verified: 'bg-[#EBF1ED] text-success border border-[#D1E0D7]',
    accreditation: 'bg-paper text-ink border border-hairline shadow-raised'
  };
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {variant === 'verified' &&
      <Check className="w-3 h-3 mr-1" strokeWidth={2.5} />
      }
      {children}
    </span>);

}