import React, { useState, Component } from 'react';
import {
  ShieldCheck,
  Lock,
  BadgeCheck,
  Upload,
  Search,
  FileX } from
'lucide-react';
import { Button } from '../components/ds/Button';
import { Badge } from '../components/ds/Badge';
import { TrustSignal } from '../components/ds/TrustSignal';
import { PriceDisplay } from '../components/ds/PriceDisplay';
import { Input } from '../components/ds/Input';
import { ProductCard } from '../components/ds/ProductCard';
import { Progress } from '../components/ds/Progress';
import { Nav } from '../components/ds/Nav';
import { Hero } from '../components/ds/Hero';
import { ReviewCard } from '../components/ds/ReviewCard';
import { FAQ } from '../components/ds/FAQ';
import { Alert } from '../components/ds/Alert';
import { Modal } from '../components/ds/Modal';
import { EmptyState } from '../components/ds/EmptyState';
import { Loading } from '../components/ds/Loading';
// Helper component for annotations
const Annotation = ({ children }: {children: React.ReactNode;}) =>
<div className="w-full md:w-64 shrink-0 font-sans text-sm text-ink-muted border-l-2 border-hairline pl-4 py-1">
    <span className="font-semibold text-ink block mb-1">Note</span>
    {children}
  </div>;

const Section = ({
  title,
  children



}: {title: string;children: React.ReactNode;}) =>
<section className="mb-24">
    <h2 className="font-display text-3xl font-medium text-ink mb-10 pb-4 border-b border-hairline">
      {title}
    </h2>
    {children}
  </section>;

const ComponentRow = ({
  title,
  annotation,
  children




}: {title: string;annotation: React.ReactNode;children: React.ReactNode;}) =>
<div className="mb-16">
    <h3 className="font-sans text-lg font-semibold text-ink mb-6">{title}</h3>
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="flex-grow w-full overflow-x-auto pb-4 no-scrollbar">
        {children}
      </div>
      <Annotation>{annotation}</Annotation>
    </div>
  </div>;

export function DesignSystem() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-brand selection:text-paper pb-32">
      {/* Header */}
      <header className="pt-20 pb-16 px-6 md:px-8 max-w-[1200px] mx-auto border-b border-hairline mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight mb-4">
          Windows & Doors Online
        </h1>
        <p className="font-sans text-xl text-ink-muted">Design System · v0.1</p>
      </header>

      <main className="px-6 md:px-8 max-w-[1200px] mx-auto">
        {/* Brand Principles */}
        <Section title="Brand Principles">
          <div className="max-w-[640px] space-y-6 font-sans text-lg text-ink-muted leading-relaxed">
            <p>
              <strong className="text-ink font-medium">
                Transparency & Honesty.
              </strong>{' '}
              The windows and doors industry is notorious for opaque pricing,
              fake discounts, and high-pressure sales. We are the antidote. Our
              design language is grounded, material, and unambiguous.
            </p>
            <p>
              <strong className="text-ink font-medium">Calm Confidence.</strong>{' '}
              We don't use red sale banners, countdown timers, or flashing
              badges. We borrow visual cues from premium physical retail and
              editorial design to communicate authority without shouting.
            </p>
            <p>
              <strong className="text-ink font-medium">
                Considered Retail.
              </strong>{' '}
              Buying home improvements is a significant, tactile purchase. The
              UI should feel like a printed ledger or a well-crafted
              catalogue—not a generic tech startup.
            </p>
          </div>
        </Section>

        {/* Foundations */}
        <Section title="Foundations">
          <div className="mb-16">
            <h3 className="font-sans text-lg font-semibold text-ink mb-6">
              Colour Palette
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
              {
                name: 'Paper (Bg)',
                var: 'bg-paper',
                hex: '#F6F2EA',
                text: 'text-ink'
              },
              {
                name: 'Surface',
                var: 'bg-surface',
                hex: '#FBF8F2',
                text: 'text-ink'
              },
              {
                name: 'Ink (Text)',
                var: 'bg-ink',
                hex: '#1A1A17',
                text: 'text-paper'
              },
              {
                name: 'Hairline',
                var: 'bg-hairline',
                hex: '#E2DCCE',
                text: 'text-ink'
              },
              {
                name: 'Brand Green',
                var: 'bg-brand',
                hex: '#2F4A3A',
                text: 'text-paper'
              },
              {
                name: 'Accent Clay',
                var: 'bg-accent',
                hex: '#B8553A',
                text: 'text-paper'
              }].
              map((color) =>
              <div key={color.name} className="flex flex-col">
                  <div
                  className={`h-24 rounded-sm border border-hairline mb-3 ${color.var}`}>
                </div>
                  <span className="font-sans text-sm font-medium text-ink">
                    {color.name}
                  </span>
                  <span className="font-mono text-xs text-ink-muted">
                    {color.hex}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-16">
            <h3 className="font-sans text-lg font-semibold text-ink mb-6">
              Typography
            </h3>
            <div className="space-y-8">
              <div>
                <span className="font-sans text-sm text-ink-muted mb-2 block">
                  Display (Fraunces)
                </span>
                <div className="font-display text-5xl md:text-6xl text-ink">
                  Honest pricing.
                </div>
              </div>
              <div>
                <span className="font-sans text-sm text-ink-muted mb-2 block">
                  Body (Inter)
                </span>
                <div className="font-sans text-lg text-ink max-w-2xl">
                  See real installed prices online instantly. No salespeople in
                  your home, no fake discounts, and no pressure.
                </div>
              </div>
              <div>
                <span className="font-sans text-sm text-ink-muted mb-2 block">
                  Prices (IBM Plex Mono)
                </span>
                <div className="font-mono text-4xl text-ink">£1,240</div>
              </div>
            </div>
          </div>
        </Section>

        {/* Components */}
        <Section title="Components">
          <ComponentRow
            title="Price Display"
            annotation="The signature component. Uses IBM Plex Mono to read like a printed ledger—honest, unambiguous, never promotional. The assurance line directly answers the customer anxiety: 'will the price change after a site visit?'">
            
            <div className="flex flex-col gap-8">
              <PriceDisplay price={1240} size="large" />
              <PriceDisplay price={489} size="medium" isFrom />
            </div>
          </ComponentRow>

          <ComponentRow
            title="Buttons"
            annotation="Restrained 4px radius. No pills. The primary button uses the deep brand green. The accent terracotta is reserved strictly for rare emphasis. Hover states are subtle.">
            
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary">Get a price</Button>
              <Button variant="secondary">View details</Button>
              <Button variant="ghost">How it works</Button>
              <Button variant="accent">Book survey</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>
          </ComponentRow>

          <ComponentRow
            title="Form Inputs"
            annotation="Generous padding, hairline borders. Labels are uppercase and tracked out for an editorial feel. Focus states use a crisp inset ring, not a soft glow.">
            
            <div className="max-w-sm space-y-6">
              <Input label="Full Name" placeholder="Jane Doe" />
              <Input
                label="Postcode"
                placeholder="LS1 4AB"
                helperText="We currently only serve West Yorkshire." />
              
              <Input
                label="Phone Number"
                defaultValue="07700900"
                error="Please enter a valid UK mobile number." />
              
            </div>
          </ComponentRow>

          <ComponentRow
            title="Product Card"
            annotation="Flat, material design. No floating drop-shadows. The price is the most visually weighted element after the image, reinforcing transparency.">
            
            <div className="max-w-sm">
              <ProductCard
                title="Casement Window"
                description="White uPVC, double glazed, A-rated energy efficiency. 1200×1000mm."
                price={489}
                imageUrl="https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800"
                isFromPrice />
              
            </div>
          </ComponentRow>

          <ComponentRow
            title="Trust Signals & Badges"
            annotation="Quiet visual weight. Used to address specific anxieties at key moments (e.g., near a checkout button). Badges avoid bright 'sale' colours.">
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <TrustSignal icon={ShieldCheck} text="10-year guarantee" />
                <TrustSignal icon={Lock} text="Secure checkout" />
              </div>
              <div className="flex gap-4">
                <Badge variant="neutral">uPVC</Badge>
                <Badge variant="verified">Vetted Installer</Badge>
                <Badge variant="accreditation">FENSA Registered</Badge>
              </div>
            </div>
          </ComponentRow>

          <ComponentRow
            title="Progress Indicator"
            annotation="Used for the multi-step survey flow. Avoids pill shapes in favour of a more architectural, squared-off approach.">
            
            <div className="max-w-2xl w-full">
              <Progress currentStep={2} totalSteps={4} />
            </div>
          </ComponentRow>

          <ComponentRow
            title="Review Card"
            annotation="Editorial pull-quote style. Avoids the generic e-commerce 'gold star' cliché by using a subtle filled-circle pattern.">
            
            <div className="max-w-md">
              <ReviewCard
                quote="No hard sell, no sitting in my living room for three hours. Just a clear price and a great fitting team."
                author="Sarah"
                location="Ilkley"
                rating={5} />
              
            </div>
          </ComponentRow>

          <ComponentRow
            title="Alerts"
            annotation="Subtle tinted washes with a solid left border. Used for system feedback without overwhelming the page.">
            
            <div className="max-w-md space-y-4">
              <Alert
                variant="info"
                title="Survey scheduled"
                message="Your surveyor will arrive between 9am and 11am." />
              
              <Alert
                variant="warning"
                message="This product requires a minimum order of 3 windows." />
              
              <Alert
                variant="error"
                message="We couldn't process your payment. Please try again."
                dismissible />
              
            </div>
          </ComponentRow>

          <ComponentRow
            title="FAQ Accordion"
            annotation="Clean, full-width rows with hairline dividers. No card wrapping. Smooth height transitions.">
            
            <div className="max-w-2xl">
              <FAQ
                items={[
                {
                  question: 'Will the price change after the survey?',
                  answer:
                  'No. The price you see online is the price you pay, provided the measurements you entered are roughly correct. If there is a significant discrepancy, you can cancel for a full refund.'
                },
                {
                  question: 'Do you employ salespeople?',
                  answer:
                  "Absolutely not. We believe in transparent pricing. You browse online, get a price, and if you're happy, a surveyor comes to check the technical details."
                }]
                } />
              
            </div>
          </ComponentRow>

          <ComponentRow
            title="Empty State & Loading"
            annotation="Honest tone copy. Loading states use a thin, elegant spinner or a flat skeleton pulse—no bouncy dots or shiny shimmer gradients.">
            
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="flex-1">
                <EmptyState
                  icon={FileX}
                  title="No quotes yet"
                  description="You haven't requested any prices yet. Browse our products to get started."
                  actionLabel="Browse windows"
                  onAction={() => {}} />
                
              </div>
              <div className="flex-1 flex flex-col gap-8">
                <div className="p-8 bg-surface border border-hairline flex items-center justify-center">
                  <Loading variant="spinner" />
                </div>
                <Loading variant="skeleton" />
              </div>
            </div>
          </ComponentRow>

          <ComponentRow
            title="Modal"
            annotation="The only component in the system that uses a significant drop shadow, to establish z-index hierarchy. Backdrop is a solid dark wash, no blur.">
            
            <div>
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Important Information">
                
                <p className="mb-4">
                  By proceeding with this survey request, you agree to our terms
                  of service. A £50 fully refundable deposit is required to
                  secure your date.
                </p>
                <div className="flex justify-end gap-3 mt-8">
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(false)}>
                    
                    I understand
                  </Button>
                </div>
              </Modal>
            </div>
          </ComponentRow>
        </Section>

        {/* Full Width Components */}
        <Section title="Layout Components">
          <div className="mb-16">
            <div className="flex justify-between items-end mb-6">
              <h3 className="font-sans text-lg font-semibold text-ink">
                Navigation
              </h3>
              <Annotation>
                Clean, paper background. No transparent-on-scroll effects.
              </Annotation>
            </div>
            <div className="border border-hairline rounded overflow-hidden">
              <Nav />
            </div>
          </div>

          <div className="mb-16">
            <div className="flex justify-between items-end mb-6">
              <h3 className="font-sans text-lg font-semibold text-ink">
                Hero Section
              </h3>
              <Annotation>
                Asymmetric editorial layout. Avoids the generic centred SaaS
                hero. Uses real architectural photography.
              </Annotation>
            </div>
            <div className="border border-hairline rounded overflow-hidden">
              <Hero />
            </div>
          </div>
        </Section>
      </main>
    </div>);

}