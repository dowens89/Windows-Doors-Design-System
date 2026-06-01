import type { Product, ProductFAQ } from '../data/products'

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Windows & Doors Online',
    url: 'https://www.buywindowsanddoors.co.uk',
    description:
      'Transparent online pricing for windows and doors installation in West Yorkshire.',
    areaServed: 'West Yorkshire',
    serviceType: 'Windows and Doors Installation',
  }
}

export function productSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    offers: {
      '@type': 'Offer',
      price: product.basePrice,
      priceCurrency: 'GBP',
      priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      areaServed: 'West Yorkshire',
    },
  }
}

export function faqSchema(faqs: ProductFAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
