export interface WindowPricingData {
  bands: Record<number, number>
  addons: Record<string, number>
  colourUplifts: Record<string, number>
}

export interface WindowQuoteInput {
  widthMm: number;
  heightMm: number;
  openers?: number;
  bayPoles?: number;
  midRail?: boolean;
  leading?: boolean;
  georgianBar?: boolean;
  flushCasement?: boolean;
  colourType?: 'white' | 'standard' | 'premium';
}

export interface WindowQuoteResult {
  input: WindowQuoteInput;
  combinedMm: number;
  band: number;
  basePrice: number;
  addons: { label: string; amount: number }[];
  subtotal: number;
  colourUpliftPct: number;
  colourUpliftAmount: number;
  totalPrice: number;
  totalPriceRounded: number;
}

export function lookupWindowBandPrice(
  combinedMm: number,
  bands: Record<number, number>
): { band: number; basePrice: number } {
  const sortedBands = Object.keys(bands)
    .map(Number)
    .sort((a, b) => a - b)

  const band = sortedBands.find((b) => b >= combinedMm)

  if (band === undefined) {
    throw new Error(
      `Combined measurement ${combinedMm}mm exceeds maximum band. ` +
      `Please contact us for a bespoke quote.`
    )
  }

  return { band, basePrice: bands[band] }
}

export function calculateWindowPrice(
  input: WindowQuoteInput,
  data: WindowPricingData
): WindowQuoteResult {
  const combinedMm = input.widthMm + input.heightMm
  const { band, basePrice } = lookupWindowBandPrice(combinedMm, data.bands)

  const addons: { label: string; amount: number }[] = []

  if (input.openers && input.openers > 0) {
    addons.push({
      label: `Opener x${input.openers}`,
      amount: (data.addons.opener ?? 242) * input.openers,
    })
  }

  if (input.bayPoles && input.bayPoles > 0) {
    addons.push({
      label: `Bay pole x${input.bayPoles}`,
      amount: (data.addons.bay_pole ?? 242) * input.bayPoles,
    })
  }

  if (input.midRail) {
    addons.push({ label: 'Mid rail', amount: data.addons.mid_rail ?? 20 })
  }

  if (input.leading) {
    addons.push({ label: 'Leading', amount: data.addons.leading ?? 50 })
  }

  if (input.georgianBar) {
    addons.push({ label: 'Georgian bar', amount: data.addons.georgian_bar ?? 50 })
  }

  if (input.flushCasement) {
    addons.push({ label: 'Flush casement', amount: data.addons.flush_casement ?? 363 })
  }

  const addonTotal = addons.reduce((sum, a) => sum + a.amount, 0)
  const subtotal = basePrice + addonTotal

  const colourType = input.colourType ?? 'white'
  const colourUpliftPct = data.colourUplifts[colourType] ?? 0
  const colourUpliftAmount = subtotal * colourUpliftPct
  const totalPrice = subtotal + colourUpliftAmount
  const totalPriceRounded = Math.round(totalPrice)

  return {
    input,
    combinedMm,
    band,
    basePrice,
    addons,
    subtotal,
    colourUpliftPct,
    colourUpliftAmount,
    totalPrice,
    totalPriceRounded,
  }
}
