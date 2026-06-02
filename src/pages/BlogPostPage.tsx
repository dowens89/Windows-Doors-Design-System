import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Layout } from '../components/Layout'
import { SchemaTag } from '../components/SchemaTag'
import { BlogCard } from '../components/blog/BlogCard'
import { BlogContent } from '../components/blog/BlogContent'
import { Button } from '../components/ds/Button'
import { Badge } from '../components/ds/Badge'
import { EmptyState } from '../components/ds/EmptyState'
import { useSEO } from '../utils/seo'
import { faqSchema } from '../utils/schema'
import { blogPosts } from '../data/blogPosts'
import type { BlogPost } from '../data/blogPosts'

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

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const post = blogPosts.find((p) => p.slug === slug)

  // Gather all faqs from content sections for schema
  const allFaqs = post
    ? post.content
        .filter((s) => s.type === 'faq' && s.faqs?.length)
        .flatMap((s) => s.faqs ?? [])
    : []

  const relatedPosts = post
    ? post.relatedPostIds
        .map((id) => blogPosts.find((p) => p.id === id))
        .filter((p): p is BlogPost => p !== undefined)
    : []

  // Always call hooks before any conditional returns
  useSEO({
    title: post ? post.metaTitle : 'Guide | Windows & Doors Online',
    description: post ? post.metaDescription : '',
  })

  if (!post) {
    return (
      <Layout>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
          <EmptyState
            icon={BookOpen}
            title="Guide not found"
            description="We couldn't find that article. Browse all our guides below."
            actionLabel="Back to blog"
            onAction={() => navigate('/blog')}
          />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {allFaqs.length > 0 && <SchemaTag schema={faqSchema(allFaqs)} />}

      <article className="max-w-3xl mx-auto px-6 md:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-4">
            <Badge variant="neutral">{CATEGORY_LABELS[post.category]}</Badge>
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-ink mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="font-sans text-sm text-ink-muted">
            {post.author} &middot; {formatDate(post.publishedAt)} &middot;{' '}
            {post.readTimeMinutes} min read
          </p>

          <div className="mt-8 border-t border-hairline" />
        </div>

        {/* Body */}
        <BlogContent sections={post.content} />

        {/* CTA block */}
        <div className="mt-16 bg-surface border border-hairline p-8">
          <h3 className="font-display text-xl text-ink mb-3">Get your price online</h3>
          <p className="font-sans text-base text-ink-muted mb-6">
            See honest installed prices before anyone visits your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" onClick={() => navigate('/shop')}>
              Browse Products
            </Button>
            <Button variant="secondary" onClick={() => navigate('/quick-quote')}>
              Quick Quote
            </Button>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-ink mb-8">Related guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rp) => (
                <BlogCard
                  key={rp.id}
                  post={rp}
                  onClick={() => navigate(`/blog/${rp.slug}`)}
                />
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  )
}
