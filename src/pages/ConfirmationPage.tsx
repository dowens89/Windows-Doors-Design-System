import React, { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { Alert } from '../components/ds/Alert'
import { Badge } from '../components/ds/Badge'
import { Progress } from '../components/ds/Progress'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { useSEO } from '../utils/seo'
import type { BasketItem } from '../store/basketStore'

interface ConfirmationState {
  reference: string
  name: string
  items: BasketItem[]
  total: number
}

export function ConfirmationPage() {
  useSEO({
    title: 'Survey Request Confirmed | Windows & Doors Online',
    description: 'Your survey request has been confirmed. We will be in touch within 24 hours.',
  })

  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ConfirmationState | null

  useEffect(() => {
    if (!state) navigate('/', { replace: true })
  }, [state, navigate])

  if (!state) return null

  const firstName = state.name.split(' ')[0]

  return (
    <Layout>
      <div className="max-w-[720px] mx-auto px-6 md:px-8 py-12">
        <div className="mb-10">
          <Progress currentStep={3} totalSteps={3} />
        </div>

        <Alert variant="success" message="Your survey request is confirmed" />

        <h1 className="font-display text-3xl md:text-4xl text-ink mt-8 mb-6">
          You're all set, {firstName}.
        </h1>

        {/* Reference */}
        <div className="mb-10 pb-10 border-b border-hairline">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
            Your reference
          </p>
          <Badge variant="neutral">{state.reference}</Badge>
          <p className="font-sans text-sm text-ink-muted mt-2">Keep this for your records</p>
        </div>

        {/* Order summary */}
        <div className="mb-12">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
            Summary
          </p>
          <div className="space-y-4 mb-6">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 pb-4 border-b border-hairline">
                <div>
                  <p className="font-sans text-sm font-medium text-ink">{item.productName}</p>
                  <p className="font-sans text-xs text-ink-muted">{item.variantSummary}</p>
                </div>
                <PriceDisplay price={item.indicativePrice} size="inline" assuranceText="" />
              </div>
            ))}
          </div>
          <div className="flex items-start justify-between">
            <p className="font-sans text-sm font-semibold text-ink-muted uppercase tracking-wide">
              Total
            </p>
            <PriceDisplay price={state.total} size="medium" assuranceText="" />
          </div>
        </div>

        {/* What happens next */}
        <div className="mb-12">
          <h2 className="font-display text-2xl text-ink mb-8">What happens next</h2>
          <div className="space-y-8">
            {[
              {
                n: '01',
                heading: 'Matching your job',
                body: 'We are finding the right vetted installer in your area for this job.',
              },
              {
                n: '02',
                heading: 'Installer confirmed within 24 hours',
                body: 'You will receive an email confirming which installer has accepted your job and their contact details.',
              },
              {
                n: '03',
                heading: 'Survey arranged within 48 hours',
                body: 'Your installer will contact you to arrange a convenient survey visit at no charge.',
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-6">
                <span className="font-mono text-xl text-brand flex-shrink-0">{step.n}</span>
                <div>
                  <h3 className="font-display text-lg text-ink mb-1">{step.heading}</h3>
                  <p className="font-sans text-base text-ink-muted">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Alert
          variant="info"
          message="In most standard jobs, the price you have seen today is the price you will be quoted. If your surveyor identifies anything that affects the price — such as a structural issue or non-standard access requirement — they will explain this clearly and in writing before any work begins."
        />

        <p className="font-sans text-sm text-ink-muted text-center mt-8 mb-8">
          Questions? Email{' '}
          <a
            href="mailto:hello@buywindowsanddoors.co.uk"
            className="text-brand hover:underline"
          >
            hello@buywindowsanddoors.co.uk
          </a>
          . We respond within one working day.
        </p>

        <div className="text-center">
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to home
          </Button>
        </div>
      </div>
    </Layout>
  )
}
