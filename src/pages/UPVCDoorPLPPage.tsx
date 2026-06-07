import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { useSEO } from '../utils/seo'
import { doorProducts } from '../data/products'

const SWATCHES = [
  { hex: '#F0EDE8', border: '#CCCCCC', label: 'White' },
  { hex: '#3D3D3D', border: '#3D3D3D', label: 'Anthracite Grey' },
  { hex: '#1C1C1C', border: '#1C1C1C', label: 'Black' },
  { hex: '#6B8F71', border: '#6B8F71', label: 'Chartwell Green' },
  { hex: '#8B5E3C', border: '#8B5E3C', label: 'Irish Oak' },
]

function tierLabel(tier: 'budget' | 'mid' | 'upper' | 'premium'): string {
  switch (tier) {
    case 'budget': return 'Budget'
    case 'mid': return 'Mid'
    case 'upper': return 'Upper'
    case 'premium': return 'Premium'
  }
}

const upvcDoors = doorProducts.filter(
  (d) => d.variantType === 'pvc' || d.rangeName.includes('PVC')
)

export function UPVCDoorPLPPage() {
  const navigate = useNavigate()

  useSEO({
    title: 'uPVC Doors Installed West Yorkshire | Windows & Doors Online',
    description:
      'Practical and affordable uPVC doors with honest installed prices. Same professional installation as our composite range. No salesperson.',
  })

  return (
    <Layout>
      <div className="bg-brand py-12 px-8 text-center">
        <h1 className="font-display text-4xl text-paper">uPVC Doors</h1>
        <p className="font-sans text-lg text-paper opacity-75 mt-3 max-w-xl mx-auto">
          Practical and affordable. Same professional installation and honest pricing as our
          composite range, at a lower starting price.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-6">
          {upvcDoors.map((door) => (
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
    </Layout>
  )
}
