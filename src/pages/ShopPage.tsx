import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { X, Search } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { EmptyState } from '../components/ds/EmptyState'
import { ProductCard } from '../components/ds/ProductCard'
import { useSEO } from '../utils/seo'
import { products } from '../data/products'
import type { Product } from '../data/products'

type Category = 'windows' | 'doors' | null

function getPageSEO(category: Category) {
  if (category === 'windows') {
    return {
      title: 'Replacement Windows — Installed Prices West Yorkshire | WDO',
      description:
        'Replacement windows with transparent installed prices for West Yorkshire. Casement, sash, tilt & turn, bay and French windows.',
      h1: 'Replacement Windows — Installed Prices',
      intro:
        'Browse our full range of replacement windows with honest installed prices. All prices include supply, installation by a FENSA-registered fitter, and removal of your existing windows.',
    }
  }
  if (category === 'doors') {
    return {
      title: 'Replacement Doors — Installed Prices West Yorkshire | WDO',
      description:
        'Replacement doors with honest installed prices for West Yorkshire. Composite, uPVC, French, bi-fold and patio doors.',
      h1: 'Replacement Doors — Installed Prices',
      intro:
        'Browse our full range of replacement doors with honest installed prices. All prices include supply, installation by a FENSA-registered fitter, and removal of your existing door.',
    }
  }
  return {
    title: 'Windows & Doors — Installed Prices West Yorkshire | WDO',
    description:
      'Browse replacement windows and doors with honest installed prices for West Yorkshire. See your price online before anyone visits.',
    h1: 'Windows & Doors — Installed Prices',
    intro:
      'Browse our full range of windows and doors with honest installed prices. All prices include supply, installation by a FENSA-registered fitter, and removal of your existing units.',
  }
}

const windowTypes = ['Casement', 'Sash', 'Tilt & Turn', 'Bay', 'French']
const doorTypes = ['Composite', 'uPVC', 'French', 'Bi-Fold', 'Patio']

export function ShopPage() {
  const { category: categoryParam } = useParams<{ category?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState<Category>(() => {
    const qc = searchParams.get('category')
    if (qc === 'windows' || qc === 'doors') return qc
    if (categoryParam === 'windows' || categoryParam === 'doors') return categoryParam
    return null
  })
  const [activeTypes, setActiveTypes] = useState<string[]>(() => {
    const qt = searchParams.get('types')
    return qt ? qt.split(',') : []
  })
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '')

  const updateURL = useCallback(
    (cat: Category, types: string[], min: string, max: string) => {
      const params: Record<string, string> = {}
      if (cat) params.category = cat
      if (types.length) params.types = types.join(',')
      if (min) params.minPrice = min
      if (max) params.maxPrice = max
      setSearchParams(params, { replace: true })
    },
    [setSearchParams]
  )

  function setCategory(cat: Category) {
    setActiveCategory(cat)
    setActiveTypes([])
    updateURL(cat, [], minPrice, maxPrice)
  }

  function toggleType(type: string) {
    setActiveTypes((prev) => {
      const next = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      updateURL(activeCategory, next, minPrice, maxPrice)
      return next
    })
  }

  function clearAll() {
    setActiveCategory(null)
    setActiveTypes([])
    setMinPrice('')
    setMaxPrice('')
    setSearchParams({}, { replace: true })
  }

  function handlePriceChange(field: 'min' | 'max', val: string) {
    if (field === 'min') {
      setMinPrice(val)
      updateURL(activeCategory, activeTypes, val, maxPrice)
    } else {
      setMaxPrice(val)
      updateURL(activeCategory, activeTypes, minPrice, val)
    }
  }

  const filtered = products.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false
    if (activeTypes.length && !activeTypes.includes(p.type)) return false
    if (minPrice && p.basePrice < parseInt(minPrice)) return false
    if (maxPrice && p.basePrice > parseInt(maxPrice)) return false
    return true
  })

  const seo = getPageSEO(activeCategory)
  useSEO({ title: seo.title, description: seo.description })

  const hasFilters = activeCategory !== null || activeTypes.length > 0 || minPrice || maxPrice

  const availableTypes = activeCategory
    ? activeCategory === 'windows'
      ? windowTypes
      : doorTypes
    : [...windowTypes, ...doorTypes]

  const typeCounts = availableTypes.reduce<Record<string, number>>((acc, type) => {
    acc[type] = products.filter(
      (p) => p.type === type && (!activeCategory || p.category === activeCategory)
    ).length
    return acc
  }, {})

  function getProductPath(p: Product) {
    return `/${p.category}/${p.slug}`
  }

  const seo2 = getPageSEO(activeCategory)

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-12">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">{seo2.h1}</h1>
        <p className="font-sans text-ink-muted mb-6 max-w-2xl">{seo2.intro}</p>

        {/* Active filter badges */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {activeCategory && (
              <button
                onClick={() => setCategory(null)}
                className="inline-flex items-center gap-1 font-sans text-sm px-3 py-1 border border-hairline bg-surface text-ink rounded hover:border-brand transition-colors"
              >
                {activeCategory === 'windows' ? 'Windows' : 'Doors'}
                <X className="w-3 h-3" />
              </button>
            )}
            {activeTypes.map((t) => (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className="inline-flex items-center gap-1 font-sans text-sm px-3 py-1 border border-hairline bg-surface text-ink rounded hover:border-brand transition-colors"
              >
                {t}
                <X className="w-3 h-3" />
              </button>
            ))}
            {(minPrice || maxPrice) && (
              <button
                onClick={() => {
                  setMinPrice('')
                  setMaxPrice('')
                  updateURL(activeCategory, activeTypes, '', '')
                }}
                className="inline-flex items-center gap-1 font-sans text-sm px-3 py-1 border border-hairline bg-surface text-ink rounded hover:border-brand transition-colors"
              >
                Price filter
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={clearAll}
              className="font-sans text-sm text-brand hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="border border-hairline bg-surface p-5 space-y-8">
              {/* Category */}
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
                  Category
                </p>
                {([null, 'windows', 'doors'] as const).map((cat) => (
                  <label key={String(cat)} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={activeCategory === cat}
                      onChange={() => setCategory(cat)}
                      className="accent-brand"
                    />
                    <span className="font-sans text-sm text-ink">
                      {cat === null ? 'All Products' : cat === 'windows' ? 'Windows' : 'Doors'}
                    </span>
                    <span className="font-sans text-xs text-ink-muted ml-auto">
                      {cat === null
                        ? products.length
                        : products.filter((p) => p.category === cat).length}
                    </span>
                  </label>
                ))}
              </div>

              {/* Type */}
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
                  Product Type
                </p>
                {availableTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="accent-brand"
                    />
                    <span className="font-sans text-sm text-ink">{type}</span>
                    <span className="font-sans text-xs text-ink-muted ml-auto">
                      {typeCounts[type] || 0}
                    </span>
                  </label>
                ))}
              </div>

              {/* Price */}
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
                  Base Price
                </p>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min £"
                    value={minPrice}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full border border-hairline bg-paper font-sans text-sm text-ink px-2 py-1.5 rounded focus:outline-none focus:border-brand"
                  />
                  <input
                    type="number"
                    placeholder="Max £"
                    value={maxPrice}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full border border-hairline bg-paper font-sans text-sm text-ink px-2 py-1.5 rounded focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filter pills */}
          <div className="md:hidden flex flex-wrap gap-2 mb-4">
            {([null, 'windows', 'doors'] as const).map((cat) => (
              <button
                key={String(cat)}
                onClick={() => setCategory(cat)}
                className={`font-sans text-sm px-3 py-1.5 border rounded transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand text-paper border-brand'
                    : 'bg-surface border-hairline text-ink'
                }`}
              >
                {cat === null ? 'All' : cat === 'windows' ? 'Windows' : 'Doors'}
              </button>
            ))}
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`font-sans text-sm px-3 py-1.5 border rounded transition-colors ${
                  activeTypes.includes(type)
                    ? 'bg-brand text-paper border-brand'
                    : 'bg-surface border-hairline text-ink'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1">
            <p className="font-sans text-sm text-ink-muted mb-6">
              Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>

            {filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No products match your filters"
                description="Try adjusting or clearing your filters."
                actionLabel="Clear filters"
                onAction={clearAll}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    className="cursor-pointer"
                    onClick={() => navigate(getProductPath(product))}
                  >
                    <ProductCard
                      title={product.name}
                      description={product.shortDescription}
                      price={product.basePrice}
                      imageUrl={product.imageUrl}
                      isFromPrice
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
