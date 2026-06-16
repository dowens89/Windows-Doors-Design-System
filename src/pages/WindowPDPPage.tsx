import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Info, ChevronRight, Ruler, Wind, Palette, Layers, Grip, ClipboardList } from 'lucide-react'
import { Button } from '../components/ds/Button'
import { Input } from '../components/ds/Input'
import { Alert } from '../components/ds/Alert'
import {
  calculateWindowPrice,
  usePricingData,
  formatPrice,
} from '../pricing'
import type { WindowQuoteInput, WindowQuoteResult } from '../pricing'
import { useBasketStore } from '../store/basketStore'
import { useSEO } from '../utils/seo'
import { Layout } from '../components/Layout'
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

// ─── Static data ──────────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: 'Size' },
  { number: 2, label: 'Openers' },
  { number: 3, label: 'Colour' },
  { number: 4, label: 'Glass' },
  { number: 5, label: 'Handle' },
  { number: 6, label: 'Review' },
]

const STEP_CONFIG = [
  { number: 1, Icon: Ruler,         tooltip: 'Dimensions' },
  { number: 2, Icon: Wind,          tooltip: 'Opening lights' },
  { number: 3, Icon: Palette,       tooltip: 'Colour' },
  { number: 4, Icon: Layers,        tooltip: 'Glass' },
  { number: 5, Icon: Grip,          tooltip: 'Handle' },
  { number: 6, Icon: ClipboardList, tooltip: 'Review & add' },
]

const WIDTH_PRESETS = [500, 600, 700, 800, 900, 1000, 1100, 1200]
const HEIGHT_PRESETS = [500, 600, 700, 800, 900, 1000, 1100, 1200, 1400]

const COLOURS = {
  white: [
    { name: 'White', hex: '#F0EDE8', border: '#CCCCCC', upliftType: 'white' as const },
    { name: 'Cream', hex: '#F5F0E0', border: '#CCCCCC', upliftType: 'white' as const },
  ],
  standard: [
    { name: 'Anthracite Grey', hex: '#3D3D3D', upliftType: 'standard' as const },
    { name: 'Black', hex: '#1C1C1C', upliftType: 'standard' as const },
    { name: 'Chartwell Green', hex: '#6B8F71', upliftType: 'standard' as const },
    { name: 'Irish Oak', hex: '#8B5E3C', upliftType: 'standard' as const },
    { name: 'Rosewood', hex: '#6B2D2D', upliftType: 'standard' as const },
    { name: 'Golden Oak', hex: '#C4841D', upliftType: 'standard' as const },
  ],
  premium: [
    { name: 'Slate Grey', hex: '#6B7280', upliftType: 'premium' as const },
    { name: 'Agate Grey', hex: '#8E9BA3', upliftType: 'premium' as const },
    { name: 'Pebble Grey', hex: '#9E9E8E', upliftType: 'premium' as const },
  ],
}

const SATIN_OPTIONS = [
  { variant: 'satin_2', label: 'Light satin', privacyLevel: 2, priceModifier: 50 },
  { variant: 'satin_3', label: 'Medium satin', privacyLevel: 3, priceModifier: 50 },
  { variant: 'satin_4', label: 'Standard satin', privacyLevel: 4, priceModifier: 50 },
  { variant: 'satin_5a', label: 'Heavy satin', privacyLevel: 5, priceModifier: 50 },
  { variant: 'satin_5b', label: 'Full satin', privacyLevel: 5, priceModifier: 50 },
]

const PATTERNED_OPTIONS = [
  { variant: 'stipple', label: 'Stipple', privacyLevel: 4, priceModifier: 75, description: 'Fine textured pattern. Good privacy.' },
  { variant: 'bark', label: 'Bark', privacyLevel: 5, priceModifier: 75, description: 'Vertical linear texture. Maximum privacy.' },
  { variant: 'satin_regency', label: 'Satin', privacyLevel: 5, priceModifier: 75, description: 'Smooth frosted finish. Highest privacy.' },
  { variant: 'westminster', label: 'Westminster', privacyLevel: 2, priceModifier: 75, description: 'Rippled organic pattern. Subtle privacy.' },
  { variant: 'leaf', label: 'Leaf', privacyLevel: 3, priceModifier: 75, description: 'Botanical pattern. Decorative privacy.' },
  { variant: 'contour', label: 'Contour', privacyLevel: 4, priceModifier: 75, description: 'Fine grain texture. Good privacy.' },
]

const BAR_OPTIONS: { type: BarSelection['type']; label: string; price: string; priceModifier: number }[] = [
  { type: 'none', label: 'None', price: 'Included', priceModifier: 0 },
  { type: 'georgian', label: 'Georgian', price: '+ £50', priceModifier: 50 },
  { type: 'vertical', label: 'Vertical', price: '+ £50', priceModifier: 50 },
  { type: 'diamond_lead', label: 'Diamond lead', price: '+ £75', priceModifier: 75 },
  { type: 'square_lead', label: 'Square lead', price: '+ £75', priceModifier: 75 },
]

const HANDLE_COLOURS: { name: string; hex: string; border?: string; priceModifier: number }[] = [
  { name: 'White', hex: '#F0EDE8', border: '#CCCCCC', priceModifier: 0 },
  { name: 'Hardex Graphite', hex: '#4A4A4A', priceModifier: 0 },
  { name: 'Antique Black', hex: '#2C2C2C', priceModifier: 0 },
  { name: 'Black', hex: '#1C1C1C', priceModifier: 0 },
  { name: 'Hardex Gold', hex: '#B8960C', priceModifier: 0 },
  { name: 'Hardex Chrome', hex: '#C0C0C0', border: '#AAAAAA', priceModifier: 0 },
  { name: 'Satin Silver', hex: '#A8A9AD', priceModifier: 0 },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function WindowPDPPage() {
  const navigate = useNavigate()
  const { addItem } = useBasketStore()
  const { windows: windowData, loading: pricingLoading, error: pricingError } = usePricingData()

  const [currentStep, setCurrentStep] = useState<number>(1)

  // Size
  const [widthMm, setWidthMm] = useState<number | null>(null)
  const [heightMm, setHeightMm] = useState<number | null>(null)
  const [widthCustom, setWidthCustom] = useState<boolean>(false)
  const [heightCustom, setHeightCustom] = useState<boolean>(false)
  const [widthInput, setWidthInput] = useState<string>('')
  const [heightInput, setHeightInput] = useState<string>('')
  const [widthError, setWidthError] = useState<string>('')
  const [heightError, setHeightError] = useState<string>('')

  // Openers
  const [openerCount, setOpenerCount] = useState<0 | 1 | 2 | 3 | null>(null)

  // Colour
  const [externalColour, setExternalColour] = useState<ColourSelection | null>(null)

  // Glass
  const [glassCategory, setGlassCategory] = useState<'clear' | 'satin' | 'patterned' | null>(null)
  const [glassSelection, setGlassSelection] = useState<GlassSelection | null>(null)
  const [barSelection, setBarSelection] = useState<BarSelection>({ type: 'none', priceModifier: 0 })

  // Handle
  const [handleColour, setHandleColour] = useState<HandleSelection | null>(null)

  // Product reference
  const [productReference, setProductReference] = useState<string>('')

  // Pricing
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)
  const [priceBreakdown, setPriceBreakdown] = useState<WindowQuoteResult | null>(null)
  const [bandBasePrice, setBandBasePrice] = useState<number | null>(null)
  const [priceError, setPriceError] = useState<boolean>(false)

  // Basket
  const [addedToBasket, setAddedToBasket] = useState<boolean>(false)

  useSEO({
    title: 'uPVC Casement Windows — Installed Prices | WDO',
    description:
      'Configure your uPVC casement window and see an honest installed price in real time. No salesperson. Surveyor confirms before manufacture.',
  })

  // ── Price calculation ──────────────────────────────────────────────────────
  useEffect(() => {
    setPriceError(false)
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

      const flatModifiers =
        (glassSelection?.priceModifier ?? 0) +
        (barSelection?.priceModifier ?? 0) +
        25

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

  // ── Diagram props ──────────────────────────────────────────────────────────
  const diagramVariant: 'fixed' | 'single-right' | 'two-both' | 'three-all' = (() => {
    if (!openerCount) return 'fixed'
    if (openerCount === 1) return 'single-right'
    if (openerCount === 2) return 'two-both'
    return 'three-all'
  })()

  const diagramFrameColour = externalColour?.hex ?? '#E8E8E8'
  const diagramGlazingStyle = glassSelection && glassSelection.category !== 'clear' ? 'frosted' : 'clear'
  const diagramBarStyle = barSelection.type

  // ── Step helpers ───────────────────────────────────────────────────────────
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
        return externalColour.name
      }
      case 4: {
        if (!glassSelection) return ''
        const barLabel = barSelection.type !== 'none' ? ` + ${barSelection.type.replace('_', ' ')}` : ''
        if (glassSelection.category === 'clear') return `Clear glass${barLabel}`
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

  // ── Size input handlers ────────────────────────────────────────────────────
  function handleWidthCustomChange(val: string) {
    setWidthInput(val)
    const n = parseInt(val, 10)
    if (!val) { setWidthError(''); setWidthMm(null); return }
    if (n < 340) { setWidthError('Width must be at least 340mm'); setWidthMm(null) }
    else if (n > 5400) { setWidthError('Width must be no more than 5,400mm'); setWidthMm(null) }
    else { setWidthError(''); setWidthMm(n) }
  }

  function handleHeightCustomChange(val: string) {
    setHeightInput(val)
    const n = parseInt(val, 10)
    if (!val) { setHeightError(''); setHeightMm(null); return }
    if (n < 350) { setHeightError('Height must be at least 350mm'); setHeightMm(null) }
    else if (n > 2730) { setHeightError('Height must be no more than 2,730mm'); setHeightMm(null) }
    else { setHeightError(''); setHeightMm(n) }
  }

  function selectWidth(mm: number) {
    setWidthCustom(false)
    setWidthInput('')
    setWidthError('')
    setWidthMm(mm)
  }

  function selectHeight(mm: number) {
    setHeightCustom(false)
    setHeightInput('')
    setHeightError('')
    setHeightMm(mm)
  }

  // ── Add to basket ──────────────────────────────────────────────────────────
  function handleAddToBasket() {
    if (!widthMm || !heightMm || openerCount === null || !externalColour || !glassSelection || !handleColour || !calculatedPrice) return

    addItem({
      productId: 'casement-window',
      productName: 'uPVC Casement Window',
      category: 'windows',
      selectedVariants: {
        width: widthMm.toString(),
        height: heightMm.toString(),
        openers: openerCount.toString(),
        externalColour: externalColour.name,
        glass: glassSelection.variant,
        bars: barSelection.type,
        handleColour: handleColour.name,
        productReference,
      },
      variantSummary: `${widthMm}mm × ${heightMm}mm · ${externalColour.name} · ${glassSelection.variant} · ${openerCount} opener${openerCount !== 1 ? 's' : ''}`,
      indicativePrice: calculatedPrice,
      quantity: 1,
    })

    setAddedToBasket(true)
  }

  // ── Navigation helper ──────────────────────────────────────────────────────
  function goToStep(n: number) {
    setCurrentStep(n)
    window.scrollTo(0, 0)
  }

  function handleSameSpecDifferentSize() {
    setWidthMm(null)
    setHeightMm(null)
    setWidthCustom(false)
    setHeightCustom(false)
    setWidthInput('')
    setHeightInput('')
    setWidthError('')
    setHeightError('')
    setAddedToBasket(false)
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Layout>
    <div className="min-h-screen bg-paper">

      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-paper border-b border-hairline py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">

          <div className="hidden md:flex items-center gap-1 text-xs text-ink-muted font-sans uppercase tracking-wide flex-shrink-0">
            <span>Windows</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink font-medium">Casement</span>
          </div>

          <div className="flex items-center flex-1 justify-center gap-0">
            {STEP_CONFIG.map((step, index) => {
              const isActive = currentStep === step.number
              const isComplete = isStepComplete(step.number)
              const canNavigate = step.number < currentStep
              return (
                <React.Fragment key={step.number}>
                  {index > 0 && (
                    <div className={`h-px w-6 flex-shrink-0 transition-colors duration-300 ${
                      isStepComplete(step.number - 1) && isStepComplete(step.number)
                        ? 'bg-brand'
                        : 'bg-hairline'
                    }`} />
                  )}
                  <button
                    onClick={() => { if (canNavigate) setCurrentStep(step.number) }}
                    title={step.tooltip}
                    className="relative group flex flex-col items-center"
                  >
                    <div className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-brand text-paper ring-2 ring-brand ring-offset-2'
                        : isComplete
                        ? 'bg-brand text-paper'
                        : 'bg-surface border border-hairline text-ink-muted opacity-50'
                    }`}>
                      <step.Icon className="w-4 h-4" />
                      {isComplete && !isActive && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-paper border border-brand flex items-center justify-center">
                          <Check className="w-2 h-2 text-brand" />
                        </span>
                      )}
                    </div>
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-ink text-paper text-xs font-sans px-2 py-1 rounded-sm whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                      {step.tooltip}
                    </span>
                  </button>
                </React.Fragment>
              )
            })}
          </div>

          <div className="flex flex-col items-end flex-shrink-0 min-w-[90px]">
            {pricingLoading ? (
              <span className="font-sans text-xs text-ink-muted italic">Loading...</span>
            ) : calculatedPrice ? (
              <>
                <span className="font-mono text-base text-ink font-medium">
                  {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(calculatedPrice)}
                </span>
                <span className="font-sans text-xs text-ink-muted italic">Inc. VAT · indicative</span>
              </>
            ) : widthMm || heightMm ? (
              <span className="font-sans text-xs text-ink-muted italic">Calculating...</span>
            ) : (
              <>
                <span className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-0.5">
                  Installed price
                </span>
                <span className="font-mono text-base text-ink-muted">
                  From £306
                </span>
                <span className="font-sans text-xs text-ink-muted italic mt-0.5">
                  Inc. VAT · enter size for your price
                </span>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 items-start">

          {/* Left column */}
          <div className="md:sticky md:top-24 space-y-6">
            <div className="bg-surface border border-hairline rounded-sm p-6 flex flex-col items-center gap-4">
              <WindowDiagram
                variant={diagramVariant}
                frameColour={diagramFrameColour}
                glazingStyle={diagramGlazingStyle}
                glazingBarStyle={diagramBarStyle}
                width={200}
                height={220}
              />
              <p className="text-xs text-ink-muted font-sans italic text-center">
                For illustrative purposes only. Exact design confirmed at survey.
              </p>
            </div>

            {priceError && (
              <Alert
                variant="warning"
                message="These dimensions need a custom quote. Please contact us at hello@buywindowsanddoors.co.uk"
              />
            )}

            {pricingError && (
              <Alert variant="error" message="Unable to load pricing data. Please refresh the page." />
            )}

            <div className="border border-hairline rounded-sm divide-y divide-hairline">
              {['FENSA Registered Installers', 'Tri-Stay Hinges as Standard', 'Insurance Backed Guarantee'].map((text) => (
                <div key={text} className="flex items-center gap-2 px-4 py-3">
                  <Check className="w-4 h-4 text-brand flex-shrink-0" />
                  <span className="font-sans text-sm text-ink">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — step panels */}
          <div>
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

            <div className="pt-6">

              {/* Step 1 — Size */}
              {currentStep === 1 && (
                <div>
                  <h1 className="font-display text-3xl text-ink mb-2">What size is your window?</h1>
                  <p className="font-sans text-sm text-ink-muted mb-6">Choose from common sizes or enter exact measurements in mm.</p>

                  <div className="bg-surface border border-hairline rounded-sm p-4 mb-6 flex gap-3 items-start">
                    <Info className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-sm text-ink-muted">
                      Measure from the inside of your existing frame — not the glass. These measurements give us an accurate indicative price but nothing will be ordered from them. Your surveyor will confirm all measurements before anything goes to manufacture.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-sans text-sm font-medium text-ink uppercase tracking-wide mb-3">Width (mm)</p>
                      <div className="grid grid-cols-3 gap-2">
                        {WIDTH_PRESETS.map((w) => (
                          <button
                            key={w}
                            onClick={() => selectWidth(w)}
                            className={`px-2 py-2 text-sm font-mono rounded-sm border transition-colors ${
                              widthMm === w && !widthCustom
                                ? 'bg-brand text-paper border-brand'
                                : 'bg-surface text-ink border-hairline hover:border-brand'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                        <button
                          onClick={() => { setWidthCustom(true); setWidthMm(null) }}
                          className={`px-2 py-2 text-sm font-mono rounded-sm border transition-colors ${
                            widthCustom
                              ? 'bg-brand text-paper border-brand'
                              : 'bg-surface text-ink border-hairline hover:border-brand'
                          }`}
                        >
                          Custom
                        </button>
                      </div>
                      {widthCustom && (
                        <div className="mt-3">
                          <Input
                            label="Enter width in mm"
                            type="number"
                            value={widthInput}
                            min={340}
                            max={5400}
                            onChange={(e) => handleWidthCustomChange(e.target.value)}
                            error={widthError || undefined}
                            helperText="Min 340mm · Max 5,400mm"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-sans text-sm font-medium text-ink uppercase tracking-wide mb-3">Height (mm)</p>
                      <div className="grid grid-cols-3 gap-2">
                        {HEIGHT_PRESETS.map((h) => (
                          <button
                            key={h}
                            onClick={() => selectHeight(h)}
                            className={`px-2 py-2 text-sm font-mono rounded-sm border transition-colors ${
                              heightMm === h && !heightCustom
                                ? 'bg-brand text-paper border-brand'
                                : 'bg-surface text-ink border-hairline hover:border-brand'
                            }`}
                          >
                            {h}
                          </button>
                        ))}
                        <button
                          onClick={() => { setHeightCustom(true); setHeightMm(null) }}
                          className={`px-2 py-2 text-sm font-mono rounded-sm border transition-colors ${
                            heightCustom
                              ? 'bg-brand text-paper border-brand'
                              : 'bg-surface text-ink border-hairline hover:border-brand'
                          }`}
                        >
                          Custom
                        </button>
                      </div>
                      {heightCustom && (
                        <div className="mt-3">
                          <Input
                            label="Enter height in mm"
                            type="number"
                            value={heightInput}
                            min={350}
                            max={2730}
                            onChange={(e) => handleHeightCustomChange(e.target.value)}
                            error={heightError || undefined}
                            helperText="Min 350mm · Max 2,730mm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button variant="primary" onClick={() => goToStep(2)} disabled={!isStepComplete(1)}>
                      Continue →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2 — Openers */}
              {currentStep === 2 && (
                <div>
                  <h2 className="font-display text-3xl text-ink mb-2">How many opening lights?</h2>
                  <p className="font-sans text-sm text-ink-muted mb-6">An opening light is a section of the window that opens for ventilation. Fixed windows have none.</p>

                  <div className="bg-surface border border-hairline rounded-sm p-4 mb-6 flex gap-3 items-start">
                    <Info className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-sm text-ink-muted">
                      All our windows include Tri-Stay hinges as standard — these meet fire exit requirements and allow the window to stay open safely at multiple positions.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {([
                      { count: 0 as const, label: 'Fixed', sub: 'No opener', variant: 'fixed' as const },
                      { count: 1 as const, label: '1 Opening Light', sub: '', variant: 'single-right' as const },
                      { count: 2 as const, label: '2 Opening Lights', sub: '', variant: 'two-both' as const },
                      { count: 3 as const, label: '3 Opening Lights', sub: '', variant: 'three-all' as const },
                    ]).map(({ count, label, sub, variant }) => (
                      <button
                        key={count}
                        onClick={() => setOpenerCount(count)}
                        className={`border rounded-sm p-4 cursor-pointer text-center transition-colors ${
                          openerCount === count
                            ? 'border-brand bg-brand bg-opacity-5'
                            : 'border-hairline bg-surface hover:border-brand'
                        }`}
                      >
                        <div className="flex justify-center mb-3">
                          <WindowDiagram
                            variant={variant}
                            frameColour={diagramFrameColour}
                            glazingStyle="clear"
                            width={80}
                            height={88}
                          />
                        </div>
                        <p className="font-display text-base text-ink">{label}</p>
                        {sub && <p className="font-sans text-xs text-ink-muted mt-0.5">{sub}</p>}
                      </button>
                    ))}
                  </div>

                  <p className="font-sans text-xs text-ink-muted italic mt-4">
                    All openers are shown as side-hung. They can be swapped to top-hung on survey at no extra cost — just mention your preference to the surveyor.
                  </p>

                  <div className="flex justify-between mt-8">
                    <Button variant="ghost" onClick={() => setCurrentStep(1)}>← Back</Button>
                    <Button variant="primary" onClick={() => goToStep(3)} disabled={openerCount === null}>Continue →</Button>
                  </div>
                </div>
              )}

              {/* Step 3 — Colour */}
              {currentStep === 3 && (
                <div>
                  <h2 className="font-display text-3xl text-ink mb-2">Choose your colour</h2>
                  <p className="font-sans text-sm text-ink-muted mb-6">External frame colour. All windows are white inside as standard.</p>

                  <div className="bg-surface border border-hairline rounded-sm p-4 mb-6 flex gap-3 items-start">
                    <Info className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-sm text-ink-muted">
                      All colours apply to the external frame only. All windows are white on the inside as standard — white is by far the most popular choice in the UK. If you'd like to discuss alternative internal colours, your surveyor can help — though this will affect the price.
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-3">Standard white</p>
                    <div className="flex gap-4 flex-wrap">
                      {COLOURS.white.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setExternalColour(c)}
                          title={c.name}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div
                            className={`w-12 h-12 rounded-full transition-all ${
                              externalColour?.name === c.name
                                ? 'ring-[3px] ring-brand ring-offset-2'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: c.hex, border: `1px solid ${c.border}` }}
                          />
                          <span className="font-sans text-xs text-ink">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-3">Standard colours</p>
                    <div className="flex gap-4 flex-wrap">
                      {COLOURS.standard.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setExternalColour(c)}
                          title={c.name}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div
                            className={`w-12 h-12 rounded-full transition-all ${
                              externalColour?.name === c.name
                                ? 'ring-[3px] ring-brand ring-offset-2'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: c.hex, border: '1px solid rgba(0,0,0,0.15)' }}
                          />
                          <span className="font-sans text-xs text-ink text-center max-w-[60px] leading-tight">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-3">Premium colours</p>
                    <div className="flex gap-4 flex-wrap">
                      {COLOURS.premium.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setExternalColour(c)}
                          title={c.name}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div
                            className={`w-12 h-12 rounded-full transition-all ${
                              externalColour?.name === c.name
                                ? 'ring-[3px] ring-brand ring-offset-2'
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: c.hex, border: '1px solid rgba(0,0,0,0.15)' }}
                          />
                          <span className="font-sans text-xs text-ink text-center max-w-[60px] leading-tight">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {externalColour && (
                    <div className="bg-surface border border-hairline rounded-sm p-3">
                      <p className="font-sans text-sm text-ink">{externalColour.name}</p>
                      {externalColour.upliftType !== 'white' && (
                        <p className="font-sans text-xs text-ink-muted mt-1 mb-1">
                          Base price before colour uplift:{' '}
                          <span className="font-mono">
                            £{priceBreakdown
                              ? Math.round(priceBreakdown.subtotal * 1.20)
                              : '—'}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button variant="ghost" onClick={() => setCurrentStep(2)}>← Back</Button>
                    <Button variant="primary" onClick={() => goToStep(4)} disabled={!externalColour}>Continue →</Button>
                  </div>
                </div>
              )}

              {/* Step 4 — Glass */}
              {currentStep === 4 && (
                <div>
                  <h2 className="font-display text-3xl text-ink mb-2">Choose your glass</h2>
                  <p className="font-sans text-sm text-ink-muted mb-6">All glass is argon gas filled double glazed as standard.</p>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {([
                      { cat: 'clear' as const, title: 'Clear', desc: 'Maximum light. Unobstructed views.' },
                      { cat: 'satin' as const, title: 'Satin', desc: 'Privacy with a clean, frosted appearance.' },
                      { cat: 'patterned' as const, title: 'Patterned', desc: 'Decorative privacy glass. Six styles available.' },
                    ]).map(({ cat, title, desc }) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setGlassCategory(cat)
                          if (cat === 'clear') {
                            setGlassSelection({ category: 'clear', variant: 'clear', privacyLevel: 0, priceModifier: 0 })
                          } else {
                            setGlassSelection(null)
                          }
                        }}
                        className={`border rounded-sm p-4 cursor-pointer text-left transition-colors ${
                          glassCategory === cat
                            ? 'border-brand bg-brand bg-opacity-5'
                            : 'border-hairline hover:border-brand'
                        }`}
                      >
                        <div className="w-full h-16 rounded-sm mb-3 overflow-hidden bg-blue-50">
                          {cat === 'clear' && (
                            <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #C9DFF0 0%, #E8F4FF 100%)' }} />
                          )}
                          {cat === 'satin' && (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EEF4F8 0%, #D8E8F0 100%)' }}>
                              <div className="w-full h-full bg-white opacity-40" />
                            </div>
                          )}
                          {cat === 'patterned' && (
                            <div className="w-full h-full grid grid-cols-4 grid-rows-3 gap-px p-1 bg-blue-50">
                              {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="rounded-sm" style={{ backgroundColor: i % 2 === 0 ? '#C9DFF0' : '#E8F4FF' }} />
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="font-display text-base text-ink">{title}</p>
                        <p className="font-sans text-xs text-ink-muted mt-1 leading-relaxed">{desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Satin sub-options */}
                  {glassCategory === 'satin' && (
                    <div className="mb-6">
                      <p className="font-sans text-sm font-medium text-ink mb-4">Choose your satin privacy level</p>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {SATIN_OPTIONS.map((opt) => (
                          <button
                            key={opt.variant}
                            onClick={() => setGlassSelection({ category: 'satin', ...opt })}
                            className={`border rounded-sm p-3 cursor-pointer flex-shrink-0 min-w-[110px] text-center transition-colors ${
                              glassSelection?.variant === opt.variant
                                ? 'border-brand bg-brand bg-opacity-5'
                                : 'border-hairline hover:border-brand'
                            }`}
                          >
                            <div className="relative w-full h-16 mb-2 rounded-sm overflow-hidden bg-blue-50">
                              <div
                                className="absolute inset-0 bg-white rounded-sm"
                                style={{ opacity: opt.privacyLevel * 0.15 }}
                              />
                              <span className="absolute top-1 right-1 bg-brand text-paper text-xs px-1.5 py-0.5 rounded-sm font-mono leading-none">
                                L{opt.privacyLevel}
                              </span>
                            </div>
                            <p className="font-sans text-xs text-ink leading-tight">{opt.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Patterned sub-options */}
                  {glassCategory === 'patterned' && (
                    <div className="mb-6">
                      <p className="font-sans text-sm font-medium text-ink mb-4">Choose your pattern</p>
                      <div className="grid grid-cols-3 gap-3">
                        {PATTERNED_OPTIONS.map((opt) => (
                          <button
                            key={opt.variant}
                            onClick={() => setGlassSelection({ category: 'patterned', ...opt })}
                            className={`border rounded-sm overflow-hidden cursor-pointer text-left transition-colors ${
                              glassSelection?.variant === opt.variant
                                ? 'border-brand ring-2 ring-brand ring-offset-1'
                                : 'border-hairline hover:border-brand'
                            }`}
                          >
                            <div className="relative w-full h-24 bg-surface flex items-center justify-center">
                              <span className="font-mono text-xs text-ink-muted">{opt.label}</span>
                              <span className="absolute top-2 right-2 bg-brand text-paper text-xs px-1.5 py-0.5 rounded-sm leading-none">
                                Privacy {opt.privacyLevel}
                              </span>
                            </div>
                            <div className="p-2 border-t border-hairline">
                              <p className="font-sans text-sm text-ink font-medium">{opt.label}</p>
                              <p className="font-sans text-xs text-ink-muted mt-0.5">{opt.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bar options */}
                  {glassCategory !== null && (
                    <div className="border-t border-hairline pt-6 mt-2">
                      <p className="font-sans text-sm font-medium text-ink mb-1">Add decorative bars (optional)</p>
                      <p className="font-sans text-xs text-ink-muted mb-4">Decorative bars add a traditional or period look to your window. They do not affect performance or security.</p>
                      <div className="grid grid-cols-5 gap-2">
                        {BAR_OPTIONS.map((bar) => (
                          <button
                            key={bar.type}
                            onClick={() => setBarSelection({ type: bar.type, priceModifier: bar.priceModifier })}
                            className={`border rounded-sm p-3 text-center cursor-pointer transition-colors ${
                              barSelection.type === bar.type
                                ? 'border-brand bg-brand bg-opacity-5'
                                : 'border-hairline hover:border-brand'
                            }`}
                          >
                            <div className="flex justify-center mb-2">
                              <WindowDiagram
                                variant="fixed"
                                frameColour={diagramFrameColour}
                                glazingStyle="clear"
                                glazingBarStyle={bar.type}
                                width={52}
                                height={52}
                              />
                            </div>
                            <p className="font-sans text-xs text-ink leading-tight">{bar.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button variant="ghost" onClick={() => setCurrentStep(3)}>← Back</Button>
                    <Button variant="primary" onClick={() => goToStep(5)} disabled={!glassSelection}>Continue →</Button>
                  </div>
                </div>
              )}

              {/* Step 5 — Handle */}
              {currentStep === 5 && (
                <div>
                  <h2 className="font-display text-3xl text-ink mb-2">Choose your handle colour</h2>
                  <p className="font-sans text-sm text-ink-muted mb-6">All windows include a standard lever handle. Choose your preferred finish.</p>

                  <div className="bg-surface border border-hairline rounded-sm p-3 mb-6">
                    <p className="font-sans text-sm text-ink-muted">
                      Handle style is standard lever on all windows. Alternative styles can be discussed with your surveyor.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {HANDLE_COLOURS.map((h) => (
                      <button
                        key={h.name}
                        onClick={() => setHandleColour(h)}
                        className={`border rounded-sm p-3 text-center cursor-pointer transition-colors ${
                          handleColour?.name === h.name
                            ? 'border-brand bg-brand bg-opacity-5'
                            : 'border-hairline hover:border-brand'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-sm mx-auto mb-2"
                          style={{
                            backgroundColor: h.hex,
                            border: `1px solid ${h.border ?? 'rgba(0,0,0,0.2)'}`,
                          }}
                        />
                        <p className="font-sans text-xs text-ink leading-tight">{h.name}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button variant="ghost" onClick={() => setCurrentStep(4)}>← Back</Button>
                    <Button variant="primary" onClick={() => goToStep(6)} disabled={!handleColour}>Continue →</Button>
                  </div>
                </div>
              )}

              {/* Step 6 — Review */}
              {currentStep === 6 && widthMm && heightMm && openerCount !== null && externalColour && glassSelection && handleColour && (
                <div>
                  <h2 className="font-display text-3xl text-ink mb-6">Review your window</h2>

                  <div className="bg-brand rounded-sm p-6 mb-6">
                    <p className="font-sans text-xs text-paper opacity-70 uppercase tracking-wide mb-4">Your specification</p>

                    {([
                      ['Size', `${widthMm}mm × ${heightMm}mm`],
                      ['Opening lights', openerCount === 0 ? 'Fixed' : `${openerCount} opening light${openerCount > 1 ? 's' : ''}`],
                      ['External colour', externalColour.name],
                      ['Internal colour', 'White (standard)'],
                      ['Glass', glassSelection.category === 'clear' ? 'Clear' : glassSelection.variant],
                      ...(glassSelection.category !== 'clear' ? [['Privacy level', `Level ${glassSelection.privacyLevel}`]] : []),
                      ...(barSelection.type !== 'none' ? [['Decorative bars', barSelection.type.replace(/_/g, ' ')]] : []),
                      ['Handle colour', handleColour.name],
                      ['Cill', '180mm (included)'],
                      ['Trickle vents', 'Included as standard'],
                      ['Hinges', 'Tri-Stay (included)'],
                    ] as [string, string][]).map(([label, value]) => (
                      <div key={label} className="flex justify-between py-1">
                        <span className="font-sans text-sm text-paper opacity-80">{label}</span>
                        <span className="font-sans text-sm text-paper font-medium">{value}</span>
                      </div>
                    ))}

                    <div className="border-t border-white border-opacity-20 my-4" />

                    {priceBreakdown && calculatedPrice && (() => {
                      const sub = priceBreakdown.subtotal + (glassSelection.priceModifier ?? 0) + (barSelection.priceModifier ?? 0) + 25
                      const uplift = Math.round(sub * priceBreakdown.colourUpliftPct)
                      const exVAT = Math.round(sub + uplift)
                      const vat = Math.round(exVAT * 0.2)
                      return (
                        <>
                          <div className="space-y-1 mb-3">
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">Base window ({priceBreakdown.band}mm band)</span>
                              <span className="font-mono text-xs text-paper">{formatPrice(priceBreakdown.basePrice)}</span>
                            </div>
                            {priceBreakdown.addons.map((a) => (
                              <div key={a.label} className="flex justify-between">
                                <span className="font-sans text-xs text-paper opacity-70">{a.label}</span>
                                <span className="font-mono text-xs text-paper">+{formatPrice(a.amount)}</span>
                              </div>
                            ))}
                            {glassSelection.priceModifier > 0 && (
                              <div className="flex justify-between">
                                <span className="font-sans text-xs text-paper opacity-70">{glassSelection.category === 'satin' ? 'Satin glass' : 'Patterned glass'}</span>
                                <span className="font-mono text-xs text-paper">+{formatPrice(glassSelection.priceModifier)}</span>
                              </div>
                            )}
                            {barSelection.priceModifier > 0 && (
                              <div className="flex justify-between">
                                <span className="font-sans text-xs text-paper opacity-70">{barSelection.type.replace(/_/g, ' ')} bars</span>
                                <span className="font-mono text-xs text-paper">+{formatPrice(barSelection.priceModifier)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">Cill (180mm)</span>
                              <span className="font-mono text-xs text-paper">+{formatPrice(25)}</span>
                            </div>
                            {priceBreakdown.colourUpliftPct > 0 && (
                              <div className="flex justify-between">
                                <span className="font-sans text-xs text-paper opacity-70">
                                  {externalColour.name} colour uplift (+{Math.round(priceBreakdown.colourUpliftPct * 100)}%)
                                </span>
                                <span className="font-mono text-xs text-paper">+{formatPrice(uplift)}</span>
                              </div>
                            )}
                          </div>
                          <div className="border-t border-white border-opacity-20 my-2" />
                          <div className="flex justify-between mb-1">
                            <span className="font-sans text-xs text-paper opacity-70">Subtotal (ex VAT)</span>
                            <span className="font-mono text-xs text-paper">{formatPrice(exVAT)}</span>
                          </div>
                          <div className="flex justify-between mb-4">
                            <span className="font-sans text-xs text-paper opacity-70">VAT (20%)</span>
                            <span className="font-mono text-xs text-paper">+{formatPrice(vat)}</span>
                          </div>
                          <div className="border-t border-white border-opacity-20 my-4" />
                          <p className="font-sans text-xs text-paper opacity-70 uppercase tracking-wide mb-2">Estimated installed price</p>
                          <span className="font-mono text-4xl text-paper font-medium tracking-tight">
                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(calculatedPrice)}
                          </span>
                          <p className="font-sans text-xs text-paper opacity-60 mt-2">
                            Indicative price. Confirmed by your surveyor before any work begins.
                          </p>
                        </>
                      )
                    })()}
                  </div>

                  <div className="mb-6">
                    <Input
                      label="Your reference (optional)"
                      placeholder="e.g. Master bedroom, front of house"
                      maxLength={40}
                      value={productReference}
                      onChange={(e) => setProductReference(e.target.value)}
                      helperText="Up to 40 characters. Helps your installer identify the window on their visit."
                    />
                  </div>

                  {!addedToBasket ? (
                    <>
                      <Button variant="accent" size="lg" className="w-full" onClick={handleAddToBasket}>
                        Add to Quote
                      </Button>
                      <div className="mt-4">
                        <Button variant="ghost" onClick={() => setCurrentStep(5)}>← Back</Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Alert variant="success" message="Added to your quote" />
                      <Button variant="primary" size="lg" className="w-full" onClick={handleSameSpecDifferentSize}>
                        Add another — same spec, different size
                      </Button>
                      <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate('/basket')}>
                        View quote
                      </Button>
                      <Button variant="ghost" size="lg" className="w-full" onClick={() => navigate('/shop?category=windows')}>
                        Return to range
                      </Button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Zone 2 — Product Details */}
      <div className="border-t border-hairline bg-surface py-16 px-4 md:px-8 mt-8">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display text-2xl text-ink mb-4">uPVC Casement Windows</h2>
              <div className="space-y-4 font-sans text-ink-muted leading-relaxed">
                <p>
                  Casement windows are the most common window type in the UK — and with good reason. They open outward on a side hinge, giving you full control of ventilation while maintaining maximum glazed area.
                </p>
                <p>
                  Our casement windows are built on the Safeguard Profile 22 system — a UK-manufactured uPVC profile with over 40 years of use in residential and commercial buildings. The slim sculptured sightlines maximise daylight. The multi-chamber construction delivers exceptional thermal and acoustic insulation.
                </p>
                <p>
                  All windows are A-rated for energy efficiency as standard, fitted with Planitherm double glazing and filled with argon gas for optimum thermal performance.
                </p>
              </div>
            </div>
            <div className="aspect-video bg-hairline rounded-sm flex items-center justify-center">
              <p className="font-sans text-sm text-ink-muted">Product photography coming soon</p>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h2 className="font-display text-2xl text-ink mb-8">Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'A-Rated', body: 'Planitherm double glazing with argon gas fill. Stops 56% more heat escaping than older double glazing.' },
                { title: '1.4 W/m²K', body: 'Standard double glazed unit. Triple glazing and enhanced units available — discuss with your surveyor.' },
                { title: 'Yale Multi-Point Locking', body: 'Shootbolt locking system. Secured by Design specification available. Yale Lifetime Security Guarantee.' },
              ].map(({ title, body }) => (
                <div key={title} className="border border-hairline rounded-sm p-6">
                  <h3 className="font-display text-lg text-ink mb-2">{title}</h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div>
            <h2 className="font-display text-2xl text-ink mb-6">What's included in every price</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
              {[
                'Supply of window to your specification',
                'Professional installation by a FENSA-registered fitter',
                'Removal and disposal of your existing window',
                'FENSA certificate',
                '180mm cill as standard',
                'Trickle vents included',
                'Tri-Stay hinges as standard (fire exit compliant)',
                'Mastic seal and internal finishing',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-ink">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Toughened glass notice */}
          <div className="bg-surface border border-hairline rounded-sm p-6">
            <div className="flex gap-3 items-start">
              <Info className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-medium text-ink mb-1">Toughened glass</p>
                <p className="font-sans text-sm text-ink-muted">
                  Toughened glass will be provided to all large panes and all ground-floor windows as standard, in line with UK building regulations. Your surveyor will confirm all glazing specifications on their visit before anything goes to manufacture.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
    </Layout>
  )
}
