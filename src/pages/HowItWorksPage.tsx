import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { useSEO } from '../utils/seo'

interface Step {
  num: string
  heading: string
  body: string
  callout: string
  image: string
  imageAlt: string
  imageRight: boolean
}

const STEPS: Step[] = [
  {
    num: 'Step 01',
    heading: 'Browse real prices.\nNo registration needed.',
    body: 'Open our product catalogue and start browsing windows and doors. Every product shows a real indicative installed price — not a range so wide it means nothing, not a "call for a quote" placeholder. A number. Before you give us anything.\n\nChoose your product type, select your specification — size, colour, glazing — and watch the price update in real time. When you have what you need, add it to your quote. There is no account to create and no contact details required to see prices.',
    callout:
      'The average WDO customer spends 8 minutes browsing before submitting a survey request.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Modern window in a bright living room',
    imageRight: true,
  },
  {
    num: 'Step 02',
    heading: 'Submit your request.\nWe do the matching.',
    body: 'When you are ready, tell us your address and confirm your specification. You can upload a photo of your current window or door — it helps your installer prepare, though it is not required.\n\nYou are not paying anything at this stage. We take your request and match it to the right vetted installer in your area. You will receive a confirmation within 24 hours telling you which installer has accepted your job.',
    callout:
      'Your details go to one installer only — never a list of companies competing for your number.',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Residential street with traditional terrace houses',
    imageRight: false,
  },
  {
    num: 'Step 03',
    heading: 'A surveyor visits.\nNot a salesperson.',
    body: 'Your installer will contact you within 48 hours of accepting your job to arrange a convenient survey visit. The survey takes 15–60 minutes depending on the size of the job.\n\nThe surveyor confirms measurements and checks for anything non-standard. That is it. There is no sales presentation, no manager call, no pressure to sign anything. In most standard jobs the price confirmed at survey matches what you saw online.',
    callout:
      'If a surveyor tries to reprice without a legitimate reason, they are removed from our platform.',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Surveyor measuring a window opening',
    imageRight: true,
  },
  {
    num: 'Step 04',
    heading: 'Installation day.\nWhat to expect.',
    body: 'A standard composite door installation takes 2–4 hours. A full window replacement for a typical West Yorkshire terrace takes one day. Your installer will confirm the exact schedule when they arrange your survey.\n\nAll our installers are FENSA registered. You will receive a FENSA certificate on completion — you will need it when you sell your home.',
    callout:
      'WDO charges the installer a small fee on completion only. If your job is not completed, we do not get paid.',
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Window installation in progress',
    imageRight: false,
  },
]

export function HowItWorksPage() {
  useSEO({
    title: 'How It Works | Windows & Doors Online',
    description:
      'See how WDO helps West Yorkshire homeowners get honest installed prices and get matched with a vetted local installer — no salesperson, no pressure.',
  })

  const navigate = useNavigate()

  return (
    <Layout>
      {/* ── HERO BAND ────────────────────────────────────────────── */}
      <section className="bg-brand py-20 px-8 text-center">
        <h1 className="font-display text-5xl text-paper leading-tight">
          No surprises. No pressure.<br />No salesperson.
        </h1>
        <p className="font-sans text-paper opacity-70 text-xl mt-4 max-w-2xl mx-auto leading-relaxed">
          Here is exactly what happens from the moment you browse to the moment your windows or
          doors are installed.
        </p>
      </section>

      {/* ── GUIDED STEPS ─────────────────────────────────────────── */}
      {STEPS.map((step, i) => (
        <section
          key={step.num}
          className={i % 2 === 0 ? 'bg-paper' : 'bg-surface'}
        >
          <div className="max-w-6xl mx-auto px-8 py-20">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${
                !step.imageRight ? 'md:[&>*:first-child]:order-2' : ''
              }`}
            >
              {/* Content */}
              <div>
                <p className="font-mono text-xs text-brand uppercase tracking-widest mb-4">
                  {step.num}
                </p>
                <h2 className="font-display text-4xl text-ink mb-6 leading-tight whitespace-pre-line">
                  {step.heading}
                </h2>
                <div className="font-sans text-ink-muted text-lg leading-relaxed max-w-prose mb-8 space-y-4">
                  {step.body.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
                <div className="bg-brand text-paper font-sans text-sm p-4 rounded-sm">
                  {step.callout}
                </div>
              </div>

              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={step.image}
                  alt={step.imageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── PRICING PROMISE CALLOUT ───────────────────────────────── */}
      <section className="bg-accent py-12 px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-paper mb-4">What if the price changes?</h2>
          <p className="font-sans text-paper opacity-80 text-lg max-w-2xl mx-auto mb-8">
            The only legitimate reasons a price can change after survey are structural issues,
            scaffolding requirements, or a significant measurement discrepancy. Everything else is
            not acceptable.
          </p>
          <Button
            variant="primary"
            style={{ backgroundColor: 'var(--color-paper)', color: 'var(--color-accent)' }}
            onClick={() => navigate('/pricing-promise')}
          >
            Read Our Pricing Promise
          </Button>
        </div>
      </section>
    </Layout>
  )
}
