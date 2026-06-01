import React from 'react';
export interface ReviewCardProps {
  quote: string;
  author: string;
  location: string;
  rating?: number;
  className?: string;
}
export function ReviewCard({
  quote,
  author,
  location,
  rating = 5,
  className = ''
}: ReviewCardProps) {
  return (
    <div
      className={`flex flex-col p-8 bg-surface border border-hairline shadow-raised ${className}`}>
      
      {/* Subtle filled-circle pattern for rating instead of gold stars */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({
          length: 5
        }).map((_, i) =>
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i < rating ? 'bg-brand' : 'bg-hairline'}`}
          aria-hidden="true" />

        )}
      </div>

      <div className="relative mb-6">
        <span
          className="absolute -top-4 -left-4 font-display text-6xl text-hairline leading-none select-none"
          aria-hidden="true">
          
          "
        </span>
        <blockquote className="relative z-10 font-display italic text-lg md:text-xl text-ink leading-relaxed">
          {quote}
        </blockquote>
      </div>

      <div className="mt-auto pt-4 border-t border-hairline">
        <p className="font-sans text-sm text-ink-muted">
          <span className="font-medium text-ink">{author}</span> · {location}
        </p>
      </div>
    </div>);

}