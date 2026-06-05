import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, BadgeCheck, Lock } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Badge } from '../components/ds/Badge'
import { Button } from '../components/ds/Button'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { TrustSignal } from '../components/ds/TrustSignal'
import { useSEO } from '../utils/seo'
import { doorProducts } from '../data/products'
import type { DoorProduct } from '../data/products'

type FilterTier = 'all' | 'budget' | 'mid' | 'premium'

function variantLabel(v: DoorProduct['variantType']): string {
  switch (v) {
    case 'standard': return 'Standard'
    case 'bevel': return 'Bevel'
    case 'solid': return 'Solid'
    case 'mini_blind': return 'Mini Blind'
    case 'pvc': return 'PVC'
  }
}

function tierLabel(t: FilterTier): string {
  switch (t) {
    case 'all': return 'All'
    case 'budget': return 'Budget'
    case 'mid': return 'Mid Range'
    case 'premium': return 'Premium'
  }
}

const FILTER_TIERS: FilterTier[] = ['all', 'budget', 'mid', 'premium']

function matchesTier(door: DoorProduct, filter: FilterTier): boolean {
  if (filter === 'all') return true
  if (filter === 'budget') return door.pricetier === 'budget'
  if (filter === 'mid') return door.pricetier === 'mid' || door.pricetier === 'upper'
  if (filter === 'premium') return door.pricetier === 'premium'
  return true
}

export function DoorPLPPage() {
  const navigate = useNavigate()
  const [activeTier, setActiveTier] = useState<FilterTier>('all')

  useSEO({
    title: 'Composite Doors — Installed Prices | Windows & Doors Online',
    description:
      'Browse our range of composite doors with honest installed prices. Choose your style and configure online — no salesperson required.',
  })

  const filtered = doorProducts.filter((d) => matchesTier(d, activeTier))

  return (
    <Layout>
      {/* Header band */}
      <div className="bg-brand py-16 px-8 text-center">
        <h1 className="font-display text-5xl text-paper">Composite Doors</h1>
        <p className="font-sans text-lg text-paper opacity-80 mt-4 max-w-2xl mx-auto">
          Choose your style below, then customise your colour, hardware and extras. Your installed
          price updates as you go — no salesperson needed.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-paper border-b border-hairline">
        <div className="max-w-6xl mx-auto py-4 px-8 flex flex-wrap gap-2">
          {FILTER_TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-4 py-2 rounded-sm text-sm font-sans transition-colors ${
                activeTier === tier
                  ? 'bg-brand text-paper'
                  : 'bg-surface text-ink border border-hairline hover:border-brand'
              }`}
            >
              {tierLabel(tier)}
            </button>
          ))}
        </div>
        <p className="font-sans text-sm text-ink-muted px-8 py-3 max-w-6xl mx-auto">
          Showing {filtered.length} door{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((door) => (
            <div
              key={door.id}
              className="bg-paper border border-hairline rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/doors/${door.slug}`)}
            >
              {/* Image */}
              <div className="relative" style={{ aspectRatio: '4/3' }}>
                <img
                  src={door.imageUrl}
                  alt={door.name}
                  className="w-full h-full object-cover"
                />
                {/* Tier badge */}
                <div className="absolute top-3 left-3">
                  {door.pricetier === 'premium' ? (
                    <Badge variant="accreditation" className="text-xs">Premium</Badge>
                  ) : (
                    <Badge variant="neutral" className="text-xs">
                      {door.pricetier === 'budget'
                        ? 'Budget'
                        : door.pricetier === 'mid'
                        ? 'Mid Range'
                        : 'Upper Range'}
                    </Badge>
                  )}
                </div>
                {/* Variant badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-ink text-paper font-sans text-xs px-2 py-1">
                    {variantLabel(door.variantType)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="bg-paper p-4">
                <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-1">
                  {door.rangeName}
                </p>
                <p className="font-display text-lg text-ink mb-2">{door.name}</p>
                <p
                  className="font-sans text-sm text-ink-muted leading-relaxed mb-4 overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {door.shortDescription}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-sans text-xs text-ink-muted">From</p>
                    <PriceDisplay price={door.basePrice} size="medium" />
                  </div>
                  <Button variant="secondary" size="sm">Configure →</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info band */}
      <div className="bg-surface border-t border-hairline py-8 px-8 text-center">
        <p className="font-display text-2xl text-ink mb-3">Not sure which door to choose?</p>
        <p className="font-sans text-ink-muted mb-6">
          All our composite doors include professional installation, a FENSA certificate, and a
          white handle as standard. The price you see is the price you pay in most standard
          installations.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <TrustSignal icon={ShieldCheck} text="FENSA Registered Installers" />
          <TrustSignal icon={BadgeCheck} text="White Handle Included" />
          <TrustSignal icon={Lock} text="No Payment Today" />
        </div>
      </div>
    </Layout>
  )
}
