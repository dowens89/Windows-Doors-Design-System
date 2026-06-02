import React, { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Check, AlertCircle, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Layout } from '../components/Layout'
import { SchemaTag } from '../components/SchemaTag'
import { Button } from '../components/ds/Button'
import { Badge } from '../components/ds/Badge'
import { Alert } from '../components/ds/Alert'
import { FAQ } from '../components/ds/FAQ'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { ProductCard } from '../components/ds/ProductCard'
import { EmptyState } from '../components/ds/EmptyState'
import { Loading } from '../components/ds/Loading'
import { useSEO } from '../utils/seo'
import { productSchema, faqSchema } from '../utils/schema'
import { products } from '../data/products'
import type { Product } from '../data/products'
import { useBasketStore } from '../store/basketStore'
import {
  calculateWindowPrice,
  calculateDoorPrice,
  usePricingData,
} from '../pricing'
import type { WindowQuoteInput, DoorQuoteInput, WindowPricingData, DoorPricingData } from '../pricing'

// Representative default SKU per door product slug
const PRODUCT_SLUG_TO_SKU: Record<string, string> = {
  'composite-doors': 'CD-08',
  'upvc-doors':      'CD-146',
  'french-doors':    'CD-70',
  'bi-fold-doors':   'CD-54',
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

function calcFallbackPrice(
  product: Product,
  selections: Record<string, string>,
): number {
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
    const openers = openerVariant
      ? parseInt(selections[openerVariant.id] ?? '0', 10) || 0
      : 0

    const midRailVariant = product.variants.find((v) => v.id === 'mid_rail')
    const midRail = midRailVariant ? selections[midRailVariant.id] === 'true' : false

    const georgianBarVariant = product.variants.find((v) => v.id === 'georgian_bar')
    const georgianBar = georgianBarVariant ? selections[georgianBarVariant.id] === 'true' : false

    const leadingVariant = product.variants.find((v) => v.id === 'leading')
    const leading = leadingVariant ? selections[leadingVariant.id] === 'true' : false

    const flushCasementVariant = product.variants.find((v) => v.id === 'flush_casement')
    const flushCasement = flushCasementVariant
      ? selections[flushCasementVariant.id] === 'true'
      : false

    const result = calculateWindowPrice(
      { widthMm, heightMm, openers, colourType, midRail, georgianBar, leading, flushCasement },
      windowData
    )
    return { value: result.totalPriceRounded, fromEngine: true, error: null }
  } catch (e) {
    return {
      value: 0,
      fromEngine: false,
      error: e instanceof Error ? e.message : 'Pricing error',
    }
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
    const isLargeDoor =
      selectedSizeId === 'wide' || selectedSizeId === 'large' || selectedSizeId === 'extra-large'

    const colourVariant = product.variants.find((v) => v.type === 'colour')
    const selectedColourId = colourVariant ? selections[colourVariant.id] : undefined
    const colourOpt = colourVariant?.options.find((o) => o.id === selectedColourId)
    const premiumColour = colourOpt ? colourOpt.priceModifier > 0 : false

    const sidePanelVariant = product.variants.find((v) => v.type === 'sidePanels')
    const selectedSidePanelId = sidePanelVariant ? selections[sidePanelVariant.id] : undefined
    const sideLight = !!selectedSidePanelId && selectedSidePanelId !== 'none'

    const input: DoorQuoteInput = {
      skuId,
      isLargeDoor,
      premiumColour,
      autoLock: false,
      letterbox: false,
      knocker: false,
      topLight: false,
      sideLight,
    }

    const result = calculateDoorPrice(input, doorData)
    return { value: result.totalPriceRounded, fromEngine: true, error: null }
  } catch (e) {
    return {
      value: 0,
      fromEngine: false,
      error: e instanceof Error ? e.message : 'Pricing error',
    }
  }
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useBasketStore((s) => s.addItem)
  const { windows: windowData, doors: doorData, loading: pricingLoading } = usePricingData()

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

  const [measureOpen, setMeasureOpen] = useState(false)
  const [measureUnit, setMeasureUnit] = useState<'MM' | 'CM'>('MM')
  const [measurement, setMeasurement] = useState({ width: '', height: '' })
  const [added, setAdded] = useState(false)

  const priceState = useMemo((): PriceState => {
    if (!product) return { value: 0, fromEngine: false, error: null }

    const toMm = (val: string) => {
      if (!val) return 0
      const n = parseFloat(val)
      return isNaN(n) ? 0 : measureUnit === 'CM' ? n * 10 : n
    }

    const widthMm = toMm(measurement.width)
    const heightMm = toMm(measurement.height)
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
  }, [product, selections, measurement, measureUnit, windowData, doorData])

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

  return (
    <Layout>
      <SchemaTag schema={productSchema(product)} />
      <SchemaTag schema={faqSchema(product.faqs)} />

      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-sans text-sm text-ink-muted mb-8">
          <Link to="/shop" className="hover:text-ink transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-ink transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 mb-16">
          {/* Left: image + badges */}
          <div>
            <div className="aspect-[4/3] bg-hairline overflow-hidden mb-6">
              <img
                src={product.imageUrl}
                alt={`${product.name} installed in West Yorkshire`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="accreditation">FENSA Registered</Badge>
              <Badge variant="verified">Vetted Installer</Badge>
              <Badge variant="accreditation">Insurance Backed</Badge>
            </div>
          </div>

          {/* Right: configurator */}
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-ink mb-6">
              {product.seo.h1}
            </h1>

            {/* Price */}
            <div className="mb-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
                Indicative Installed Price
              </p>

              {priceState.error ? (
                <Alert
                  variant="warning"
                  message={`This specification needs a custom quote. Please contact us at hello@buywindowsanddoors.co.uk`}
                />
              ) : (
                <>
                  <PriceDisplay price={priceState.value} size="large" assuranceText="" />
                  {priceState.fromEngine && measurement.width && measurement.height ? (
                    <p className="font-sans text-sm text-ink-muted mt-2">
                      Price calculated from your measurements. Confirmed at survey.
                    </p>
                  ) : (
                    <p className="font-sans text-sm text-ink-muted mt-2">
                      {product.unit} &mdash; confirmed at survey, no payment today
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Variants */}
            <div className="space-y-7 mb-8">
              {product.variants.map((variant) => {
                const selectedOpt = variant.options.find((o) => o.id === selections[variant.id])
                return (
                  <div key={variant.id}>
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink mb-3">
                      {variant.label}
                    </p>

                    {variant.type === 'colour' ? (
                      <>
                        <div className="flex flex-wrap gap-3 mb-2">
                          {variant.options.map((opt) => {
                            const isSelected = selections[variant.id] === opt.id
                            return (
                              <button
                                key={opt.id}
                                style={{
                                  backgroundColor: opt.hex,
                                  borderColor: isSelected
                                    ? 'var(--color-brand)'
                                    : opt.borderHex || 'transparent',
                                }}
                                className={`w-11 h-11 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none ${
                                  isSelected
                                    ? 'ring-2 ring-brand ring-offset-2 ring-offset-paper'
                                    : ''
                                }`}
                                onClick={() =>
                                  setSelections((s) => ({ ...s, [variant.id]: opt.id }))
                                }
                                aria-label={
                                  opt.priceModifier > 0
                                    ? `${opt.label} — adds £${opt.priceModifier}`
                                    : `${opt.label} — included`
                                }
                                aria-pressed={isSelected}
                                title={opt.label}
                              />
                            )
                          })}
                        </div>
                        {selectedOpt && (
                          <p className="font-sans text-sm text-ink">
                            {selectedOpt.label}
                            {selectedOpt.priceModifier > 0 && (
                              <span className="text-ink-muted">
                                {' '}
                                — + £{selectedOpt.priceModifier}
                              </span>
                            )}
                            {selectedOpt.priceModifier === 0 && (
                              <span className="text-ink-muted"> — Included</span>
                            )}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((opt) => {
                          const isSelected = selections[variant.id] === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() =>
                                setSelections((s) => ({ ...s, [variant.id]: opt.id }))
                              }
                              className={`flex flex-col items-center px-3 py-2 border rounded font-sans text-sm transition-colors focus:outline-none ${
                                isSelected
                                  ? 'bg-brand text-paper border-brand'
                                  : 'bg-surface border-hairline text-ink hover:border-brand hover:text-brand'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {opt.priceModifier > 0 && (
                                <span
                                  className={`text-xs mt-0.5 ${
                                    isSelected ? 'text-paper opacity-75' : 'text-ink-muted'
                                  }`}
                                >
                                  + £{opt.priceModifier}
                                </span>
                              )}
                              {opt.priceModifier < 0 && (
                                <span
                                  className={`text-xs mt-0.5 ${
                                    isSelected ? 'text-paper opacity-75' : 'text-ink-muted'
                                  }`}
                                >
                                  - £{Math.abs(opt.priceModifier)}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Measurement input (windows only) */}
            {product.category === 'windows' && (
              <div className="mb-8 border-t border-hairline pt-6">
                <button
                  onClick={() => setMeasureOpen((o) => !o)}
                  className="flex items-center gap-2 font-sans text-sm text-brand hover:underline"
                >
                  {measureOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {measureOpen ? 'Hide measurements' : '+ Know your exact measurements?'}
                </button>

                {measureOpen && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-2 mb-4">
                      {(['MM', 'CM'] as const).map((u) => (
                        <button
                          key={u}
                          onClick={() => setMeasureUnit(u)}
                          className={`px-4 py-1.5 border font-sans text-sm rounded transition-colors ${
                            measureUnit === u
                              ? 'bg-ink text-paper border-ink'
                              : 'bg-surface border-hairline text-ink'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-muted block mb-1">
                          Width ({measureUnit})
                        </label>
                        <input
                          type="number"
                          value={measurement.width}
                          onChange={(e) =>
                            setMeasurement((m) => ({ ...m, width: e.target.value }))
                          }
                          className="w-full border border-hairline bg-paper font-sans text-sm text-ink px-3 py-2 rounded focus:outline-none focus:border-brand"
                          placeholder="e.g. 900"
                        />
                      </div>
                      <div>
                        <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-muted block mb-1">
                          Height ({measureUnit})
                        </label>
                        <input
                          type="number"
                          value={measurement.height}
                          onChange={(e) =>
                            setMeasurement((m) => ({ ...m, height: e.target.value }))
                          }
                          className="w-full border border-hairline bg-paper font-sans text-sm text-ink px-3 py-2 rounded focus:outline-none focus:border-brand"
                          placeholder="e.g. 1200"
                        />
                      </div>
                    </div>
                    <p className="font-sans text-xs text-ink-muted">
                      Measure the existing frame, not the glass
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Add to basket */}
            {added ? (
              <div className="space-y-3">
                <Alert variant="success" message="Added to your quote" />
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={() => navigate('/basket')}
                  >
                    Added — View Quote
                  </Button>
                  <Button variant="ghost" onClick={() => setAdded(false)}>
                    Continue browsing
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={handleAddToBasket}
                disabled={!!priceState.error}
              >
                Add to Quote
              </Button>
            )}
          </div>
        </div>

        {/* Below-fold content */}
        <div className="border-t border-hairline pt-16 space-y-16">
          {/* Features */}
          {product.features.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-ink mb-6">Key features</h2>
              <ul className="space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 text-brand flex-shrink-0 mt-0.5"
                      strokeWidth={2}
                    />
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
                  <Check
                    className="w-5 h-5 text-brand flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <span className="font-sans text-base text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Potential variations */}
          <div>
            <h2 className="font-display text-2xl text-ink mb-3">
              What might affect your final price
            </h2>
            <p className="font-sans text-base text-ink-muted mb-6">
              In most straightforward installations the price above is the price you pay. The
              following are the only legitimate reasons a surveyor may need to revise it:
            </p>
            <ul className="space-y-3">
              {product.potentialVariations.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <AlertCircle
                    className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                    strokeWidth={1.5}
                  />
                  <span className="font-sans text-base text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-display text-2xl text-ink mb-6">
              About {product.name.toLowerCase()}
            </h2>
            <div className="space-y-4 max-w-prose">
              <p className="font-sans text-base text-ink leading-relaxed">
                {product.name} are one of the most popular choices for West Yorkshire homes. They
                combine reliable thermal performance with a clean aesthetic that suits a wide range
                of property styles, from Victorian terraces to modern new builds.
              </p>
              <p className="font-sans text-base text-ink leading-relaxed">
                The price shown is an indicative installed price based on standard conditions for
                West Yorkshire. It includes supply of the unit to your specification, removal of
                your existing {product.category === 'windows' ? 'window' : 'door'}, professional
                installation by a FENSA-registered fitter, and all finishing work.
              </p>
              <p className="font-sans text-base text-ink leading-relaxed">
                A surveyor will visit to confirm your exact measurements before any work begins.
                In the majority of straightforward jobs, the final price matches what you see
                here. If anything non-standard is identified, your surveyor will explain it
                clearly and in writing before any work is agreed.
              </p>
            </div>
          </div>

          {/* FAQ */}
          {product.faqs.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-ink mb-6">
                Frequently asked questions
              </h2>
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
