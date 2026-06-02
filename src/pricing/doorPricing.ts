export type DoorVariantType =
  | 'standard'
  | 'bevel'
  | 'solid'
  | 'mini_blind'
  | 'pvc'

export interface DoorVariant {
  skuId: string;
  variantType: DoorVariantType;
  sellingPrice: number;
}

export interface DoorRange {
  rangeId: string;
  rangeName: string;
  variants: DoorVariant[];
}

export interface DoorPricingData {
  catalogue: DoorRange[]
  addons: Record<string, number>
  largeDoorUplift: number
}

export interface DoorQuoteInput {
  skuId: string;
  isLargeDoor?: boolean;
  premiumColour?: boolean;
  autoLock?: boolean;
  handleSize?: '600mm' | '1200mm' | '1800mm' | null;
  letterbox?: boolean;
  knocker?: boolean;
  topLight?: boolean;
  sideLight?: boolean;
}

export interface DoorQuoteResult {
  input: DoorQuoteInput;
  skuId: string;
  rangeName: string;
  variantType: DoorVariantType;
  basePrice: number;
  addons: { label: string; amount: number }[];
  subtotal: number;
  largeDoorUpliftAmount: number;
  totalPrice: number;
  totalPriceRounded: number;
}

export function getDoorRange(
  rangeId: string,
  catalogue: DoorRange[]
): DoorRange | undefined {
  return catalogue.find((r) => r.rangeId === rangeId)
}

export function getDoorBySku(
  skuId: string,
  catalogue: DoorRange[]
): { range: DoorRange; variant: DoorVariant } | undefined {
  for (const range of catalogue) {
    const variant = range.variants.find((v) => v.skuId === skuId)
    if (variant) return { range, variant }
  }
  return undefined
}

export function getDoorsByVariantType(
  type: DoorVariantType,
  catalogue: DoorRange[]
): { range: DoorRange; variant: DoorVariant }[] {
  const results: { range: DoorRange; variant: DoorVariant }[] = []
  for (const range of catalogue) {
    for (const variant of range.variants) {
      if (variant.variantType === type) {
        results.push({ range, variant })
      }
    }
  }
  return results
}

export function calculateDoorPrice(
  input: DoorQuoteInput,
  data: DoorPricingData
): DoorQuoteResult {
  const found = getDoorBySku(input.skuId, data.catalogue)
  if (!found) {
    throw new Error(`SKU ${input.skuId} not found in door catalogue.`)
  }

  const { range, variant } = found
  const basePrice = variant.sellingPrice

  const addons: { label: string; amount: number }[] = []

  if (input.premiumColour) {
    addons.push({ label: 'Premium colour', amount: data.addons.premium_colour ?? 50 })
  }

  if (input.autoLock) {
    addons.push({ label: 'Auto lock', amount: data.addons.auto_lock ?? 100 })
  }

  if (input.handleSize) {
    addons.push({
      label: `Long bar handle (${input.handleSize})`,
      amount: data.addons[`handle_${input.handleSize}`] ?? 100,
    })
  }

  if (input.letterbox) {
    addons.push({ label: 'Letterbox', amount: data.addons.letterbox ?? 50 })
  }

  if (input.knocker) {
    addons.push({ label: 'Knocker', amount: data.addons.knocker ?? 50 })
  }

  if (input.topLight) {
    addons.push({ label: 'Top light', amount: data.addons.top_light ?? 50 })
  }

  if (input.sideLight) {
    addons.push({ label: 'Side light', amount: data.addons.side_light ?? 100 })
  }

  const addonTotal = addons.reduce((sum, a) => sum + a.amount, 0)
  const subtotal = basePrice + addonTotal

  const largeDoorUpliftAmount = input.isLargeDoor ? subtotal * data.largeDoorUplift : 0
  const totalPrice = subtotal + largeDoorUpliftAmount
  const totalPriceRounded = Math.round(totalPrice)

  return {
    input,
    skuId: input.skuId,
    rangeName: range.rangeName,
    variantType: variant.variantType,
    basePrice,
    addons,
    subtotal,
    largeDoorUpliftAmount,
    totalPrice,
    totalPriceRounded,
  }
}
