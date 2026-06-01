import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'
import { EmptyState } from '../components/ds/EmptyState'

export function NotFoundPage() {
  const navigate = useNavigate()
  useSEO({ title: 'Page Not Found | WDO', description: 'The page you are looking for does not exist.' })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
        <EmptyState
          icon={FileQuestion}
          title="Page not found"
          description="The page you are looking for does not exist."
          actionLabel="Go home"
          onAction={() => navigate('/')}
        />
      </div>
    </Layout>
  )
}
