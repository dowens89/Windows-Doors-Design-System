import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { Button } from './ds/Button'
import { useBasketStore } from '../store/basketStore'

const navLinks = [
  { label: 'Windows', to: '/shop?category=windows' },
  { label: 'Doors', to: '/doors' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Pricing', to: '/pricing-promise' },
]

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const itemCount = useBasketStore((s) => s.getItemCount())

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <header className="w-full bg-paper border-b border-hairline relative z-50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          to="/"
          className="font-display text-2xl font-medium text-ink tracking-tight"
          onClick={closeMenu}
        >
          Windows & Doors Online
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-sans text-base text-ink-muted hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + basket */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/basket" className="relative text-ink-muted hover:text-ink transition-colors">
            <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 font-mono text-xs bg-brand text-paper rounded-full w-5 h-5 flex items-center justify-center leading-none">
                {itemCount}
              </span>
            )}
          </Link>
          <Button variant="primary" onClick={() => navigate('/quick-quote')}>
            Get a price
          </Button>
        </div>

        {/* Mobile: basket + toggle */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/basket" className="relative text-ink-muted hover:text-ink transition-colors">
            <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 font-mono text-xs bg-brand text-paper rounded-full w-5 h-5 flex items-center justify-center leading-none">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="p-2 -mr-2 text-ink"
            onClick={() => setIsOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-paper border-b border-hairline">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="font-sans text-lg text-ink py-2 border-b border-hairline"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => { closeMenu(); navigate('/quick-quote') }}
              >
                Get a price
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
