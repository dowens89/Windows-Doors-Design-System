import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function ShopPage() {
  useSEO({
    title: 'Windows & Doors — Installed Prices West Yorkshire | WDO',
    description:
      'Browse replacement windows and doors with honest installed prices for West Yorkshire. See your price online before anyone visits.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">ShopPage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
