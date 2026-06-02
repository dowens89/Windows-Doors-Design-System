import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Search } from 'lucide-react'
import { Layout } from '../components/Layout'
import { SchemaTag } from '../components/SchemaTag'
import { Button } from '../components/ds/Button'
import { Alert } from '../components/ds/Alert'
import { FAQ } from '../components/ds/FAQ'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { EmptyState } from '../components/ds/EmptyState'
import { useSEO } from '../utils/seo'
import { faqSchema } from '../utils/schema'
import { doorProducts } from '../data/products'
import { useBasketStore } from '../store/basketStore'

const STEP_LABELS = ['Colour', 'Hardware', 'Extras', 'Size']

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
      {index < total - 1 && (
        <div className="w-8 h-px bg-hairline mb-4 mx-1" />
      )}
    </div>
  )
}

export function DoorPDPPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useBasketStore((s) => s.addItem)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)

  const door = doorProducts.find((d) => d.slug === slug)

  useSEO({
    title: door ? door.seo.title : 'Composite Door | Windows & Doors Online',
    description: door ? door.seo.description : '',
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedColour, setSelectedColour] = useState<'basic' | 'premium'>('basic')
  const [selectedHandle, setSelectedHandle] = useState<'standard' | '600mm' | '1200mm' | '1800mm'>('standard')
  const [autoLock, setAutoLock] = useState(false)
  const [letterbox, setLetterbox] = useState(false)
  const [knocker, setKnocker] = useState(false)
  const [topLight, setTopLight] = useState(false)
  const [sideLight, setSideLight] = useState(false)
  const [isLargeDoor, setIsLargeDoor] = useState(false)
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

  if (!door) {
    return (
      <Layout>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
          <EmptyState
            icon={Search}
            title="Door not found"
            description="We couldn't find that door. Browse our full range below."
            actionLabel="Browse composite doors"
            onAction={() => navigate('/doors')}
          />
        </div>
      </Layout>
    )
  }

  const addonTotal =
    (selectedColour === 'premium' ? 50 : 0) +
    (selectedHandle !== 'standard' ? 100 : 0) +
    (autoLock ? 100 : 0) +
    (letterbox ? 50 : 0) +
    (knocker ? 50 : 0) +
    (topLight ? 50 : 0) +
    (sideLight ? 100 : 0)

  const subtotal = door.basePrice + addonTotal
  const calculatedPrice = isLargeDoor ? Math.round(subtotal * 1.1) : Math.round(subtotal)
  const largeDoorUplift = Math.round(subtotal * 0.1)

  function handleAddToQuote() {
    const parts: string[] = []
    if (selectedColour === 'premium') parts.push('Premium colour')
    if (selectedHandle !== 'standard') parts.push(`${selectedHandle} handle`)
    if (autoLock) parts.push('auto lock')
    if (letterbox) parts.push('letterbox')
    if (knocker) parts.push('knocker')
    if (topLight) parts.push('top light')
    if (sideLight) parts.push('side light')
    parts.push(isLargeDoor ? 'large size' : 'standard size')

    addItem({
      productId: door.id,
      productName: door.name,
      category: 'doors',
      selectedVariants: {
        colour: selectedColour,
        handle: selectedHandle,
        autoLock: autoLock.toString(),
        letterbox: letterbox.toString(),
        knocker: knocker.toString(),
        topLight: topLight.toString(),
        sideLight: sideLight.toString(),
        size: isLargeDoor ? 'large' : 'standard',
      },
      variantSummary: parts.join(', '),
      indicativePrice: calculatedPrice,
      quantity: 1,
    })
    setAdded(true)
  }

  const variantTypeLabel =
    door.variantType === 'standard'
      ? 'Standard'
      : door.variantType === 'bevel'
      ? 'Bevel'
      : door.variantType === 'solid'
      ? 'Solid'
      : door.variantType === 'mini_blind'
      ? 'Mini Blind'
      : 'PVC'

  return (
    <Layout>
      <SchemaTag schema={faqSchema(door.faqs)} />

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
              Composite Doors
            </span>
            <ChevronRight className="w-3 h-3 text-ink-muted mx-1 flex-shrink-0" />
            <span className="font-display text-base text-ink truncate">{door.name}</span>
          </div>
          <div className="flex items-center justify-center flex-1">
            {STEP_LABELS.map((label, i) => (
              <StepDot
                key={i}
                index={i}
                current={currentStep}
                label={label}
                total={4}
                onClick={setCurrentStep}
              />
            ))}
          </div>
          <div className="flex-1 flex justify-end">
            <div className="text-right">
              <p className="font-sans text-[10px] uppercase tracking-wider text-ink-muted">
                Installed price
              </p>
              <p className="font-mono font-medium text-xl text-ink">
                £{calculatedPrice.toLocaleString('en-GB')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-10 mb-16 items-start">
          {/* Left column */}
          <div className="lg:sticky lg:top-[72px]">
            <div className="overflow-hidden rounded-sm" style={{ aspectRatio: '3/4' }}>
              <img
                src={door.imageUrl}
                alt={door.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-sans text-xs text-ink-muted italic text-center mt-2">
              Illustrative image — actual door style varies by range
            </p>
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
            {/* Mobile price */}
            <div className="lg:hidden mt-4">
              <h1 className="font-display text-2xl text-ink">{door.name}</h1>
              <PriceDisplay price={calculatedPrice} size="medium" className="mt-2" />
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="hidden lg:block mb-6">
              <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">
                {door.seo.h1}
              </h1>
              <p className="font-sans text-ink-muted text-base leading-relaxed">
                {door.shortDescription}
              </p>
            </div>

            {/* Step panel */}
            {!added && (
              <div className="bg-surface rounded-sm border border-hairline p-6 md:p-8 mb-6">
                {/* Step 1 — Colour */}
                {currentStep === 0 && (
                  <>
                    <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                      Step 01 of 04
                    </p>
                    <h2 className="font-display text-3xl text-ink mb-2">Choose your colour</h2>
                    <p className="font-sans text-sm text-ink-muted mb-8">
                      All colours are applied externally. Your door is white on the inside as standard.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {(
                        [
                          {
                            id: 'basic' as const,
                            title: 'Basic Colour',
                            price: 'Included',
                            desc: 'A wide range of popular colours included as standard',
                            swatchClass: 'bg-gray-100 border border-hairline',
                          },
                          {
                            id: 'premium' as const,
                            title: 'Premium Colour',
                            price: '+ £50',
                            desc: 'Extended colour palette for a truly bespoke finish',
                            swatchClass: 'bg-ink',
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedColour(opt.id)}
                          className={`border rounded-sm p-6 cursor-pointer text-left transition-colors ${
                            selectedColour === opt.id
                              ? 'border-brand bg-brand bg-opacity-5'
                              : 'border-hairline bg-surface hover:border-brand'
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full mx-auto mb-4 ${opt.swatchClass}`}
                          />
                          <p className="font-display text-lg text-ink text-center">{opt.title}</p>
                          <p className="font-mono text-sm text-ink-muted text-center">{opt.price}</p>
                          <p className="font-sans text-xs text-ink-muted text-center mt-2">
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                    <div className="bg-surface border border-hairline rounded-sm p-3 mt-6">
                      <p className="font-sans text-sm text-ink-muted">
                        Exact colour choices are confirmed with your installer at survey. Both ranges
                        include Anthracite Grey, Black, White, Chartwell Green, Irish Oak and more.
                      </p>
                    </div>
                    <div className="flex justify-end mt-10">
                      <Button variant="primary" onClick={() => setCurrentStep(1)}>
                        Continue →
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 2 — Hardware */}
                {currentStep === 1 && (
                  <>
                    <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                      Step 02 of 04
                    </p>
                    <h2 className="font-display text-3xl text-ink mb-2">Choose your handle</h2>
                    <p className="font-sans text-sm text-ink-muted mb-8">
                      A white handle is included as standard. Long bar handles suit contemporary
                      properties and multi-lock door systems.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {(
                        [
                          {
                            id: 'standard' as const,
                            title: 'Standard Handle',
                            price: 'Included',
                            desc: 'Classic lever handle in white. Suits all door styles.',
                          },
                          {
                            id: '600mm' as const,
                            title: '600mm Long Bar',
                            price: '+ £100',
                            desc: 'Contemporary bar handle. Ideal for standard door heights.',
                          },
                          {
                            id: '1200mm' as const,
                            title: '1200mm Long Bar',
                            price: '+ £100',
                            desc: 'Full-height bar handle. A bold, modern choice.',
                          },
                          {
                            id: '1800mm' as const,
                            title: '1800mm Long Bar',
                            price: '+ £100',
                            desc: 'Floor-to-ceiling bar handle. Striking architectural finish.',
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedHandle(opt.id)}
                          className={`border rounded-sm p-4 text-left transition-colors ${
                            selectedHandle === opt.id
                              ? 'border-brand bg-brand bg-opacity-5'
                              : 'border-hairline bg-surface hover:border-brand'
                          }`}
                        >
                          <p className="font-display text-base text-ink">{opt.title}</p>
                          <p className="font-mono text-sm text-ink-muted">{opt.price}</p>
                          <p className="font-sans text-xs text-ink-muted mt-1">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                    {/* Auto lock */}
                    <div
                      className="flex items-center justify-between bg-surface border border-hairline rounded-sm p-4 mt-4 cursor-pointer"
                      onClick={() => setAutoLock((v) => !v)}
                    >
                      <div>
                        <p className="font-display text-base text-ink">Auto Lock</p>
                        <p className="font-sans text-xs text-ink-muted mt-1">
                          Automatically locks when the door closes. Recommended for households with
                          young children.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="font-mono text-sm text-ink-muted">
                          {autoLock ? '+ £100' : 'Optional'}
                        </span>
                        <Toggle active={autoLock} />
                      </div>
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

                {/* Step 3 — Extras */}
                {currentStep === 2 && (
                  <>
                    <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                      Step 03 of 04
                    </p>
                    <h2 className="font-display text-3xl text-ink mb-2">Add extras</h2>
                    <p className="font-sans text-sm text-ink-muted mb-8">
                      All optional. Add what you need and leave out what you don't.
                    </p>
                    {(
                      [
                        {
                          label: 'Letterbox',
                          price: '+ £50',
                          desc: 'Standard letterbox fitted to your specification.',
                          active: letterbox,
                          toggle: () => setLetterbox((v) => !v),
                        },
                        {
                          label: 'Knocker',
                          price: '+ £50',
                          desc: 'Matching door knocker in chrome or black finish.',
                          active: knocker,
                          toggle: () => setKnocker((v) => !v),
                        },
                        {
                          label: 'Top Light',
                          price: '+ £50',
                          desc: 'Glazed panel above the door to bring natural light into the hallway.',
                          active: topLight,
                          toggle: () => setTopLight((v) => !v),
                        },
                        {
                          label: 'Side Light',
                          price: '+ £100',
                          desc: 'Glazed panel to one side of the door. Adds light and visual width to the entrance.',
                          active: sideLight,
                          toggle: () => setSideLight((v) => !v),
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

                {/* Step 4 — Size */}
                {currentStep === 3 && (
                  <>
                    <p className="font-mono text-xs text-brand uppercase tracking-widest mb-2">
                      Step 04 of 04
                    </p>
                    <h2 className="font-display text-3xl text-ink mb-2">
                      Standard or large door?
                    </h2>
                    <p className="font-sans text-sm text-ink-muted mb-8">
                      Most UK homes have a standard door opening. If you are unsure, your surveyor
                      will confirm exact measurements on their visit.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setIsLargeDoor(false)}
                        className={`border rounded-sm p-6 text-left transition-colors ${
                          !isLargeDoor
                            ? 'border-brand bg-brand bg-opacity-5'
                            : 'border-hairline bg-surface hover:border-brand'
                        }`}
                      >
                        <p className="font-display text-lg text-ink">Standard</p>
                        <p className="font-sans text-xs text-ink-muted">Up to 920mm wide</p>
                        <p className="font-mono text-sm text-ink-muted mt-2">Included</p>
                        <p className="font-sans text-xs text-ink-muted mt-2">
                          Suits the vast majority of UK homes. Your surveyor confirms the exact size
                          on their visit.
                        </p>
                      </button>
                      <button
                        onClick={() => setIsLargeDoor(true)}
                        className={`border rounded-sm p-6 text-left transition-colors ${
                          isLargeDoor
                            ? 'border-brand bg-brand bg-opacity-5'
                            : 'border-hairline bg-surface hover:border-brand'
                        }`}
                      >
                        <p className="font-display text-lg text-ink">Large Door</p>
                        <p className="font-sans text-xs text-ink-muted">Over 920mm wide</p>
                        <p className="font-mono text-sm text-ink-muted mt-2">+ 10% on total price</p>
                        <p className="font-mono text-sm text-accent">
                          Currently + £{largeDoorUplift.toLocaleString('en-GB')}
                        </p>
                        <p className="font-sans text-xs text-ink-muted mt-2">
                          For wider openings. Common in newer builds and converted properties.
                        </p>
                      </button>
                    </div>
                    <div className="bg-surface border border-hairline rounded-sm p-4 mt-6">
                      <p className="font-sans text-sm text-ink-muted">
                        Not sure? Select standard for now. If your opening is larger, your installer
                        will identify this at survey and discuss the small price adjustment with you
                        before any work begins.
                      </p>
                    </div>

                    {/* Price summary */}
                    <div className="bg-brand p-6 rounded-sm mt-6">
                      <p className="font-sans text-sm text-paper opacity-70 uppercase tracking-wide mb-3">
                        Your configured price
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between font-sans text-sm text-paper">
                          <span>
                            {door.name} ({variantTypeLabel})
                          </span>
                          <span className="font-mono">
                            £{door.basePrice.toLocaleString('en-GB')}
                          </span>
                        </div>
                        {selectedColour === 'premium' && (
                          <div className="flex justify-between font-sans text-sm text-paper">
                            <span>Premium colour</span>
                            <span className="font-mono">+ £50</span>
                          </div>
                        )}
                        {selectedHandle !== 'standard' && (
                          <div className="flex justify-between font-sans text-sm text-paper">
                            <span>{selectedHandle} handle</span>
                            <span className="font-mono">+ £100</span>
                          </div>
                        )}
                        {autoLock && (
                          <div className="flex justify-between font-sans text-sm text-paper">
                            <span>Auto lock</span>
                            <span className="font-mono">+ £100</span>
                          </div>
                        )}
                        {letterbox && (
                          <div className="flex justify-between font-sans text-sm text-paper">
                            <span>Letterbox</span>
                            <span className="font-mono">+ £50</span>
                          </div>
                        )}
                        {knocker && (
                          <div className="flex justify-between font-sans text-sm text-paper">
                            <span>Knocker</span>
                            <span className="font-mono">+ £50</span>
                          </div>
                        )}
                        {topLight && (
                          <div className="flex justify-between font-sans text-sm text-paper">
                            <span>Top light</span>
                            <span className="font-mono">+ £50</span>
                          </div>
                        )}
                        {sideLight && (
                          <div className="flex justify-between font-sans text-sm text-paper">
                            <span>Side light</span>
                            <span className="font-mono">+ £100</span>
                          </div>
                        )}
                        {isLargeDoor && (
                          <div className="flex justify-between font-sans text-sm text-paper">
                            <span>Large door (+ 10%)</span>
                            <span className="font-mono">+ £{largeDoorUplift.toLocaleString('en-GB')}</span>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-paper border-opacity-20 my-3" />
                      <div className="flex justify-between font-display text-lg text-paper">
                        <span>Indicative installed price</span>
                        <span className="font-mono">
                          £{calculatedPrice.toLocaleString('en-GB')}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-paper opacity-60 mt-2">
                        Confirmed at survey. No payment today.
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <Button
                        variant="ghost"
                        className="text-ink border-hairline"
                        onClick={() => setCurrentStep(2)}
                      >
                        ← Back
                      </Button>
                      <Button variant="accent" size="lg" onClick={handleAddToQuote}>
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
                  onClick={() => navigate('/doors')}
                >
                  Add Another Door
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
