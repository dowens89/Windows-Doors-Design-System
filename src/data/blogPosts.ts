export interface BlogSection {
  type: 'paragraph' | 'heading' | 'subheading' | 'list' | 'callout' | 'faq'
  content?: string
  items?: string[]
  faqs?: { question: string; answer: string }[]
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  excerpt: string
  content: BlogSection[]
  category: 'pricing' | 'advice' | 'products' | 'industry'
  tags: string[]
  author: string
  publishedAt: string
  readTimeMinutes: number
  relatedProductIds: string[]
  relatedPostIds: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: 'composite-door-cost-west-yorkshire-2026',
    slug: 'composite-door-cost-west-yorkshire-2026',
    title: 'How Much Does a Composite Door Cost in West Yorkshire in 2026?',
    metaTitle: 'Composite Door Cost West Yorkshire 2026 | Honest Installed Prices | WDO',
    metaDescription:
      'Honest installed prices for composite doors in West Yorkshire in 2026. What affects the price, what is included, and how to avoid overpaying.',
    excerpt:
      'Composite doors now average £1,195 installed in West Yorkshire for a standard specification. Here is what affects that price and what you should expect to pay.',
    category: 'pricing',
    tags: ['composite doors', 'pricing', 'West Yorkshire', 'Leeds', 'installed price'],
    author: 'Windows & Doors Online',
    publishedAt: '2026-05-01',
    readTimeMinutes: 5,
    relatedProductIds: ['composite-doors'],
    relatedPostIds: [
      'replacement-windows-cost-leeds-2026',
      'upvc-vs-composite-doors',
    ],
    content: [
      {
        type: 'paragraph',
        content:
          'A composite door installed in West Yorkshire costs between £1,100 and £1,600 for a standard specification in 2026. The midpoint — what most homeowners pay for a straightforward replacement — is around £1,195. That price covers supply, fitting, removal of your old door, and a FENSA certificate.',
      },
      {
        type: 'heading',
        content: 'What affects the price of a composite door?',
      },
      {
        type: 'paragraph',
        content:
          'Four things move the price up or down meaningfully. Style — a stable door or double door configuration costs more than a standard single. Colour — white and cream are included in the base price, while Anthracite Grey, Black, Chartwell Green, Irish Oak and Red carry a small premium of around £75. Glazing — clear glass is standard, decorative glazing adds approximately £150. Width — doors wider than 920mm cost more to supply and fit.',
      },
      {
        type: 'subheading',
        content: 'Style',
      },
      {
        type: 'paragraph',
        content:
          'A standard single composite door is the base price. A stable door — split horizontally so the top opens independently — adds approximately £150. Double doors add around £400 and require a wider opening.',
      },
      {
        type: 'subheading',
        content: 'Colour',
      },
      {
        type: 'paragraph',
        content:
          'White is the most common choice and carries no premium. Coloured finishes such as Anthracite Grey and Black are now extremely popular and add a modest premium. The colour is baked into the GRP outer skin rather than painted, so it will not peel, crack or fade.',
      },
      {
        type: 'subheading',
        content: 'Glazing',
      },
      {
        type: 'paragraph',
        content:
          'Clear glass is standard. Obscure glass for privacy adds around £50. Decorative glazing panels — which significantly improve kerb appeal — add approximately £150. Fully solid doors with no glass are also available at no premium.',
      },
      {
        type: 'subheading',
        content: 'Size',
      },
      {
        type: 'paragraph',
        content:
          'Standard door widths up to 920mm are included in the base price. Wider openings between 921mm and 1100mm add approximately £200 to supply and fit.',
      },
      {
        type: 'heading',
        content: 'What is included in the price?',
      },
      {
        type: 'list',
        items: [
          'Supply of the composite door to your specification',
          'Professional installation by a FENSA-registered fitter',
          'Removal and disposal of your existing door',
          'FENSA certificate — required for building regulations compliance',
          'Mastic seal and weather bar',
          'Letter plate, knocker and handle to specification',
        ],
      },
      {
        type: 'heading',
        content: 'What can push the price higher?',
      },
      {
        type: 'paragraph',
        content:
          'The prices above assume a standard installation. A few things can add cost and should be confirmed at survey. If the door frame needs replacing rather than just the door leaf, that adds to the job. Structural lintel issues — uncommon but possible in older properties — require additional work. Scaffolding for awkward access points also adds cost. A good installer will identify these at survey and explain them clearly before any work is agreed.',
      },
      {
        type: 'heading',
        content: 'Why do prices vary so much between companies?',
      },
      {
        type: 'paragraph',
        content:
          'The double glazing industry is notorious for opaque pricing and inflated quotes designed to be discounted at the doorstep. A company that sends a salesperson to your home, pays a canvassing team to generate the appointment, and offers a sequence of fake discounts is carrying a cost of sale of 8–9% before a single door is measured. Those costs are built into the price you are shown.',
      },
      {
        type: 'paragraph',
        content:
          'A local FENSA-registered installer with lower overheads and no commission-based sales team can offer the same product for significantly less. The WDO pricing sits in the honest middle — not the cheapest possible price, but a fair installed price that a reliable installer can deliver without the sales drama.',
      },
      {
        type: 'callout',
        content:
          'The price you see on Windows & Doors Online is the price you pay in the majority of standard installations. No salesperson visits to inflate it first.',
      },
      {
        type: 'heading',
        content: 'How to get an accurate price for your composite door in West Yorkshire',
      },
      {
        type: 'paragraph',
        content:
          'The most accurate way to get a price without inviting a salesperson into your home is to configure your door online, see the indicative installed price, and request a free survey. A surveyor — not a salesperson — visits to confirm measurements and check for anything non-standard. In most straightforward replacements the price you saw online is the price you pay.',
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'What is the cheapest composite door installed in West Yorkshire?',
            answer:
              'The lowest end of the market for a composite door installed in West Yorkshire is around £900–£1,000. At this price point you are likely looking at a thinner door leaf, limited colour and style options, and a smaller installer. Our pricing starts from £1,195 for a fully specified, FENSA-registered installation.',
          },
          {
            question: 'How long does a composite door last?',
            answer:
              'A well-made composite door with a GRP outer skin should last 25–35 years with minimal maintenance. The frame, seals and hardware may need attention over that time but the door itself should not warp, crack or fade.',
          },
          {
            question: 'Can I get a composite door fitted in a day?',
            answer:
              'Yes. A standard composite door replacement typically takes 2–4 hours. Most installations are completed in a single morning or afternoon visit.',
          },
        ],
      },
    ],
  },

  {
    id: 'replacement-windows-cost-leeds-2026',
    slug: 'replacement-windows-cost-leeds-2026',
    title: 'How Much Do Replacement Windows Cost in Leeds in 2026?',
    metaTitle:
      'Replacement Window Cost Leeds 2026 | Installed Prices | Windows & Doors Online',
    metaDescription:
      'Honest installed prices for replacement windows in Leeds in 2026. Casement, sash, bay and more — what you should expect to pay.',
    excerpt:
      'Replacement windows in Leeds start from £450 per window installed for a standard casement. Here is a full breakdown by window type and what affects the price.',
    category: 'pricing',
    tags: ['replacement windows', 'Leeds', 'pricing', 'casement', 'installed price', '2026'],
    author: 'Windows & Doors Online',
    publishedAt: '2026-05-08',
    readTimeMinutes: 6,
    relatedProductIds: ['casement-windows', 'sash-windows', 'bay-windows'],
    relatedPostIds: [
      'composite-door-cost-west-yorkshire-2026',
      'upvc-vs-composite-doors',
    ],
    content: [
      {
        type: 'paragraph',
        content:
          'Replacement windows in Leeds cost between £450 and £800 per window installed for a standard casement, depending on size, colour and glazing choice. Bay windows start from £1,200 installed. Sash windows — more common in Leeds period properties — start from £650 per window. These prices include supply, fitting, removal of existing windows, and a FENSA certificate.',
      },
      {
        type: 'heading',
        content: 'Replacement window prices in Leeds by type',
      },
      {
        type: 'subheading',
        content: 'Casement windows',
      },
      {
        type: 'paragraph',
        content:
          'The most common window type in Leeds — outward-opening on a side hinge. Standard casement windows start from £450 installed. Size, colour and glazing choice affect the final price. A large casement in Anthracite Grey with decorative glazing would sit toward the top of the range at around £750–£800.',
      },
      {
        type: 'subheading',
        content: 'Sash windows',
      },
      {
        type: 'paragraph',
        content:
          'Common in the Victorian and Edwardian terraces that make up a significant proportion of Leeds housing stock. Sash windows start from £650 installed. Modern uPVC sash windows replicate the traditional sliding movement while providing far better thermal performance than the originals.',
      },
      {
        type: 'subheading',
        content: 'Bay windows',
      },
      {
        type: 'paragraph',
        content:
          'Bay windows project outward and are priced as a unit rather than per pane. A standard three-panel bay starts from £1,200 installed. A five-panel bay — less common but found in larger period properties — starts from around £1,800.',
      },
      {
        type: 'subheading',
        content: 'Tilt and turn windows',
      },
      {
        type: 'paragraph',
        content:
          'Popular in flats and properties where opening outward is not practical. Tilt and turn windows start from £550 installed. They open either by tilting inward at the top for ventilation, or swinging fully inward for cleaning and emergency egress.',
      },
      {
        type: 'heading',
        content: 'What affects replacement window prices in Leeds?',
      },
      {
        type: 'list',
        items: [
          'Size — larger windows cost more to supply and fit',
          'Colour — white is standard, other colours add approximately £75 per window',
          'Glazing — clear double glazing is standard, triple glazing adds £200 per window, decorative glazing adds £150',
          'Number of windows — multi-window jobs are more efficient to install and the per-window price reflects this',
          'Access — first floor or above may require scaffolding',
          'Frame condition — if the frame needs replacing as well as the glass unit, this adds to the job',
        ],
      },
      {
        type: 'heading',
        content: 'How many windows does a typical Leeds house have?',
      },
      {
        type: 'paragraph',
        content:
          'A standard two-bedroom Leeds terrace typically has six to eight windows. A three-bedroom semi-detached has eight to twelve. Replacing all windows in one job is more cost-efficient than replacing them individually — a single survey visit, single fitting day, and a single FENSA certificate for the whole job.',
      },
      {
        type: 'heading',
        content: 'Why are some quotes so much higher than others?',
      },
      {
        type: 'paragraph',
        content:
          'Window replacement is one of the few home improvement categories where prices can vary by 50–100% for identical products. The difference is almost entirely the cost of the sales model rather than the product quality. Large national companies with canvassing teams, commission-based salespeople and in-home close tactics carry a cost of sale of 8–9% that is built into their pricing before any discount is offered.',
      },
      {
        type: 'paragraph',
        content:
          'A local Leeds installer with lower overheads can supply and fit the same product for significantly less. The challenge has historically been finding those installers and getting a price without sitting through a sales appointment. That is the gap WDO was built to close.',
      },
      {
        type: 'callout',
        content:
          'Browse replacement window prices for Leeds and West Yorkshire on Windows & Doors Online. See your installed price online before anyone visits your home.',
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'How much does it cost to replace all windows in a Leeds terrace?',
            answer:
              'A typical two-bedroom Leeds terrace with six to eight windows would cost between £2,700 and £5,600 to fully replace depending on window type, size, colour and glazing choice. Request an itemised quote online to get a price for your specific specification.',
          },
          {
            question: 'Do I need planning permission to replace windows in Leeds?',
            answer:
              'In most cases no. Replacing like-for-like windows in a standard residential property does not require planning permission. Properties in conservation areas or listed buildings have additional requirements — check with Leeds City Council if you are unsure.',
          },
          {
            question: 'What is a FENSA certificate and do I need one?',
            answer:
              'FENSA is the industry body that self-certifies that replacement windows meet building regulations. Your installer must be FENSA registered and must provide a FENSA certificate on completion. You will need it when you sell your home. All WDO installers are FENSA registered.',
          },
        ],
      },
    ],
  },

  {
    id: 'upvc-vs-composite-doors',
    slug: 'upvc-vs-composite-doors',
    title: 'uPVC vs Composite Doors — Which Is Right for Your Home?',
    metaTitle: 'uPVC vs Composite Doors — Which Should You Choose? | WDO',
    metaDescription:
      'Honest comparison of uPVC and composite doors. Price, performance, appearance and longevity — which is the better choice for your West Yorkshire home?',
    excerpt:
      'Composite doors cost roughly £500 more than uPVC but last longer, look better, and perform better thermally. Here is an honest comparison to help you decide.',
    category: 'advice',
    tags: ['composite doors', 'uPVC doors', 'comparison', 'advice', 'West Yorkshire'],
    author: 'Windows & Doors Online',
    publishedAt: '2026-05-15',
    readTimeMinutes: 5,
    relatedProductIds: ['composite-doors', 'upvc-doors'],
    relatedPostIds: ['composite-door-cost-west-yorkshire-2026'],
    content: [
      {
        type: 'paragraph',
        content:
          'The honest answer is that composite doors are the better product in almost every measurable way. They look better, perform better thermally, are more secure, and last longer. The question is whether the approximately £500 price difference is worth it for your situation.',
      },
      {
        type: 'heading',
        content: 'The key differences',
      },
      {
        type: 'subheading',
        content: 'Price',
      },
      {
        type: 'paragraph',
        content:
          'A uPVC door installed in West Yorkshire starts from £695. A composite door starts from £1,195. That is a meaningful difference but over a 25-year lifespan it is less than £20 per year.',
      },
      {
        type: 'subheading',
        content: 'Appearance',
      },
      {
        type: 'paragraph',
        content:
          'This is the clearest difference. Composite doors have a GRP (glass reinforced plastic) outer skin that is moulded to look like timber. From the street they are indistinguishable from a painted timber door. uPVC doors look like uPVC — functional but clearly plastic. If kerb appeal matters to you, the composite wins easily.',
      },
      {
        type: 'subheading',
        content: 'Thermal performance',
      },
      {
        type: 'paragraph',
        content:
          'Composite doors have a solid timber or foam core that provides significant thermal mass. They perform better than uPVC in both keeping heat in and reducing cold drafts at the threshold. If your current door is draughty, the difference will be noticeable.',
      },
      {
        type: 'subheading',
        content: 'Security',
      },
      {
        type: 'paragraph',
        content:
          'Both types come with multi-point locking as standard. Composite doors have a slight edge because the solid core is harder to force than a hollow uPVC door. In practice both are substantially more secure than a single-glazed timber door.',
      },
      {
        type: 'subheading',
        content: 'Longevity',
      },
      {
        type: 'paragraph',
        content:
          'A composite door should last 25–35 years with minimal maintenance. uPVC doors typically last 15–20 years before the profile begins to discolour or the mechanism becomes unreliable. If you are planning to stay in your home long term, the composite is likely to be cheaper over its lifetime.',
      },
      {
        type: 'subheading',
        content: 'Maintenance',
      },
      {
        type: 'paragraph',
        content:
          'Both require very little maintenance. Neither needs painting or sealing. The composite colour is integral to the GRP skin rather than a surface finish, so it will not peel or fade. The only regular maintenance either needs is an occasional wipe down and lubrication of the locking mechanism.',
      },
      {
        type: 'heading',
        content: 'When does a uPVC door make sense?',
      },
      {
        type: 'paragraph',
        content:
          'There are situations where uPVC is the right choice. Budget is the most common — if £695 is the ceiling, a good uPVC door is a significant improvement on an old timber door. For back doors and secondary entrances where appearance is less important, uPVC is often the practical choice. And for rental properties where you are focused on durability and low maintenance cost rather than aesthetics, uPVC is entirely reasonable.',
      },
      {
        type: 'callout',
        content:
          'Both uPVC and composite doors are available on Windows & Doors Online with transparent installed prices. Configure yours and see your price before anyone visits your home.',
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'Is a composite door worth the extra cost?',
            answer:
              'For a front door where appearance and thermal performance matter, yes. The price difference of approximately £500 works out to less than £20 per year over a typical 25-year lifespan. For back doors or secondary entrances, uPVC is often the more practical choice.',
          },
          {
            question: 'Can you tell the difference between a composite and uPVC door?',
            answer:
              'Yes, easily. A composite door has a moulded GRP skin that genuinely looks like timber from the street. uPVC has a uniform plastic appearance. If kerb appeal is important to you, the composite is the clear choice.',
          },
        ],
      },
    ],
  },

  {
    id: 'avoid-double-glazing-hard-sell',
    slug: 'avoid-double-glazing-hard-sell',
    title: 'How to Avoid the Double Glazing Hard Sell in West Yorkshire',
    metaTitle: 'How to Avoid the Double Glazing Hard Sell | West Yorkshire | WDO',
    metaDescription:
      'The double glazing industry is notorious for high-pressure sales tactics. Here is how to spot them, avoid them, and get a fair price without the drama.',
    excerpt:
      'The double glazing hard sell — inflated prices, fake discounts, manager calls — is still widespread in 2026. Here is exactly what to watch for and how to avoid it entirely.',
    category: 'advice',
    tags: ['hard sell', 'advice', 'double glazing', 'consumer rights', 'West Yorkshire'],
    author: 'Windows & Doors Online',
    publishedAt: '2026-05-22',
    readTimeMinutes: 6,
    relatedProductIds: ['composite-doors', 'casement-windows'],
    relatedPostIds: [
      'replacement-windows-cost-leeds-2026',
      'what-to-expect-window-survey',
    ],
    content: [
      {
        type: 'paragraph',
        content:
          'The windows and doors industry has a well-earned reputation for high-pressure sales. In 2026 — despite everything that has changed about how people research and buy — the majority of large double glazing companies are still using the same tactics they used in the 1980s. Understanding what to expect is the best defence.',
      },
      {
        type: 'heading',
        content: 'The classic double glazing sales playbook',
      },
      {
        type: 'paragraph',
        content:
          'Most large double glazing companies follow the same sequence. A canvassing team buys lists of phone numbers and cold-calls homeowners, asking whether they are considering home improvements. If the answer is yes, a salesperson books an appointment. The appointment is scheduled for the evening when both householders are likely to be home — this is deliberate.',
      },
      {
        type: 'paragraph',
        content:
          'At the appointment the salesperson measures up, then presents a price that is substantially higher than what the job actually costs. A second price is shown — described as a competitor quote — which is also inflated. The salesperson then calls their manager and returns with a "special discount" that brings the price to something that feels like a deal but is still above market rate. This sequence is designed to make you feel you have negotiated a good price when you have not.',
      },
      {
        type: 'heading',
        content: 'Warning signs to watch for',
      },
      {
        type: 'list',
        items: [
          'The salesperson asks you to commit on the night or the price goes up',
          'A manager call happens during the appointment to authorise a discount',
          'You are shown a competitor price you cannot verify',
          'The visit is scheduled for an evening and lasts more than an hour',
          'The initial price is significantly higher than the final offered price',
          'You are told the discount expires tonight or this week only',
        ],
      },
      {
        type: 'heading',
        content: 'Your rights as a consumer',
      },
      {
        type: 'paragraph',
        content:
          'If a salesperson visits your home to make a sale, you have a 14-day cooling off period under the Consumer Contracts Regulations 2013. Any contract signed at a home visit can be cancelled within 14 days for a full refund. Never let a salesperson tell you that you cannot change your mind.',
      },
      {
        type: 'heading',
        content: 'How to get a fair price without the sales process',
      },
      {
        type: 'paragraph',
        content:
          'The most effective way to avoid the hard sell is to know your price before anyone visits your home. When you arrive at the appointment already knowing that a standard composite door in West Yorkshire costs around £1,195 installed, the inflated opening price has no power. You either get a fair quote or you leave.',
      },
      {
        type: 'paragraph',
        content:
          'Better still, use a platform that shows you the installed price online and only connects you with an installer for a survey — not a sales appointment. That is the model WDO was built around.',
      },
      {
        type: 'callout',
        content:
          'On Windows & Doors Online you see your installed price before anyone visits your home. The survey is a technical visit, not a sales appointment. No pressure. No manager calls. No fake discounts.',
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'Can I cancel a double glazing contract signed at home?',
            answer:
              'Yes. Under the Consumer Contracts Regulations 2013 you have 14 days to cancel any contract agreed at a home visit and receive a full refund. The company must tell you about this right before you sign. If they did not, your cancellation period may be extended.',
          },
          {
            question: 'How do I know if a double glazing price is fair?',
            answer:
              'Research the mid-market price before any appointment. Composite doors in West Yorkshire start from around £1,195 installed. Standard casement windows start from around £450 each. If the opening price in a sales appointment is substantially higher than these figures, you are being shown an inflated price designed to be discounted.',
          },
        ],
      },
    ],
  },

  {
    id: 'what-to-expect-window-survey',
    slug: 'what-to-expect-window-survey',
    title: 'What to Expect From a Window and Door Survey',
    metaTitle: 'What Happens at a Window Survey | What to Expect | Windows & Doors Online',
    metaDescription:
      'What a window or door survey actually involves, how long it takes, what questions to ask, and how it differs from a sales visit.',
    excerpt:
      'A survey is a technical visit to confirm measurements and check for anything non-standard. Here is exactly what happens and what to ask.',
    category: 'advice',
    tags: ['survey', 'advice', 'installation', 'West Yorkshire', 'what to expect'],
    author: 'Windows & Doors Online',
    publishedAt: '2026-05-29',
    readTimeMinutes: 4,
    relatedProductIds: ['casement-windows', 'composite-doors'],
    relatedPostIds: [
      'avoid-double-glazing-hard-sell',
      'replacement-windows-cost-leeds-2026',
    ],
    content: [
      {
        type: 'paragraph',
        content:
          'A window or door survey is a technical visit. The surveyor comes to confirm exact measurements, check the condition of the existing frames, and identify anything that might affect installation — like scaffolding requirements or structural issues. It is not a sales visit.',
      },
      {
        type: 'heading',
        content: 'What happens during a survey?',
      },
      {
        type: 'list',
        items: [
          'The surveyor measures each window or door opening precisely',
          'They check the condition of the existing frames and surrounding structure',
          'They confirm your specification — colour, glazing, style — matches what you ordered',
          'They identify any access requirements such as scaffolding',
          'They check for any structural issues such as lintel problems in older properties',
          'They confirm the installation date and timescale',
        ],
      },
      {
        type: 'heading',
        content: 'How long does a survey take?',
      },
      {
        type: 'paragraph',
        content:
          'A survey for a single door takes 15–20 minutes. A whole-house window replacement survey takes 45–60 minutes. There is no reason for a survey to last several hours — if it does, it has become a sales appointment.',
      },
      {
        type: 'heading',
        content: 'What questions should I ask the surveyor?',
      },
      {
        type: 'list',
        items: [
          'Does the price I have been given cover everything, or are there likely additions?',
          'Are the existing frames being replaced or just the glass units?',
          'Will scaffolding be required and is that included in the price?',
          'How long will the installation take?',
          'Who provides the FENSA certificate and when will I receive it?',
        ],
      },
      {
        type: 'heading',
        content: 'What legitimate reasons exist for a price to change after survey?',
      },
      {
        type: 'paragraph',
        content:
          'A good surveyor will only revise a price if they find something genuinely non-standard that could not be identified without visiting. The legitimate reasons are narrow: a structural lintel that needs replacing, scaffolding requirements for upper floor access, an opening size that is substantially different from the customer-provided measurement, or significant brickwork repair required.',
      },
      {
        type: 'paragraph',
        content:
          'What is never a legitimate reason to revise a price: deciding the customer seems willing to pay more, a general desire for a higher margin, or vague references to the property condition. If a surveyor tries to substantially revise a price for reasons that do not fall into the narrow list above, ask them to explain in writing.',
      },
      {
        type: 'callout',
        content:
          'WDO surveyors are vetted and expected to honour the indicated price in all standard installations. If a surveyor reprices without a legitimate reason from our defined list, they are removed from the platform.',
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'Do I have to be home for the survey?',
            answer:
              'Yes. The surveyor needs access to each window and door opening and needs to see the exterior as well as the interior. Plan for 20–60 minutes depending on the size of the job.',
          },
          {
            question: 'What if the survey price is higher than the online indication?',
            answer:
              'Ask the surveyor to explain specifically what was found that justifies the increase. If the reason is one of the defined legitimate variations — structural issue, scaffolding, non-standard opening — the revision is reasonable. If it is not, you are under no obligation to proceed and can contact WDO directly.',
          },
        ],
      },
    ],
  },
]
