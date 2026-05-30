'use client'

import type { ReactNode } from 'react'

interface PageHeroProps {
  kicker: string
  title: string
  highlight?: string
  description: string
  icon?: ReactNode
}

export default function PageHero({ kicker, title, highlight, description, icon }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-brand-500/20 bg-[#050505] py-16 text-white sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(232,162,62,0.16),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(22,163,74,0.12),transparent_30%)]" />
      <div className="section-shell relative text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/90">
          {icon}
          {kicker}
        </span>
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          {title}
          {highlight ? <span className="brand-gradient-text"> {highlight}</span> : null}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  )
}
