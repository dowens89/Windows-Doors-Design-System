import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { SchemaTag } from '../components/SchemaTag'
import { Button } from '../components/ds/Button'
import { Input } from '../components/ds/Input'
import { Alert } from '../components/ds/Alert'
import { useSEO } from '../utils/seo'
import { localBusinessSchema } from '../utils/schema'
import { supabase } from '../lib/supabase'

const UK_POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i

// FIX 7: expanded postcode coverage
const COVERED_POSTCODES = [
  // West Yorkshire
  'LS','BD','WF','HD','HX','HG',
  // South Yorkshire
  'S','DN',
  // East Yorkshire
  'HU','YO',
  // North Yorkshire
  'DL','TS',
  // Lancashire
  'BB','PR','FY','LA','BL',
  // Manchester
  'M','SK','WN','WA','OL',
]

function isCovered(postcode: string): boolean {
  const upper = postcode.trim().toUpperCase().replace(/\s+/g, '')
  return COVERED_POSTCODES.some((code) => upper.startsWith(code))
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
      <section className="flex flex-col md:flex-row min-h-[500px] md:min-h-[500px]">
        {/* Mobile image — appears above content */}
        <div className="block md:hidden w-full h-[280px] overflow-hidden flex-shrink-0">
          <img
            src="https://res.cloudinary.com/dw0wt42ns/image/upload/v1780422068/hero-splash_xnswmo.jpg"
            alt="New windows and doors installed on a detached house"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Left: content */}
        <div className="bg-brand flex flex-col justify-center px-8 py-6 md:px-12 md:py-6 w-full md:w-[55%]">
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

          {/* FIX 2: resized buttons with border and shadow; FIX 2 scroll behaviour on second button */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              variant="primary"
              size="lg"
              className="px-8 border border-paper border-opacity-40 shadow-lg"
              style={{ backgroundColor: 'var(--color-accent)', borderColor: 'rgba(240,237,232,0.4)' }}
              onClick={() => navigate('/shop')}
            >
              Browse Products
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="px-8 text-paper border border-paper border-opacity-40 shadow-lg hover:border-opacity-100"
              onClick={() => {
                document.getElementById('quick-quote-section')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Get a Quick Quote
            </Button>
          </div>
          {/* FIX 1: trust signal icons removed */}
        </div>

        {/* Right: image — desktop only */}
        <div className="hidden md:block w-[45%] overflow-hidden">
          <img
            src="https://res.cloudinary.com/dw0wt42ns/image/upload/v1780422068/hero-splash_xnswmo.jpg"
            alt="New windows and doors installed on a detached house"
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
                  Currently serving West Yorkshire
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
                message="Great news — we cover your area. We serve West Yorkshire, South Yorkshire, East Yorkshire, North Yorkshire, Lancashire and Manchester."
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
                  message="We are not in your area yet but we are expanding. Register your interest and we will let you know when we launch near you."
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
      {/* FIX 3: id added for scroll target */}
      <section id="quick-quote-section" className="bg-brand py-16 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="bg-accent text-paper font-sans text-xs uppercase tracking-wider px-3 py-1 rounded-sm inline-block mb-4">
            Instant Estimate
          </span>

          <h2 className="font-display text-4xl text-paper">How much will your job cost?</h2>

          <p className="font-sans text-paper opacity-70 text-lg mt-3 mb-10 max-w-lg mx-auto">
            No contact details needed. Takes 30 seconds. Price is indicative based on average costs, get your full fixed price by shopping our range!
          </p>

          {/* FIX 6: lifted card container */}
          <div className="bg-paper rounded-sm shadow-xl p-8 md:p-12">
            {/* FIX 4: number inputs clear zero on focus */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Windows', value: windows, set: setWindows, max: 20 },
                { label: 'Doors', value: doors, set: setDoors, max: 10 },
                { label: 'Composite Doors', value: compositeDoors, set: setCompositeDoors, max: 5 },
              ].map(({ label, value, set, max }) => (
                <div key={label} className="bg-surface border border-hairline rounded-sm p-4">
                  <label className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-2 block">
                    {label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={max}
                    value={value}
                    placeholder="0"
                    onChange={(e) => set(Math.max(0, parseInt(e.target.value) || 0))}
                    onFocus={(e) => { if (e.target.value === '0') e.target.value = '' }}
                    onBlur={(e) => { if (e.target.value === '') { e.target.value = '0'; set(0) } }}
                    className="bg-transparent text-ink text-2xl font-mono text-center border-b border-hairline w-full focus:outline-none focus:border-brand transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="max-w-xs mx-auto mb-2">
              <div className="bg-surface border border-hairline rounded-sm p-4">
                <label className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-2 block">
                  Your Postcode
                </label>
                <input
                  type="text"
                  placeholder="e.g. LS1 4AB"
                  value={quotePostcode}
                  onChange={(e) => setQuotePostcode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                  className="bg-transparent text-ink text-lg font-mono text-center border-b border-hairline w-full focus:outline-none focus:border-brand transition-all placeholder:text-ink-muted"
                />
              </div>
            </div>

            {quoteErrors.items && (
              <p className="font-sans text-sm text-accent mt-2">{quoteErrors.items}</p>
            )}
            {quoteErrors.postcode && (
              <p className="font-sans text-sm text-accent mt-1">{quoteErrors.postcode}</p>
            )}

            {/* FIX 5: button label updated */}
            <div className="mt-8">
              <Button
                variant="accent"
                size="lg"
                className="w-full max-w-xs"
                onClick={handleCalculate}
              >
                Calculate My Instant Estimate
              </Button>
            </div>

            {quoteResult && (
              <div className="bg-brand rounded-sm p-8 mt-8 text-center">
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
        </div>
      </section>

      {/* ── HOW IT WORKS: OLD VS NEW ─────────────────────────────── */}
      {/* FIX 8: lighter background */}
      <section className="bg-paper py-16 px-8">
        <div className="max-w-5xl mx-auto">
          {/* FIX 8: heading colour updated */}
          <h2 className="font-display text-4xl text-ink text-center mb-4">
            The old way vs the WDO way
          </h2>

          {/* FIX 9: story copy block */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="font-sans text-ink-muted text-lg mb-4">
              After thirty years in this industry, we have seen every trick in the book. The canvassing calls. The evening appointments. The price that starts at £4,000 and somehow becomes £1,800 after the manager gets involved. If you have ever sat through that experience you will know exactly what we mean.
            </p>
            <p className="font-sans text-ink-muted text-lg mb-4">
              White Gold was a television show. For millions of homeowners it was a Tuesday night.
            </p>
            <p className="font-sans text-ink-muted text-lg mb-4">
              We built Windows &amp; Doors Online because we believe there is a better way. One honest price. One vetted installer. No drama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FIX 8: traditional column uses mid-grey */}
            <div className="bg-gray-100 border border-gray-200 p-8">
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
                  className="flex items-start gap-3 py-3 border-b border-gray-200 last:border-0"
                >
                  <span className="w-5 h-5 flex-shrink-0 bg-accent text-paper text-xs flex items-center justify-center mt-0.5 font-mono">
                    ✕
                  </span>
                  <span className="font-sans text-ink opacity-70">{item}</span>
                </div>
              ))}
            </div>

            {/* FIX 8: WDO column keeps bg-brand */}
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
      <section className="bg-surface py-16 px-8">
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
                  {/* FIX 10: step numbers are text-brand, no opacity */}
                  <span className="font-display text-6xl text-brand leading-none mb-4 block">
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
      {/* FIX 11 + FIX 13 Step 4: product cards, bi-fold replaced by patio */}
      <section className="bg-paper py-12 px-8">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-display text-3xl text-ink">What are you looking for?</h2>
          <p className="font-sans text-ink-muted mt-2 mb-8">Browse by product type</p>

          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
            {[
              {
                name: 'Casement Windows',
                from: '£450',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
                to: '/windows/casement-windows',
              },
              {
                name: 'Sash Windows',
                from: '£650',
                image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600',
                to: '/windows/sash-windows',
              },
              {
                name: 'Composite Doors',
                from: '£1,195',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
                to: '/doors/composite-doors',
              },
              {
                name: 'Patio Doors',
                from: '£950',
                image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600',
                to: '/doors/patio-doors',
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={cat.to}
                className="group flex-shrink-0 w-48 md:w-auto bg-paper border border-hairline rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="bg-paper p-4">
                  <p className="font-display text-lg text-ink leading-tight">{cat.name}</p>
                  <p className="font-mono text-sm text-brand mt-1">From {cat.from} installed</p>
                  <p className="font-sans text-ink-muted text-xs mt-2">View range →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FIX 12: social proof stats bar removed */}

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
