import React from 'react';
export type PriceDisplaySize = 'inline' | 'medium' | 'large';
export interface PriceDisplayProps {
  price: number;
  size?: PriceDisplaySize;
  isFrom?: boolean;
  assuranceText?: string;
  className?: string;
}
export function PriceDisplay({
  price,
  size = 'medium',
  isFrom = false,
  assuranceText = 'Includes fitting, VAT and 10-year guarantee.',
  className = ''
}: PriceDisplayProps) {
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0
  }).format(price);
  const sizes = {
    inline: {
      price: 'text-lg',
      label: 'text-[10px]'
    },
    medium: {
      price: 'text-3xl',
      label: 'text-[11px]'
    },
    large: {
      price: 'text-5xl md:text-6xl',
      label: 'text-xs'
    }
  };
  return (
    <div className={`flex flex-col ${className}`}>
      <span
        className={`font-sans font-semibold uppercase tracking-wider text-ink-muted mb-1 ${sizes[size].label}`}>
        
        Installed Price
      </span>
      <div className="flex items-baseline gap-2">
        {isFrom &&
        <span className="font-sans text-ink-muted text-sm md:text-base">
            from
          </span>
        }
        <span
          className={`font-mono font-medium text-ink tracking-tight ${sizes[size].price}`}>
          
          {formattedPrice}
        </span>
      </div>
      {assuranceText && size !== 'inline' &&
      <span className="font-sans text-sm text-ink-subtle mt-1.5">
          {assuranceText}
        </span>
      }
    </div>);

}