import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Check, AlertCircle, Search } from 'lucide-react'
import { Layout } from '../components/Layout'
import { SchemaTag } from '../components/SchemaTag'
import { Button } from '../components/ds/Button'
import { Alert } from '../components/ds/Alert'
import { FAQ } from '../components/ds/FAQ'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { ProductCard } from '../components/ds/ProductCard'
import { EmptyState } from '../components/ds/EmptyState'
import { Loading } from '../components/ds/Loading'
import { useSEO } from '../utils/seo'
import { productSchema, faqSchema } from '../utils/schema'
import { products } from '../data/products'
import type { Product, ProductVariant } from '../data/products'
import { useBasketStore } from '../store/basketStore'
import {
  calculateWindowPrice,
  calculateDoorPrice,
  usePricingData,
} from '../pricing'
import type { WindowQuoteInput, DoorQuoteInput, WindowPricingData, DoorPricingData } from '../pricing'

const PRODUCT_SLUG_TO_SKU: Record<string, string> = {
  'composite-doors': 'CD-08',
  'upvc-doors':      'CD-146',
  'french-doors':    'CD-70',
  'patio-doors':     'CD-39',
}

function resolveColourType(priceModifier: number): WindowQuoteInput['colourType'] {
  if (priceModifier <= 0) return 'white'
  if (priceModifier <= 75) return 'standard'
  return 'premium'
}

interface PriceState {
  value: number
  fromEngine: boolean
  error: string | null
}

function calcFallbackPrice(product: Product, selections: Record<string, string>): number {
  let price = product.basePrice
  for (const variant of product.variants) {
    const selected = selections[variant.id]
    if (selected) {
      const opt = variant.options.find((o) => o.id === selected)
      if (opt) price += opt.priceModifier
    }
  }
  return price
}

function calcWindowEnginePrice(
  product: Product,
  selections: Record<string, string>,
  widthMm: number,
  heightMm: number,
  windowData: WindowPricingData,
): PriceState {
  try {
    const colourVariant = product.variants.find((v) => v.type === 'colour')
    const selectedColourId = colourVariant ? selections[colourVariant.id] : undefined
    const colourOpt = colourVariant?.options.find((o) => o.id === selectedColourId)
    const colourType = colourOpt ? resolveColourType(colourOpt.priceModifier) : 'white'

    const openerVariant = product.variants.find((v) => v.id === 'openers')
    const openerIdToCount: Record<string, number> = {
      no_opener: 0,
      one_opener: 1,
      two_openers: 2,
      three_openers: 3,
    }
    const openerRawId = openerVariant ? (selections[openerVariant.id] ?? 'no_opener') : 'no_opener'
    const openers = openerIdToCount[openerRawId] ?? (parseInt(openerRawId, 10) || 0)

    const midRailVariant = product.variants.find((v) => v.id === 'mid_rail')
    const midRail = midRailVariant ? selections[midRailVariant.id] === 'true' : false

    const georgianBarVariant = product.variants.find((v) => v.id === 'georgian_bar')
    const georgianBar = georgianBarVariant ? selections[georgianBarVariant.id] === 'true' : false

    const leadingVariant = product.variants.find((v) => v.id === 'leading')
    const leading = leadingVariant ? selections[leadingVariant.id] === 'true' : false

    const flushCasementVariant = product.variants.find((v) => v.id === 'flush_casement')
    const flushCasement = flushCasementVariant ? selections[flushCasementVariant.id] === 'true' : false

    const result = calculateWindowPrice(
      { widthMm, heightMm, openers, colourType, midRail, georgianBar, leading, flushCasement },
      windowData
    )
    return { value: result.totalPriceRounded, fromEngine: true, error: null }
  } catch (e) {
    return { value: 0, fromEngine: false, error: e instanceof Error ? e.message : 'Pricing error' }
  }
}

function calcDoorEnginePrice(
  product: Product,
  selections: Record<string, string>,
  doorData: DoorPricingData,
): PriceState {
  const skuId = PRODUCT_SLUG_TO_SKU[product.slug]
  if (!skuId) {
    return { value: calcFallbackPrice(product, selections), fromEngine: false, error: null }
  }
  try {
    const sizeVariant = product.variants.find((v) => v.type === 'size')
    const selectedSizeId = sizeVariant ? selections[sizeVariant.id] : undefined
    const isLargeDoor = selectedSizeId === 'wide' || selectedSizeId === 'large' || selectedSizeId === 'extra-large'

    const colourVariant = product.variants.find((v) => v.type === 'colour')
    const selectedColourId = colourVariant ? selections[colourVariant.id] : undefined
    const colourOpt = colourVariant?.options.find((o) => o.id === selectedColourId)
    const premiumColour = colourOpt ? colourOpt.priceModifier > 0 : false

    const sidePanelVariant = product.variants.find((v) => v.type === 'sidePanels')
    const selectedSidePanelId = sidePanelVariant ? selections[sidePanelVariant.id] : undefined
    const sideLight = !!selectedSidePanelId && selectedSidePanelId !== 'none'

    const input: DoorQuoteInput = {
      skuId, isLargeDoor, premiumColour, autoLock: false, letterbox: false,
      knocker: false, topLight: false, sideLight,
    }

    const result = calculateDoorPrice(input, doorData)
    return { value: result.totalPriceRounded, fromEngine: true, error: null }
  } catch {
    return { value: calcFallbackPrice(product, selections), fromEngine: false, error: null }
  }
}

// Map variant types to step labels
const STEP_TYPE_LABELS: Record<string, string> = {
  style: 'Style',
  colour: 'Colour',
  glazing: 'Glazing',
  size: 'Size',
  panels: 'Panels',
  sidePanels: 'Side Panels',
  addon: 'Options',
}

const COMMON_WIDTHS_MM = [500, 600, 700, 750, 800, 900, 1000, 1050, 1100, 1200]
const COMMON_HEIGHTS_MM = [800, 900, 1000, 1050, 1100, 1200, 1300, 1400, 1500]

interface StepDotProps {
  index: number
  currentStep: number
  label: string
  total: number
}

function StepDot({ index, currentStep, label, total }: StepDotProps) {
  const completed = index < currentStep
  const active = index === currentStep

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center gap-1">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            completed
              ? 'bg-brand'
              : active
              ? 'bg-brand ring-4 ring-brand ring-opacity-20'
              : 'bg-paper border-2 border-hairline'
          }`}
        >
          {completed ? (
            <Check className="w-3.5 h-3.5 text-paper" strokeWidth={2.5} />
          ) : (
            <span className={`font-mono text-xs font-bold ${active ? 'text-paper' : 'text-ink-muted'}`}>
              {index + 1}
            </span>
          )}
        </div>
        <span className={`font-sans text-[10px] uppercase tracking-wider whitespace-nowrap ${active ? 'text-brand font-semibold' : 'text-ink-muted'}`}>
          {label}
        </span>
      </div>
      {index < total - 1 && (
        <div className={`h-px w-8 sm:w-12 mb-4 mx-1 transition-colors ${index < currentStep ? 'bg-brand' : 'bg-hairline'}`} />
      )}
    </div>
  )
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useBasketStore((s) => s.addItem)
  const { windows: windowData, doors: doorData, loading: pricingLoading } = usePricingData()
  const stickyRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)

  const product = products.find((p) => p.slug === slug)

  useSEO({
    title: product ? product.seo.title : 'Product | Windows & Doors Online',
    description: product ? product.seo.description : '',
  })

  const [selections, setSelections] = useState<Record<string, string>>(() => {
    if (!product) return {}
    const init: Record<string, string> = {}
    for (const v of product.variants) {
      init[v.id] = v.options[0].id
    }
    return init
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [measureUnit, setMeasureUnit] = useState<'MM' | 'CM'>('MM')
  const [widthSelect, setWidthSelect] = useState('900')
  const [heightSelect, setHeightSelect] = useState('1200')
  const [widthCustom, setWidthCustom] = useState('')
  const [heightCustom, setHeightCustom] = useState('')
  const [added, setAdded] = useState(false)
  const sizeStepRef = useRef<HTMLDivElement>(null)

  // Sticky header scroll detection
  useEffect(() => {
    const onScroll = () => {
      if (stickyRef.current) {
        setIsSticky(window.scrollY > stickyRef.current.offsetTop - 64)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const priceState = useMemo((): PriceState => {
    if (!product) return { value: 0, fromEngine: false, error: null }

    const toMm = (select: string, custom: string) => {
      const raw = select === 'custom' ? custom : select
      if (!raw) return 0
      const n = parseFloat(raw)
      return isNaN(n) ? 0 : measureUnit === 'CM' ? n * 10 : n
    }

    const widthMm = toMm(widthSelect, widthCustom)
    const heightMm = toMm(heightSelect, heightCustom)
    const hasMeasurements = widthMm > 0 && heightMm > 0

    if (product.category === 'windows') {
      if (hasMeasurements && windowData) {
        return calcWindowEnginePrice(product, selections, widthMm, heightMm, windowData)
      }
      return { value: calcFallbackPrice(product, selections), fromEngine: false, error: null }
    }

    if (product.category === 'doors') {
      if (doorData) {
        return calcDoorEnginePrice(product, selections, doorData)
      }
      return { value: calcFallbackPrice(product, selections), fromEngine: false, error: null }
    }

    return { value: calcFallbackPrice(product, selections), fromEngine: false, error: null }
  }, [product, selections, widthSelect, heightSelect, widthCustom, heightCustom, measureUnit, windowData, doorData])

  if (!product) {
    return (
      <Layout>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
          <EmptyState
            icon={Search}
            title="Product not found"
            description="We couldn't find that product. Browse our full range below."
            actionLabel="Browse all products"
            onAction={() => navigate('/shop')}
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

  const relatedProducts = product.relatedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 3)

  // Build ordered steps from product variants
  const TYPE_ORDER = ['style', 'colour', 'glazing', 'size', 'panels', 'sidePanels']
  const steps: ProductVariant[] = [...product.variants].sort(
    (a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type)
  )

  // Append a size/measurement step for windows if they have no size variant
  const hasSizeVariant = steps.some((s) => s.type === 'size')
  const isWindow = product.category === 'windows'
  const totalSteps = isWindow && !hasSizeVariant ? steps.length + 1 : steps.length
  const isMeasurementStep = isWindow && !hasSizeVariant && currentStep === steps.length
  const isFinalStep = currentStep === totalSteps - 1

  function handleAddToBasket() {
    const variantSummary = product.variants
      .map((v) => {
        const sel = selections[v.id]
        const opt = v.options.find((o) => o.id === sel)
        return opt ? opt.label : ''
      })
      .filter(Boolean)
      .join(', ')

    addItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      selectedVariants: selections,
      variantSummary,
      indicativePrice: priceState.value,
      quantity: 1,
    })
    setAdded(true)
  }

  function handleAddAnother() {
    // Reset size inputs only, keep other selections
    setWidthSelect('900')
    setHeightSelect('1200')
    setWidthCustom('')
    setHeightCustom('')
    setAdded(false)
    // Jump to size step (last step)
    const sizeStepIndex = totalSteps - 1
    setCurrentStep(sizeStepIndex)
    setTimeout(() => {
      sizeStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const stepLabels = [
    ...steps.map((s) => STEP_TYPE_LABELS[s.type] || s.label),
    ...(isWindow && !hasSizeVariant ? ['Size'] : []),
  ]

  const currentVariant = !isMeasurementStep ? steps[currentStep] : null

  return (
    <Layout>
      <SchemaTag schema={productSchema(product)} />
      <SchemaTag schema={faqSchema(product.faqs)} />

      {/* ── STICKY HEADER ─────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className={`sticky top-0 z-30 bg-paper border-b border-hairline transition-shadow ${
          isSticky ? 'shadow-raised' : ''
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-3 flex items-center gap-4">
          {/* Product name */}
          <p className="font-display text-base text-ink hidden sm:block truncate flex-1 min-w-0">
            {product.name}
          </p>

          {/* Step dots */}
          <div className="flex items-center justify-center flex-1">
            {stepLabels.map((label, i) => (
              <StepDot
                key={i}
                index={i}
                currentStep={currentStep}
                label={label}
                total={totalSteps}
              />
            ))}
          </div>

          {/* Live price */}
          <div className="flex-1 flex justify-end">
            {!priceState.error && (
              <div className="text-right">
                <p className="font-sans text-[10px] uppercase tracking-wider text-ink-muted">From</p>
                <p className="font-display text-xl text-ink">
                  £{priceState.value.toLocaleString('en-GB')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-sans text-sm text-ink-muted mb-8">
          <Link to="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-ink transition-colors capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        {/* ── MAIN TWO-COLUMN ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-10 mb-16 items-start">

          {/* Left: image + badges */}
          <div className="lg:sticky lg:top-[72px]">
            <div className="aspect-square bg-surface overflow-hidden mb-4">
              <img
                src={product.imageUrl}
                alt={`${product.name} installed in a residential home`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2.5 mt-4">
              {[
                'FENSA Registered Installers',
                'Vetted Installer Network',
                'Insurance Backed Guarantee',
              ].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <Check className="text-brand w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
                  <span className="font-sans text-sm text-ink">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: step configurator */}
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">
              {product.seo.h1}
            </h1>
            <p className="font-sans text-ink-muted text-base mb-8 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Step panel */}
            <div ref={sizeStepRef} className="bg-surface rounded-sm border border-hairline p-6 md:p-8 mb-6">
              {/* Step label */}
              <p className="font-mono text-xs text-brand uppercase tracking-widest mb-1">
                Step {String(currentStep + 1).padStart(2, '0')} of {String(totalSteps).padStart(2, '0')}
              </p>

              {isMeasurementStep ? (
                <>
                  <h2 className="font-display text-2xl text-ink mb-2">Your window size</h2>
                  <p className="font-sans text-sm text-ink-muted mb-6">
                    Select your existing frame dimensions for an accurate installed price. Not sure? Choose the closest size — your surveyor will confirm on-site.
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
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-muted block mb-1">
                        Width ({measureUnit})
                      </label>
                      <select
                        value={widthSelect}
                        onChange={(e) => setWidthSelect(e.target.value)}
                        className="w-full border border-hairline bg-paper font-sans text-sm text-ink px-3 py-2.5 rounded focus:outline-none focus:border-brand"
                      >
                        {(measureUnit === 'CM' ? COMMON_WIDTHS_MM.map((v) => v / 10) : COMMON_WIDTHS_MM).map((v) => (
                          <option key={v} value={String(v)}>{v} {measureUnit}</option>
                        ))}
                        <option value="custom">Custom size</option>
                      </select>
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
                    <div>
                      <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-muted block mb-1">
                        Height ({measureUnit})
                      </label>
                      <select
                        value={heightSelect}
                        onChange={(e) => setHeightSelect(e.target.value)}
                        className="w-full border border-hairline bg-paper font-sans text-sm text-ink px-3 py-2.5 rounded focus:outline-none focus:border-brand"
                      >
                        {(measureUnit === 'CM' ? COMMON_HEIGHTS_MM.map((v) => v / 10) : COMMON_HEIGHTS_MM).map((v) => (
                          <option key={v} value={String(v)}>{v} {measureUnit}</option>
                        ))}
                        <option value="custom">Custom size</option>
                      </select>
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
                  <p className="font-sans text-xs text-ink-muted">
                    Measure the existing frame, not the glass
                  </p>
                </>
              ) : currentVariant ? (
                <>
                  <h2 className="font-display text-2xl text-ink mb-2">
                    Choose your {STEP_TYPE_LABELS[currentVariant.type]?.toLowerCase() ?? currentVariant.label.toLowerCase()}
                  </h2>
                  <p className="font-sans text-sm text-ink-muted mb-4">
                    {currentVariant.type === 'colour'
                      ? 'All colours include matching hardware. Premium finishes add to the base price.'
                      : currentVariant.type === 'glazing'
                      ? 'All glazing options are A-rated energy efficient double glazed units.'
                      : currentVariant.type === 'style'
                      ? 'Select the opening configuration that suits your room.'
                      : `Select your preferred ${currentVariant.label.toLowerCase()}.`}
                  </p>

                  {currentVariant.type === 'colour' && (
                    <div className="bg-surface border border-hairline rounded-sm p-3 mb-6 text-sm font-sans text-ink-muted">
                      All colours apply externally. Our standard windows are white inside — the colour you choose is for the outside face only.
                    </div>
                  )}

                  {currentVariant.type === 'colour' ? (
                    <>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
                        {currentVariant.options.map((opt) => {
                          const isSelected = selections[currentVariant.id] === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setSelections((s) => ({ ...s, [currentVariant.id]: opt.id }))}
                              className={`flex flex-col items-center gap-1.5 p-1 rounded transition-all focus:outline-none ${
                                isSelected ? 'ring-2 ring-brand ring-offset-1' : ''
                              }`}
                              title={opt.label}
                              aria-pressed={isSelected}
                            >
                              <div
                                className="w-14 h-14 rounded-full border-2 transition-transform hover:scale-105"
                                style={{
                                  backgroundColor: opt.hex,
                                  borderColor: isSelected
                                    ? 'var(--color-brand)'
                                    : opt.borderHex || 'transparent',
                                }}
                              />
                              <span className="font-sans text-[10px] text-ink-muted text-center leading-tight">
                                {opt.label.split(' ')[0]}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      {(() => {
                        const selectedOpt = currentVariant.options.find(
                          (o) => o.id === selections[currentVariant.id]
                        )
                        return selectedOpt ? (
                          <div className="bg-paper border border-hairline rounded px-4 py-2 inline-flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: selectedOpt.hex, borderColor: selectedOpt.borderHex || '#ccc' }}
                            />
                            <span className="font-sans text-sm text-ink">
                              {selectedOpt.label}
                              {selectedOpt.priceModifier > 0 && (
                                <span className="text-ink-muted"> — + £{selectedOpt.priceModifier}</span>
                              )}
                              {selectedOpt.priceModifier === 0 && (
                                <span className="text-ink-muted"> — Included</span>
                              )}
                            </span>
                          </div>
                        ) : null
                      })()}
                    </>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {currentVariant.options.map((opt) => {
                        const isSelected = selections[currentVariant.id] === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setSelections((s) => ({ ...s, [currentVariant.id]: opt.id }))}
                            className={`flex flex-col items-start p-4 border rounded transition-all text-left focus:outline-none ${
                              isSelected
                                ? 'border-brand bg-brand'
                                : 'border-hairline bg-paper hover:border-brand hover:bg-brand hover:bg-opacity-5'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-paper bg-opacity-20 flex items-center justify-center mb-2">
                                <Check className="w-3 h-3 text-paper" strokeWidth={2.5} />
                              </div>
                            )}
                            {!isSelected && (
                              <div className="w-5 h-5 rounded-full border-2 border-hairline mb-2" />
                            )}
                            <span className={`font-sans text-sm font-medium ${isSelected ? 'text-paper' : 'text-ink'}`}>{opt.label}</span>
                            {opt.priceModifier > 0 && (
                              <span className={`font-sans text-xs mt-0.5 ${isSelected ? 'text-paper text-opacity-80' : 'text-ink-muted'}`}>+ £{opt.priceModifier}</span>
                            )}
                            {opt.priceModifier < 0 && (
                              <span className={`font-sans text-xs mt-0.5 ${isSelected ? 'text-paper text-opacity-80' : 'text-ink-muted'}`}>- £{Math.abs(opt.priceModifier)}</span>
                            )}
                            {opt.priceModifier === 0 && (
                              <span className={`font-sans text-xs mt-0.5 ${isSelected ? 'text-paper text-opacity-60' : 'text-ink-subtle'}`}>Included</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Navigation */}
            {added ? (
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
                <div className="flex gap-3">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => navigate('/basket')}>
                    View Quote
                  </Button>
                  <Button variant="ghost" size="md" className="flex-1" onClick={() => navigate('/shop')}>
                    Continue Browsing
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <Button variant="ghost" onClick={() => setCurrentStep((s) => s - 1)}>
                    Back
                  </Button>
                )}
                {isFinalStep ? (
                  <Button
                    variant="accent"
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToBasket}
                    disabled={!!priceState.error}
                  >
                    Add to Quote
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={() => setCurrentStep((s) => s + 1)}
                  >
                    Continue
                  </Button>
                )}
              </div>
            )}

            {/* Live price below nav */}
            <div className="mt-5 pt-5 border-t border-hairline">
              {priceState.error ? (
                <Alert
                  variant="warning"
                  message="This specification needs a custom quote. Please contact us at hello@buywindowsanddoors.co.uk"
                />
              ) : (
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-1">
                      Indicative Installed Price
                    </p>
                    <PriceDisplay price={priceState.value} size="large" assuranceText="" />
                    <p className="font-sans text-xs text-ink-muted mt-1">
                      {priceState.fromEngine
                        ? 'Calculated from your size selection. Confirmed at survey.'
                        : `${product.unit} — confirmed at survey, no payment today`}
                    </p>
                  </div>
                  {isFinalStep && !added && (
                    <Link to="/pricing-promise" className="font-sans text-xs text-brand hover:underline">
                      Our pricing promise
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── BELOW FOLD ───────────────────────────────────────────── */}
        <div className="border-t border-hairline pt-16 space-y-16">
          {/* Features */}
          {product.features.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-ink mb-6">Key features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="font-sans text-base text-ink">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What's included */}
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

          {/* Potential variations */}
          <div>
            <h2 className="font-display text-2xl text-ink mb-3">What might affect your final price</h2>
            <p className="font-sans text-base text-ink-muted mb-6">
              In most straightforward installations the price above is the price you pay. The following are the only legitimate reasons a surveyor may need to revise it:
            </p>
            <ul className="space-y-3">
              {product.potentialVariations.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span className="font-sans text-base text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-display text-2xl text-ink mb-6">About {product.name.toLowerCase()}</h2>
            <div className="space-y-4 max-w-prose">
              <p className="font-sans text-base text-ink leading-relaxed">
                {product.name} are one of the most popular choices for UK homes. They combine reliable thermal performance with a clean aesthetic that suits a wide range of property styles, from Victorian terraces to modern new builds.
              </p>
              <p className="font-sans text-base text-ink leading-relaxed">
                The price shown is an indicative installed price based on standard installation conditions. It includes supply of the unit to your specification, removal of your existing {product.category === 'windows' ? 'window' : 'door'}, professional installation by a FENSA-registered fitter, and all finishing work.
              </p>
              <p className="font-sans text-base text-ink leading-relaxed">
                A surveyor will visit to confirm your exact measurements before any work begins. In the majority of straightforward jobs, the final price matches what you see here. If anything non-standard is identified, your surveyor will explain it clearly and in writing before any work is agreed.
              </p>
            </div>
          </div>

          {/* FAQ */}
          {product.faqs.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-ink mb-6">Frequently asked questions</h2>
              <FAQ items={product.faqs} />
            </div>
          )}

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-ink mb-8">You might also need</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((rp) => (
                  <div
                    key={rp.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/${rp.category}/${rp.slug}`)}
                  >
                    <ProductCard
                      title={rp.name}
                      description={rp.shortDescription}
                      price={rp.basePrice}
                      imageUrl={rp.imageUrl}
                      isFromPrice
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
