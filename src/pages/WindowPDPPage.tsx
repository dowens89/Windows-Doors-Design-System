import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Info, ChevronRight } from 'lucide-react'
import { Button } from '../components/ds/Button'
import { Input } from '../components/ds/Input'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { Alert } from '../components/ds/Alert'
import { Badge } from '../components/ds/Badge'
import { Loading } from '../components/ds/Loading'
import {
  calculateWindowPrice,
  usePricingData,
  formatPrice,
} from '../pricing'
import type { WindowQuoteInput, WindowQuoteResult } from '../pricing'
import { useBasketStore } from '../store/basketStore'
import { useSEO } from '../utils/seo'
import { WindowDiagram } from '../components/WindowDiagram'

// ─── Local interfaces ─────────────────────────────────────────────────────────

interface ColourSelection {
  name: string
  hex: string
  upliftType: 'white' | 'standard' | 'premium'
}

interface GlassSelection {
  category: 'clear' | 'satin' | 'patterned'
  variant: string
  privacyLevel: number
  priceModifier: number
}

interface BarSelection {
  type: 'none' | 'georgian' | 'vertical' | 'diamond_lead' | 'square_lead'
  priceModifier: number
}

interface HandleSelection {
  name: string
  hex: string
  priceModifier: number
}

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: 'Size' },
  { number: 2, label: 'Openers' },
  { number: 3, label: 'Colour' },
  { number: 4, label: 'Glass' },
  { number: 5, label: 'Handle' },
  { number: 6, label: 'Review' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function WindowPDPPage() {
  // ── Navigation & store ──────────────────────────────────────────────────────
  const navigate = useNavigate()
  const { addItem } = useBasketStore()

  // ── Pricing data ────────────────────────────────────────────────────────────
  const { windows: windowData, loading: pricingLoading, error: pricingError } = usePricingData()

  // ── Step ────────────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState<number>(1)

  // ── Size ────────────────────────────────────────────────────────────────────
  const [widthMm, setWidthMm] = useState<number | null>(null)
  const [heightMm, setHeightMm] = useState<number | null>(null)
  const [widthCustom, setWidthCustom] = useState<boolean>(false)
  const [heightCustom, setHeightCustom] = useState<boolean>(false)

  // ── Openers ─────────────────────────────────────────────────────────────────
  const [openerCount, setOpenerCount] = useState<0 | 1 | 2 | 3 | null>(null)

  // ── Colour ──────────────────────────────────────────────────────────────────
  const [externalColour, setExternalColour] = useState<ColourSelection | null>(null)

  // ── Glass ───────────────────────────────────────────────────────────────────
  const [glassSelection, setGlassSelection] = useState<GlassSelection | null>(null)

  // ── Bars ────────────────────────────────────────────────────────────────────
  const [barSelection, setBarSelection] = useState<BarSelection>({
    type: 'none',
    priceModifier: 0,
  })

  // ── Handle ──────────────────────────────────────────────────────────────────
  const [handleColour, setHandleColour] = useState<HandleSelection | null>(null)

  // ── Product reference ───────────────────────────────────────────────────────
  const [productReference, setProductReference] = useState<string>('')

  // ── Price calculation results ───────────────────────────────────────────────
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)
  const [priceBreakdown, setPriceBreakdown] = useState<WindowQuoteResult | null>(null)
  const [bandBasePrice, setBandBasePrice] = useState<number | null>(null)
  const [priceError, setPriceError] = useState<boolean>(false)

  // ── Basket success ──────────────────────────────────────────────────────────
  const [addedToBasket, setAddedToBasket] = useState<boolean>(false)

  // ── Architecture refs: consumed by Pass 2 / Pass 3 step panels ─────────────
  // (state setters and imports wired to UI in subsequent passes)
  void [
    useCallback, Info, Input, Badge, Loading, formatPrice,
    navigate, addItem, pricingError,
    setWidthMm, setHeightMm, widthCustom, setWidthCustom,
    heightCustom, setHeightCustom, setOpenerCount, setExternalColour,
    setGlassSelection, setBarSelection, setHandleColour,
    productReference, setProductReference, priceBreakdown,
    bandBasePrice, addedToBasket, setAddedToBasket,
  ]

  // ── SEO ─────────────────────────────────────────────────────────────────────
  useSEO({
    title: 'uPVC Casement Windows — Installed Prices | WDO',
    description:
      'Configure your uPVC casement window and see an honest installed price in real time. No salesperson. Surveyor confirms before manufacture.',
  })

  // ── Price calculation effect ─────────────────────────────────────────────────
  useEffect(() => {
    if (!widthMm || !heightMm || !windowData) {
      setCalculatedPrice(null)
      setPriceBreakdown(null)
      setBandBasePrice(null)
      return
    }

    try {
      const input: WindowQuoteInput = {
        widthMm,
        heightMm,
        openers: openerCount ?? 0,
        colourType: externalColour?.upliftType ?? 'white',
      }

      const result = calculateWindowPrice(input, windowData)

      setPriceBreakdown(result)
      setBandBasePrice(result.basePrice)

      // Glass and bar modifiers applied before colour uplift percentage
      const flatModifiers =
        (glassSelection?.priceModifier ?? 0) +
        (barSelection?.priceModifier ?? 0) +
        25 // 180mm cill always included

      const subtotalWithExtras = result.subtotal + flatModifiers

      const colourUplift = subtotalWithExtras * result.colourUpliftPct

      const totalExVAT = Math.round(subtotalWithExtras + colourUplift)

      const totalIncVAT = Math.round(totalExVAT * 1.2)

      setCalculatedPrice(totalIncVAT)
      setPriceError(false)
    } catch {
      setCalculatedPrice(null)
      setPriceBreakdown(null)
      setBandBasePrice(null)
      setPriceError(true)
    }
  }, [widthMm, heightMm, openerCount, externalColour, glassSelection, barSelection, windowData])

  // ── SVG diagram props ────────────────────────────────────────────────────────
  const diagramVariant: 'fixed' | 'single-right' | 'two-both' | 'three-all' = (() => {
    if (!openerCount) return 'fixed'
    if (openerCount === 1) return 'single-right'
    if (openerCount === 2) return 'two-both'
    return 'three-all'
  })()

  const diagramFrameColour = externalColour?.hex ?? '#E8E8E8'

  const diagramGlazingStyle =
    glassSelection && glassSelection.category !== 'clear' ? 'frosted' : 'clear'

  const diagramBarStyle = barSelection?.type ?? 'none'

  // ── Step helpers ─────────────────────────────────────────────────────────────
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return !!(widthMm && heightMm)
      case 2: return openerCount !== null
      case 3: return externalColour !== null
      case 4: return glassSelection !== null
      case 5: return handleColour !== null
      case 6: return false
      default: return false
    }
  }

  const stepSummary = (step: number): string => {
    switch (step) {
      case 1: {
        if (!widthMm || !heightMm) return ''
        return `${widthMm}mm × ${heightMm}mm`
      }
      case 2: {
        if (openerCount === null) return ''
        if (openerCount === 0) return 'Fixed — no opener'
        return `${openerCount} opening light${openerCount > 1 ? 's' : ''}`
      }
      case 3: {
        if (!externalColour) return ''
        const upliftLabel =
          externalColour.upliftType === 'white'
            ? 'Included'
            : externalColour.upliftType === 'standard'
            ? '+20%'
            : '+30%'
        return `${externalColour.name} — ${upliftLabel}`
      }
      case 4: {
        if (!glassSelection) return ''
        const barLabel =
          barSelection.type !== 'none'
            ? ` + ${barSelection.type.replace('_', ' ')}`
            : ''
        if (glassSelection.category === 'clear') return 'Clear glass'
        return `${glassSelection.variant} — Privacy Level ${glassSelection.privacyLevel}${barLabel}`
      }
      case 5: {
        if (!handleColour) return ''
        return `${handleColour.name} handle`
      }
      default:
        return ''
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-paper">

      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-paper border-b border-hairline py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">

          {/* Left — breadcrumb */}
          <div className="hidden md:flex items-center gap-1 text-xs text-ink-muted font-sans uppercase tracking-wide flex-shrink-0">
            <span>Windows</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink font-medium">Casement</span>
          </div>

          {/* Centre — step progress dots */}
          <div className="flex items-center gap-0 flex-1 justify-center max-w-sm mx-auto">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.number}>
                {index > 0 && (
                  <div
                    className={`h-px w-6 flex-shrink-0 ${
                      currentStep > step.number - 1 ? 'bg-brand' : 'bg-hairline'
                    }`}
                  />
                )}
                <button
                  onClick={() => {
                    if (isStepComplete(step.number - 1) || step.number <= currentStep) {
                      setCurrentStep(step.number)
                    }
                  }}
                  className="flex flex-col items-center gap-1 flex-shrink-0"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-200 ${
                      currentStep === step.number
                        ? 'bg-brand text-paper'
                        : isStepComplete(step.number)
                        ? 'bg-brand opacity-60 text-paper'
                        : 'bg-surface border border-hairline text-ink-muted'
                    }`}
                  >
                    {isStepComplete(step.number) && currentStep !== step.number ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="hidden md:block text-xs font-sans text-ink-muted leading-none">
                    {step.label}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Right — price display */}
          <div className="flex flex-col items-end flex-shrink-0 min-w-[100px]">
            {pricingLoading ? (
              <div className="text-xs text-ink-muted font-sans">Loading...</div>
            ) : calculatedPrice ? (
              <>
                <div className="text-xs text-ink-muted font-sans uppercase tracking-wide mb-0.5">
                  Est. installed price
                </div>
                <PriceDisplay price={calculatedPrice} size="inline" />
                <div className="text-xs text-ink-muted font-sans italic mt-0.5">
                  Inc. VAT · indicative
                </div>
              </>
            ) : widthMm && heightMm ? (
              <div className="text-xs text-ink-muted font-sans italic">Calculating...</div>
            ) : (
              <div className="text-xs text-ink-muted font-sans italic">Enter size for price</div>
            )}
          </div>

        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 items-start">

          {/* ── Left column — SVG and trust ────────────────────────────────── */}
          <div className="md:sticky md:top-24 space-y-6">

            {/* SVG preview */}
            <div className="bg-surface border border-hairline rounded-sm p-6 flex flex-col items-center gap-4">
              <WindowDiagram
                variant={diagramVariant}
                frameColour={diagramFrameColour}
                glazingStyle={diagramGlazingStyle}
                glazingBarStyle={diagramBarStyle}
                width={200}
                height={220}
              />

              {openerCount !== null && openerCount > 0 && (
                <p className="text-xs text-ink-muted font-sans italic text-center max-w-[200px]">
                  All openers shown as side-hung as standard. If you&apos;d prefer top-hung or a
                  specific configuration, just mention it to your surveyor — it won&apos;t affect
                  your price.
                </p>
              )}
            </div>

            {/* Price error */}
            {priceError && (
              <Alert
                variant="warning"
                message="These dimensions need a custom quote. Please contact us at hello@buywindowsanddoors.co.uk"
              />
            )}

            {/* Trust badges */}
            <div className="border border-hairline rounded-sm divide-y divide-hairline">
              {[
                'FENSA Registered Installers',
                'Tri-Stay Hinges as Standard',
                'Insurance Backed Guarantee',
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 px-4 py-3">
                  <Check className="w-4 h-4 text-brand flex-shrink-0" />
                  <span className="font-sans text-sm text-ink">{text}</span>
                </div>
              ))}
            </div>

          </div>

          {/* ── Right column — step panels ─────────────────────────────────── */}
          <div className="space-y-0">

            {/* Completed steps summary rows */}
            {STEPS.filter((s) => s.number < currentStep).map((step) => (
              <div
                key={step.number}
                className="flex justify-between items-center py-3 border-b border-hairline"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-brand uppercase tracking-wide w-16 flex-shrink-0">
                    Step {String(step.number).padStart(2, '0')}
                  </span>
                  <span className="font-sans text-sm text-ink">{stepSummary(step.number)}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(step.number)}>
                  Edit
                </Button>
              </div>
            ))}

            {/* Active step panel */}
            <div className="pt-6">
              {/* Step panels will be added in Pass 2 and Pass 3 */}
              <div className="bg-surface border border-hairline rounded-sm p-8 flex items-center justify-center">
                <p className="font-sans text-sm text-ink-muted">
                  Step {currentStep} panel — coming in Pass 2
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Zone 2 placeholder ─────────────────────────────────────────────── */}
      <div className="border-t border-hairline bg-surface py-8 px-8 text-center">
        <p className="font-sans text-sm text-ink-muted">
          Product details section — coming in Pass 4
        </p>
      </div>

    </div>
  )
}
