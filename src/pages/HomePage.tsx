import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Lock, BadgeCheck } from 'lucide-react'
import { Layout } from '../components/Layout'
import { SchemaTag } from '../components/SchemaTag'
import { Button } from '../components/ds/Button'
import { Input } from '../components/ds/Input'
import { Alert } from '../components/ds/Alert'
import { Loading } from '../components/ds/Loading'
import { useSEO } from '../utils/seo'
import { localBusinessSchema } from '../utils/schema'
import { supabase } from '../lib/supabase'

const UK_POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i
const COVERED_PREFIXES = ['LS', 'BD', 'WF', 'HD', 'HX', 'HG', 'DN', 'S72', 'S73', 'S74', 'S75']

function isCovered(postcode: string): boolean {
  const upper = postcode.trim().toUpperCase().replace(/\s+/g, '')
  return COVERED_PREFIXES.some((prefix) => upper.startsWith(prefix))
}

interface QuoteResult {
  low: number
  high: number
}

export function HomePage() {
  useSEO({
    title: 'Windows & Doors Online | Honest Installed Prices in West Yorkshire',
    description:
      'See real installed prices for windows and doors before anyone visits your home. One vetted installer. No salesperson. No pressure. West Yorkshire.',
  })

  const navigate = useNavigate()

  // ── Postcode checker ─────────────────────────────────────────────
  const [postcodeInput, setPostcodeInput] = useState('')
  const [coverageResult, setCoverageResult] = useState<'covered' | 'not-covered' | null>(null)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifySubmitted, setNotifySubmitted] = useState(false)
  const [notifyPostcode, setNotifyPostcode] = useState('')

  function checkPostcode() {
    if (!postcodeInput.trim()) return
    setNotifyPostcode(postcodeInput)
    setCoverageResult(isCovered(postcodeInput) ? 'covered' : 'not-covered')
  }

  async function submitNotify() {
    if (!notifyEmail.trim()) return
    await supabase.from('interest_registrations').insert({
      email: notifyEmail.trim(),
      postcode: notifyPostcode,
    })
    setNotifySubmitted(true)
  }

  // ── Quick Quote ───────────────────────────────────────────────────
  const [windows, setWindows] = useState(0)
  const [doors, setDoors] = useState(0)
  const [compositeDoors, setCompositeDoors] = useState(0)
  const [quotePostcode, setQuotePostcode] = useState('')
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({})
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null)

  function handleCalculate() {
    const errs: Record<string, string> = {}
    if (windows === 0 && doors === 0 && compositeDoors === 0) {
      errs.items = 'Enter at least one item'
    }
    if (!UK_POSTCODE_RE.test(quotePostcode)) {
      errs.postcode = 'Enter a valid postcode'
    }
    setQuoteErrors(errs)
    if (Object.keys(errs).length > 0) return
    const total = windows * 600 + doors * 750 + compositeDoors * 1195
    setQuoteResult({
      low: Math.round((total * 0.8) / 50) * 50,
      high: Math.round((total * 1.25) / 50) * 50,
    })
  }

  // ── Quote count ───────────────────────────────────────────────────
  const [quoteCount, setQuoteCount] = useState<number | null>(null)

  useEffect(() => {
    supabase
      .from('quote_requests')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => setQuoteCount(count ?? 0))
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(n)

  return (
    <Layout>
      <SchemaTag schema={localBusinessSchema()} />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row min-h-[600px] md:min-h-screen">
        {/* Mobile image — appears above content */}
        <div className="block md:hidden w-full h-[280px] overflow-hidden flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200"
            alt="Composite door installed on a residential home"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Left: content */}
        <div className="bg-brand flex flex-col justify-center px-8 py-16 md:px-12 md:py-20 w-full md:w-[55%]">
          <p className="font-mono text-xs text-paper opacity-70 uppercase tracking-widest mb-6">
            No Salesperson · Transparent Pricing · One Installer
          </p>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-paper leading-tight">
            See the price.<br />
            Book the survey.<br />
            No salesperson ever.
          </h1>

          <p className="font-sans text-lg text-paper opacity-80 mt-6 max-w-md leading-relaxed">
            We show you honest installed prices for windows and doors online. You choose what you want. We match you with a local installer who will carry out a survey.
            No cold calls. 
            No fake discounts. 
            No pressure.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              variant="primary"
              size="lg"
              style={{ backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
              onClick={() => navigate('/shop')}
            >
              Browse Products & build your order
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-paper border border-paper border-opacity-60 hover:border-opacity-100"
              onClick={() => navigate('/quick-quote')}
            >
              Get a quick quote
            </Button>
          </div>

         
              <div key={text} className="inline-flex items-center gap-2">
                <Icon className="w-4 h-4 text-paper shrink-0 opacity-80" strokeWidth={1.5} />
                <span className="font-sans text-sm text-paper opacity-80">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: image — desktop only */}
        <div className="hidden md:block w-[45%] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200"
            alt="Composite door installed on a residential home"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── POSTCODE CHECKER ─────────────────────────────────────── */}
      <section className="bg-surface border-b border-hairline py-6 px-8">
        <div className="max-w-4xl mx-auto">
          {coverageResult === null ? (
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div>
                <p className="font-display text-xl text-ink">Do we cover your area?</p>
                <p className="font-sans text-sm text-ink-muted mt-1">
                  Currently serving West Yorkshire, South Yorkshire, East Yorkshire, North Yorkshire, Lancashire and Manchester
                </p>
              </div>
              <div className="flex gap-3 sm:ml-auto items-end">
                <div className="w-48">
                  <Input
                    label=""
                    placeholder="Enter your postcode"
                    value={postcodeInput}
                    onChange={(e) => setPostcodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkPostcode()}
                  />
                </div>
                <Button variant="primary" onClick={checkPostcode}>
                  Check
                </Button>
              </div>
            </div>
          ) : coverageResult === 'covered' ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Alert
                variant="success"
                message="Great news — we cover your area. Browse products to get started."
                className="flex-1"
              />
              <Button variant="secondary" size="sm" onClick={() => navigate('/shop')}>
                Browse Now
              </Button>
            </div>
          ) : notifySubmitted ? (
            <Alert
              variant="info"
              message="Thanks — we'll let you know when we reach your area."
            />
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <Alert
                  variant="info"
                  message="We're not in your area yet — but we're expanding."
                />
              </div>
              <div className="flex gap-3 items-end">
                <div className="w-48">
                  <Input
                    label=""
                    placeholder="Your email"
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitNotify()}
                  />
                </div>
                <Button variant="secondary" size="sm" onClick={submitNotify}>
                  Notify Me
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── QUICK QUOTE ──────────────────────────────────────────── */}
      <section className="bg-brand py-16 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="bg-accent text-paper font-sans text-xs uppercase tracking-wider px-3 py-1 rounded-sm inline-block mb-4">
            Instant Estimate
          </span>

          <h2 className="font-display text-4xl text-paper">How much will your job cost?</h2>

          <p className="font-sans text-paper opacity-70 text-lg mt-3 mb-10 max-w-lg mx-auto">
            No contact details needed. Takes 30 seconds. Price is indicative based on average costs, get your full fixed price by shopping our range!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Windows', value: windows, set: setWindows, max: 20 },
              { label: 'Doors', value: doors, set: setDoors, max: 10 },
              { label: 'Composite Doors', value: compositeDoors, set: setCompositeDoors, max: 5 },
            ].map(({ label, value, set, max }) => (
              <div key={label} className="bg-white bg-opacity-10 rounded-sm p-4">
                <label className="font-sans text-xs text-paper uppercase tracking-wide mb-2 block">
                  {label}
                </label>
                <input
                  type="number"
                  min={0}
                  max={max}
                  value={value}
                  onChange={(e) => set(Math.max(0, parseInt(e.target.value) || 0))}
                  className="bg-transparent text-paper text-2xl font-mono text-center border-b border-paper border-opacity-30 w-full focus:outline-none focus:border-opacity-100 transition-all"
                />
              </div>
            ))}
          </div>

          <div className="max-w-xs mx-auto mb-2">
            <div className="bg-white bg-opacity-10 rounded-sm p-4">
              <label className="font-sans text-xs text-paper uppercase tracking-wide mb-2 block">
                Your Postcode
              </label>
              <input
                type="text"
                placeholder="e.g. LS1 4AB"
                value={quotePostcode}
                onChange={(e) => setQuotePostcode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                className="bg-transparent text-paper text-lg font-mono text-center border-b border-paper border-opacity-30 w-full focus:outline-none focus:border-opacity-100 transition-all placeholder:text-paper placeholder:opacity-40"
              />
            </div>
          </div>

          {quoteErrors.items && (
            <p className="font-sans text-sm text-accent mt-2">{quoteErrors.items}</p>
          )}
          {quoteErrors.postcode && (
            <p className="font-sans text-sm text-accent mt-1">{quoteErrors.postcode}</p>
          )}

          <div className="mt-8">
            <Button
              variant="accent"
              size="lg"
              className="w-full max-w-xs"
              onClick={handleCalculate}
            >
              Calculate My Estimate
            </Button>
          </div>

          {quoteResult && (
            <div className="bg-white bg-opacity-15 rounded-sm p-8 mt-8 text-center">
              <p className="font-sans text-paper text-sm uppercase tracking-wide mb-4">
                Your indicative installed price
              </p>
              <div className="flex items-baseline justify-center gap-4 flex-wrap">
                <span className="font-mono text-5xl text-paper font-medium">
                  {fmt(quoteResult.low)}
                </span>
                <span className="font-sans text-2xl text-paper opacity-70">to</span>
                <span className="font-mono text-5xl text-paper font-medium">
                  {fmt(quoteResult.high)}
                </span>
              </div>
              <p className="font-sans text-paper opacity-60 text-sm mt-4">
                Based on standard installation costs. Your surveyor confirms before any
                work begins.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Button
                  variant="primary"
                  style={{ backgroundColor: 'var(--color-paper)', color: 'var(--color-brand)' }}
                  onClick={() => navigate('/shop')}
                >
                  Get Itemised Quote
                </Button>
                <Button
                  variant="ghost"
                  className="text-paper border border-paper border-opacity-60 hover:border-opacity-100"
                  onClick={() => navigate('/pricing-promise')}
                >
                  Learn How Pricing Works
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS: OLD VS NEW ─────────────────────────────── */}
      <section className="bg-ink py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl text-paper text-center mb-12">
            The old way vs the WDO way
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-white border-opacity-10 p-8">
              <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-6">
                Traditional double glazing
              </p>
              {[
                'Cold call from a canvassing team',
                'Evening appointment — both of you must be home',
                'Inflated price shown first',
                'Manager called for a "special discount"',
                'Pressure to sign on the night',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 py-3 border-b border-white border-opacity-10 last:border-0"
                >
                  <span className="w-5 h-5 flex-shrink-0 bg-accent text-paper text-xs flex items-center justify-center mt-0.5 font-mono">
                    ✕
                  </span>
                  <span className="font-sans text-paper opacity-60">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-brand p-8">
              <p className="font-sans text-xs text-paper opacity-70 uppercase tracking-wide mb-6">
                Windows &amp; Doors Online
              </p>
              {[
                'Browse and see your price online',
                'No appointment until you\'re ready',
                'Honest price shown from the start',
                'No manager. No discount theatre.',
                'No obligation at any stage',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 py-3 border-b border-paper border-opacity-10 last:border-0"
                >
                  <span className="w-5 h-5 flex-shrink-0 bg-paper text-brand text-xs flex items-center justify-center mt-0.5 font-mono font-bold">
                    ✓
                  </span>
                  <span className="font-sans text-paper">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS: THREE STEPS ────────────────────────────── */}
      <section className="bg-paper py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl text-ink text-center mb-4">How it works</h2>
          <p className="font-sans text-ink-muted text-center mb-16 max-w-xl mx-auto">
            Three steps from browsing to a booked survey
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-0">
            {[
              {
                n: '01',
                heading: 'Browse and build your quote',
                body: 'Choose your windows or doors, select your specification, and see your honest indicative price update as you go. No registration. No contact details.',
              },
              {
                n: '02',
                heading: 'Submit your survey request',
                body: 'Tell us your address and confirm your specification. We match you with one vetted local installer within 24 hours.',
              },
              {
                n: '03',
                heading: 'Your installer gets in touch',
                body: 'A surveyor — not a salesperson — visits to confirm measurements. In most standard jobs, the price you saw online is the price you pay.',
              },
            ].map((step, i) => (
              <React.Fragment key={step.n}>
                <div>
                  <span className="font-mono text-6xl text-brand opacity-20 leading-none mb-4 block">
                    {step.n}
                  </span>
                  <h3 className="font-display text-2xl text-ink mb-3">{step.heading}</h3>
                  <p className="font-sans text-ink-muted leading-relaxed max-w-xs">{step.body}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex items-start justify-center pt-10 px-4">
                    <span className="text-hairline text-2xl select-none">→</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES ───────────────────────────────────── */}
      <section className="bg-surface py-12 px-8">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-display text-3xl text-ink">What are you looking for?</h2>
          <p className="font-sans text-ink-muted mt-2 mb-8">Browse by product type</p>

          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
            {[
              {
                name: 'Casement Windows',
                from: '£450',
                image:
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
                to: '/windows/casement-windows',
              },
              {
                name: 'Sash Windows',
                from: '£650',
                image:
                  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600',
                to: '/windows/sash-windows',
              },
              {
                name: 'Composite Doors',
                from: '£1,195',
                image:
                  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
                to: '/doors/composite-doors',
              },
              {
                name: 'French Doors',
                from: '£1,100',
                image:
                  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&q=80&w=600',
                to: '/doors/french-doors',
              },
              {
                name: 'Bi-Fold Doors',
                from: '£2,200',
                image:
                  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600',
                to: '/doors/bi-fold-doors',
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={cat.to}
                className="group relative flex-shrink-0 w-48 md:w-auto overflow-hidden cursor-pointer border border-transparent hover:border-accent transition-colors duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div
                  className="absolute inset-0 flex flex-col justify-end p-4"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(26,26,23,0.85) 0%, rgba(26,26,23,0) 60%)',
                  }}
                >
                  <p className="font-display text-lg text-paper leading-tight">{cat.name}</p>
                  <p className="font-mono text-sm text-paper opacity-80">
                    From {cat.from} installed
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ─────────────────────────────────────── */}
      <section className="bg-brand py-8 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-mono text-3xl text-paper min-h-[2rem] flex items-center justify-center">
                {quoteCount === null ? (
                  <Loading className="inline-flex" />
                ) : (
                  quoteCount.toLocaleString()
                )}
              </p>
              <p className="font-sans text-sm text-paper opacity-70 mt-1">
                Survey requests submitted
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl text-paper">4</p>
              <p className="font-sans text-sm text-paper opacity-70 mt-1">
                Vetted local installers
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl text-paper">£0</p>
              <p className="font-sans text-sm text-paper opacity-70 mt-1">Upfront cost to you</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────────── */}
      <section className="bg-ink py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl text-paper text-center mb-4">
            What our customers say
          </h2>
          <p className="font-sans text-paper opacity-60 text-center mb-12">
            Real homeowners. Real jobs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  'No hard sell, no sitting in my living room for three hours. Just a clear price and a great fitting team.',
                author: 'Sarah T.',
                location: 'Ilkley',
              },
              {
                quote:
                  'I knew exactly what I was paying before anyone came to the house. First time I\'ve not felt pressured buying windows.',
                author: 'James K.',
                location: 'Leeds',
              },
              {
                quote:
                  'The price I saw online was the price I paid. Refreshingly straightforward.',
                author: 'Michelle B.',
                location: 'Harrogate',
              },
            ].map((review) => (
              <div key={review.author} className="bg-brand rounded-sm p-8">
                <span className="font-display text-6xl text-accent leading-none mb-4 block">"</span>
                <p className="font-sans text-paper text-lg leading-relaxed mb-6 italic">
                  {review.quote}
                </p>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-accent inline-block" />
                  ))}
                </div>
                <p className="font-sans text-paper opacity-60 text-sm">
                  {review.author} · {review.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTALLER QUOTES ─────────────────────────────────────── */}
      <section className="bg-surface py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-ink text-center mb-4">
            What our installers say
          </h2>
          <p className="font-sans text-ink-muted text-center mb-12 max-w-xl mx-auto">
            We work with a small group of vetted independent installers. Here is what they think.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote:
                  'The leads that come through are warm. The customer has already seen a price and decided they want to proceed. That changes the whole conversation.',
                name: 'James R.',
                role: 'Independent installer · Leeds',
              },
              {
                quote:
                  'I was spending £200 a week on canvassing leads that went nowhere. This is completely different. The customer chose us.',
                name: 'Mark T.',
                role: 'Window and door specialist · Bradford',
              },
            ].map((q) => (
              <div key={q.name} className="bg-paper border border-hairline p-8">
                <span className="font-display text-5xl text-brand leading-none mb-4 block">"</span>
                <p className="font-sans text-ink text-lg leading-relaxed mb-6 italic">{q.quote}</p>
                <p className="font-display text-base text-ink">{q.name}</p>
                <p className="font-sans text-sm text-ink-muted">{q.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────── */}
      <section className="bg-accent py-16 px-8 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl text-paper mb-4">Ready to see your price?</h2>
          <p className="font-sans text-paper opacity-80 text-lg mb-8 max-w-xl mx-auto">
            No salesperson will call you. No appointment until you are ready. Just an honest
            installed price for your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              style={{ backgroundColor: 'var(--color-paper)', color: 'var(--color-accent)' }}
              onClick={() => navigate('/shop')}
            >
              Browse Products
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-paper border border-paper border-opacity-60 hover:border-opacity-100"
              onClick={() => navigate('/quick-quote')}
            >
              Quick Quote
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}
