import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  Search,
  Palette,
  Layers,
  Grip,
  Plus,
  Maximize2,
  ClipboardList,
  Key,
  RotateCcw,
  Minus,
  AlignJustify,
  List,
} from 'lucide-react'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { Alert } from '../components/ds/Alert'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { EmptyState } from '../components/ds/EmptyState'
import { FAQ } from '../components/ds/FAQ'
import { useSEO } from '../utils/seo'
import { doorProducts } from '../data/products'
import type { DoorProduct } from '../data/products'
import { useBasketStore } from '../store/basketStore'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectedColour {
  name: string
  hex: string
  group: 'standard' | 'premium'
}

interface SelectedGlazing {
  type: 'clear' | 'obscure' | 'decorative'
  priceModifier: number
}

interface SelectedHandle {
  style: string
  finish: string
  priceModifier: number
}

// ─── Static data ──────────────────────────────────────────────────────────────

const STANDARD_COLOURS: (SelectedColour & { border?: string })[] = [
  { name: 'White', hex: '#F0EDE8', border: '#CCCCCC', group: 'standard' },
  { name: 'Cream', hex: '#F5F0E0', border: '#CCCCCC', group: 'standard' },
  { name: 'Black', hex: '#1C1C1C', group: 'standard' },
  { name: 'Anthracite Grey', hex: '#3D3D3D', group: 'standard' },
  { name: 'Chartwell Green', hex: '#6B8F71', group: 'standard' },
  { name: 'Irish Oak', hex: '#8B5E3C', group: 'standard' },
  { name: 'Rosewood', hex: '#6B2D2D', group: 'standard' },
  { name: 'Golden Oak', hex: '#C4841D', group: 'standard' },
]

const PREMIUM_COLOURS: (SelectedColour & { border?: string })[] = [
  { name: 'Agate Grey', hex: '#8E9BA3', group: 'premium' },
  { name: 'Slate Grey', hex: '#6B7280', group: 'premium' },
  { name: 'Pebble Grey', hex: '#9E9E8E', group: 'premium' },
  { name: 'Traffic Red', hex: '#C0392B', group: 'premium' },
  { name: 'Midnight Blue', hex: '#2C3E6B', group: 'premium' },
]

const GLAZING_OPTIONS: { type: SelectedGlazing['type']; label: string; desc: string; priceModifier: number }[] = [
  { type: 'clear', label: 'Clear', desc: 'Clear glass — maximum light', priceModifier: 0 },
  { type: 'obscure', label: 'Obscure', desc: 'Frosted — privacy', priceModifier: 25 },
  { type: 'decorative', label: 'Decorative', desc: 'Patterned — character', priceModifier: 50 },
]

const HANDLE_STYLES: { id: string; label: string; desc: string; priceModifier: number; Icon: React.ElementType }[] = [
  { id: 'lever', label: 'Standard lever', desc: 'Included as standard', priceModifier: 0, Icon: Key },
  { id: 'bow', label: 'Bow handle', desc: 'Curved bow handle', priceModifier: 75, Icon: RotateCcw },
  { id: 'bar-600', label: '600mm bar', desc: 'Short bar handle', priceModifier: 100, Icon: Minus },
  { id: 'bar-1200', label: '1200mm bar', desc: 'Full-length bar', priceModifier: 100, Icon: AlignJustify },
  { id: 'bar-1800', label: '1800mm bar', desc: 'Floor-to-ceiling bar', priceModifier: 100, Icon: List },
]

const HANDLE_FINISHES: { name: string; hex: string; border?: string }[] = [
  { name: 'White', hex: '#F0EDE8', border: '#CCCCCC' },
  { name: 'Chrome', hex: '#C0C0C0', border: '#AAAAAA' },
  { name: 'Black', hex: '#1C1C1C' },
  { name: 'Gold', hex: '#B8960C' },
  { name: 'Graphite', hex: '#4A4A4A' },
  { name: 'Brushed Steel', hex: '#A8A9AD' },
]

const STEP_CONFIG = [
  { number: 1, Icon: Palette, tooltip: 'Colour' },
  { number: 2, Icon: Layers, tooltip: 'Glazing' },
  { number: 3, Icon: Grip, tooltip: 'Hardware' },
  { number: 4, Icon: Plus, tooltip: 'Extras' },
  { number: 5, Icon: Maximize2, tooltip: 'Size' },
  { number: 6, Icon: ClipboardList, tooltip: 'Review' },
]

const SIDE_LIGHT_OPTIONS: { value: 'none' | 'left' | 'right' | 'both'; label: string; priceModifier: number }[] = [
  { value: 'none', label: 'No side light', priceModifier: 0 },
  { value: 'left', label: 'Left side panel', priceModifier: 200 },
  { value: 'right', label: 'Right side panel', priceModifier: 200 },
  { value: 'both', label: 'Both side panels', priceModifier: 400 },
]

const TRUST_BADGES = [
  'FENSA Registered Installers',
  'Vetted Installer Network',
  'Insurance Backed Guarantee',
]

// ─── Toggle component ──────────────────────────────────────────────────────────

function Toggle({ active }: { active: boolean }) {
  return (
    <div
      className={`w-10 h-6 rounded-full flex items-center transition-colors flex-shrink-0 ${
        active ? 'bg-brand' : 'bg-hairline'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-paper shadow-sm transition-transform mx-1 ${
          active ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DoorPDPPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useBasketStore((s) => s.addItem)

  const door = doorProducts.find((d) => d.slug === slug)

  useSEO({
    title: door ? door.seo.title : 'Composite Door | Windows & Doors Online',
    description: door ? door.seo.description : '',
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedColour, setSelectedColour] = useState<SelectedColour | null>(null)
  const [selectedGlazing, setSelectedGlazing] = useState<SelectedGlazing | null>(null)
  const [selectedHandle, setSelectedHandle] = useState<SelectedHandle | null>(null)
  const [letterbox, setLetterbox] = useState(false)
  const [knocker, setKnocker] = useState(false)
  const [doorNumbers, setDoorNumbers] = useState(false)
  const [topLight, setTopLight] = useState(false)
  const [sideLight, setSideLight] = useState<'none' | 'left' | 'right' | 'both'>('none')
  const [doorSize, setDoorSize] = useState<'standard' | 'large'>('standard')
  const [productReference, setProductReference] = useState('')
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [addedToBasket, setAddedToBasket] = useState(false)

  useEffect(() => {
    if (!door) return
    const glazingMod = selectedGlazing?.priceModifier ?? 0
    const handleMod = selectedHandle?.priceModifier ?? 0
    const furnitureMod = (letterbox ? 50 : 0) + (knocker ? 50 : 0) + (doorNumbers ? 25 : 0)
    const topLightMod = topLight ? 150 : 0
    const sideLightMod =
      sideLight === 'left' || sideLight === 'right' ? 200 : sideLight === 'both' ? 400 : 0
    const colourMod = selectedColour?.group === 'premium' ? 50 : 0
    const subtotal =
      door.basePrice + glazingMod + handleMod + furnitureMod + topLightMod + sideLightMod + colourMod
    const sizedSubtotal = doorSize === 'large' ? subtotal * 1.1 : subtotal
    setCalculatedPrice(Math.round(sizedSubtotal * 1.2))
  }, [door, selectedColour, selectedGlazing, selectedHandle, letterbox, knocker, doorNumbers, topLight, sideLight, doorSize])

  if (!door) {
    return (
      <Layout>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
          <EmptyState
            icon={Search}
            title="Door not found"
            description="We couldn't find that door. Browse our composite range below."
            actionLabel="Browse composite doors"
            onAction={() => navigate('/doors/composite')}
          />
        </div>
      </Layout>
    )
  }

  const isSolid = door.variantType === 'solid'

  function isStepComplete(step: number): boolean {
    switch (step) {
      case 1: return selectedColour !== null
      case 2: return selectedGlazing !== null
      case 3: return selectedHandle !== null
      case 4: return true
      case 5: return true
      case 6: return false
      default: return false
    }
  }

  function stepSummary(step: number): string {
    switch (step) {
      case 1:
        return selectedColour?.name ?? ''
      case 2:
        if (isSolid) return 'No glazing (solid door)'
        if (!selectedGlazing) return ''
        return selectedGlazing.type === 'clear'
          ? 'Clear'
          : selectedGlazing.type === 'obscure'
          ? 'Obscure'
          : 'Decorative'
      case 3: {
        if (!selectedHandle) return ''
        const extras = [
          letterbox ? '+ Letterbox' : '',
          knocker ? '+ Knocker' : '',
        ].filter(Boolean)
        return [selectedHandle.style, selectedHandle.finish, ...extras].join(' · ')
      }
      case 4: {
        const parts: string[] = []
        if (topLight) parts.push('Top light')
        const sideLightLabel = SIDE_LIGHT_OPTIONS.find((o) => o.value === sideLight)?.label
        if (sideLight !== 'none' && sideLightLabel) parts.push(sideLightLabel)
        return parts.length ? parts.join(' · ') : 'No extras'
      }
      case 5:
        return doorSize === 'large' ? 'Large door' : 'Standard door'
      default:
        return ''
    }
  }

  function goToStep(n: number) {
    setCurrentStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function advanceFromStep1() {
    if (isSolid) {
      setSelectedGlazing({ type: 'clear', priceModifier: 0 })
      goToStep(3)
    } else {
      goToStep(2)
    }
  }

  function handleAddToBasket() {
    if (!selectedColour || !selectedGlazing || !selectedHandle) return
    const variants: string[] = [selectedColour.name, selectedGlazing.type, selectedHandle.style, selectedHandle.finish]
    if (letterbox) variants.push('Letterbox')
    if (knocker) variants.push('Knocker')
    if (doorNumbers) variants.push('Door numbers')
    if (topLight) variants.push('Top light')
    if (sideLight !== 'none') variants.push(SIDE_LIGHT_OPTIONS.find((o) => o.value === sideLight)?.label ?? '')
    variants.push(doorSize === 'large' ? 'Large door' : 'Standard door')

    addItem({
      productId: door.id,
      productName: door.name,
      category: 'doors',
      selectedVariants: {
        colour: selectedColour.name,
        colourGroup: selectedColour.group,
        glazing: selectedGlazing.type,
        handleStyle: selectedHandle.style,
        handleFinish: selectedHandle.finish,
        letterbox: letterbox.toString(),
        knocker: knocker.toString(),
        doorNumbers: doorNumbers.toString(),
        topLight: topLight.toString(),
        sideLight,
        size: doorSize,
        reference: productReference,
      },
      variantSummary: variants.join(', '),
      indicativePrice: calculatedPrice,
      quantity: 1,
    })
    setAddedToBasket(true)
  }

  const priceFormatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(calculatedPrice)

  // Steps to show in the header (always 6, but step 2 shows as complete for solid)
  const completedStepsAboveCurrent = [1, 2, 3, 4, 5].filter((n) => {
    if (n >= currentStep) return false
    if (n === 2 && isSolid) return false
    return true
  })

  return (
    <Layout>
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-paper border-b border-hairline py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-xs text-ink-muted font-sans flex-shrink-0">
            <span className="uppercase tracking-wide">Composite Doors</span>
            <ChevronRight className="w-3 h-3 mx-0.5" />
            <span className="text-ink font-medium truncate max-w-[120px]">{door.name}</span>
          </div>

          <div className="flex items-center flex-1 justify-center gap-0">
            {STEP_CONFIG.map((step, index) => {
              const isActive = currentStep === step.number
              const isComplete = isStepComplete(step.number)
              const canNavigate = step.number < currentStep
              return (
                <React.Fragment key={step.number}>
                  {index > 0 && (
                    <div
                      className={`h-px w-5 flex-shrink-0 transition-colors ${
                        isStepComplete(step.number - 1) && isComplete ? 'bg-brand' : 'bg-hairline'
                      }`}
                    />
                  )}
                  <button
                    onClick={() => { if (canNavigate) setCurrentStep(step.number) }}
                    title={step.tooltip}
                    className="relative group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? 'bg-brand text-paper ring-2 ring-brand ring-offset-2'
                          : isComplete
                          ? 'bg-brand text-paper'
                          : 'bg-surface border border-hairline text-ink-muted opacity-50'
                      }`}
                    >
                      <step.Icon className="w-4 h-4" />
                      {isComplete && !isActive && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-paper border border-brand flex items-center justify-center">
                          <Check className="w-2 h-2 text-brand" />
                        </span>
                      )}
                    </div>
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-ink text-paper text-xs font-sans px-2 py-1 rounded-sm whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {step.tooltip}
                    </span>
                  </button>
                </React.Fragment>
              )
            })}
          </div>

          <div className="flex flex-col items-end flex-shrink-0">
            <span className="font-mono text-base font-medium text-ink">{priceFormatted}</span>
            <span className="font-sans text-xs text-ink-muted italic">Inc. VAT · indicative</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 items-start">
          {/* Left column */}
          <div className="lg:sticky lg:top-[72px]">
            <div className="overflow-hidden rounded-sm" style={{ aspectRatio: '3/4' }}>
              <img src={door.imageUrl} alt={door.name} className="w-full h-full object-cover" />
            </div>
            <p className="font-sans text-xs text-ink-muted italic text-center mt-2">
              Illustrative image — actual door style varies by range
            </p>
            <div className="mt-4 border border-hairline rounded-sm divide-y divide-hairline">
              {TRUST_BADGES.map((text) => (
                <div key={text} className="flex items-center gap-2 px-4 py-3">
                  <Check className="w-4 h-4 text-brand flex-shrink-0" strokeWidth={2.5} />
                  <span className="font-sans text-sm text-ink">{text}</span>
                </div>
              ))}
            </div>
            <div className="lg:hidden mt-6">
              <h1 className="font-display text-2xl text-ink">{door.name}</h1>
              <PriceDisplay price={calculatedPrice} size="medium" className="mt-2" />
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="hidden lg:block mb-6">
              <h1 className="font-display text-3xl text-ink mb-2">{door.seo.h1}</h1>
              <p className="font-sans text-ink-muted text-base leading-relaxed">{door.shortDescription}</p>
            </div>

            {!addedToBasket && (
              <>
                {/* Completed step rows */}
                {completedStepsAboveCurrent.map((n) => (
                  <div key={n} className="flex justify-between items-center py-3 border-b border-hairline">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-brand uppercase tracking-wide w-16 flex-shrink-0">
                        Step {String(n).padStart(2, '0')}
                      </span>
                      <span className="font-sans text-sm text-ink">{stepSummary(n)}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(n)}>
                      Edit
                    </Button>
                  </div>
                ))}

                <div className="pt-6">
                  {/* ── Step 1 — Colour ────────────────────────────────────── */}
                  {currentStep === 1 && (
                    <div>
                      <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                        Step 01 of 06
                      </p>
                      <h2 className="font-display text-3xl text-ink mb-2">Choose your colour</h2>
                      <p className="font-sans text-sm text-ink-muted mb-8">
                        External colour. All doors are white inside as standard.
                      </p>

                      <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-3">
                        Standard colours
                      </p>
                      <div className="flex flex-wrap gap-4 mb-6">
                        {STANDARD_COLOURS.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => setSelectedColour(c)}
                            title={c.name}
                            className="flex flex-col items-center gap-1.5"
                          >
                            <div
                              className={`w-10 h-10 rounded-full transition-all ${
                                selectedColour?.name === c.name
                                  ? 'ring-2 ring-brand ring-offset-2'
                                  : 'hover:scale-110'
                              }`}
                              style={{
                                backgroundColor: c.hex,
                                border: `1px solid ${c.border ?? 'rgba(0,0,0,0.15)'}`,
                              }}
                            />
                            <span className="font-sans text-xs text-ink text-center max-w-[56px] leading-tight">
                              {c.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-3">
                        Premium colours
                      </p>
                      <div className="flex flex-wrap gap-4 mb-6">
                        {PREMIUM_COLOURS.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => setSelectedColour(c)}
                            title={c.name}
                            className="flex flex-col items-center gap-1.5"
                          >
                            <div
                              className={`w-10 h-10 rounded-full transition-all ${
                                selectedColour?.name === c.name
                                  ? 'ring-2 ring-brand ring-offset-2'
                                  : 'hover:scale-110'
                              }`}
                              style={{
                                backgroundColor: c.hex,
                                border: `1px solid ${c.border ?? 'rgba(0,0,0,0.15)'}`,
                              }}
                            />
                            <span className="font-sans text-xs text-ink text-center max-w-[56px] leading-tight">
                              {c.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      {selectedColour && (
                        <p className="font-sans text-sm text-ink mb-4">
                          Selected: <strong>{selectedColour.name}</strong>
                          {selectedColour.group === 'premium' && (
                            <span className="text-ink-muted ml-2">(premium colour)</span>
                          )}
                        </p>
                      )}

                      <div className="bg-surface border border-hairline rounded-sm p-3 mb-8">
                        <p className="font-sans text-sm text-ink-muted">
                          Exact colour confirmed with your installer at survey. Colours shown are
                          representative.
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant="primary"
                          onClick={advanceFromStep1}
                          disabled={!selectedColour}
                        >
                          Continue →
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ── Step 2 — Glazing ───────────────────────────────────── */}
                  {currentStep === 2 && (
                    <div>
                      <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                        Step 02 of 06
                      </p>
                      <h2 className="font-display text-3xl text-ink mb-2">Choose your glazing</h2>
                      <p className="font-sans text-sm text-ink-muted mb-8">
                        Glass style for your door panel.
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {GLAZING_OPTIONS.map((opt) => (
                          <button
                            key={opt.type}
                            onClick={() => setSelectedGlazing(opt)}
                            className={`border rounded-sm p-4 text-left transition-colors ${
                              selectedGlazing?.type === opt.type
                                ? 'border-brand bg-brand bg-opacity-5'
                                : 'border-hairline bg-surface hover:border-brand'
                            }`}
                          >
                            <p className="font-display text-base text-ink mb-1">{opt.label}</p>
                            <p className="font-sans text-xs text-ink-muted">{opt.desc}</p>
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                          ← Back
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => goToStep(3)}
                          disabled={!selectedGlazing}
                        >
                          Continue →
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ── Step 3 — Hardware ──────────────────────────────────── */}
                  {currentStep === 3 && (
                    <div>
                      <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                        Step 03 of 06
                      </p>
                      <h2 className="font-display text-3xl text-ink mb-2">Choose your hardware</h2>
                      <p className="font-sans text-sm text-ink-muted mb-6">
                        Handle, finish and door furniture.
                      </p>

                      <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-3">
                        Handle style
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        {HANDLE_STYLES.map((h) => {
                          const isSelected = selectedHandle?.style === h.label
                          return (
                            <button
                              key={h.id}
                              onClick={() =>
                                setSelectedHandle((prev) => ({
                                  style: h.label,
                                  finish: prev?.finish ?? '',
                                  priceModifier: h.priceModifier,
                                }))
                              }
                              className={`border rounded-sm p-4 text-left transition-colors ${
                                isSelected
                                  ? 'border-brand bg-brand bg-opacity-5'
                                  : 'border-hairline bg-surface hover:border-brand'
                              }`}
                            >
                              <h.Icon className="w-5 h-5 text-ink-muted mb-2" strokeWidth={1.5} />
                              <p className="font-display text-sm text-ink">{h.label}</p>
                              <p className="font-sans text-xs text-ink-muted mt-0.5">{h.desc}</p>
                            </button>
                          )
                        })}
                      </div>

                      <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-3">
                        Handle finish
                      </p>
                      <div className="flex flex-wrap gap-3 mb-6">
                        {HANDLE_FINISHES.map((f) => {
                          const isSelected = selectedHandle?.finish === f.name
                          return (
                            <button
                              key={f.name}
                              onClick={() =>
                                setSelectedHandle((prev) => ({
                                  style: prev?.style ?? '',
                                  finish: f.name,
                                  priceModifier: prev?.priceModifier ?? 0,
                                }))
                              }
                              title={f.name}
                              className="flex flex-col items-center gap-1"
                            >
                              <div
                                className={`w-8 h-8 rounded-sm transition-all ${
                                  isSelected ? 'ring-2 ring-brand ring-offset-2' : 'hover:scale-110'
                                }`}
                                style={{
                                  backgroundColor: f.hex,
                                  border: `1px solid ${f.border ?? 'rgba(0,0,0,0.2)'}`,
                                }}
                              />
                              <span className="font-sans text-xs text-ink text-center max-w-[56px] leading-tight">
                                {f.name}
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-3">
                        Door furniture
                      </p>
                      <div className="border border-hairline rounded-sm divide-y divide-hairline mb-8">
                        {[
                          {
                            label: 'Letterbox',
                            desc: 'Standard letterbox plate',
                            active: letterbox,
                            toggle: () => setLetterbox((v) => !v),
                          },
                          {
                            label: 'Door knocker',
                            desc: 'Matching finish',
                            active: knocker,
                            toggle: () => setKnocker((v) => !v),
                          },
                          {
                            label: 'Door numbers',
                            desc: 'Matching finish',
                            active: doorNumbers,
                            toggle: () => setDoorNumbers((v) => !v),
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex justify-between items-center py-3 px-4 cursor-pointer hover:bg-surface"
                            onClick={item.toggle}
                          >
                            <div>
                              <p className="font-display text-sm text-ink">{item.label}</p>
                              <p className="font-sans text-xs text-ink-muted">{item.desc}</p>
                            </div>
                            <Toggle active={item.active} />
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="ghost"
                          onClick={() => setCurrentStep(isSolid ? 1 : 2)}
                        >
                          ← Back
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => goToStep(4)}
                          disabled={!selectedHandle?.style || !selectedHandle?.finish}
                        >
                          Continue →
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ── Step 4 — Extras ────────────────────────────────────── */}
                  {currentStep === 4 && (
                    <div>
                      <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                        Step 04 of 06
                      </p>
                      <h2 className="font-display text-3xl text-ink mb-2">Add extras</h2>
                      <p className="font-sans text-sm text-ink-muted mb-8">
                        All optional. Glazed panels above and beside your door.
                      </p>

                      <div className="border border-hairline rounded-sm divide-y divide-hairline mb-8">
                        <div
                          className="flex justify-between items-center py-3 px-4 cursor-pointer hover:bg-surface"
                          onClick={() => setTopLight((v) => !v)}
                        >
                          <div>
                            <p className="font-display text-sm text-ink">Top light</p>
                            <p className="font-sans text-xs text-ink-muted">
                              Glazed panel above the door — brings light into the hallway
                            </p>
                          </div>
                          <Toggle active={topLight} />
                        </div>
                      </div>

                      <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-3">
                        Side panels
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {SIDE_LIGHT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSideLight(opt.value)}
                            className={`border rounded-sm p-4 text-left transition-colors ${
                              sideLight === opt.value
                                ? 'border-brand bg-brand bg-opacity-5'
                                : 'border-hairline bg-surface hover:border-brand'
                            }`}
                          >
                            <p className="font-display text-sm text-ink">{opt.label}</p>
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setCurrentStep(3)}>
                          ← Back
                        </Button>
                        <Button variant="primary" onClick={() => goToStep(5)}>
                          Continue →
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ── Step 5 — Size ──────────────────────────────────────── */}
                  {currentStep === 5 && (
                    <div>
                      <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                        Step 05 of 06
                      </p>
                      <h2 className="font-display text-3xl text-ink mb-2">
                        Standard or large door?
                      </h2>
                      <p className="font-sans text-sm text-ink-muted mb-8">
                        Most UK homes have a standard door opening. Your surveyor will confirm exact
                        measurements on their visit.
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                          onClick={() => setDoorSize('standard')}
                          className={`border rounded-sm p-6 text-left transition-colors ${
                            doorSize === 'standard'
                              ? 'border-brand bg-brand bg-opacity-5'
                              : 'border-hairline bg-surface hover:border-brand'
                          }`}
                        >
                          <p className="font-display text-lg text-ink">Standard</p>
                          <p className="font-sans text-xs text-ink-muted mt-1">Up to 920mm wide</p>
                          <p className="font-sans text-xs text-ink-muted mt-2">
                            Suits the vast majority of UK homes.
                          </p>
                        </button>
                        <button
                          onClick={() => setDoorSize('large')}
                          className={`border rounded-sm p-6 text-left transition-colors ${
                            doorSize === 'large'
                              ? 'border-brand bg-brand bg-opacity-5'
                              : 'border-hairline bg-surface hover:border-brand'
                          }`}
                        >
                          <p className="font-display text-lg text-ink">Large door</p>
                          <p className="font-sans text-xs text-ink-muted mt-1">Over 920mm wide</p>
                          <p className="font-sans text-xs text-ink-muted mt-2">
                            Common in newer builds and converted properties.
                          </p>
                        </button>
                      </div>

                      <div className="bg-surface border border-hairline rounded-sm p-4 mb-8">
                        <p className="font-sans text-sm text-ink-muted">
                          Not sure? Select standard. Your installer will identify any adjustment
                          needed at survey and discuss it with you before any work begins.
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setCurrentStep(4)}>
                          ← Back
                        </Button>
                        <Button variant="primary" onClick={() => goToStep(6)}>
                          Continue →
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ── Step 6 — Review ────────────────────────────────────── */}
                  {currentStep === 6 && (
                    <div>
                      <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                        Step 06 of 06
                      </p>
                      <h2 className="font-display text-3xl text-ink mb-6">Review your door</h2>

                      <div className="bg-brand rounded-sm p-6 mb-6">
                        <p className="font-sans text-xs text-paper opacity-70 uppercase tracking-wide mb-4">
                          Your configuration
                        </p>

                        {(
                          [
                            ['Door', door.name],
                            ['Range', door.rangeName],
                            ['Colour', selectedColour?.name ?? '—'],
                            ['Glazing', isSolid ? 'None (solid door)' : selectedGlazing?.type ?? '—'],
                            ['Handle', selectedHandle?.style ?? '—'],
                            ['Handle finish', selectedHandle?.finish ?? '—'],
                            ['Letterbox', letterbox ? 'Yes' : 'No'],
                            ['Door knocker', knocker ? 'Yes' : 'No'],
                            ['Door numbers', doorNumbers ? 'Yes' : 'No'],
                            ['Top light', topLight ? 'Yes' : 'No'],
                            ['Side panels', SIDE_LIGHT_OPTIONS.find((o) => o.value === sideLight)?.label ?? 'None'],
                            ['Size', doorSize === 'large' ? 'Large door' : 'Standard door'],
                          ] as [string, string][]
                        ).map(([label, value]) => (
                          <div key={label} className="flex justify-between py-1">
                            <span className="font-sans text-sm text-paper opacity-75">{label}</span>
                            <span className="font-sans text-sm text-paper font-medium">{value}</span>
                          </div>
                        ))}

                        <div className="border-t border-paper border-opacity-20 my-4" />

                        {/* Price breakdown */}
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between">
                            <span className="font-sans text-xs text-paper opacity-70">
                              {door.name} (base price)
                            </span>
                            <span className="font-mono text-xs text-paper">
                              £{door.basePrice.toLocaleString('en-GB')}
                            </span>
                          </div>
                          {selectedColour?.group === 'premium' && (
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">Premium colour</span>
                              <span className="font-mono text-xs text-paper">+ £50</span>
                            </div>
                          )}
                          {selectedGlazing && selectedGlazing.priceModifier > 0 && (
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">
                                {selectedGlazing.type === 'obscure' ? 'Obscure glazing' : 'Decorative glazing'}
                              </span>
                              <span className="font-mono text-xs text-paper">+ £{selectedGlazing.priceModifier}</span>
                            </div>
                          )}
                          {selectedHandle && selectedHandle.priceModifier > 0 && (
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">{selectedHandle.style}</span>
                              <span className="font-mono text-xs text-paper">+ £{selectedHandle.priceModifier}</span>
                            </div>
                          )}
                          {letterbox && (
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">Letterbox</span>
                              <span className="font-mono text-xs text-paper">+ £50</span>
                            </div>
                          )}
                          {knocker && (
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">Door knocker</span>
                              <span className="font-mono text-xs text-paper">+ £50</span>
                            </div>
                          )}
                          {doorNumbers && (
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">Door numbers</span>
                              <span className="font-mono text-xs text-paper">+ £25</span>
                            </div>
                          )}
                          {topLight && (
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">Top light</span>
                              <span className="font-mono text-xs text-paper">+ £150</span>
                            </div>
                          )}
                          {sideLight !== 'none' && (
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">
                                {SIDE_LIGHT_OPTIONS.find((o) => o.value === sideLight)?.label}
                              </span>
                              <span className="font-mono text-xs text-paper">
                                + £{SIDE_LIGHT_OPTIONS.find((o) => o.value === sideLight)?.priceModifier}
                              </span>
                            </div>
                          )}
                          {doorSize === 'large' && (
                            <div className="flex justify-between">
                              <span className="font-sans text-xs text-paper opacity-70">Large door (+ 10%)</span>
                              <span className="font-mono text-xs text-paper">included above</span>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-paper border-opacity-20 my-3" />
                        <div className="flex justify-between mb-1">
                          <span className="font-sans text-xs text-paper opacity-70">VAT (20%)</span>
                          <span className="font-mono text-xs text-paper">included</span>
                        </div>
                        <div className="border-t border-paper border-opacity-20 my-3" />
                        <div className="flex justify-between">
                          <span className="font-display text-base text-paper">
                            Indicative installed price
                          </span>
                          <span className="font-mono text-lg text-paper">{priceFormatted}</span>
                        </div>
                        <p className="font-sans text-xs text-paper opacity-60 mt-2">
                          Confirmed at survey. No payment today.
                        </p>
                      </div>

                      <div className="mb-6">
                        <label className="font-sans text-sm font-medium text-ink block mb-1">
                          Your reference (optional)
                        </label>
                        <input
                          type="text"
                          maxLength={40}
                          placeholder="e.g. Front door, master bedroom"
                          value={productReference}
                          onChange={(e) => setProductReference(e.target.value)}
                          className="w-full border border-hairline rounded-sm px-3 py-2 font-sans text-sm text-ink bg-paper focus:outline-none focus:border-brand"
                        />
                        <p className="font-sans text-xs text-ink-muted mt-1">
                          Helps your installer identify the door on their visit.
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={() => setCurrentStep(5)}>
                          ← Back
                        </Button>
                        <Button
                          variant="accent"
                          size="lg"
                          onClick={handleAddToBasket}
                          disabled={!selectedColour || !selectedGlazing || !selectedHandle?.style || !selectedHandle?.finish}
                        >
                          Add to Quote
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Success state */}
            {addedToBasket && (
              <div className="space-y-3 pt-6">
                <Alert variant="success" message="Added to your quote" />
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/doors/composite')}
                >
                  Add another door
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/basket')}
                >
                  View quote
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/doors')}
                >
                  Continue browsing
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Below fold */}
        <div className="border-t border-hairline pt-16 mt-8 space-y-16">
          <div>
            <h2 className="font-display text-2xl text-ink mb-6">What's included</h2>
            <ul className="space-y-3">
              {door.included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="font-sans text-base text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-6">Frequently asked questions</h2>
            <FAQ items={door.faqs} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
