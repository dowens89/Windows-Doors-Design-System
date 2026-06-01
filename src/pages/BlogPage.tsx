import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function BlogPage() {
  useSEO({
    title: 'Windows & Doors Advice for West Yorkshire Homeowners | WDO Blog',
    description:
      'Honest guides on windows and doors costs and installation for West Yorkshire homeowners.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">BlogPage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
