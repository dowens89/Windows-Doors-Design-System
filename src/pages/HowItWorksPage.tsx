import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function HowItWorksPage() {
  useSEO({
    title: 'How It Works | Windows & Doors Online',
    description:
      'See how WDO helps West Yorkshire homeowners get honest installed prices and get matched with a vetted local installer.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">HowItWorksPage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
