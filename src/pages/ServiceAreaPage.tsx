import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function ServiceAreaPage() {
  useSEO({
    title: 'Windows & Doors Installation — West Yorkshire | WDO',
    description:
      'WDO currently serves West Yorkshire including Leeds, Bradford, Wakefield, Huddersfield, Halifax, Harrogate and surrounding areas.',
  })
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-4xl text-ink">ServiceAreaPage — coming in Step Two</h1>
      </div>
    </Layout>
  )
}
