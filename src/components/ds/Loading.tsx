import React from 'react';
export type LoadingVariant = 'spinner' | 'skeleton';
export interface LoadingProps {
  variant?: LoadingVariant;
  className?: string;
}
export function Loading({ variant = 'spinner', className = '' }: LoadingProps) {
  if (variant === 'skeleton') {
    return (
      <div className={`w-full animate-pulse flex flex-col gap-4 ${className}`}>
        <div className="h-48 bg-surface border border-hairline rounded w-full"></div>
        <div className="h-6 bg-surface border border-hairline rounded w-3/4"></div>
        <div className="h-4 bg-surface border border-hairline rounded w-1/2"></div>
      </div>);

  }
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 rounded-full border-2 border-hairline border-t-brand animate-spin"></div>
    </div>);

}