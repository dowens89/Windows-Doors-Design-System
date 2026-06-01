import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  return (
    <AnimatePresence>
      {isOpen &&
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
          className="absolute inset-0 bg-ink/40"
          onClick={onClose}
          aria-hidden="true" />
        

          {/* Modal Content */}
          <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.95
          }}
          transition={{
            duration: 0.2,
            ease: 'easeOut'
          }}
          className="relative w-full md:w-full md:max-w-lg bg-paper border border-hairline rounded-t-lg md:rounded-md shadow-modal flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title">
          
            <div className="flex items-center justify-between px-6 py-5 border-b border-hairline">
              <h2
              id="modal-title"
              className="font-display text-2xl font-medium text-ink">
              
                {title}
              </h2>
              <button
              onClick={onClose}
              className="p-2 -mr-2 text-ink-subtle hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              aria-label="Close modal">
              
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-sans text-base text-ink-muted">
              {children}
            </div>
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}