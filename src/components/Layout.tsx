import React from 'react'
import { Link } from 'react-router-dom'
import { Nav } from './ds/Nav'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <FooterCol heading="Products">
            <FooterLink to="/shop?category=windows">Windows</FooterLink>
            <FooterLink to="/shop?category=doors">Doors</FooterLink>
            <FooterLink to="/quick-quote">Quick Quote</FooterLink>
          </FooterCol>

          <FooterCol heading="Information">
            <FooterLink to="/how-it-works">How It Works</FooterLink>
            <FooterLink to="/pricing-promise">Pricing Promise</FooterLink>
            <FooterLink to="/service-area">Service Area</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
          </FooterCol>

          <FooterCol heading="Company">
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/design-system">Design System</FooterLink>
          </FooterCol>

          <FooterCol heading="Legal">
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Use</FooterLink>
          </FooterCol>
        </div>
      </div>

      <div className="border-t border-ink-muted">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-6 space-y-2">
          <p className="font-sans text-sm text-ink-muted">
            Windows & Doors Online is a lead generation platform. We are not the installer. All
            installations are carried out by vetted independent local installers.
          </p>
          <p className="font-sans text-sm text-ink-muted">Currently serving West Yorkshire</p>
          <p className="font-sans text-sm text-ink-muted">
            &copy; 2026 Windows & Doors Online
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="font-sans text-sm font-semibold text-paper uppercase tracking-widest mb-4">
        {heading}
      </h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="font-sans text-sm text-ink-muted hover:text-paper transition-colors">
        {children}
      </Link>
    </li>
  )
}
