import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function AboutPage() {
  useSEO({
    title: 'About Us | Why We Built This | Windows & Doors Online',
    description:
      'Why we built a transparent online platform for windows and doors in West Yorkshire. The industry problem and what we are doing about it.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">AboutPage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
