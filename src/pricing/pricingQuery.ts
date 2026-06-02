import {
  calculateWindowPrice,
  WINDOW_PRICE_BANDS,
} from './windowPricing';

import {
  calculateDoorPrice,
  getDoorRange,
  DOOR_CATALOGUE,
} from './doorPricing';

function gbp(n: number): string {
  return `£${n.toFixed(2)}`;
}

function header(title: string): void {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

function subheader(title: string): void {
  console.log(`\n  -- ${title}`);
}

// 1. WINDOW BAND TABLE
header('WINDOW PRICE BAND TABLE');
console.log('  Combined mm'.padEnd(16) + 'Selling Price'.padEnd(16));
console.log('  ' + '-'.repeat(30));
Object.entries(WINDOW_PRICE_BANDS).forEach(([band, price]) => {
  console.log(`  ${band}mm`.padEnd(16) + gbp(price).padEnd(16));
});

// 2. WORKED EXAMPLE
header('WORKED EXAMPLE (installer verified)');
console.log('  500 x 500 window, 1 opener, standard colour');
console.log('  Expected result: ~566\n');

const example = calculateWindowPrice({
  widthMm: 500,
  heightMm: 500,
  openers: 1,
  colourType: 'standard',
});

console.log(`  Combined measurement : ${example.combinedMm}mm`);
console.log(`  Rounded up to band   : ${example.band}mm`);
console.log(`  Base selling price   : ${gbp(example.basePrice)}`);
example.addons.forEach((a) => {
  console.log(`  + ${a.label.padEnd(20)}: ${gbp(a.amount)}`);
});
console.log(`  Subtotal             : ${gbp(example.subtotal)}`);
console.log(`  Colour uplift (+${(example.colourUpliftPct * 100).toFixed(0)}%)  : ${gbp(example.colourUpliftAmount)}`);
console.log(`  ----------------------------`);
console.log(`  TOTAL                : ${gbp(example.totalPrice)}`);
console.log(`  TOTAL (rounded)      : ${gbp(example.totalPriceRounded)}`);

// 3. WINDOW EXAMPLES
header('WINDOW QUOTE EXAMPLES');

const windowExamples = [
  { label: 'Small white casement, no openers', input: { widthMm: 400, heightMm: 400, colourType: 'white' as const } },
  { label: 'Large standard colour, 2 openers', input: { widthMm: 900, heightMm: 700, openers: 2, colourType: 'standard' as const } },
  { label: 'Premium colour, 1 opener, georgian bar', input: { widthMm: 600, heightMm: 900, openers: 1, georgianBar: true, colourType: 'premium' as const } },
  { label: 'Flush casement, standard colour, mid rail', input: { widthMm: 700, heightMm: 800, flushCasement: true, midRail: true, colourType: 'standard' as const } },
  { label: 'Band boundary test (1199mm combined)', input: { widthMm: 600, heightMm: 599, colourType: 'white' as const } },
];

windowExamples.forEach(({ label, input }) => {
  const result = calculateWindowPrice(input);
  console.log(`\n  ${label}`);
  console.log(`  ${input.widthMm}mm x ${input.heightMm}mm => band ${result.band}mm`);
  console.log(`  Base: ${gbp(result.basePrice)} | Total: ${gbp(result.totalPriceRounded)}`);
});

// 4. DOOR CATALOGUE SUMMARY
header('DOOR CATALOGUE SUMMARY');

console.log(`  Total ranges    : ${DOOR_CATALOGUE.length}`);

const totalVariants = DOOR_CATALOGUE.reduce((sum, r) => sum + r.variants.length, 0);
console.log(`  Total SKUs      : ${totalVariants}`);

const allPrices = DOOR_CATALOGUE.flatMap((r) => r.variants.map((v) => v.sellingPrice));
const minPrice = Math.min(...allPrices);
const maxPrice = Math.max(...allPrices);
const avgPrice = allPrices.reduce((s, p) => s + p, 0) / allPrices.length;

console.log(`  Price range     : ${gbp(minPrice)} -- ${gbp(maxPrice)}`);
console.log(`  Average price   : ${gbp(avgPrice)}`);

subheader('Breakdown by variant type');
(['standard', 'bevel', 'solid', 'mini_blind', 'pvc'] as const).forEach((type) => {
  const count = DOOR_CATALOGUE.flatMap((r) => r.variants.filter((v) => v.variantType === type)).length;
  if (count > 0) console.log(`  ${type.padEnd(12)}: ${count} SKUs`);
});

subheader('Price tier distribution');
[
  { label: 'Budget   (under 900)',    min: 0,    max: 900 },
  { label: 'Mid      (900-1150)',      min: 900,  max: 1150 },
  { label: 'Upper    (1150-1300)',     min: 1150, max: 1300 },
  { label: 'Premium  (over 1300)',     min: 1300, max: Infinity },
].forEach(({ label, min, max }) => {
  const count = allPrices.filter((p) => p >= min && p < max).length;
  console.log(`  ${label}: ${count} SKUs`);
});

// 5. DOOR RANGE LOOKUPS
header('DOOR RANGE LOOKUP EXAMPLES');

['alnwick', 'cheltenham', 'pvc', 'balmoral'].forEach((rangeId) => {
  const range = getDoorRange(rangeId);
  if (!range) { console.log(`  ${rangeId}: NOT FOUND`); return; }
  console.log(`\n  ${range.rangeName}`);
  range.variants.forEach((v) => {
    console.log(`    ${v.skuId.padEnd(8)} ${v.variantType.padEnd(12)} ${gbp(v.sellingPrice)}`);
  });
});

// 6. DOOR QUOTE EXAMPLES
header('DOOR QUOTE EXAMPLES');

const doorExamples = [
  { label: 'Alnwick standard, white, no addons', input: { skuId: 'CD-02' } },
  { label: 'Cheltenham bevel, premium colour, letterbox, knocker', input: { skuId: 'CD-44', premiumColour: true, letterbox: true, knocker: true } },
  { label: 'Edinburgh standard, auto lock, 600mm handle', input: { skuId: 'CD-58', autoLock: true, handleSize: '600mm' as const } },
  { label: 'Balmoral solid, large door, side light', input: { skuId: 'CD-17', isLargeDoor: true, sideLight: true } },
  { label: 'PVC glazed, budget option', input: { skuId: 'CD-146' } },
];

doorExamples.forEach(({ label, input }) => {
  const result = calculateDoorPrice(input);
  console.log(`\n  ${label}`);
  console.log(`  ${result.rangeName} (${result.variantType})`);
  console.log(`  Base: ${gbp(result.basePrice)}`);
  result.addons.forEach((a) => console.log(`  + ${a.label}: ${gbp(a.amount)}`));
  if (result.largeDoorUpliftAmount > 0) {
    console.log(`  + Large door (+10%): ${gbp(result.largeDoorUpliftAmount)}`);
  }
  console.log(`  TOTAL: ${gbp(result.totalPriceRounded)}`);
});

// 7. FULL CATALOGUE
header('FULL DOOR CATALOGUE');
DOOR_CATALOGUE.forEach((range) => {
  console.log(`\n  ${range.rangeName}`);
  range.variants.forEach((v) => {
    console.log(`    ${v.skuId.padEnd(8)} ${v.variantType.padEnd(12)} ${gbp(v.sellingPrice)}`);
  });
});

// 8. PRICE RANGE FILTER
header('DOORS IN 950-1100 RANGE (standard variants only)');
DOOR_CATALOGUE.forEach((range) => {
  range.variants
    .filter((v) => v.variantType === 'standard' && v.sellingPrice >= 950 && v.sellingPrice <= 1100)
    .forEach((v) => {
      console.log(`  ${range.rangeName.padEnd(16)} ${v.skuId.padEnd(8)} ${gbp(v.sellingPrice)}`);
    });
});

console.log('\n' + '='.repeat(60));
console.log('  Pricing engine queries complete');
console.log('='.repeat(60) + '\n');
