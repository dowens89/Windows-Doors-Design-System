import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Input } from '../components/ds/Input'
import { Button } from '../components/ds/Button'
import { Alert } from '../components/ds/Alert'
import { Loading } from '../components/ds/Loading'
import {
  calculateWindowPrice,
  calculateDoorPrice,
  formatPrice,
  usePricingData,
} from '../pricing'
import type { WindowQuoteInput, DoorQuoteInput } from '../pricing'

export function PricingDebugPage() {
  const navigate = useNavigate()
  const { windows: windowData, doors: doorData, loading, error: pricingError } = usePricingData()

  // ── Window calculator state ──────────────────────────────────────
  const [wWidth, setWWidth] = useState('500')
  const [wHeight, setWHeight] = useState('500')
  const [wOpeners, setWOpeners] = useState('1')
  const [wColour, setWColour] = useState<'white' | 'standard' | 'premium'>('standard')
  const [wResult, setWResult] = useState<ReturnType<typeof calculateWindowPrice> | null>(null)
  const [wError, setWError] = useState<string | null>(null)

  function runWindowCalc() {
    if (!windowData) return
    setWError(null)
    setWResult(null)
    try {
      const input: WindowQuoteInput = {
        widthMm: parseFloat(wWidth) || 0,
        heightMm: parseFloat(wHeight) || 0,
        openers: parseInt(wOpeners, 10) || 0,
        colourType: wColour,
      }
      setWResult(calculateWindowPrice(input, windowData))
    } catch (e) {
      setWError(e instanceof Error ? e.message : String(e))
    }
  }

  // ── Door calculator state ────────────────────────────────────────
  const [dSku, setDSku] = useState('CD-08')
  const [dLarge, setDLarge] = useState(false)
  const [dPremium, setDPremium] = useState(false)
  const [dSideLight, setDSideLight] = useState(false)
  const [dResult, setDResult] = useState<ReturnType<typeof calculateDoorPrice> | null>(null)
  const [dError, setDError] = useState<string | null>(null)

  function runDoorCalc() {
    if (!doorData) return
    setDError(null)
    setDResult(null)
    try {
      const input: DoorQuoteInput = {
        skuId: dSku.trim(),
        isLargeDoor: dLarge,
        premiumColour: dPremium,
        sideLight: dSideLight,
        autoLock: false,
        letterbox: false,
        knocker: false,
        topLight: false,
      }
      setDResult(calculateDoorPrice(input, doorData))
    } catch (e) {
      setDError(e instanceof Error ? e.message : String(e))
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <Loading />
        </div>
      </Layout>
    )
  }

  if (pricingError || !windowData || !doorData) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
          <Alert variant="warning" message={pricingError ?? 'Pricing data unavailable'} />
        </div>
      </Layout>
    )
  }

  const bandEntries = Object.entries(windowData.bands)
    .map(([k, v]) => ({ band: parseInt(k, 10), price: v }))
    .sort((a, b) => a.band - b.band)

  const allSkus = doorData.catalogue.flatMap((r) =>
    r.variants.map((v) => ({ skuId: v.skuId, label: `${r.rangeName} — ${v.variantType}` }))
  )

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12 space-y-20">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl text-ink mb-2">Pricing Debug</h1>
            <p className="font-sans text-sm text-ink-muted">
              Development tool. Remove this route before launch.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/pricing-admin')}>
            Maintain Prices
          </Button>
        </div>

        {/* ── Section 1: Window Band Table ─────────────────────────── */}
        <section>
          <h2 className="font-display text-2xl text-ink mb-6">Window Price Bands</h2>
          <div className="border border-hairline overflow-hidden">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="bg-surface border-b border-hairline">
                  <th className="text-left px-4 py-3 text-ink-muted font-semibold uppercase tracking-widest text-xs">
                    Combined mm
                  </th>
                  <th className="text-right px-4 py-3 text-ink-muted font-semibold uppercase tracking-widest text-xs">
                    Selling Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {bandEntries.map(({ band, price }, i) => (
                  <tr
                    key={band}
                    className={`border-b border-hairline last:border-0 ${
                      i % 2 === 0 ? 'bg-paper' : 'bg-surface'
                    }`}
                  >
                    <td className="px-4 py-2.5 text-ink">{band}mm</td>
                    <td className="px-4 py-2.5 text-ink text-right font-mono">
                      {formatPrice(price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 2: Window Calculator ─────────────────────────── */}
        <section>
          <h2 className="font-display text-2xl text-ink mb-6">Window Price Calculator</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <Input
              label="Width (mm)"
              type="number"
              value={wWidth}
              onChange={(e) => setWWidth(e.target.value)}
            />
            <Input
              label="Height (mm)"
              type="number"
              value={wHeight}
              onChange={(e) => setWHeight(e.target.value)}
            />
            <Input
              label="Openers"
              type="number"
              value={wOpeners}
              onChange={(e) => setWOpeners(e.target.value)}
            />
            <div>
              <label className="block font-sans text-sm font-medium text-ink mb-1.5">
                Colour type
              </label>
              <select
                value={wColour}
                onChange={(e) =>
                  setWColour(e.target.value as 'white' | 'standard' | 'premium')
                }
                className="w-full border border-hairline bg-paper font-sans text-sm text-ink px-3 py-2 rounded focus:outline-none focus:border-brand"
              >
                <option value="white">White (0%)</option>
                <option value="standard">Standard (20%)</option>
                <option value="premium">Premium (30%)</option>
              </select>
            </div>
          </div>

          <Button variant="primary" onClick={runWindowCalc}>
            Calculate
          </Button>

          {wError && (
            <div className="mt-4">
              <Alert variant="warning" message={wError} />
            </div>
          )}

          {wResult && (
            <div className="mt-6 border border-hairline bg-surface p-5 font-mono text-sm space-y-1">
              <p>
                <span className="text-ink-muted">Combined mm:</span>{' '}
                <span className="text-ink">{wResult.combinedMm}mm</span>
              </p>
              <p>
                <span className="text-ink-muted">Band:</span>{' '}
                <span className="text-ink">{wResult.band}mm</span>
              </p>
              <p>
                <span className="text-ink-muted">Base price:</span>{' '}
                <span className="text-ink">{formatPrice(wResult.basePrice)}</span>
              </p>
              {wResult.addons.map((a, i) => (
                <p key={i}>
                  <span className="text-ink-muted">+ {a.label}:</span>{' '}
                  <span className="text-ink">{formatPrice(a.amount)}</span>
                </p>
              ))}
              <p>
                <span className="text-ink-muted">Subtotal:</span>{' '}
                <span className="text-ink">{formatPrice(wResult.subtotal)}</span>
              </p>
              <p>
                <span className="text-ink-muted">
                  Colour uplift ({(wResult.colourUpliftPct * 100).toFixed(0)}%):
                </span>{' '}
                <span className="text-ink">{formatPrice(wResult.colourUpliftAmount)}</span>
              </p>
              <p className="pt-2 border-t border-hairline font-semibold">
                <span className="text-ink-muted">Total (exact):</span>{' '}
                <span className="text-ink">{formatPrice(wResult.totalPrice)}</span>
              </p>
              <p>
                <span className="text-ink-muted">Total (rounded):</span>{' '}
                <span className="text-ink">{formatPrice(wResult.totalPriceRounded)}</span>
              </p>
            </div>
          )}
        </section>

        {/* ── Section 3: Door Calculator ───────────────────────────── */}
        <section>
          <h2 className="font-display text-2xl text-ink mb-6">Door Price Calculator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-sans text-sm font-medium text-ink mb-1.5">
                SKU
              </label>
              <select
                value={dSku}
                onChange={(e) => setDSku(e.target.value)}
                className="w-full border border-hairline bg-paper font-sans text-sm text-ink px-3 py-2 rounded focus:outline-none focus:border-brand"
              >
                {allSkus.map(({ skuId, label }) => (
                  <option key={skuId} value={skuId}>
                    {skuId} — {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-3 justify-end pb-0.5">
              <label className="flex items-center gap-2 font-sans text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={dLarge}
                  onChange={(e) => setDLarge(e.target.checked)}
                  className="accent-brand"
                />
                Large door (+10% uplift)
              </label>
              <label className="flex items-center gap-2 font-sans text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={dPremium}
                  onChange={(e) => setDPremium(e.target.checked)}
                  className="accent-brand"
                />
                Premium colour (+£50)
              </label>
              <label className="flex items-center gap-2 font-sans text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={dSideLight}
                  onChange={(e) => setDSideLight(e.target.checked)}
                  className="accent-brand"
                />
                Side light (+£100)
              </label>
            </div>
          </div>

          <Button variant="primary" onClick={runDoorCalc}>
            Calculate
          </Button>

          {dError && (
            <div className="mt-4">
              <Alert variant="warning" message={dError} />
            </div>
          )}

          {dResult && (
            <div className="mt-6 border border-hairline bg-surface p-5 font-mono text-sm space-y-1">
              <p>
                <span className="text-ink-muted">SKU:</span>{' '}
                <span className="text-ink">{dResult.skuId}</span>
              </p>
              <p>
                <span className="text-ink-muted">Range:</span>{' '}
                <span className="text-ink">{dResult.rangeName}</span>
              </p>
              <p>
                <span className="text-ink-muted">Variant:</span>{' '}
                <span className="text-ink">{dResult.variantType}</span>
              </p>
              <p>
                <span className="text-ink-muted">Base price:</span>{' '}
                <span className="text-ink">{formatPrice(dResult.basePrice)}</span>
              </p>
              {dResult.addons.map((a, i) => (
                <p key={i}>
                  <span className="text-ink-muted">+ {a.label}:</span>{' '}
                  <span className="text-ink">{formatPrice(a.amount)}</span>
                </p>
              ))}
              <p>
                <span className="text-ink-muted">Subtotal:</span>{' '}
                <span className="text-ink">{formatPrice(dResult.subtotal)}</span>
              </p>
              {dResult.largeDoorUpliftAmount > 0 && (
                <p>
                  <span className="text-ink-muted">Large door uplift (+10%):</span>{' '}
                  <span className="text-ink">
                    {formatPrice(dResult.largeDoorUpliftAmount)}
                  </span>
                </p>
              )}
              <p className="pt-2 border-t border-hairline font-semibold">
                <span className="text-ink-muted">Total (rounded):</span>{' '}
                <span className="text-ink">{formatPrice(dResult.totalPriceRounded)}</span>
              </p>
            </div>
          )}
        </section>

        {/* ── Section 4: Full Door Catalogue ───────────────────────── */}
        <section>
          <h2 className="font-display text-2xl text-ink mb-6">Full Door Catalogue</h2>
          <div className="border border-hairline overflow-hidden">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="bg-surface border-b border-hairline">
                  <th className="text-left px-4 py-3 text-ink-muted font-semibold uppercase tracking-widest text-xs">
                    SKU
                  </th>
                  <th className="text-left px-4 py-3 text-ink-muted font-semibold uppercase tracking-widest text-xs">
                    Range
                  </th>
                  <th className="text-left px-4 py-3 text-ink-muted font-semibold uppercase tracking-widest text-xs">
                    Variant
                  </th>
                  <th className="text-right px-4 py-3 text-ink-muted font-semibold uppercase tracking-widest text-xs">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {doorData.catalogue.flatMap((range, ri) =>
                  range.variants.map((v, vi) => (
                    <tr
                      key={v.skuId}
                      className={`border-b border-hairline last:border-0 ${
                        (ri + vi) % 2 === 0 ? 'bg-paper' : 'bg-surface'
                      }`}
                    >
                      <td className="px-4 py-2 text-ink font-mono">{v.skuId}</td>
                      <td className="px-4 py-2 text-ink">{range.rangeName}</td>
                      <td className="px-4 py-2 text-ink-muted">{v.variantType}</td>
                      <td className="px-4 py-2 text-ink text-right font-mono">
                        {formatPrice(v.sellingPrice)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  )
}
