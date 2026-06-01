import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

const legitimateReasons = [
  'Structural lintel replacement required',
  'Scaffolding required for first floor or above',
  'Opening size materially different from customer information',
  'Significant access constraints affecting installation time',
  'Repair to surrounding brickwork or plasterwork required',
]

const neverLegitimate = [
  'Wanting a higher margin',
  'Customer seemed agreeable to a higher price',
  'General condition of the property',
]

export function PricingPromisePage() {
  useSEO({
    title: 'Our Pricing Promise | Windows & Doors Online',
    description:
      'Understand what our indicative prices include and what we do if an installer reprices without good reason.',
  })

  return (
    <Layout>
      <div className="max-w-[720px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-16">Our Pricing Promise</h1>

        <section className="mb-14">
          <h2 className="font-display text-2xl text-ink mb-6">What is included in every price</h2>
          <p className="font-sans text-base text-ink leading-relaxed">
            Every price on this site is an indicative installed price covering: supply of the
            window or door unit to your specification; professional installation by a
            FENSA-registered fitter; removal and disposal of your existing unit; all sealing,
            finishing and making-good around the frame; and a FENSA certificate confirming
            building regulations compliance. No hidden extras. No line items added later.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="font-display text-2xl text-ink mb-6">What standard installation means</h2>
          <p className="font-sans text-base text-ink leading-relaxed">
            Standard installation means a like-for-like replacement in a structurally sound
            opening of the size you have described, with normal access to the property. This covers
            the vast majority of residential replacement jobs in West Yorkshire. If you know your
            job involves anything non-standard — an unusual opening, a high location, surrounding
            damage — mention it in the checkout notes and your installer will factor it into the
            survey assessment.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="font-display text-2xl text-ink mb-6">
            Legitimate reasons a price may vary
          </h2>
          <p className="font-sans text-base text-ink-muted mb-6">
            These are the only circumstances in which a surveyor may revise the indicative price
            upward. Each variation must be explained in writing before any work is agreed.
          </p>
          <ul className="space-y-4">
            {legitimateReasons.map((r) => (
              <li key={r} className="flex items-start gap-3">
                <AlertCircle
                  className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <span className="font-sans text-base text-ink">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14">
          <h2 className="font-display text-2xl text-ink mb-6">
            What is never a legitimate reason to vary
          </h2>
          <ul className="space-y-4">
            {neverLegitimate.map((r) => (
              <li key={r} className="flex items-start gap-3">
                <span className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <span className="block w-3 h-0.5 bg-accent" />
                </span>
                <span className="font-sans text-base text-ink">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-surface border border-hairline p-6">
          <h2 className="font-display text-2xl text-ink mb-4">
            What happens if an installer reprices unfairly
          </h2>
          <p className="font-sans text-base text-ink leading-relaxed">
            Installers who reprice without a legitimate cause from the list above are removed from
            the platform immediately. No exceptions. Our business model depends on customers
            trusting the prices they see. Any installer who undermines that trust is damaging our
            reputation directly, and we treat it accordingly. If you believe your installer has
            repriced unfairly, contact us at hello@buywindowsanddoors.co.uk and we will investigate
            and act.
          </p>
        </section>
      </div>
    </Layout>
  )
}
