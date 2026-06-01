import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function PricingPromisePage() {
  useSEO({
    title: 'Our Pricing Promise | Windows & Doors Online',
    description:
      'Understand what our indicative prices include and what we do if an installer reprices without good reason.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">PricingPromisePage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
