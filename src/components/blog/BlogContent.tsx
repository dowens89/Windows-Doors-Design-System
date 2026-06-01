import React from 'react'
import { Check } from 'lucide-react'
import { FAQ } from '../ds/FAQ'
import type { BlogSection } from '../../data/blogPosts'

interface BlogContentProps {
  sections: BlogSection[]
}

export function BlogContent({ sections }: BlogContentProps) {
  return (
    <div>
      {sections.map((section, i) => {
        switch (section.type) {
          case 'paragraph':
            return (
              <p
                key={i}
                className="font-sans text-base text-ink leading-relaxed max-w-prose mb-6"
              >
                {section.content}
              </p>
            )

          case 'heading':
            return (
              <h2
                key={i}
                className="font-display text-2xl text-ink mb-4 mt-10 pb-2 border-b border-hairline"
              >
                {section.content}
              </h2>
            )

          case 'subheading':
            return (
              <h3 key={i} className="font-display text-xl text-ink mb-3 mt-8">
                {section.content}
              </h3>
            )

          case 'list':
            return (
              <ul key={i} className="space-y-2 mb-6">
                {section.items?.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 text-brand flex-shrink-0 mt-0.5"
                      strokeWidth={2}
                    />
                    <span className="font-sans text-base text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            )

          case 'callout':
            return (
              <blockquote
                key={i}
                className="bg-surface border-l-4 border-brand px-6 py-4 font-sans text-base text-ink-muted italic mb-6"
              >
                {section.content}
              </blockquote>
            )

          case 'faq':
            return section.faqs && section.faqs.length > 0 ? (
              <div key={i} className="mt-10">
                <h2 className="font-display text-2xl text-ink mb-6 pb-2 border-b border-hairline">
                  Frequently asked questions
                </h2>
                <FAQ items={section.faqs} />
              </div>
            ) : null

          default:
            return null
        }
      })}
    </div>
  )
}
