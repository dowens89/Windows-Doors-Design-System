import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { useSEO } from '../utils/seo'

const CATEGORIES = [
  {
    title: 'Composite Doors',
    description: 'GRP composite doors in 88 styles. Our most popular range.',
    path: '/doors/composite',
    available: true,
  },
  {
    title: 'uPVC Doors',
    description: 'Practical and affordable. Three styles available.',
    path: '/doors/upvc',
    available: true,
  },
  {
    title: 'Patio Doors',
    description: 'Coming soon to our range.',
    path: null,
    available: false,
  },
  {
    title: 'French Doors',
    description: 'Coming soon to our range.',
    path: null,
    available: false,
  },
]

export function DoorCategoryPage() {
  const navigate = useNavigate()

  useSEO({
    title: 'Doors Installed West Yorkshire | Windows & Doors Online',
    description:
      'Browse our range of installed doors. Composite, uPVC and more. Honest prices, vetted installers, no salesperson.',
  })

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="font-display text-4xl text-ink mb-4">Doors</h1>
        <p className="font-sans text-lg text-ink-muted mb-12">
          Browse our range of installed doors. Honest prices. One vetted installer. No salesperson.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="bg-paper border border-hairline rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => cat.available && cat.path && navigate(cat.path)}
            >
              <div className="aspect-video bg-surface flex items-center justify-center">
                <span className="font-sans text-sm text-ink-muted">{cat.title} image</span>
              </div>
              <div className="p-5">
                <h2 className="font-display text-xl text-ink mb-1">{cat.title}</h2>
                <p className="font-sans text-sm text-ink-muted mb-3">{cat.description}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!cat.available}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (cat.available && cat.path) navigate(cat.path)
                  }}
                >
                  {cat.available ? 'Browse range' : 'Coming soon'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
