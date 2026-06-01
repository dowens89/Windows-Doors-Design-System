import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function HomePage() {
  useSEO({
    title: 'Windows & Doors Online | Installed Prices in West Yorkshire',
    description:
      'Browse windows and doors with honest installed prices for West Yorkshire. See your price online before anyone visits your home. No salesperson. No pressure.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">HomePage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
