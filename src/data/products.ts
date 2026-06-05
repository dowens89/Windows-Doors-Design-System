export const DOOR_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800'

export interface DoorProduct {
  id: string
  slug: string
  category: 'doors'
  skuId: string
  rangeName: string
  variantType: 'standard' | 'bevel' | 'solid' | 'mini_blind' | 'pvc'
  name: string
  shortDescription: string
  basePrice: number
  imageUrl: string
  pricetier: 'budget' | 'mid' | 'upper' | 'premium'
  included: string[]
  faqs: { question: string; answer: string }[]
  seo: {
    title: string
    description: string
    h1: string
  }
}

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
  type: 'style' | 'colour' | 'glazing' | 'size' | 'panels' | 'sidePanels' | 'addon'
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

// FIX 21: 'White handles included as standard' added as first item
const standardIncluded = [
  'White handles included as standard',
  'Supply of window unit to your specification',
  'Professional installation by a FENSA-registered installer',
  'Removal and disposal of your existing window',
  'FENSA certificate for your records',
  'Mastic seal and internal finishing',
]

const doorIncluded = [
  'White handles included as standard',
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

const sashColours: ProductVariantOption[] = [
  { id: 'white', label: 'White', priceModifier: 0, hex: '#F0EDE8', borderHex: '#CCCCCC' },
  { id: 'anthracite', label: 'Anthracite Grey', priceModifier: 75, hex: '#3D3D3D' },
  { id: 'black', label: 'Black', priceModifier: 75, hex: '#1C1C1C' },
  { id: 'cream', label: 'Cream', priceModifier: 0, hex: '#F5F0E0', borderHex: '#CCCCCC' },
]

// FIX 19: triple glazed removed from standardGlazing
const standardGlazing: ProductVariantOption[] = [
  { id: 'clear-double', label: 'Clear Double Glazed', priceModifier: 0 },
  { id: 'obscure-double', label: 'Obscure Double Glazed', priceModifier: 50 },
  { id: 'decorative', label: 'Decorative', priceModifier: 150 },
]

// FIX 22: openers variant for casement and sash windows
const windowOpenersVariant: ProductVariant = {
  id: 'openers',
  label: 'Opening Lights',
  type: 'addon',
  options: [
    { id: 'no_opener', label: 'Fixed (no opener)', priceModifier: 0 },
    { id: 'one_opener', label: '1 Opening Light', priceModifier: 242 },
    { id: 'two_openers', label: '2 Opening Lights', priceModifier: 484 },
    { id: 'three_openers', label: '3 Opening Lights', priceModifier: 726 },
  ],
}

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
  // FIX 17: casement windows — style variant removed, no triple glazed, openers added
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
      windowOpenersVariant,
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
    relatedProductIds: ['sash-windows', 'bay-windows'],
    seo: {
      title: 'Casement Windows Installed West Yorkshire | From £450 | Windows & Doors Online',
      description:
        'Casement windows with honest installed prices for West Yorkshire. Choose your size, colour and glazing. See your price online — no salesperson.',
      h1: 'Casement Windows — From £450 Installed',
    },
  },
  // FIX 19: sash windows — triple glazed removed, openers added
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
      windowOpenersVariant,
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
    relatedProductIds: ['casement-windows', 'bay-windows'],
    seo: {
      title: 'Sash Windows Installed West Yorkshire | From £650 | Windows & Doors Online',
      description:
        'Replacement sash windows with honest installed prices for West Yorkshire. Traditional style, modern performance. See your price online.',
      h1: 'Sash Windows — From £650 Installed',
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
    relatedProductIds: ['casement-windows', 'sash-windows'],
    seo: {
      title: 'Bay Windows Installed West Yorkshire | From £1,200 | Windows & Doors Online',
      description:
        'Bay windows with transparent installed prices for West Yorkshire. Three and five panel options. Get your price online before anyone visits.',
      h1: 'Bay Windows — From £1,200 Installed',
    },
  },
  // FIX 23: Double Doors option removed; FIX 13: bi-fold-doors removed from relatedProductIds
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
      h1: 'Composite Doors — From £1,195 Installed',
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
      h1: 'uPVC Doors — From £695 Installed',
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
    relatedProductIds: ['patio-doors', 'composite-doors'],
    seo: {
      title: 'French Doors Installed West Yorkshire | From £1,100 | Windows & Doors Online',
      description:
        'French doors with transparent installed prices for West Yorkshire. Full glazing, garden access, honest pricing. See your price online.',
      h1: 'French Doors — From £1,100 Installed',
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
    relatedProductIds: ['french-doors', 'composite-doors'],
    seo: {
      title: 'Patio Doors Installed West Yorkshire | From £950 | Windows & Doors Online',
      description:
        'Patio doors with transparent installed prices for West Yorkshire. Smooth sliding action, slim sightlines. See your price online.',
      h1: 'Patio Doors — From £950 Installed',
    },
  },
]

const doorIncludedItems: string[] = [
  'Supply of composite door to your specification',
  'Professional installation by a FENSA-registered fitter',
  'White handle included as standard',
  'Removal and disposal of your existing door',
  'FENSA certificate',
  'Mastic seal and weather bar',
]

const doorFaqs: { question: string; answer: string }[] = [
  {
    question: 'Is the online price what I will pay?',
    answer:
      'The price shown is an honest indicative installed price based on standard installation. A surveyor will visit to confirm exact measurements and check for anything non-standard. In most straightforward replacements the final price matches what you see here.',
  },
  {
    question: 'Will I be pressured to buy at the survey?',
    answer:
      'No. The survey is a technical visit to confirm your specification. There is no salesperson. You are under no obligation at any stage.',
  },
  {
    question: 'How long does installation take?',
    answer:
      'A standard composite door installation typically takes 2-4 hours. Your installer confirms the timeframe when arranging your survey.',
  },
  {
    question: 'Which areas do you cover?',
    answer:
      'We serve West Yorkshire, South Yorkshire, East Yorkshire, North Yorkshire, Lancashire and Manchester.',
  },
  {
    question: 'What handles are included as standard?',
    answer:
      'All doors include a white handle as standard. Long bar handles in 600mm, 1200mm and 1800mm are available as upgrades.',
  },
]

function doorSeo(name: string, price: number) {
  return {
    title: `${name} Composite Door | From £${price} | Windows & Doors Online`,
    description: `The ${name} composite door installed from £${price}. Honest installed prices — no salesperson, no pressure.`,
    h1: `${name} Composite Door — Installed Price`,
  }
}

export const doorProducts: DoorProduct[] = [
  {
    id: 'pvc-glazed',
    slug: 'pvc-glazed',
    category: 'doors',
    skuId: 'CD-146',
    rangeName: 'PVC Glazed',
    variantType: 'standard',
    name: 'PVC Glazed Door',
    shortDescription:
      'A practical, affordable glazed door. Ideal for side and rear entrances where value and durability matter.',
    basePrice: 750.0,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'budget',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('PVC Glazed Door', 750),
  },
  {
    id: 'pvc-panel',
    slug: 'pvc-panel',
    category: 'doors',
    skuId: 'CD-147',
    rangeName: 'PVC Panel',
    variantType: 'solid',
    name: 'PVC Panel Door',
    shortDescription:
      'A solid panel uPVC door offering excellent security and thermal efficiency at an accessible price point.',
    basePrice: 787.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'budget',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('PVC Panel Door', 788),
  },
  {
    id: 'pvc-bevel',
    slug: 'pvc-bevel',
    category: 'doors',
    skuId: 'CD-145',
    rangeName: 'PVC Bevel',
    variantType: 'bevel',
    name: 'PVC Bevel Door',
    shortDescription:
      'Classic bevel glazing on a robust uPVC frame. A step up from standard glazing with timeless kerb appeal.',
    basePrice: 817.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'budget',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('PVC Bevel Door', 818),
  },
  {
    id: 'edinburgh',
    slug: 'edinburgh',
    category: 'doors',
    skuId: 'CD-58',
    rangeName: 'Edinburgh',
    variantType: 'standard',
    name: 'Edinburgh',
    shortDescription:
      'Clean lines and a refined glazing panel. One of our most popular doors for traditional and modern homes alike.',
    basePrice: 907.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'budget',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Edinburgh', 908),
  },
  {
    id: 'edinburgh-bevel',
    slug: 'edinburgh-bevel',
    category: 'doors',
    skuId: 'CD-59',
    rangeName: 'Edinburgh',
    variantType: 'bevel',
    name: 'Edinburgh Bevel',
    shortDescription:
      'The Edinburgh with bevel glazing for a more decorative finish and enhanced character.',
    basePrice: 940.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'budget',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Edinburgh Bevel', 941),
  },
  {
    id: 'alnwick',
    slug: 'alnwick',
    category: 'doors',
    skuId: 'CD-02',
    rangeName: 'Alnwick',
    variantType: 'standard',
    name: 'Alnwick',
    shortDescription:
      'A versatile composite door combining security, style and value. Available in standard, bevel and solid configurations.',
    basePrice: 931.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'mid',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Alnwick', 932),
  },
  {
    id: 'alnwick-bevel',
    slug: 'alnwick-bevel',
    category: 'doors',
    skuId: 'CD-03',
    rangeName: 'Alnwick',
    variantType: 'bevel',
    name: 'Alnwick Bevel',
    shortDescription:
      'The Alnwick with bevel glazing — a popular upgrade that adds depth and character to the classic design.',
    basePrice: 946.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'mid',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Alnwick Bevel', 947),
  },
  {
    id: 'alnwick-solid',
    slug: 'alnwick-solid',
    category: 'doors',
    skuId: 'CD-04',
    rangeName: 'Alnwick',
    variantType: 'solid',
    name: 'Alnwick Solid',
    shortDescription:
      'The Alnwick in a fully solid configuration. Maximum privacy and thermal performance.',
    basePrice: 858.0,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'mid',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Alnwick Solid', 858),
  },
  {
    id: 'carlisle',
    slug: 'carlisle',
    category: 'doors',
    skuId: 'CD-39',
    rangeName: 'Carlisle',
    variantType: 'standard',
    name: 'Carlisle',
    shortDescription:
      'A dependable mid-range composite door with clean proportions and strong kerb appeal.',
    basePrice: 952.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'mid',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Carlisle', 953),
  },
  {
    id: 'balmoral',
    slug: 'balmoral',
    category: 'doors',
    skuId: 'CD-15',
    rangeName: 'Balmoral',
    variantType: 'standard',
    name: 'Balmoral',
    shortDescription:
      'Inspired by classic Georgian proportions. A statement door for traditional properties.',
    basePrice: 960.0,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'mid',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Balmoral', 960),
  },
  {
    id: 'balmoral-bevel',
    slug: 'balmoral-bevel',
    category: 'doors',
    skuId: 'CD-16',
    rangeName: 'Balmoral',
    variantType: 'bevel',
    name: 'Balmoral Bevel',
    shortDescription:
      'The Balmoral with bevel glazing for an elevated finish. A popular choice for period properties.',
    basePrice: 1089.0,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'mid',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Balmoral Bevel', 1089),
  },
  {
    id: 'conwy',
    slug: 'conwy',
    category: 'doors',
    skuId: 'CD-46',
    rangeName: 'Conwy',
    variantType: 'standard',
    name: 'Conwy',
    shortDescription:
      'Contemporary styling with a generous glazed panel. Suits both traditional and modern homes.',
    basePrice: 939.0,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'mid',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Conwy', 939),
  },
  {
    id: 'conwy-mini-blind',
    slug: 'conwy-mini-blind',
    category: 'doors',
    skuId: 'CD-48',
    rangeName: 'Conwy',
    variantType: 'mini_blind',
    name: 'Conwy Mini Blind',
    shortDescription:
      'The Conwy with integrated mini blind — privacy and light control without external curtains or blinds.',
    basePrice: 994.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'mid',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Conwy Mini Blind', 995),
  },
  {
    id: 'arundel',
    slug: 'arundel',
    category: 'doors',
    skuId: 'CD-08',
    rangeName: 'Arundel',
    variantType: 'standard',
    name: 'Arundel',
    shortDescription:
      'An elegant design with a distinctive glazing arrangement. A strong choice for traditional brick homes.',
    basePrice: 1057.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'upper',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Arundel', 1058),
  },
  {
    id: 'arundel-bevel',
    slug: 'arundel-bevel',
    category: 'doors',
    skuId: 'CD-09',
    rangeName: 'Arundel',
    variantType: 'bevel',
    name: 'Arundel Bevel',
    shortDescription:
      'The Arundel with bevel glazing — refined detailing that elevates a classic design.',
    basePrice: 1125.0,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'upper',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Arundel Bevel', 1125),
  },
  {
    id: 'durham',
    slug: 'durham',
    category: 'doors',
    skuId: 'CD-56',
    rangeName: 'Durham',
    variantType: 'standard',
    name: 'Durham',
    shortDescription:
      'Understated and well-proportioned. A reliable choice across a wide range of property types.',
    basePrice: 999.0,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'upper',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Durham', 999),
  },
  {
    id: 'florence',
    slug: 'florence',
    category: 'doors',
    skuId: 'CD-70',
    rangeName: 'Florence',
    variantType: 'standard',
    name: 'Florence',
    shortDescription:
      'Continental styling with generous glazing. Makes a real statement on any front elevation.',
    basePrice: 1231.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'upper',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Florence', 1232),
  },
  {
    id: 'florence-bevel',
    slug: 'florence-bevel',
    category: 'doors',
    skuId: 'CD-71',
    rangeName: 'Florence',
    variantType: 'bevel',
    name: 'Florence Bevel',
    shortDescription:
      'The Florence with bevel glazing for maximum visual impact. Our most popular upper-range door.',
    basePrice: 1252.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'upper',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Florence Bevel', 1253),
  },
  {
    id: 'cheltenham',
    slug: 'cheltenham',
    category: 'doors',
    skuId: 'CD-43',
    rangeName: 'Cheltenham',
    variantType: 'standard',
    name: 'Cheltenham',
    shortDescription:
      'Our flagship premium composite door. Exceptional specification, striking presence, built to last.',
    basePrice: 1536.0,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'premium',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Cheltenham', 1536),
  },
  {
    id: 'cheltenham-bevel',
    slug: 'cheltenham-bevel',
    category: 'doors',
    skuId: 'CD-44',
    rangeName: 'Cheltenham',
    variantType: 'bevel',
    name: 'Cheltenham Bevel',
    shortDescription:
      'The Cheltenham with bevel glazing. The finest door in our range. Uncompromising on every detail.',
    basePrice: 1630.5,
    imageUrl: DOOR_PLACEHOLDER_IMAGE,
    pricetier: 'premium',
    included: doorIncludedItems,
    faqs: doorFaqs,
    seo: doorSeo('Cheltenham Bevel', 1631),
  },
]
