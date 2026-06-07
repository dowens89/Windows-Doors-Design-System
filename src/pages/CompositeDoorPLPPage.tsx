import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { useSEO } from '../utils/seo'
import { doorProducts } from '../data/products'
import type { DoorProduct } from '../data/products'

type ActiveFilter = 'all' | 'traditional' | 'contemporary' | 'solid' | 'glazed' | 'pvc'
type SortBy = 'popular' | 'price-asc' | 'price-desc'

const SWATCHES = [
  { hex: '#F0EDE8', border: '#CCCCCC', label: 'White' },
  { hex: '#3D3D3D', border: '#3D3D3D', label: 'Anthracite Grey' },
  { hex: '#1C1C1C', border: '#1C1C1C', label: 'Black' },
  { hex: '#6B8F71', border: '#6B8F71', label: 'Chartwell Green' },
  { hex: '#8B5E3C', border: '#8B5E3C', label: 'Irish Oak' },
]

const FILTER_OPTIONS: { value: ActiveFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'contemporary', label: 'Contemporary' },
  { value: 'solid', label: 'Solid' },
  { value: 'glazed', label: 'With Glazing' },
]

function getSubcategory(door: DoorProduct): 'traditional' | 'contemporary' | 'solid' | 'glazed' | 'pvc' {
  if (door.rangeName.includes('PVC') || door.variantType === 'pvc') return 'pvc'
  if (door.variantType === 'solid') return 'solid'
  if (door.variantType === 'mini_blind' || door.variantType === 'bevel') return 'glazed'
  if (['Florence', 'Cheltenham', 'Conwy'].some((r) => door.rangeName.includes(r))) return 'contemporary'
  return 'traditional'
}

function tierLabel(tier: DoorProduct['pricetier']): string {
  switch (tier) {
    case 'budget': return 'Budget'
    case 'mid': return 'Mid'
    case 'upper': return 'Upper'
    case 'premium': return 'Premium'
  }
}

function glazingLabel(variantType: DoorProduct['variantType']): string {
  if (variantType === 'solid') return 'None'
  if (variantType === 'mini_blind' || variantType === 'bevel') return 'Decorative'
  return 'Yes'
}

function variantLabel(variantType: DoorProduct['variantType']): string {
  switch (variantType) {
    case 'standard': return 'Standard'
    case 'bevel': return 'Bevel'
    case 'solid': return 'Solid'
    case 'mini_blind': return 'Mini Blind'
    case 'pvc': return 'PVC'
  }
}

function sortDoors(doors: DoorProduct[], sortBy: SortBy): DoorProduct[] {
  const copy = [...doors]
  if (sortBy === 'price-asc') return copy.sort((a, b) => a.basePrice - b.basePrice)
  if (sortBy === 'price-desc') return copy.sort((a, b) => b.basePrice - a.basePrice)
  return copy
}

const compositeDoors = doorProducts.filter((d) => getSubcategory(d) !== 'pvc')

function compareGridClass(count: number): string {
  if (count === 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1 md:grid-cols-2'
  return 'grid-cols-1 md:grid-cols-3'
}

export function CompositeDoorPLPPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('popular')
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [compareModalOpen, setCompareModalOpen] = useState(false)

  useSEO({
    title: 'Composite Doors Installed West Yorkshire | Windows & Doors Online',
    description:
      'Browse our full range of composite doors with honest installed prices. Choose your style, colour and glazing. No salesperson.',
  })

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const filtered = sortDoors(
    compositeDoors.filter((d) => activeFilter === 'all' || getSubcategory(d) === activeFilter),
    sortBy
  )

  const compareDoorsData = compareIds
    .map((id) => compositeDoors.find((d) => d.id === id))
    .filter((d): d is DoorProduct => d !== undefined)

  return (
    <Layout>
      {/* Filter bar */}
      <div className="sticky top-0 z-40 bg-paper border-b border-hairline py-4 px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2 flex-1">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`px-4 py-2 rounded-sm text-sm font-sans transition-colors ${
                  activeFilter === opt.value
                    ? 'bg-brand text-paper'
                    : 'bg-surface border border-hairline text-ink hover:border-brand'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-sans text-sm text-ink-muted whitespace-nowrap">
              {filtered.length} door{filtered.length !== 1 ? 's' : ''}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="font-sans text-sm text-ink bg-surface border border-hairline rounded-sm px-3 py-2 focus:outline-none focus:border-brand"
            >
              <option value="popular">Most popular</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Card grid */}
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filtered.map((door) => (
            <div
              key={door.id}
              className="bg-paper border border-hairline rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer relative"
              onClick={() => navigate(`/doors/${door.slug}`)}
            >
              <div className="relative">
                <img
                  src={door.imageUrl}
                  alt={door.name}
                  className="aspect-[3/4] object-cover w-full"
                />
                <input
                  type="checkbox"
                  checked={compareIds.includes(door.id)}
                  onChange={() => toggleCompare(door.id)}
                  disabled={!compareIds.includes(door.id) && compareIds.length >= 3}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-3 left-3 w-4 h-4 accent-brand z-10"
                />
                <div className="absolute bottom-2 left-2 bg-ink bg-opacity-60 text-paper text-xs px-2 py-0.5 rounded-sm">
                  {tierLabel(door.pricetier)}
                </div>
              </div>

              <div className="p-4">
                <p className="font-sans text-xs text-ink-muted uppercase tracking-wide mb-1">
                  {door.rangeName}
                </p>
                <p className="font-display text-base text-ink mb-1">{door.name}</p>

                <div className="flex items-center gap-1 mb-3">
                  {SWATCHES.map((s) => (
                    <span
                      key={s.hex}
                      title={s.label}
                      className="inline-block rounded-full w-4 h-4 border"
                      style={{ backgroundColor: s.hex, borderColor: s.border }}
                    />
                  ))}
                  <span className="font-sans text-xs text-ink-muted ml-1">+2 more</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <PriceDisplay price={door.basePrice} size="inline" />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/doors/${door.slug}`)
                    }}
                  >
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compare bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-paper py-4 px-8 flex justify-between items-center shadow-2xl">
          <span className="font-sans text-sm">
            Comparing {compareIds.length} of 3 doors
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              disabled={compareIds.length < 2}
              onClick={() => setCompareModalOpen(true)}
              className="text-paper hover:text-paper disabled:text-paper"
            >
              Compare now
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCompareIds([])}
              className="text-paper hover:text-paper"
            >
              ✕ Clear
            </Button>
          </div>
        </div>
      )}

      {/* Compare modal */}
      {compareModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink bg-opacity-50 overflow-y-auto"
          onClick={() => setCompareModalOpen(false)}
        >
          <div
            className="bg-paper rounded-sm max-w-4xl mx-auto mt-16 max-h-[80vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-2xl text-ink">Compare doors</h2>
              <Button variant="ghost" onClick={() => setCompareModalOpen(false)}>
                ✕
              </Button>
            </div>

            <div className={`grid gap-6 ${compareGridClass(compareDoorsData.length)}`}>
              {compareDoorsData.map((door) => (
                <div key={door.id} className="flex flex-col">
                  <img
                    src={door.imageUrl}
                    alt={door.name}
                    className="h-40 object-cover w-full rounded-sm mb-4"
                  />
                  <p className="font-display text-lg text-ink mb-1">{door.name}</p>
                  <PriceDisplay price={door.basePrice} size="inline" className="mb-4" />

                  <div className="space-y-3">
                    <div className="flex flex-col border-b border-hairline pb-2">
                      <span className="font-sans text-xs text-ink-muted uppercase tracking-wide">
                        Starting price
                      </span>
                      <div className="mt-0.5">
                        <PriceDisplay price={door.basePrice} size="inline" />
                      </div>
                    </div>
                    {(
                      [
                        { label: 'Range', value: door.rangeName },
                        { label: 'Style', value: variantLabel(door.variantType) },
                        { label: 'Glazing', value: glazingLabel(door.variantType) },
                      ] as { label: string; value: string }[]
                    ).map((row) => (
                      <div key={row.label} className="flex flex-col border-b border-hairline pb-2">
                        <span className="font-sans text-xs text-ink-muted uppercase tracking-wide">
                          {row.label}
                        </span>
                        <span className="font-sans text-sm text-ink mt-0.5">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    className="w-full mt-6"
                    onClick={() => {
                      setCompareModalOpen(false)
                      navigate(`/doors/${door.slug}`)
                    }}
                  >
                    Configure this door
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
