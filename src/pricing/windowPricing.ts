/**
 * WDO Window Pricing Engine
 *
 * Calculation rules:
 * 1. Take width + height in mm
 * 2. Round UP to the next available band
 * 3. Look up the selling price for that band
 * 4. Add flat add-ons (openers, rails, etc)
 * 5. Apply percentage uplifts LAST (colour)
 *
 * Worked example from installer:
 * 500 x 500 window = 1000mm combined
 * Base price at 1000mm band = £229.50
 * + 1 opener = £242.00
 * Subtotal = £471.50
 * + 20% standard colour = £94.30
 * Total = £565.80 → rounds to £566 ✓
 */

// ─── Price Bands ────────────────────────────────────────────────────────────
// Key = combined width + height in mm (rounded up to this band)
// Value = selling price in £

export const WINDOW_PRICE_BANDS: Record<number, number> = {
  1000: 229.50,
  1200: 232.50,
  1400: 235.50,
  1600: 238.50,
  1800: 243.00,
  2000: 261.00,
  2200: 282.00,
  2400: 304.50,
  2600: 330.00,
  2800: 357.00,
  3000: 385.50,
  3200: 417.00,
  3400: 450.00,
  3600: 484.50,
  3800: 522.00,
  4000: 561.00,
  4200: 601.50,
  4400: 645.00,
  4600: 690.00,
  4800: 736.50,
  5000: 784.50,
};

// ─── Flat Add-ons (£) ────────────────────────────────────────────────────────

export const WINDOW_ADDONS: Record<string, number> = {
  mid_rail:        20,
  leading:         50,
  georgian_bar:    50,
  opener:         242,   // per opener
  bay_pole:       242,   // per pole
  flush_casement: 363,   // per window
};

// ─── Percentage Uplifts (applied after all flat add-ons) ────────────────────

export const WINDOW_COLOUR_UPLIFTS: Record<string, number> = {
  white:   0,    // standard white — no uplift
  standard: 0.20, // standard colour range
  premium:  0.30, // premium colour range
};

// ─── Band Lookup ─────────────────────────────────────────────────────────────

/**
 * Given a combined measurement in mm, returns the selling price
 * from the next band up.
 * Throws if measurement exceeds the maximum band (5000mm).
 */
export function lookupWindowBandPrice(combinedMm: number): {
  band: number;
  basePrice: number;
} {
  const bands = Object.keys(WINDOW_PRICE_BANDS)
    .map(Number)
    .sort((a, b) => a - b);

  const band = bands.find((b) => b >= combinedMm);

  if (band === undefined) {
    throw new Error(
      `Combined measurement ${combinedMm}mm exceeds maximum band (5000mm). ` +
      `Please contact us for a bespoke quote.`
    );
  }

  return {
    band,
    basePrice: WINDOW_PRICE_BANDS[band],
  };
}

// ─── Main Calculation ────────────────────────────────────────────────────────

export interface WindowQuoteInput {
  widthMm: number;
  heightMm: number;
  openers?: number;          // count of opening lights
  bayPoles?: number;         // count of bay poles
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

export function calculateWindowPrice(
  input: WindowQuoteInput
): WindowQuoteResult {
  const combinedMm = input.widthMm + input.heightMm;
  const { band, basePrice } = lookupWindowBandPrice(combinedMm);

  // Build flat add-ons
  const addons: { label: string; amount: number }[] = [];

  if (input.openers && input.openers > 0) {
    addons.push({
      label: `Opener x${input.openers}`,
      amount: WINDOW_ADDONS.opener * input.openers,
    });
  }

  if (input.bayPoles && input.bayPoles > 0) {
    addons.push({
      label: `Bay pole x${input.bayPoles}`,
      amount: WINDOW_ADDONS.bay_pole * input.bayPoles,
    });
  }

  if (input.midRail) {
    addons.push({ label: 'Mid rail', amount: WINDOW_ADDONS.mid_rail });
  }

  if (input.leading) {
    addons.push({ label: 'Leading', amount: WINDOW_ADDONS.leading });
  }

  if (input.georgianBar) {
    addons.push({ label: 'Georgian bar', amount: WINDOW_ADDONS.georgian_bar });
  }

  if (input.flushCasement) {
    addons.push({
      label: 'Flush casement',
      amount: WINDOW_ADDONS.flush_casement,
    });
  }

  const addonTotal = addons.reduce((sum, a) => sum + a.amount, 0);
  const subtotal = basePrice + addonTotal;

  // Apply colour uplift last
  const colourType = input.colourType ?? 'white';
  const colourUpliftPct = WINDOW_COLOUR_UPLIFTS[colourType];
  const colourUpliftAmount = subtotal * colourUpliftPct;
  const totalPrice = subtotal + colourUpliftAmount;
  const totalPriceRounded = Math.round(totalPrice);

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
  };
}
