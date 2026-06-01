import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function ProductDetailPage() {
  useSEO({
    title: 'Product | Windows & Doors Online',
    description: 'Product detail page.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">ProductDetailPage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
