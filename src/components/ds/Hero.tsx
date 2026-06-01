import React from 'react';
import { Button } from './Button';
import { TrustSignal } from './TrustSignal';
import { ShieldCheck, PoundSterling, Clock } from 'lucide-react';
export function Hero() {
  return (
    <section className="w-full bg-paper py-12 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Content Column (60%) */}
          <div className="w-full lg:w-[60%] flex flex-col items-start">
            <h1 className="font-display text-5xl md:text-6xl lg:text-[72px] leading-[1.1] font-normal text-ink tracking-tight mb-6">
              Windows and doors, bought the way you buy everything else.
            </h1>

            <p className="font-sans text-lg md:text-xl text-ink-muted leading-relaxed mb-10 max-w-2xl">
              See real installed prices online instantly. No salespeople in your
              home, no fake discounts, and no pressure. Just honest pricing and
              vetted local installers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Browse products & prices
              </Button>
              <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                How it works
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 border-t border-hairline pt-8 w-full">
              <TrustSignal icon={PoundSterling} text="Transparent pricing" />
              <TrustSignal icon={ShieldCheck} text="Vetted installers" />
              <TrustSignal icon={Clock} text="No pressure sales" />
            </div>
          </div>

          {/* Image Column (40%) */}
          <div className="w-full lg:w-[40%]">
            <div className="aspect-[4/5] w-full bg-surface border border-hairline p-2 shadow-raised">
              <img
                src="https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=1000"
                alt="Modern casement window installation in a brick home"
                className="w-full h-full object-cover" />
              
            </div>
          </div>
        </div>
      </div>
    </section>);

}