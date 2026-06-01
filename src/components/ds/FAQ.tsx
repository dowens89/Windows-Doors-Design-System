import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export interface FAQItem {
  question: string;
  answer: string;
}
export interface FAQProps {
  items: FAQItem[];
  className?: string;
}
export function FAQ({ items, className = '' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className={`w-full flex flex-col ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-hairline last:border-b-0">
            <button
              className="w-full py-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}>
              
              <span className="font-sans text-lg font-medium text-ink pr-8">
                {item.question}
              </span>
              <span className="text-ink-muted shrink-0 transition-transform duration-200">
                {isOpen ?
                <Minus className="w-5 h-5" strokeWidth={1.5} /> :

                <Plus className="w-5 h-5" strokeWidth={1.5} />
                }
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen &&
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0
                }}
                animate={{
                  height: 'auto',
                  opacity: 1
                }}
                exit={{
                  height: 0,
                  opacity: 0
                }}
                transition={{
                  duration: 0.2,
                  ease: 'easeOut'
                }}
                className="overflow-hidden">
                
                  <div className="pb-6 pr-8 font-sans text-base text-ink-muted leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </div>);

      })}
    </div>);

}