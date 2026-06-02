export {
  calculateWindowPrice,
  lookupWindowBandPrice,
  WINDOW_PRICE_BANDS,
  WINDOW_ADDONS,
  WINDOW_COLOUR_UPLIFTS,
} from './windowPricing'
export type { WindowQuoteInput, WindowQuoteResult } from './windowPricing'

export {
  calculateDoorPrice,
  getDoorRange,
  getDoorBySku,
  getDoorsByVariantType,
  DOOR_CATALOGUE,
  DOOR_ADDONS,
  LARGE_DOOR_UPLIFT,
} from './doorPricing'
export type {
  DoorRange,
  DoorVariant,
  DoorVariantType,
  DoorQuoteInput,
  DoorQuoteResult,
} from './doorPricing'

export function formatPrice(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pence)
}

export function getPriceRange(basePrice: number): { low: number; high: number } {
  return {
    low: Math.round((basePrice * 0.85) / 50) * 50,
    high: Math.round((basePrice * 1.15) / 50) * 50,
  }
}
