import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function ContactPage() {
  useSEO({
    title: 'Contact | Windows & Doors Online',
    description: 'Get in touch. We respond to every message within one working day.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">ContactPage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
