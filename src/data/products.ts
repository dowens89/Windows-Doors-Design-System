export interface ProductVariantOption {
  id: string
  label: string
  priceModifier: number
  hex?: string
  borderHex?: string
}

export interface ProductVariant {
  id: string
  label: string
  type: 'style' | 'colour' | 'glazing' | 'size' | 'panels' | 'sidePanels'
  options: ProductVariantOption[]
}

export interface ProductFAQ {
  question: string
  answer: string
}

export interface Product {
  id: string
  slug: string
  category: 'windows' | 'doors'
  type: string
  name: string
  shortDescription: string
  basePrice: number
  unit: string
  imageUrl: string
  variants: ProductVariant[]
  features: string[]
  included: string[]
  potentialVariations: string[]
  faqs: ProductFAQ[]
  relatedProductIds: string[]
  seo: {
    title: string
    description: string
    h1: string
  }
}

const standardIncluded = [
  'Supply of window unit to your specification',
  'Professional installation by a FENSA-registered installer',
  'Removal and disposal of your existing window',
  'FENSA certificate for your records',
  'Mastic seal and internal finishing',
]

const doorIncluded = [
  'Supply of composite door to your specification',
  'Professional installation by a FENSA-registered fitter',
  'Removal and disposal of your existing door',
  'FENSA certificate',
  'Mastic seal and weather bar',
]

const standardVariations = [
  'Structural lintel replacement not visible before survey',
  'Scaffolding required for first floor or above',
  'Non-standard or irregular opening size',
  'Significant access constraints',
  'Repair work to surrounding brickwork or plasterwork',
]

const standardSizes: ProductVariantOption[] = [
  { id: 'small', label: 'Small (up to 600mm wide)', priceModifier: -50 },
  { id: 'standard', label: 'Standard (601–900mm wide)', priceModifier: 0 },
  { id: 'large', label: 'Large (901–1200mm wide)', priceModifier: 150 },
  { id: 'extra-large', label: 'Extra Large (over 1200mm wide)', priceModifier: 300 },
]

const fullColours: ProductVariantOption[] = [
  { id: 'white', label: 'White', priceModifier: 0, hex: '#F0EDE8', borderHex: '#CCCCCC' },
  { id: 'anthracite', label: 'Anthracite Grey', priceModifier: 75, hex: '#3D3D3D' },
  { id: 'black', label: 'Black', priceModifier: 75, hex: '#1C1C1C' },
  { id: 'chartwell', label: 'Chartwell Green', priceModifier: 75, hex: '#6B8F71' },
  { id: 'irish-oak', label: 'Irish Oak', priceModifier: 75, hex: '#8B5E3C' },
  { id: 'cream', label: 'Cream', priceModifier: 0, hex: '#F5F0E0', borderHex: '#CCCCCC' },
]

const noChartwellColours: ProductVariantOption[] = fullColours.filter(
  (c) => c.id !== 'chartwell' && c.id !== 'irish-oak'
)

const sashColours: ProductVariantOption[] = [
  { id: 'white', label: 'White', priceModifier: 0, hex: '#F0EDE8', borderHex: '#CCCCCC' },
  { id: 'anthracite', label: 'Anthracite Grey', priceModifier: 75, hex: '#3D3D3D' },
  { id: 'black', label: 'Black', priceModifier: 75, hex: '#1C1C1C' },
  { id: 'cream', label: 'Cream', priceModifier: 0, hex: '#F5F0E0', borderHex: '#CCCCCC' },
]

const standardGlazing: ProductVariantOption[] = [
  { id: 'clear-double', label: 'Clear Double Glazed', priceModifier: 0 },
  { id: 'obscure-double', label: 'Obscure Double Glazed', priceModifier: 50 },
  { id: 'decorative', label: 'Decorative', priceModifier: 150 },
  { id: 'triple', label: 'Triple Glazed', priceModifier: 200 },
]

const standardWindowFaqs = (basePrice: number): ProductFAQ[] => [
  {
    question: 'Is the online price the price I will pay?',
    answer:
      'The price shown is an honest indicative price based on standard installation. A surveyor confirms exact measurements and checks for anything non-standard. In the majority of straightforward jobs the final price matches what you see here.',
  },
  {
    question: 'Will I be pressured to buy at the survey?',
    answer:
      'No. The survey is a technical visit to confirm measurements. There is no salesperson. You are under no obligation at any stage.',
  },
  {
    question: 'How long does installation take?',
    answer:
      'A standard window installation takes approximately 1–2 hours per window. Your installer will confirm the full day schedule when they arrange your survey.',
  },
  {
    question: 'Which areas do you cover?',
    answer:
      'We currently serve West Yorkshire including Leeds, Bradford, Wakefield, Huddersfield, Halifax, Harrogate and surrounding areas.',
  },
  {
    question: `How much does a window cost installed in West Yorkshire?`,
    answer: `Based on our current pricing, a standard window installed in West Yorkshire starts from £${basePrice}. Price varies by size, colour, and glazing choice. Multi-window jobs are priced per unit and the total will reflect your full specification.`,
  },
]

const standardDoorFaqs = (basePrice: number): ProductFAQ[] => [
  {
    question: `How much does a door cost installed in West Yorkshire?`,
    answer: `A standard door installed in West Yorkshire starts from £${basePrice} based on our current pricing. Style, colour, glazing choice and door width all affect the final price.`,
  },
  {
    question: 'Is the online price what I will pay?',
    answer:
      'The price shown is an honest indicative installed price. A surveyor will visit to confirm exact measurements and check for anything non-standard. In most straightforward replacements the final price matches the online indication.',
  },
  {
    question: 'How long does installation take?',
    answer:
      'A standard door installation typically takes 2–4 hours. Your installer confirms the timeframe when arranging your survey.',
  },
  {
    question: 'Will I be pressured to buy at the survey visit?',
    answer:
      'No. The survey is a technical visit to confirm your specification. There is no salesperson. You are under no obligation at any stage.',
  },
  {
    question: 'Which areas do you currently cover?',
    answer:
      'West Yorkshire — Leeds, Bradford, Wakefield, Huddersfield, Halifax, Harrogate and surrounding areas.',
  },
]

export const products: Product[] = [
  {
    id: 'casement-windows',
    slug: 'casement-windows',
    category: 'windows',
    type: 'Casement',
    name: 'Casement Windows',
    shortDescription:
      'Classic outward-opening windows. Energy-efficient, secure, and available in a range of colours to suit any home.',
    basePrice: 450,
    unit: 'per window, installed',
    imageUrl:
      'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800',
    variants: [
      {
        id: 'style',
        label: 'Style',
        type: 'style',
        options: [
          { id: 'standard', label: 'Standard', priceModifier: 0 },
          { id: 'bay', label: 'Bay Configuration', priceModifier: 350 },
          { id: 'corner', label: 'Corner Configuration', priceModifier: 500 },
        ],
      },
      {
        id: 'colour',
        label: 'Colour',
        type: 'colour',
        options: fullColours,
      },
      {
        id: 'glazing',
        label: 'Glazing',
        type: 'glazing',
        options: standardGlazing,
      },
      {
        id: 'size',
        label: 'Size',
        type: 'size',
        options: standardSizes,
      },
    ],
    features: [
      'A-rated energy efficiency',
      'Multi-point locking system',
      'Low maintenance uPVC frame',
      'Trickle vents for ventilation',
      'Suited to most UK property types',
    ],
    included: standardIncluded,
    potentialVariations: standardVariations,
    faqs: [
      {
        question: 'How much does a casement window cost installed in West Yorkshire?',
        answer:
          'Based on our current pricing, a standard casement window installed in West Yorkshire starts from £450. Price varies by size, colour, and glazing choice. Multi-window jobs are priced per unit and the total will reflect your full specification.',
      },
      ...standardWindowFaqs(450).slice(1),
    ],
    relatedProductIds: ['sash-windows', 'tilt-turn-windows', 'french-windows'],
    seo: {
      title: 'Casement Windows Installed West Yorkshire | From £450 | Windows & Doors Online',
      description:
        'Casement windows with honest installed prices for West Yorkshire. Choose your size, colour and glazing. See your price online — no salesperson.',
      h1: 'Casement Windows — Installed Prices in West Yorkshire',
    },
  },
  {
    id: 'sash-windows',
    slug: 'sash-windows',
    category: 'windows',
    type: 'Sash',
    name: 'Sash Windows',
    shortDescription:
      'Elegant sliding sash windows that complement period and traditional properties. Draught-proof and thermally efficient.',
    basePrice: 650,
    unit: 'per window, installed',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
    variants: [
      {
        id: 'style',
        label: 'Style',
        type: 'style',
        options: [
          { id: 'single-hung', label: 'Single Hung', priceModifier: 0 },
          { id: 'double-hung', label: 'Double Hung', priceModifier: 200 },
        ],
      },
      {
        id: 'colour',
        label: 'Colour',
        type: 'colour',
        options: sashColours,
      },
      {
        id: 'glazing',
        label: 'Glazing',
        type: 'glazing',
        options: [
          { id: 'clear-double', label: 'Clear Double Glazed', priceModifier: 0 },
          { id: 'obscure-double', label: 'Obscure Double Glazed', priceModifier: 50 },
          { id: 'decorative', label: 'Decorative', priceModifier: 150 },
        ],
      },
      {
        id: 'size',
        label: 'Size',
        type: 'size',
        options: standardSizes,
      },
    ],
    features: [
      'Authentic sash movement with spring balances',
      'Draught-proof brushes and seals',
      'Slim sightlines for a traditional aesthetic',
      'Tilt-in cleaning on double hung models',
    ],
    included: standardIncluded,
    potentialVariations: standardVariations,
    faqs: [
      {
        question: 'How much does a sash window cost installed in West Yorkshire?',
        answer:
          'Based on our current pricing, a standard sash window installed in West Yorkshire starts from £650. Price varies by style, colour, and glazing choice.',
      },
      ...standardWindowFaqs(650).slice(1),
    ],
    relatedProductIds: ['casement-windows', 'tilt-turn-windows'],
    seo: {
      title: 'Sash Windows Installed West Yorkshire | From £650 | Windows & Doors Online',
      description:
        'Replacement sash windows with honest installed prices for West Yorkshire. Traditional style, modern performance. See your price online.',
      h1: 'Sash Windows — Installed Prices in West Yorkshire',
    },
  },
  {
    id: 'tilt-turn-windows',
    slug: 'tilt-turn-windows',
    category: 'windows',
    type: 'Tilt & Turn',
    name: 'Tilt & Turn Windows',
    shortDescription:
      'Versatile dual-action windows that tilt inward for ventilation or open fully for cleaning and emergency egress.',
    basePrice: 550,
    unit: 'per window, installed',
    imageUrl:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
    variants: [
      {
        id: 'colour',
        label: 'Colour',
        type: 'colour',
        options: noChartwellColours,
      },
      {
        id: 'glazing',
        label: 'Glazing',
        type: 'glazing',
        options: standardGlazing,
      },
      {
        id: 'size',
        label: 'Size',
        type: 'size',
        options: standardSizes,
      },
    ],
    features: [
      'Dual-action tilt and turn mechanism',
      'Inward tilt for safe ventilation',
      'Full open for easy cleaning',
      'A-rated energy efficiency',
      'Multi-point locking system',
    ],
    included: standardIncluded,
    potentialVariations: standardVariations,
    faqs: [
      {
        question: 'How much does a tilt and turn window cost installed in West Yorkshire?',
        answer:
          'Based on our current pricing, a standard tilt and turn window installed in West Yorkshire starts from £550. Price varies by colour, glazing choice, and size.',
      },
      ...standardWindowFaqs(550).slice(1),
    ],
    relatedProductIds: ['casement-windows', 'sash-windows', 'bay-windows'],
    seo: {
      title: 'Tilt and Turn Windows West Yorkshire | From £550 | Windows & Doors Online',
      description:
        'Tilt and turn windows installed in West Yorkshire. Dual-action ventilation and easy cleaning. Honest online prices — no salesperson.',
      h1: 'Tilt & Turn Windows — Installed Prices in West Yorkshire',
    },
  },
  {
    id: 'bay-windows',
    slug: 'bay-windows',
    category: 'windows',
    type: 'Bay',
    name: 'Bay Windows',
    shortDescription:
      'Project outward to create space and light. Available as three or five panel configurations.',
    basePrice: 1200,
    unit: 'per bay, installed',
    imageUrl:
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&q=80&w=800',
    variants: [
      {
        id: 'style',
        label: 'Style',
        type: 'style',
        options: [
          { id: 'three-panel', label: 'Three Panel Bay', priceModifier: 0 },
          { id: 'five-panel', label: 'Five Panel Bay', priceModifier: 600 },
        ],
      },
      {
        id: 'colour',
        label: 'Colour',
        type: 'colour',
        options: fullColours,
      },
      {
        id: 'glazing',
        label: 'Glazing',
        type: 'glazing',
        options: [
          { id: 'clear-double', label: 'Clear Double Glazed', priceModifier: 0 },
          { id: 'decorative', label: 'Decorative', priceModifier: 150 },
          { id: 'triple', label: 'Triple Glazed', priceModifier: 200 },
        ],
      },
      {
        id: 'size',
        label: 'Size',
        type: 'size',
        options: [
          { id: 'standard', label: 'Standard', priceModifier: 0 },
          { id: 'large', label: 'Large', priceModifier: 400 },
        ],
      },
    ],
    features: [
      'Projects outward to create additional space',
      'Three and five panel configurations',
      'A-rated energy efficiency',
      'Multi-point locking system',
      'Low maintenance uPVC frame',
    ],
    included: standardIncluded,
    potentialVariations: [
      ...standardVariations,
      'Bay pole or bay roof may require additional structural assessment',
    ],
    faqs: [
      {
        question: 'How much does a bay window cost installed in West Yorkshire?',
        answer:
          'Based on our current pricing, a bay window installed in West Yorkshire starts from £1,200 for a standard three panel configuration. Five panel and larger sizes carry an additional cost.',
      },
      ...standardWindowFaqs(1200).slice(1),
    ],
    relatedProductIds: ['casement-windows', 'french-windows', 'tilt-turn-windows'],
    seo: {
      title: 'Bay Windows Installed West Yorkshire | From £1,200 | Windows & Doors Online',
      description:
        'Bay windows with transparent installed prices for West Yorkshire. Three and five panel options. Get your price online before anyone visits.',
      h1: 'Bay Windows — Installed Prices in West Yorkshire',
    },
  },
  {
    id: 'french-windows',
    slug: 'french-windows',
    category: 'windows',
    type: 'French',
    name: 'French Windows',
    shortDescription:
      'Full-height glazed doors that open outward to create a seamless connection between inside and outside.',
    basePrice: 850,
    unit: 'per pair, installed',
    imageUrl:
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    variants: [
      {
        id: 'colour',
        label: 'Colour',
        type: 'colour',
        options: fullColours,
      },
      {
        id: 'glazing',
        label: 'Glazing',
        type: 'glazing',
        options: standardGlazing,
      },
      {
        id: 'size',
        label: 'Size',
        type: 'size',
        options: [
          { id: 'standard', label: 'Standard (up to 1200mm wide)', priceModifier: 0 },
          { id: 'wide', label: 'Wide (1201–1600mm wide)', priceModifier: 200 },
        ],
      },
    ],
    features: [
      'Full-height glazing for maximum light',
      'Outward opening for space efficiency inside',
      'Multi-point locking system',
      'A-rated energy efficiency',
      'Low maintenance uPVC frame',
    ],
    included: standardIncluded,
    potentialVariations: standardVariations,
    faqs: [
      {
        question: 'How much do French windows cost installed in West Yorkshire?',
        answer:
          'Based on our current pricing, French windows installed in West Yorkshire start from £850 per pair. Width and glazing choice affect the final price.',
      },
      ...standardWindowFaqs(850).slice(1),
    ],
    relatedProductIds: ['french-doors', 'bi-fold-doors', 'patio-doors'],
    seo: {
      title: 'French Windows Installed West Yorkshire | From £850 | Windows & Doors Online',
      description:
        'French windows with honest installed prices for West Yorkshire homes. Full-height glazing, easy access to garden. See your price online.',
      h1: 'French Windows — Installed Prices in West Yorkshire',
    },
  },
  {
    id: 'composite-doors',
    slug: 'composite-doors',
    category: 'doors',
    type: 'Composite',
    name: 'Composite Doors',
    shortDescription:
      'The most popular front door choice in the UK. Thermally efficient, secure, and available in a wide range of styles and colours.',
    basePrice: 1195,
    unit: 'installed',
    imageUrl:
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&q=80&w=800',
    variants: [
      {
        id: 'style',
        label: 'Style',
        type: 'style',
        options: [
          { id: 'single', label: 'Standard Single Door', priceModifier: 0 },
          { id: 'stable', label: 'Stable Door', priceModifier: 150 },
          { id: 'double', label: 'Double Doors', priceModifier: 400 },
        ],
      },
      {
        id: 'colour',
        label: 'Colour',
        type: 'colour',
        options: [
          { id: 'white', label: 'White', priceModifier: 0, hex: '#F0EDE8', borderHex: '#CCCCCC' },
          { id: 'black', label: 'Black', priceModifier: 75, hex: '#1C1C1C' },
          { id: 'anthracite', label: 'Anthracite Grey', priceModifier: 75, hex: '#3D3D3D' },
          { id: 'chartwell', label: 'Chartwell Green', priceModifier: 75, hex: '#6B8F71' },
          { id: 'irish-oak', label: 'Irish Oak', priceModifier: 75, hex: '#8B5E3C' },
          { id: 'red', label: 'Red', priceModifier: 75, hex: '#8B1A1A' },
          { id: 'blue', label: 'Blue', priceModifier: 75, hex: '#2C4A6E' },
        ],
      },
      {
        id: 'glazing',
        label: 'Glazing',
        type: 'glazing',
        options: [
          { id: 'clear', label: 'Clear', priceModifier: 0 },
          { id: 'obscure', label: 'Obscure', priceModifier: 50 },
          { id: 'decorative', label: 'Decorative', priceModifier: 150 },
          { id: 'solid', label: 'Fully Solid (no glass)', priceModifier: 0 },
        ],
      },
      {
        id: 'size',
        label: 'Size',
        type: 'size',
        options: [
          { id: 'standard', label: 'Standard (up to 920mm wide)', priceModifier: 0 },
          { id: 'wide', label: 'Wide (921–1100mm wide)', priceModifier: 200 },
        ],
      },
    ],
    features: [
      'GRP (glass reinforced plastic) outer skin',
      'Solid timber or foam core for thermal mass',
      'Multi-point locking as standard',
      'A-rated energy efficiency available',
      'Low maintenance — will not warp, crack or fade',
      '10-year manufacturer guarantee',
    ],
    included: doorIncluded,
    potentialVariations: standardVariations,
    faqs: standardDoorFaqs(1195),
    relatedProductIds: ['upvc-doors', 'french-doors'],
    seo: {
      title:
        'Composite Doors Installed West Yorkshire | From £1,195 | Windows & Doors Online',
      description:
        'Composite doors with transparent installed prices for West Yorkshire. Choose your style, colour and glazing. See your price online before anyone visits your home.',
      h1: 'Composite Doors — Installed Prices in West Yorkshire',
    },
  },
  {
    id: 'upvc-doors',
    slug: 'upvc-doors',
    category: 'doors',
    type: 'uPVC',
    name: 'uPVC Doors',
    shortDescription:
      'Practical, durable and thermally efficient. A cost-effective choice for back doors and secondary entrances.',
    basePrice: 695,
    unit: 'installed',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
    variants: [
      {
        id: 'style',
        label: 'Style',
        type: 'style',
        options: [
          { id: 'single', label: 'Single Door', priceModifier: 0 },
          { id: 'double', label: 'Double Door', priceModifier: 350 },
        ],
      },
      {
        id: 'colour',
        label: 'Colour',
        type: 'colour',
        options: [
          { id: 'white', label: 'White', priceModifier: 0, hex: '#F0EDE8', borderHex: '#CCCCCC' },
          { id: 'anthracite', label: 'Anthracite Grey', priceModifier: 75, hex: '#3D3D3D' },
          { id: 'black', label: 'Black', priceModifier: 75, hex: '#1C1C1C' },
          { id: 'cream', label: 'Cream', priceModifier: 0, hex: '#F5F0E0', borderHex: '#CCCCCC' },
        ],
      },
      {
        id: 'glazing',
        label: 'Glazing',
        type: 'glazing',
        options: [
          { id: 'clear', label: 'Clear', priceModifier: 0 },
          { id: 'obscure', label: 'Obscure', priceModifier: 50 },
          { id: 'decorative', label: 'Decorative', priceModifier: 100 },
        ],
      },
      {
        id: 'size',
        label: 'Size',
        type: 'size',
        options: [
          { id: 'standard', label: 'Standard', priceModifier: 0 },
          { id: 'wide', label: 'Wide', priceModifier: 150 },
        ],
      },
    ],
    features: [
      'Durable uPVC construction',
      'Thermally efficient double glazing',
      'Multi-point locking system',
      'Low maintenance frame',
      'Suited to rear and side entrances',
    ],
    included: doorIncluded,
    potentialVariations: standardVariations,
    faqs: standardDoorFaqs(695),
    relatedProductIds: ['composite-doors', 'french-doors'],
    seo: {
      title: 'uPVC Doors Installed West Yorkshire | From £695 | Windows & Doors Online',
      description:
        'uPVC doors with honest installed prices for West Yorkshire. Practical and thermally efficient. See your price online — no salesperson.',
      h1: 'uPVC Doors — Installed Prices in West Yorkshire',
    },
  },
  {
    id: 'french-doors',
    slug: 'french-doors',
    category: 'doors',
    type: 'French',
    name: 'French Doors',
    shortDescription:
      'Open your home to the garden. Elegant double doors with full glazing and smooth multi-point locking.',
    basePrice: 1100,
    unit: 'per pair, installed',
    imageUrl:
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    variants: [
      {
        id: 'colour',
        label: 'Colour',
        type: 'colour',
        options: [
          { id: 'white', label: 'White', priceModifier: 0, hex: '#F0EDE8', borderHex: '#CCCCCC' },
          { id: 'anthracite', label: 'Anthracite Grey', priceModifier: 75, hex: '#3D3D3D' },
          { id: 'black', label: 'Black', priceModifier: 75, hex: '#1C1C1C' },
          { id: 'chartwell', label: 'Chartwell Green', priceModifier: 75, hex: '#6B8F71' },
          { id: 'irish-oak', label: 'Irish Oak', priceModifier: 75, hex: '#8B5E3C' },
          { id: 'cream', label: 'Cream', priceModifier: 0, hex: '#F5F0E0', borderHex: '#CCCCCC' },
        ],
      },
      {
        id: 'glazing',
        label: 'Glazing',
        type: 'glazing',
        options: [
          { id: 'clear', label: 'Clear', priceModifier: 0 },
          { id: 'obscure', label: 'Obscure', priceModifier: 50 },
          { id: 'decorative', label: 'Decorative', priceModifier: 150 },
        ],
      },
      {
        id: 'side-panels',
        label: 'Side Panels',
        type: 'sidePanels',
        options: [
          { id: 'none', label: 'No Side Panels', priceModifier: 0 },
          { id: 'one', label: 'One Side Panel', priceModifier: 200 },
          { id: 'two', label: 'Two Side Panels', priceModifier: 350 },
        ],
      },
    ],
    features: [
      'Full-height double glazing',
      'Outward or inward opening options',
      'Multi-point locking system',
      'A-rated energy efficiency',
      'Optional matching side panels',
    ],
    included: doorIncluded,
    potentialVariations: standardVariations,
    faqs: standardDoorFaqs(1100),
    relatedProductIds: ['bi-fold-doors', 'patio-doors', 'composite-doors'],
    seo: {
      title: 'French Doors Installed West Yorkshire | From £1,100 | Windows & Doors Online',
      description:
        'French doors with transparent installed prices for West Yorkshire. Full glazing, garden access, honest pricing. See your price online.',
      h1: 'French Doors — Installed Prices in West Yorkshire',
    },
  },
  {
    id: 'bi-fold-doors',
    slug: 'bi-fold-doors',
    category: 'doors',
    type: 'Bi-Fold',
    name: 'Bi-Fold Doors',
    shortDescription:
      'Create a seamless opening between your home and garden. Available in 3 to 6 panel configurations.',
    basePrice: 2200,
    unit: 'installed',
    imageUrl:
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800',
    variants: [
      {
        id: 'panels',
        label: 'Panels',
        type: 'panels',
        options: [
          { id: '3-panel', label: '3 Panel', priceModifier: 0 },
          { id: '4-panel', label: '4 Panel', priceModifier: 400 },
          { id: '5-panel', label: '5 Panel', priceModifier: 800 },
          { id: '6-panel', label: '6 Panel', priceModifier: 1200 },
        ],
      },
      {
        id: 'colour',
        label: 'Colour',
        type: 'colour',
        options: [
          { id: 'white', label: 'White', priceModifier: 0, hex: '#F0EDE8', borderHex: '#CCCCCC' },
          { id: 'anthracite', label: 'Anthracite Grey', priceModifier: 75, hex: '#3D3D3D' },
          { id: 'black', label: 'Black', priceModifier: 75, hex: '#1C1C1C' },
          { id: 'chartwell', label: 'Chartwell Green', priceModifier: 75, hex: '#6B8F71' },
        ],
      },
      {
        id: 'glazing',
        label: 'Glazing',
        type: 'glazing',
        options: [
          { id: 'clear', label: 'Clear', priceModifier: 0 },
          { id: 'tinted', label: 'Tinted', priceModifier: 200 },
        ],
      },
    ],
    features: [
      'Folds flat to maximise opening width',
      '3 to 6 panel configurations',
      'Slim aluminium sightlines',
      'Multi-point locking system',
      'Smooth bottom-rolling track',
    ],
    included: doorIncluded,
    potentialVariations: [
      ...standardVariations,
      'Structural opening modification may be required',
    ],
    faqs: standardDoorFaqs(2200),
    relatedProductIds: ['french-doors', 'patio-doors'],
    seo: {
      title: 'Bi-Fold Doors Installed West Yorkshire | From £2,200 | Windows & Doors Online',
      description:
        'Bi-fold doors with honest installed prices for West Yorkshire. 3 to 6 panel options. Get your price online before anyone visits.',
      h1: 'Bi-Fold Doors — Installed Prices in West Yorkshire',
    },
  },
  {
    id: 'patio-doors',
    slug: 'patio-doors',
    category: 'doors',
    type: 'Patio',
    name: 'Patio Doors',
    shortDescription:
      'Smooth sliding access to your garden. Space-saving design with slim sightlines and secure multi-point locking.',
    basePrice: 950,
    unit: 'installed',
    imageUrl:
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=800',
    variants: [
      {
        id: 'style',
        label: 'Style',
        type: 'style',
        options: [
          { id: '2-panel', label: '2 Panel Sliding', priceModifier: 0 },
          { id: '3-panel', label: '3 Panel Sliding', priceModifier: 400 },
        ],
      },
      {
        id: 'colour',
        label: 'Colour',
        type: 'colour',
        options: [
          { id: 'white', label: 'White', priceModifier: 0, hex: '#F0EDE8', borderHex: '#CCCCCC' },
          { id: 'anthracite', label: 'Anthracite Grey', priceModifier: 75, hex: '#3D3D3D' },
          { id: 'black', label: 'Black', priceModifier: 75, hex: '#1C1C1C' },
        ],
      },
      {
        id: 'glazing',
        label: 'Glazing',
        type: 'glazing',
        options: [
          { id: 'clear', label: 'Clear', priceModifier: 0 },
          { id: 'obscure', label: 'Obscure', priceModifier: 50 },
        ],
      },
    ],
    features: [
      'Smooth sliding mechanism',
      'Slim sightlines for unobstructed views',
      'Multi-point locking system',
      'A-rated energy efficiency',
      'Space-saving — no swing clearance required',
    ],
    included: doorIncluded,
    potentialVariations: standardVariations,
    faqs: standardDoorFaqs(950),
    relatedProductIds: ['bi-fold-doors', 'french-doors'],
    seo: {
      title: 'Patio Doors Installed West Yorkshire | From £950 | Windows & Doors Online',
      description:
        'Patio doors with transparent installed prices for West Yorkshire. Smooth sliding action, slim sightlines. See your price online.',
      h1: 'Patio Doors — Installed Prices in West Yorkshire',
    },
  },
]
