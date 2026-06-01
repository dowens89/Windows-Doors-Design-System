import React, { lazy } from 'react';
import { PriceDisplay } from './PriceDisplay';
export interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  isFromPrice?: boolean;
  className?: string;
}
export function ProductCard({
  title,
  description,
  price,
  imageUrl,
  isFromPrice = false,
  className = ''
}: ProductCardProps) {
  return (
    <div
      className={`flex flex-col bg-surface border border-hairline rounded shadow-raised overflow-hidden ${className}`}>
      
      <div className="aspect-[4/3] w-full overflow-hidden bg-hairline">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy" />
        
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <h3 className="font-display text-xl font-medium text-ink mb-2">
          {title}
        </h3>
        <p className="font-sans text-base text-ink-muted mb-6 flex-grow">
          {description}
        </p>

        <div className="pt-5 border-t border-hairline mt-auto">
          <PriceDisplay
            price={price}
            size="medium"
            isFrom={isFromPrice}
            assuranceText="Includes fitting, VAT & guarantee" />
          
        </div>
      </div>
    </div>);

}