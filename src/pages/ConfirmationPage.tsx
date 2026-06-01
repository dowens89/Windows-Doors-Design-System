import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function ConfirmationPage() {
  useSEO({
    title: 'Survey Request Confirmed | Windows & Doors Online',
    description:
      'Your survey request has been confirmed. We will be in touch within 24 hours.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">ConfirmationPage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
