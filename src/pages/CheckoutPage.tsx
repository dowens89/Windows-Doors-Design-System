import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function CheckoutPage() {
  useSEO({
    title: 'Request Your Survey | Windows & Doors Online',
    description:
      'Submit your survey request. No payment taken. We will confirm your installer within 24 hours.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">CheckoutPage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
