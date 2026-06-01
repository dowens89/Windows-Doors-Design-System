import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function QuickQuotePage() {
  useSEO({
    title: 'Quick Price Estimate | Windows & Doors West Yorkshire | WDO',
    description:
      'Get an instant indicative price for your windows and doors in West Yorkshire. Three inputs. No contact details needed.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">QuickQuotePage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
