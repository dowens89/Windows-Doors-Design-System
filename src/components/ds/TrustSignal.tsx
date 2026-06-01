import React from 'react';
import { BoxIcon } from 'lucide-react';
export type TrustSignalVariant = 'inline' | 'block';
export interface TrustSignalProps {
  icon: BoxIcon;
  text: string;
  variant?: TrustSignalVariant;
  className?: string;
}
export function TrustSignal({
  icon: Icon,
  text,
  variant = 'inline',
  className = ''
}: TrustSignalProps) {
  if (variant === 'block') {
    return (
      <div
        className={`flex flex-col items-center text-center gap-2 ${className}`}>
        
        <Icon className="w-6 h-6 text-brand" strokeWidth={1.5} />
        <span className="font-sans text-sm text-ink-muted leading-snug">
          {text}
        </span>
      </div>);

  }
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Icon className="w-4 h-4 text-brand shrink-0" strokeWidth={1.5} />
      <span className="font-sans text-sm text-ink-muted">{text}</span>
    </div>);

}