import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { BlogCard } from '../components/blog/BlogCard'
import { useSEO } from '../utils/seo'
import { blogPosts } from '../data/blogPosts'
import type { BlogPost } from '../data/blogPosts'

type CategoryFilter = BlogPost['category'] | 'all'

const FILTER_LABELS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'advice', label: 'Advice' },
  { value: 'products', label: 'Products' },
  { value: 'industry', label: 'Industry' },
]

export function BlogPage() {
  useSEO({
    title: 'Windows & Doors Advice for West Yorkshire Homeowners | WDO Blog',
    description:
      'Honest guides on windows and doors costs and installation for West Yorkshire homeowners. No sales pitch.',
  })

  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all')

  const filtered =
    activeFilter === 'all'
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeFilter)

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-12">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">
          Windows and Doors Advice for West Yorkshire Homeowners
        </h1>
        <p className="font-sans text-ink-muted mb-10">
          Honest guides and local pricing information. No sales pitch.
        </p>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTER_LABELS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`font-sans text-sm px-4 py-1.5 border rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                activeFilter === value
                  ? 'bg-brand text-paper border-brand'
                  : 'bg-surface border-hairline text-ink hover:border-brand hover:text-brand'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onClick={() => navigate(`/blog/${post.slug}`)}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
