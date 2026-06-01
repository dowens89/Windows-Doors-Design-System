import React from 'react';
import { Button } from './Button';
import { BoxIcon } from 'lucide-react';
export interface EmptyStateProps {
  icon: BoxIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 bg-surface border border-hairline border-dashed rounded ${className}`}>
      
      <div className="w-16 h-16 flex items-center justify-center bg-paper border border-hairline rounded-full mb-6">
        <Icon className="w-8 h-8 text-ink-subtle" strokeWidth={1.5} />
      </div>

      <h3 className="font-display text-2xl font-medium text-ink mb-3">
        {title}
      </h3>

      <p className="font-sans text-base text-ink-muted max-w-md mb-8">
        {description}
      </p>

      {actionLabel && onAction &&
      <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      }
    </div>);

}