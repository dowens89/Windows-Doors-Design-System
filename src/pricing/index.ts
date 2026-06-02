import { useState, useEffect } from 'react'
import { fetchAllPricingData } from './pricingService'
import type { WindowPricingData } from './windowPricing'
import type { DoorPricingData } from './doorPricing'

export { calculateWindowPrice, lookupWindowBandPrice } from './windowPricing'
export type { WindowPricingData, WindowQuoteInput, WindowQuoteResult } from './windowPricing'

export { calculateDoorPrice, getDoorRange, getDoorBySku, getDoorsByVariantType } from './doorPricing'
export type {
  DoorPricingData,
  DoorRange,
  DoorVariant,
  DoorVariantType,
  DoorQuoteInput,
  DoorQuoteResult,
} from './doorPricing'

export function formatPrice(pounds: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pounds)
}

export function getPriceRange(basePrice: number): { low: number; high: number } {
  return {
    low: Math.round((basePrice * 0.85) / 50) * 50,
    high: Math.round((basePrice * 1.15) / 50) * 50,
  }
}

// ─── Module-level cache ───────────────────────────────────────────────────────

let cachedWindows: WindowPricingData | null = null
let cachedDoors: DoorPricingData | null = null

export interface PricingDataState {
  windows: WindowPricingData | null
  doors: DoorPricingData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function usePricingData(): PricingDataState {
  const [windows, setWindows] = useState<WindowPricingData | null>(cachedWindows)
  const [doors, setDoors] = useState<DoorPricingData | null>(cachedDoors)
  const [loading, setLoading] = useState(!cachedWindows || !cachedDoors)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (cachedWindows && cachedDoors && tick === 0) {
      setWindows(cachedWindows)
      setDoors(cachedDoors)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchAllPricingData()
      .then(({ windows: w, doors: d }) => {
        if (cancelled) return
        cachedWindows = w
        cachedDoors = d
        setWindows(w)
        setDoors(d)
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [tick])

  function refetch() {
    cachedWindows = null
    cachedDoors = null
    setTick((t) => t + 1)
  }

  return { windows, doors, loading, error, refetch }
}
