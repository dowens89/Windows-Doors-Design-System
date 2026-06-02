import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Lock, BadgeCheck } from 'lucide-react'
import { Layout } from '../components/Layout'
import { SchemaTag } from '../components/SchemaTag'
import { Hero } from '../components/ds/Hero'
import { Button } from '../components/ds/Button'
import { Input } from '../components/ds/Input'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { TrustSignal } from '../components/ds/TrustSignal'
import { ReviewCard } from '../components/ds/ReviewCard'
import { useSEO } from '../utils/seo'
import { localBusinessSchema } from '../utils/schema'

const UK_POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i

interface QuoteResult {
  low: number
  high: number
}

export function HomePage() {
  useSEO({
    title: 'Windows & Doors Online | Installed Prices in West Yorkshire',
    description:
      'Browse windows and doors with honest installed prices for West Yorkshire. See your price online before anyone visits your home. No salesperson. No pressure.',
  })

  const navigate = useNavigate()

  const [windows, setWindows] = useState(0)
  const [doors, setDoors] = useState(0)
  const [compositeDoors, setCompositeDoors] = useState(0)
  const [postcode, setPostcode] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuoteResult | null>(null)

  function handleCalculate() {
    const newErrors: Record<string, string> = {}
    if (windows === 0 && doors === 0 && compositeDoors === 0) {
      newErrors.windows = 'Enter at least one item'
    }
    if (!UK_POSTCODE_RE.test(postcode)) {
      newErrors.postcode = 'Enter a valid West Yorkshire postcode'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const total = windows * 600 + doors * 750 + compositeDoors * 1195
    const low = Math.round((total * 0.8) / 50) * 50
    const high = Math.round((total * 1.25) / 50) * 50
    setResult({ low, high })
  }

  return (
    <Layout>
      <SchemaTag schema={localBusinessSchema()} />

      {/* Hero */}
      <Hero />

      {/* Quick Quote */}
      <section className="bg-surface border-t border-b border-hairline py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-2">
            How much will your job cost?
          </h2>
          <p className="font-sans text-ink-muted mb-10">
            Enter your requirements for an instant indicative price. No contact details needed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <Input
              label="Windows"
              type="number"
              min={0}
              max={20}
              value={windows}
              onChange={(e) => setWindows(Math.max(0, parseInt(e.target.value) || 0))}
              error={errors.windows}
            />
            <Input
              label="uPVC or French Doors"
              type="number"
              min={0}
              max={10}
              value={doors}
              onChange={(e) => setDoors(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <Input
              label="Composite Doors"
              type="number"
              min={0}
              max={5}
              value={compositeDoors}
              onChange={(e) => setCompositeDoors(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>

          <div className="max-w-xs mb-8">
            <Input
              label="Your Postcode"
              placeholder="e.g. LS1 4AB"
              helperText="We currently serve West Yorkshire"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              error={errors.postcode}
            />
          </div>

          <Button variant="primary" onClick={handleCalculate}>
            Calculate Estimate
          </Button>

          {result && (
            <div className="mt-10 pt-10 border-t border-hairline">
              <div className="flex items-baseline gap-4 flex-wrap">
                <PriceDisplay price={result.low} size="large" assuranceText="" />
                <span className="font-sans text-2xl text-ink-muted">to</span>
                <PriceDisplay price={result.high} size="large" assuranceText="" />
              </div>
              <p className="font-sans text-sm text-ink-muted mt-3 mb-8">
                Indicative installed price for West Yorkshire. Based on standard conditions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" onClick={() => navigate('/shop')}>
                  Get your itemised quote
                </Button>
                <Button variant="secondary" onClick={() => navigate('/how-it-works')}>
                  See how it works
                </Button>
              </div>
              <p className="font-sans text-sm text-ink-muted mt-4">
                Prices are indicative. A free survey confirms your final price.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-paper">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-16">How it works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
            {[
              {
                n: '01',
                heading: 'Browse and build',
                body: 'Select your windows or doors, choose your options, and see your indicative installed price update in real time. No registration. No contact details. Just a price.',
              },
              {
                n: '02',
                heading: 'Submit your survey request',
                body: 'Tell us your address and confirm your specification. Upload a photo if you have one. No payment is taken at any stage.',
              },
              {
                n: '03',
                heading: 'Your installer gets in touch',
                body: 'We match you with one vetted local installer. They contact you within 48 hours to arrange a free survey and confirm your price.',
              },
            ].map((step) => (
              <div key={step.n}>
                <span className="font-mono text-2xl text-brand block mb-4">{step.n}</span>
                <h3 className="font-display text-xl text-ink mb-3">{step.heading}</h3>
                <p className="font-sans text-base text-ink-muted leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-8 pt-12 border-t border-hairline">
            <TrustSignal
              icon={ShieldCheck}
              text="One installer per lead. Not a list of companies competing for your number."
            />
            <TrustSignal
              icon={Lock}
              text="Price shown upfront. You see an honest price before anyone visits your home."
            />
            <TrustSignal
              icon={BadgeCheck}
              text="No win, no fee. Your installer only pays us when your job completes."
            />
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="bg-surface border-t border-hairline py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-10">Browse by category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CategoryCard
              heading="Windows"
              price={450}
              to="/shop?category=windows"
              imageUrl="https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800"
            />
            <CategoryCard
              heading="Doors"
              price={695}
              to="/shop?category=doors"
              imageUrl="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&q=80&w=800"
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 md:py-24 bg-paper border-t border-hairline">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-12">
            What our customers say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReviewCard
              quote="No hard sell, no sitting in my living room for three hours. Just a clear price and a great fitting team."
              author="Sarah T."
              location="Ilkley"
              rating={5}
            />
            <ReviewCard
              quote="I knew exactly what I was paying before anyone came to the house. First time I've not felt pressured buying windows."
              author="James K."
              location="Leeds"
              rating={5}
            />
            <ReviewCard
              quote="The price I saw online was the price I paid. Refreshingly straightforward."
              author="Michelle B."
              location="Harrogate"
              rating={5}
            />
          </div>
          <p className="font-sans text-sm text-ink-muted mt-8">Reviews collected via Google</p>
        </div>
      </section>
    </Layout>
  )
}

function CategoryCard({
  heading,
  price,
  to,
  imageUrl,
}: {
  heading: string
  price: number
  to: string
  imageUrl: string
}) {
  return (
    <div className="bg-surface border border-hairline overflow-hidden">
      <div className="aspect-[16/7] overflow-hidden bg-hairline">
        <img src={imageUrl} alt={heading} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-ink mb-1">{heading}</h3>
          <PriceDisplay price={price} size="inline" isFrom assuranceText="" />
        </div>
        <Link to={to}>
          <Button variant="secondary" size="sm">
            Browse {heading}
          </Button>
        </Link>
      </div>
    </div>
  )
}
