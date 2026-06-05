import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Check, ChevronRight, Search } from 'lucide-react'
import { Layout } from '../components/Layout'
import { SchemaTag } from '../components/SchemaTag'
import { Button } from '../components/ds/Button'
import { Alert } from '../components/ds/Alert'
import { FAQ } from '../components/ds/FAQ'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { EmptyState } from '../components/ds/EmptyState'
import { Loading } from '../components/ds/Loading'
import { useSEO } from '../utils/seo'
import { productSchema, faqSchema } from '../utils/schema'
import { products } from '../data/products'
import { useBasketStore } from '../store/basketStore'
import { calculateWindowPrice, usePricingData } from '../pricing'
import type { WindowQuoteResult } from '../pricing'

const STEP_LABELS = ['Size', 'Openers', 'Frame', 'Glazing', 'Colour']

const COMMON_WIDTHS_MM = [500, 600, 700, 800, 900, 1000, 1100, 1200]
const COMMON_HEIGHTS_MM = [500, 600, 700, 800, 900, 1000, 1100, 1200, 1400]

type ColourType = 'white' | 'standard' | 'premium'
type GlazingType = 'clear' | 'obscure' | 'decorative'

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

interface StepDotProps {
  index: number
  current: number
  label: string
  total: number
  onClick: (i: number) => void
}

function StepDot({ index, current, label, total, onClick }: StepDotProps) {
  const completed = index < current
  const active = index === current
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => completed && onClick(index)}
          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs transition-all ${
            completed
              ? 'bg-brand bg-opacity-40 text-paper cursor-pointer'
              : active
              ? 'bg-brand text-paper'
              : 'bg-surface border border-hairline text-ink-muted cursor-default'
          }`}
        >
          {completed ? <Check className="w-3 h-3" strokeWidth={2.5} /> : index + 1}
        </button>
        <span className="hidden md:block font-sans text-xs text-ink-muted whitespace-nowrap">
          {label}
        </span>
      </div>
      {index < total - 1 && <div className="w-8 h-px bg-hairline mb-4 mx-1" />}
    </div>
  )
}

export function WindowPDPPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useBasketStore((s) => s.addItem)
  const { windows: windowData, loading: pricingLoading } = usePricingData()
  const stickyRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)

  const product = products.find((p) => p.slug === slug && p.category === 'windows')

  useSEO({
    title: product ? product.seo.title : 'Window | Windows & Doors Online',
    description: product ? product.seo.description : '',
  })

  // Step state
  const [currentStep, setCurrentStep] = useState(0)

  // Step 1 — Size
  const [measureUnit, setMeasureUnit] = useState<'MM' | 'CM'>('MM')
  const [widthSelect, setWidthSelect] = useState<string | null>(null)
  const [heightSelect, setHeightSelect] = useState<string | null>(null)
  const [widthCustom, setWidthCustom] = useState('')
  const [heightCustom, setHeightCustom] = useState('')

  // Step 2 — Openers
  const [openers, setOpeners] = useState<0 | 1 | 2 | 3>(0)

  // Step 3 — Frame
  const [isFlushCasement, setIsFlushCasement] = useState(false)
  const [georgianBar, setGeorgianBar] = useState(false)
  const [midRail, setMidRail] = useState(false)
  const [leading, setLeading] = useState(false)

  // Step 4 — Glazing
  const [glazing, setGlazing] = useState<GlazingType>('clear')

  // Step 5 — Colour
  const [colourType, setColourType] = useState<ColourType>('white')

  const [added, setAdded] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (stickyRef.current) {
        setIsSticky(window.scrollY > stickyRef.current.offsetTop - 64)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toMm(select: string | null, custom: string): number | null {
    if (!select) return null
    const raw = select === 'custom' ? custom : select
    if (!raw) return null
    const n = parseFloat(raw)
    if (isNaN(n) || n <= 0) return null
    return measureUnit === 'CM' ? n * 10 : n
  }

  const widthMm = toMm(widthSelect, widthCustom)
  const heightMm = toMm(heightSelect, heightCustom)
  const hasMeasurements = widthMm !== null && heightMm !== null

  const glazingModifier = glazing === 'obscure' ? 50 : glazing === 'decorative' ? 150 : 0

  const priceResult = useMemo((): WindowQuoteResult | null => {
    if (!hasMeasurements || !windowData || widthMm === null || heightMm === null) return null
    try {
      return calculateWindowPrice(
        {
          widthMm,
          heightMm,
          openers,
          midRail,
          leading,
          georgianBar,
          flushCasement: isFlushCasement,
          colourType,
        },
        windowData
      )
    } catch {
      return null
    }
  }, [
    widthMm,
    heightMm,
    openers,
    midRail,
    leading,
    georgianBar,
    isFlushCasement,
    colourType,
    windowData,
    hasMeasurements,
  ])

  const calculatedPrice = useMemo((): number | null => {
    if (!priceResult) return null
    const glazingSubtotal = priceResult.subtotal + glazingModifier
    const colourUplift = glazingSubtotal * priceResult.colourUpliftPct
    return Math.round(glazingSubtotal + colourUplift)
  }, [priceResult, glazingModifier])

  const subtotalForColour = useMemo((): number => {
    if (!priceResult) return 0
    return priceResult.subtotal + glazingModifier
  }, [priceResult, glazingModifier])

  function handleAddToQuote() {
    if (!product) return
    const parts: string[] = []
    if (widthMm && heightMm)
      parts.push(`${widthMm}mm × ${heightMm}mm`)
    if (openers > 0) parts.push(`${openers} opener${openers > 1 ? 's' : ''}`)
    if (isFlushCasement) parts.push('flush casement')
    if (glazing !== 'clear') parts.push(glazing + ' glass')
    if (georgianBar) parts.push('georgian bar')
    if (midRail) parts.push('mid rail')
    if (leading) parts.push('leading')
    if (colourType !== 'white') parts.push(colourType + ' colour')

    addItem({
      productId: product.id,
      productName: product.name,
      category: 'windows',
      selectedVariants: {
        widthMm: String(widthMm ?? ''),
        heightMm: String(heightMm ?? ''),
        openers: String(openers),
        flushCasement: isFlushCasement.toString(),
        glazing,
        georgianBar: georgianBar.toString(),
        midRail: midRail.toString(),
        leading: leading.toString(),
        colour: colourType,
      },
      variantSummary: parts.join(', '),
      indicativePrice: calculatedPrice ?? 0,
      quantity: 1,
    })
    setAdded(true)
  }

  function handleAddAnother() {
    setWidthSelect(null)
    setHeightSelect(null)
    setWidthCustom('')
    setHeightCustom('')
    setAdded(false)
    setCurrentStep(0)
    setTimeout(() => {
      rightColRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
          <EmptyState
            icon={Search}
            title="Product not found"
            description="We couldn't find that window. Browse our full range below."
            actionLabel="Browse windows"
            onAction={() => navigate('/shop?category=windows')}
          />
        </div>
      </Layout>
    )
  }

  if (pricingLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <Loading />
        </div>
      </Layout>
    )
  }

  const displayPrice = calculatedPrice ?? product.basePrice

  return (
    <Layout>
      <SchemaTag schema={productSchema(product)} />
      <SchemaTag schema={faqSchema(product.faqs)} />

      {/* Sticky header */}
      <div
        ref={stickyRef}
        className={`sticky top-0 z-30 bg-paper border-b border-hairline transition-shadow ${
          isSticky ? 'shadow-raised' : ''
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-3 flex items-center gap-4">
          <div className="hidden sm:flex items-center flex-1 min-w-0">
            <span className="font-sans text-xs text-ink-muted uppercase tracking-wide">
              Windows
            </span>
            <ChevronRight className="w-3 h-3 text-ink-muted mx-1 flex-shrink-0" />
            <span className="font-display text-base text-ink truncate">{product.name}</span>
          </div>
          <div className="flex items-center justify-center flex-1">
            {STEP_LABELS.map((label, i) => (
              <StepDot
                key={i}
                index={i}
                current={currentStep}
                label={label}
                total={5}
                onClick={setCurrentStep}
              />
            ))}
          </div>
          <div className="flex-1 flex justify-end">
            <div className="text-right">
              <p className="font-sans text-[10px] uppercase tracking-wider text-ink-muted">
                {calculatedPrice ? 'Installed price' : 'From'}
              </p>
              <p className="font-mono font-medium text-xl text-ink">
                £{displayPrice.toLocaleString('en-GB')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-10 mb-16 items-start">
          {/* Left column */}
          <div className="lg:sticky lg:top-[72px]">
            <div className="aspect-square bg-surface overflow-hidden rounded-sm">
              <img
                src={product.imageUrl}
                alt={`${product.name} installed`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              {[
                'FENSA Registered Installers',
                'Vetted Installer Network',
                'Insurance Backed Guarantee',
              ].map((text, i, arr) => (
                <div
                  key={text}
                  className={`flex items-center gap-2 py-2 ${
                    i < arr.length - 1 ? 'border-b border-hairline' : ''
                  }`}
                >
                  <Check className="w-4 h-4 text-brand flex-shrink-0" strokeWidth={2.5} />
                  <span className="font-sans text-sm text-ink">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div ref={rightColRef}>
            <div className="mb-6">
              <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">
                {product.seo.h1}
              </h1>
              <p className="font-sans text-ink-muted text-base leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {!added && (
              <div className="bg-surface rounded-sm border border-hairline p-6 md:p-8 mb-6">
                {/* Step 1 — Size */}
                {currentStep === 0 && (
                  <>
                    <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                      Step 01 of 05
                    </p>
                    <h2 className="font-display text-3xl text-ink mb-2">
                      What size is your window?
                    </h2>
                    <p className="font-sans text-sm text-ink-muted mb-8">
                      Measure your existing frame, not the glass. If you are unsure, select the
                      closest size — your surveyor will confirm exact measurements.
                    </p>

                    {/* Unit toggle */}
                    <div className="flex gap-2 mb-5">
                      {(['MM', 'CM'] as const).map((u) => (
                        <button
                          key={u}
                          onClick={() => setMeasureUnit(u)}
                          className={`px-4 py-1.5 border font-sans text-sm rounded transition-colors ${
                            measureUnit === u
                              ? 'bg-ink text-paper border-ink'
                              : 'bg-paper border-hairline text-ink hover:border-brand'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Width */}
                      <div>
                        <p className="font-sans text-sm font-medium text-ink uppercase tracking-wide mb-3">
                          Width ({measureUnit})
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {(measureUnit === 'CM'
                            ? COMMON_WIDTHS_MM.map((v) => v / 10)
                            : COMMON_WIDTHS_MM
                          ).map((v) => (
                            <button
                              key={v}
                              onClick={() => setWidthSelect(String(measureUnit === 'CM' ? v * 10 : v))}
                              className={`border rounded-sm py-2 font-sans text-sm transition-colors ${
                                widthSelect === String(measureUnit === 'CM' ? v * 10 : v)
                                  ? 'bg-brand text-paper border-brand'
                                  : 'bg-surface text-ink border-hairline hover:border-brand'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                          <button
                            onClick={() => setWidthSelect('custom')}
                            className={`border rounded-sm py-2 font-sans text-sm transition-colors ${
                              widthSelect === 'custom'
                                ? 'bg-brand text-paper border-brand'
                                : 'bg-surface text-ink border-hairline hover:border-brand'
                            }`}
                          >
                            Custom
                          </button>
                        </div>
                        {widthSelect === 'custom' && (
                          <input
                            type="number"
                            value={widthCustom}
                            onChange={(e) => setWidthCustom(e.target.value)}
                            placeholder={`e.g. ${measureUnit === 'CM' ? '95' : '950'}`}
                            className="mt-2 w-full border border-hairline bg-paper font-sans text-sm text-ink px-3 py-2.5 rounded focus:outline-none focus:border-brand"
                          />
                        )}
                      </div>

                      {/* Height */}
                      <div>
                        <p className="font-sans text-sm font-medium text-ink uppercase tracking-wide mb-3">
                          Height ({measureUnit})
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {(measureUnit === 'CM'
                            ? COMMON_HEIGHTS_MM.map((v) => v / 10)
                            : COMMON_HEIGHTS_MM
                          ).map((v) => (
                            <button
                              key={v}
                              onClick={() => setHeightSelect(String(measureUnit === 'CM' ? v * 10 : v))}
                              className={`border rounded-sm py-2 font-sans text-sm transition-colors ${
                                heightSelect === String(measureUnit === 'CM' ? v * 10 : v)
                                  ? 'bg-brand text-paper border-brand'
                                  : 'bg-surface text-ink border-hairline hover:border-brand'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                          <button
                            onClick={() => setHeightSelect('custom')}
                            className={`border rounded-sm py-2 font-sans text-sm transition-colors ${
                              heightSelect === 'custom'
                                ? 'bg-brand text-paper border-brand'
                                : 'bg-surface text-ink border-hairline hover:border-brand'
                            }`}
                          >
                            Custom
                          </button>
                        </div>
                        {heightSelect === 'custom' && (
                          <input
                            type="number"
                            value={heightCustom}
                            onChange={(e) => setHeightCustom(e.target.value)}
                            placeholder={`e.g. ${measureUnit === 'CM' ? '120' : '1200'}`}
                            className="mt-2 w-full border border-hairline bg-paper font-sans text-sm text-ink px-3 py-2.5 rounded focus:outline-none focus:border-brand"
                          />
                        )}
                      </div>
                    </div>

                    {hasMeasurements && priceResult && (
                      <div className="bg-surface border border-hairline rounded-sm p-4 mb-6">
                        <p className="font-sans text-sm text-ink-muted">
                          Combined measurement: {priceResult.combinedMm}mm — Price band: up to{' '}
                          {priceResult.band}mm
                        </p>
                        <p className="font-mono text-base text-ink mt-1">
                          £{priceResult.basePrice.toLocaleString('en-GB')} base
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end mt-6">
                      <Button
                        variant="primary"
                        disabled={!hasMeasurements}
                        onClick={() => setCurrentStep(1)}
                      >
                        Continue →
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 2 — Openers */}
                {currentStep === 1 && (
                  <>
                    <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                      Step 02 of 05
                    </p>
                    <h2 className="font-display text-3xl text-ink mb-2">
                      How many opening lights?
                    </h2>
                    <p className="font-sans text-sm text-ink-muted mb-8">
                      An opening light is a section of the window that opens. Fixed windows have
                      none. Most casement windows have one.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {(
                        [
                          {
                            count: 0 as const,
                            title: 'Fixed',
                            subtitle: 'No openers',
                            price: 'Included',
                            desc: 'The whole window is fixed. Maximum glazed area. No ventilation.',
                          },
                          {
                            count: 1 as const,
                            title: '1 Opener',
                            subtitle: '',
                            price: '+ £242',
                            desc: 'One section opens. Suits most standard windows.',
                          },
                          {
                            count: 2 as const,
                            title: '2 Openers',
                            subtitle: '',
                            price: '+ £484',
                            desc: 'Two sections open. Ideal for wider windows.',
                          },
                          {
                            count: 3 as const,
                            title: '3 Openers',
                            subtitle: '',
                            price: '+ £726',
                            desc: 'Three sections open. For large bay or picture window configurations.',
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.count}
                          onClick={() => setOpeners(opt.count)}
                          className={`border rounded-sm p-4 text-left transition-colors ${
                            openers === opt.count
                              ? 'border-brand bg-brand bg-opacity-5'
                              : 'border-hairline bg-surface hover:border-brand'
                          }`}
                        >
                          <p className="font-display text-base text-ink">{opt.title}</p>
                          {opt.subtitle && (
                            <p className="font-sans text-xs text-ink-muted">{opt.subtitle}</p>
                          )}
                          <p className="font-mono text-sm text-ink-muted mt-1">{opt.price}</p>
                          <p className="font-sans text-xs text-ink-muted mt-2">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-10">
                      <Button variant="ghost" onClick={() => setCurrentStep(0)}>
                        ← Back
                      </Button>
                      <Button variant="primary" onClick={() => setCurrentStep(2)}>
                        Continue →
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3 — Frame */}
                {currentStep === 2 && (
                  <>
                    <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                      Step 03 of 05
                    </p>
                    <h2 className="font-display text-3xl text-ink mb-2">
                      Choose your frame style
                    </h2>
                    <p className="font-sans text-sm text-ink-muted mb-8">
                      The frame style affects the look and feel of the window. Standard frames suit
                      most homes. Flush casements have a sleeker, more contemporary profile.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {(
                        [
                          {
                            id: false,
                            title: 'Standard Casement',
                            price: 'Included',
                            desc: 'Classic uPVC profile. Suits traditional and modern homes alike. Our most popular choice.',
                          },
                          {
                            id: true,
                            title: 'Flush Casement',
                            price: '+ £363',
                            desc: 'The sash sits flush with the outer frame for a clean, contemporary look. Popular on new builds and modern extensions.',
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={String(opt.id)}
                          onClick={() => setIsFlushCasement(opt.id)}
                          className={`border rounded-sm p-6 text-left transition-colors ${
                            isFlushCasement === opt.id
                              ? 'border-brand bg-brand bg-opacity-5'
                              : 'border-hairline bg-surface hover:border-brand'
                          }`}
                        >
                          <p className="font-display text-lg text-ink">{opt.title}</p>
                          <p className="font-mono text-sm text-ink-muted mt-1">{opt.price}</p>
                          <p className="font-sans text-xs text-ink-muted mt-2">{opt.desc}</p>
                        </button>
                      ))}
                    </div>

                    <h3 className="font-display text-xl text-ink mb-4 mt-8">
                      Decorative options
                    </h3>
                    <p className="font-sans text-sm text-ink-muted mb-6">
                      Optional. Add character to your window with these decorative features.
                    </p>
                    {(
                      [
                        {
                          label: 'Georgian Bar',
                          price: '+ £50',
                          desc: 'Divides the glass into smaller panes for a traditional look.',
                          active: georgianBar,
                          toggle: () => setGeorgianBar((v) => !v),
                        },
                        {
                          label: 'Mid Rail',
                          price: '+ £20',
                          desc: 'A horizontal bar across the middle of the frame.',
                          active: midRail,
                          toggle: () => setMidRail((v) => !v),
                        },
                        {
                          label: 'Leading',
                          price: '+ £50',
                          desc: 'Decorative lead effect applied to the glass.',
                          active: leading,
                          toggle: () => setLeading((v) => !v),
                        },
                      ] as const
                    ).map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between border rounded-sm p-4 mb-3 cursor-pointer transition-colors ${
                          item.active
                            ? 'border-brand bg-brand bg-opacity-5'
                            : 'border-hairline bg-surface hover:border-brand'
                        }`}
                        onClick={item.toggle}
                      >
                        <div>
                          <p className="font-display text-base text-ink">{item.label}</p>
                          <p className="font-sans text-xs text-ink-muted mt-1">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="font-mono text-sm text-ink-muted">{item.price}</span>
                          <Toggle active={item.active} />
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between mt-10">
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                        ← Back
                      </Button>
                      <Button variant="primary" onClick={() => setCurrentStep(3)}>
                        Continue →
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 4 — Glazing */}
                {currentStep === 3 && (
                  <>
                    <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                      Step 04 of 05
                    </p>
                    <h2 className="font-display text-3xl text-ink mb-2">Choose your glazing</h2>
                    <p className="font-sans text-sm text-ink-muted mb-8">
                      All windows are A-rated energy efficient double glazed as standard. Choose
                      your glass style below.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(
                        [
                          {
                            id: 'clear' as const,
                            title: 'Clear Glass',
                            price: 'Included',
                            desc: 'Standard clear double glazing. Maximum light, unobstructed views.',
                          },
                          {
                            id: 'obscure' as const,
                            title: 'Obscure Glass',
                            price: '+ £50',
                            desc: 'Frosted glass for privacy. Common in bathrooms and ground floor windows.',
                          },
                          {
                            id: 'decorative' as const,
                            title: 'Decorative Glass',
                            price: '+ £150',
                            desc: 'A range of decorative glass patterns that add character and allow natural light while providing privacy.',
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setGlazing(opt.id)}
                          className={`border rounded-sm p-6 text-left transition-colors ${
                            glazing === opt.id
                              ? 'border-brand bg-brand bg-opacity-5'
                              : 'border-hairline bg-surface hover:border-brand'
                          }`}
                        >
                          <p className="font-display text-lg text-ink">{opt.title}</p>
                          <p className="font-mono text-sm text-ink-muted mt-1">{opt.price}</p>
                          <p className="font-sans text-xs text-ink-muted mt-2">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-10">
                      <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                        ← Back
                      </Button>
                      <Button variant="primary" onClick={() => setCurrentStep(4)}>
                        Continue →
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 5 — Colour */}
                {currentStep === 4 && (
                  <>
                    <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                      Step 05 of 05
                    </p>
                    <h2 className="font-display text-3xl text-ink mb-2">Choose your colour</h2>
                    <p className="font-sans text-sm text-ink-muted mb-6">
                      All colours apply externally. Your window is white inside as standard.
                    </p>
                    <div className="bg-surface border border-hairline rounded-sm p-4 mb-8">
                      <p className="font-sans text-sm text-ink-muted">
                        Colour is priced as a percentage of your total specification — including
                        frame, openers and any add-ons. This means the colour uplift reflects the
                        full scope of your window.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(
                        [
                          {
                            id: 'white' as const,
                            title: 'White',
                            subtitle: 'Standard — included',
                            price: 'No uplift',
                            uplift: null,
                            swatchClass: 'bg-gray-100 border border-hairline',
                            desc: 'Classic white uPVC. Our most popular choice. Suits all property types.',
                          },
                          {
                            id: 'standard' as const,
                            title: 'Standard Colour',
                            subtitle: '+20% on total',
                            price: '+20%',
                            uplift: Math.round(subtotalForColour * 0.2),
                            swatchClass:
                              'bg-gradient-to-r from-gray-700 via-green-700 to-amber-700',
                            desc: 'Includes Anthracite Grey, Black, Chartwell Green, Irish Oak and Cream. Exact colour confirmed at survey.',
                          },
                          {
                            id: 'premium' as const,
                            title: 'Premium Colour',
                            subtitle: '+30% on total',
                            price: '+30%',
                            uplift: Math.round(subtotalForColour * 0.3),
                            swatchClass: 'bg-gradient-to-r from-red-700 via-blue-700 to-yellow-500',
                            desc: 'Extended colour palette including RAL custom colours and specialist finishes. Exact colour confirmed at survey.',
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setColourType(opt.id)}
                          className={`border rounded-sm p-6 text-left transition-colors ${
                            colourType === opt.id
                              ? 'border-brand bg-brand bg-opacity-5'
                              : 'border-hairline bg-surface hover:border-brand'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full mb-3 ${opt.swatchClass}`} />
                          <p className="font-display text-lg text-ink">{opt.title}</p>
                          <p className="font-sans text-xs text-ink-muted">{opt.subtitle}</p>
                          <p className="font-mono text-sm text-ink-muted mt-1">{opt.price}</p>
                          {opt.uplift !== null && subtotalForColour > 0 && (
                            <p className="font-mono text-sm text-accent">
                              Currently + £{opt.uplift.toLocaleString('en-GB')}
                            </p>
                          )}
                          <p className="font-sans text-xs text-ink-muted mt-2">{opt.desc}</p>
                        </button>
                      ))}
                    </div>

                    {/* Price summary */}
                    {calculatedPrice !== null && priceResult && (
                      <div className="bg-brand p-6 rounded-sm mt-6">
                        <p className="font-sans text-sm text-paper opacity-70 uppercase tracking-wide mb-3">
                          Your configured price
                        </p>
                        <div className="space-y-1">
                          <div className="flex justify-between font-sans text-sm text-paper">
                            <span>Base window (up to {priceResult.band}mm band)</span>
                            <span className="font-mono">
                              £{priceResult.basePrice.toLocaleString('en-GB')}
                            </span>
                          </div>
                          {openers > 0 && (
                            <div className="flex justify-between font-sans text-sm text-paper">
                              <span>
                                {openers} opening light{openers > 1 ? 's' : ''}
                              </span>
                              <span className="font-mono">
                                + £{(242 * openers).toLocaleString('en-GB')}
                              </span>
                            </div>
                          )}
                          {isFlushCasement && (
                            <div className="flex justify-between font-sans text-sm text-paper">
                              <span>Flush casement</span>
                              <span className="font-mono">+ £363</span>
                            </div>
                          )}
                          {glazing !== 'clear' && (
                            <div className="flex justify-between font-sans text-sm text-paper">
                              <span>
                                {glazing === 'obscure' ? 'Obscure' : 'Decorative'} glass
                              </span>
                              <span className="font-mono">
                                + £{glazingModifier.toLocaleString('en-GB')}
                              </span>
                            </div>
                          )}
                          {georgianBar && (
                            <div className="flex justify-between font-sans text-sm text-paper">
                              <span>Georgian bar</span>
                              <span className="font-mono">+ £50</span>
                            </div>
                          )}
                          {midRail && (
                            <div className="flex justify-between font-sans text-sm text-paper">
                              <span>Mid rail</span>
                              <span className="font-mono">+ £20</span>
                            </div>
                          )}
                          {leading && (
                            <div className="flex justify-between font-sans text-sm text-paper">
                              <span>Leading</span>
                              <span className="font-mono">+ £50</span>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-paper border-opacity-20 my-3" />
                        <div className="flex justify-between font-sans text-sm text-paper">
                          <span>Subtotal</span>
                          <span className="font-mono">
                            £{subtotalForColour.toLocaleString('en-GB')}
                          </span>
                        </div>
                        {colourType !== 'white' && (
                          <div className="flex justify-between font-sans text-sm text-paper">
                            <span>
                              {colourType === 'standard' ? 'Standard' : 'Premium'} colour uplift (
                              +{colourType === 'standard' ? '20' : '30'}%)
                            </span>
                            <span className="font-mono">
                              + £
                              {Math.round(
                                subtotalForColour * (colourType === 'standard' ? 0.2 : 0.3)
                              ).toLocaleString('en-GB')}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-paper border-opacity-20 my-3" />
                        <div className="flex justify-between font-display text-lg text-paper">
                          <span>Indicative installed price</span>
                          <span className="font-mono">
                            £{calculatedPrice.toLocaleString('en-GB')}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-paper opacity-60 mt-2">
                          Per window — confirmed at survey. No payment today.
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-6">
                      <Button variant="ghost" onClick={() => setCurrentStep(3)}>
                        ← Back
                      </Button>
                      <Button
                        variant="accent"
                        size="lg"
                        onClick={handleAddToQuote}
                        disabled={calculatedPrice === null}
                      >
                        Add to Quote
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Success state */}
            {added && (
              <div className="space-y-3">
                <Alert variant="success" message="Added to your quote" />
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleAddAnother}
                >
                  Add Another — Same Spec, Different Size
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/basket')}
                >
                  View Quote
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/shop')}
                >
                  Continue Browsing
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Below fold */}
        <div className="border-t border-hairline pt-16 space-y-16">
          <div>
            <h2 className="font-display text-2xl text-ink mb-6">What's included</h2>
            <ul className="space-y-3">
              {product.included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="font-sans text-base text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {product.faqs.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-ink mb-6">
                Frequently asked questions
              </h2>
              <FAQ items={product.faqs} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
