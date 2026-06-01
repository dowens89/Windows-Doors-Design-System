import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, BadgeCheck, Package } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { TrustSignal } from '../components/ds/TrustSignal'
import { EmptyState } from '../components/ds/EmptyState'
import { useSEO } from '../utils/seo'
import { useBasketStore } from '../store/basketStore'

export function BasketPage() {
  useSEO({
    title: 'Your Quote | Windows & Doors Online',
    description:
      'Review your selected windows and doors and proceed to request your free survey.',
  })

  const navigate = useNavigate()
  const { items, removeItem, getTotal } = useBasketStore()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
          <EmptyState
            icon={Package}
            title="Your quote is empty"
            description="Browse our windows and doors to get started. Prices shown are honest installed prices for West Yorkshire."
            actionLabel="Browse products"
            onAction={() => navigate('/shop')}
          />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-12">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-12">Your quote</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* Items */}
          <div>
            <div className="space-y-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-6 py-6 border-b border-hairline"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl text-ink mb-1">{item.productName}</h3>
                    <p className="font-sans text-sm text-ink-muted mb-3 capitalize">
                      {item.category} &mdash; {item.variantSummary}
                    </p>
                    <PriceDisplay
                      price={item.indicativePrice}
                      size="medium"
                      assuranceText="Indicative installed price"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="border border-hairline bg-surface p-6 sticky top-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
                Indicative Total
              </p>
              <PriceDisplay
                price={total}
                size="large"
                assuranceText="Your surveyor confirms the final price before any work begins. No surprises."
              />

              <div className="mt-8 pt-6 border-t border-hairline space-y-4">
                <TrustSignal
                  icon={ShieldCheck}
                  text="One vetted installer — not a list of companies"
                  variant="block"
                />
                <TrustSignal
                  icon={Lock}
                  text="No payment taken until work is agreed"
                  variant="block"
                />
                <TrustSignal
                  icon={BadgeCheck}
                  text="FENSA registered installation as standard"
                  variant="block"
                />
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to checkout
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/shop')}
                >
                  Continue browsing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
