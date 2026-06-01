import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Layout } from '../components/Layout'
import { EmptyState } from '../components/ds/EmptyState'
import { useSEO } from '../utils/seo'

export function BlogPage() {
  useSEO({
    title: 'Windows & Doors Advice for West Yorkshire Homeowners | WDO Blog',
    description:
      'Honest guides on windows and doors costs and installation for West Yorkshire homeowners.',
  })

  const navigate = useNavigate()

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-12">
          Windows and Doors Advice for West Yorkshire Homeowners
        </h1>
        <EmptyState
          icon={BookOpen}
          title="Guides coming soon"
          description="We are writing honest, locally relevant guides for West Yorkshire homeowners. No sales pitch. Just useful information."
          actionLabel="Browse products"
          onAction={() => navigate('/shop')}
        />
      </div>
    </Layout>
  )
}
