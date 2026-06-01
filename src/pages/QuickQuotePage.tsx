import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { Input } from '../components/ds/Input'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { Alert } from '../components/ds/Alert'
import { useSEO } from '../utils/seo'

const UK_POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i

interface QuoteResult {
  windows: number
  doors: number
  compositeDoors: number
  lowWindows: number
  highWindows: number
  lowDoors: number
  highDoors: number
  lowComposite: number
  highComposite: number
  totalLow: number
  totalHigh: number
}

export function QuickQuotePage() {
  useSEO({
    title: 'Quick Price Estimate | Windows & Doors West Yorkshire | WDO',
    description:
      'Get an instant indicative price for your windows and doors in West Yorkshire. Three inputs. No contact details needed.',
  })

  const navigate = useNavigate()

  const [windows, setWindows] = useState(0)
  const [doors, setDoors] = useState(0)
  const [compositeDoors, setCompositeDoors] = useState(0)
  const [postcode, setPostcode] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuoteResult | null>(null)

  function calc() {
    const newErrors: Record<string, string> = {}
    if (windows === 0 && doors === 0 && compositeDoors === 0) {
      newErrors.windows = 'Enter at least one item'
    }
    if (!UK_POSTCODE_RE.test(postcode)) {
      newErrors.postcode = 'Enter a valid West Yorkshire postcode'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    function range(mid: number) {
      return {
        low: Math.round((mid * 0.8) / 50) * 50,
        high: Math.round((mid * 1.25) / 50) * 50,
      }
    }

    const w = range(windows * 600)
    const d = range(doors * 750)
    const c = range(compositeDoors * 1250)
    const totalMid = windows * 600 + doors * 750 + compositeDoors * 1250
    const t = range(totalMid)

    setResult({
      windows,
      doors,
      compositeDoors,
      lowWindows: w.low,
      highWindows: w.high,
      lowDoors: d.low,
      highDoors: d.high,
      lowComposite: c.low,
      highComposite: c.high,
      totalLow: t.low,
      totalHigh: t.high,
    })
  }

  return (
    <Layout>
      <div className="max-w-[720px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">
          Get an instant price estimate
        </h1>
        <p className="font-sans text-ink-muted mb-12">
          No contact details needed. Just tell us roughly what you need.
        </p>

        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
          <div className="max-w-xs">
            <Input
              label="Your Postcode"
              placeholder="e.g. LS1 4AB"
              helperText="We currently serve West Yorkshire"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              error={errors.postcode}
            />
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={calc}>
          Calculate Estimate
        </Button>

        {result && (
          <div className="mt-12 border-t border-hairline pt-12 space-y-6">
            {/* Breakdown */}
            <div className="space-y-4">
              {result.windows > 0 && (
                <ResultRow
                  label={`${result.windows} window${result.windows !== 1 ? 's' : ''}`}
                  low={result.lowWindows}
                  high={result.highWindows}
                />
              )}
              {result.doors > 0 && (
                <ResultRow
                  label={`${result.doors} uPVC / French door${result.doors !== 1 ? 's' : ''}`}
                  low={result.lowDoors}
                  high={result.highDoors}
                />
              )}
              {result.compositeDoors > 0 && (
                <ResultRow
                  label={`${result.compositeDoors} composite door${result.compositeDoors !== 1 ? 's' : ''}`}
                  low={result.lowComposite}
                  high={result.highComposite}
                />
              )}
            </div>

            <div className="border-t border-hairline pt-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
                Total indicative range
              </p>
              <div className="flex items-baseline gap-4 flex-wrap">
                <PriceDisplay price={result.totalLow} size="large" assuranceText="" />
                <span className="font-sans text-2xl text-ink-muted">to</span>
                <PriceDisplay price={result.totalHigh} size="large" assuranceText="" />
              </div>
            </div>

            <Alert
              variant="info"
              message="This is an indicative range based on standard West Yorkshire installation. Your itemised quote shows the exact specification and price for each product."
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button variant="primary" size="lg" onClick={() => navigate('/shop')}>
                Build your itemised quote
              </Button>
              <Button variant="secondary" onClick={() => navigate('/pricing-promise')}>
                Learn how our pricing works
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

function ResultRow({ label, low, high }: { label: string; low: number; high: number }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-hairline">
      <span className="font-sans text-base text-ink">{label}</span>
      <div className="flex items-baseline gap-2">
        <PriceDisplay price={low} size="inline" assuranceText="" />
        <span className="font-sans text-sm text-ink-muted">–</span>
        <PriceDisplay price={high} size="inline" assuranceText="" />
      </div>
    </div>
  )
}
