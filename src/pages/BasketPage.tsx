import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function BasketPage() {
  useSEO({
    title: 'Your Quote | Windows & Doors Online',
    description:
      'Review your selected windows and doors and proceed to request your free survey.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">BasketPage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
