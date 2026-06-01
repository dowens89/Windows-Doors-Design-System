import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="w-full bg-paper border-b border-hairline relative z-50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="#"
          className="font-display text-2xl font-medium text-ink tracking-tight">
          
          Windows & Doors Online
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="font-sans text-base text-ink-muted hover:text-ink transition-colors">
            
            Windows
          </a>
          <a
            href="#"
            className="font-sans text-base text-ink-muted hover:text-ink transition-colors">
            
            Doors
          </a>
          <a
            href="#"
            className="font-sans text-base text-ink-muted hover:text-ink transition-colors">
            
            How it works
          </a>
          <a
            href="#"
            className="font-sans text-base text-ink-muted hover:text-ink transition-colors">
            
            Pricing
          </a>
        </nav>

        <div className="hidden md:flex items-center">
          <Button variant="primary">Get a price</Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-ink"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu">
          
          {isOpen ?
          <X className="w-6 h-6" strokeWidth={1.5} /> :

          <Menu className="w-6 h-6" strokeWidth={1.5} />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen &&
      <div className="md:hidden absolute top-full left-0 w-full bg-paper border-b border-hairline shadow-modal">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <a
            href="#"
            className="font-sans text-lg text-ink py-2 border-b border-hairline">
            
              Windows
            </a>
            <a
            href="#"
            className="font-sans text-lg text-ink py-2 border-b border-hairline">
            
              Doors
            </a>
            <a
            href="#"
            className="font-sans text-lg text-ink py-2 border-b border-hairline">
            
              How it works
            </a>
            <a
            href="#"
            className="font-sans text-lg text-ink py-2 border-b border-hairline">
            
              Pricing
            </a>
            <div className="pt-4 pb-2">
              <Button variant="primary" className="w-full">
                Get a price
              </Button>
            </div>
          </nav>
        </div>
      }
    </header>);

}