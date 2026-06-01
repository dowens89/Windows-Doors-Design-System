import React from 'react'
import { Badge } from '../ds/Badge'
import type { BlogPost } from '../../data/blogPosts'

interface BlogCardProps {
  post: BlogPost
  onClick: () => void
}

const CATEGORY_LABELS: Record<BlogPost['category'], string> = {
  pricing: 'Pricing',
  advice: 'Advice',
  products: 'Products',
  industry: 'Industry',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function BlogCard({ post, onClick }: BlogCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface border border-hairline rounded p-6 hover:border-brand transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <div className="mb-4">
        <Badge variant="neutral">{CATEGORY_LABELS[post.category]}</Badge>
      </div>

      <h2 className="font-display text-xl text-ink mb-3 leading-snug">{post.title}</h2>

      <p className="font-sans text-sm text-ink-muted leading-relaxed mb-6">{post.excerpt}</p>

      <p className="font-sans text-xs text-ink-muted">
        {post.author} &middot; {formatDate(post.publishedAt)} &middot;{' '}
        {post.readTimeMinutes} min read
      </p>
    </button>
  )
}
