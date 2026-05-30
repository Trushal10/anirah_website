'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app'
import { ArrowRight, Award, Building2, Clock, Eye, Heart, Linkedin, Star, Target, Users } from 'lucide-react'
import PageHero from '@/components/common/PageHero'

interface Stat {
  id: string
  label: string
  value: number
  suffix: string
  icon: string
  color: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  avatarUrl: string | null
  linkedin: string | null
}

const statIconMap: Record<string, React.ElementType> = {
  Calendar: Clock,
  Star,
  Building2,
  MapPin: Users,
  Users,
  Award,
}

const milestones = [
  { year: '2018', title: 'Founded', desc: 'FundGrow was established in Ahmedabad to support entrepreneurs with practical business consultancy.' },
  { year: '2019', title: '1,000 Projects', desc: 'Completed a major milestone across registrations, certifications, and compliance filings.' },
  { year: '2020', title: '10+ Services', desc: 'Expanded into registration, legal, funding, certification, and compliance services.' },
  { year: '2022', title: 'Pan India', desc: 'Started serving businesses across India with a growing consultant network.' },
  { year: '2024', title: 'Trusted By MSMEs', desc: 'Built a stronger reputation through repeat clients, reviews, and long-term business relationships.' },
  { year: '2026', title: '5,000+ Projects', desc: 'Scaled into a multi-category consultancy serving startups, MSMEs, and established companies.' },
]

const values = [
  { icon: Heart, title: 'Client First', description: 'We guide every client with clarity, practical timelines, and service choices that fit their business stage.' },
  { icon: Target, title: 'Result Driven', description: 'Our work is measured by completed registrations, approved filings, funding progress, and maintained compliance.' },
  { icon: Award, title: 'Integrity', description: 'Transparent pricing, honest guidance, and realistic expectations stay at the center of every engagement.' },
  { icon: Users, title: 'Collaboration', description: 'Specialists across registration, legal, funding, and compliance work together so clients get connected support.' },
]

export default function AboutPage() {
  const { settings, navigate } = useAppStore()
  const [stats, setStats] = useState<Stat[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch('/api/stats').then((r) => r.json()), fetch('/api/team').then((r) => r.json())])
      .then(([statsData, teamData]) => {
        setStats(statsData || [])
        setTeam(teamData || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white">
      <PageHero
        kicker="Our Story"
        title="Buland Sapno ke Saath,"
        highlight="FundGrow"
        description="We are an Ahmedabad-based consultancy helping entrepreneurs launch, fund, protect, and scale their businesses."
        icon={<Building2 className="h-4 w-4 text-brand-300" />}
      />

      {stats.length > 0 && (
        <section className="bg-gray-50 py-10">
          <div className="section-shell">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = statIconMap[stat.icon] || Building2
                return (
                  <div key={stat.id} className="surface-card p-5 text-center">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gray-950">
                      <Icon className="h-5 w-5 text-brand-300" />
                    </div>
                    <div className="text-2xl font-bold text-gray-950 sm:text-3xl">
                      {stat.value.toLocaleString()}
                      {stat.suffix}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad">
        <div className="section-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <span className="section-kicker">Who We Are</span>
            <h2 className="section-heading mt-4">Business consultancy built around execution</h2>
            <p className="section-copy mt-5">
              {settings?.about_text ||
                'FundGrow helps business owners handle registration, compliance, legal documentation, funding support, and growth essentials through one coordinated consulting team.'}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="surface-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint-50 text-mint-700">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">Our Mission</h3>
              </div>
              <p className="leading-relaxed text-gray-600">
                {settings?.mission || 'To make essential business services simpler, clearer, and more accessible for Indian entrepreneurs.'}
              </p>
            </div>
            <div className="surface-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">Our Vision</h3>
              </div>
              <p className="leading-relaxed text-gray-600">
                {settings?.vision || 'To become a trusted partner for startups and MSMEs at every important stage of business growth.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-gray-50">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-kicker">Our Journey</span>
            <h2 className="section-heading mt-4">Key milestones</h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="surface-card p-6">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{milestone.year}</span>
                <h3 className="mt-4 text-lg font-bold text-gray-950">{milestone.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="section-pad">
          <div className="section-shell">
            <div className="mx-auto max-w-3xl text-center">
              <span className="section-kicker">Leadership Team</span>
              <h2 className="section-heading mt-4">Meet the people behind FundGrow</h2>
              <p className="section-copy mt-4">A team with experience across business consulting, finance, operations, and compliance.</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <div key={member.id} className="surface-card surface-card-hover p-6 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-gray-950 text-2xl font-bold text-brand-300">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                  <h3 className="font-bold text-gray-950">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-mint-700">{member.role}</p>
                  {member.bio && <p className="mt-3 text-sm leading-relaxed text-gray-600">{member.bio}</p>}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-mint-700">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad bg-gray-50">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-kicker">Our Foundation</span>
            <h2 className="section-heading mt-4">Core values</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="surface-card p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-950 text-brand-300">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-950">{value.title}</h3>
                    <p className="mt-2 leading-relaxed text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-gray-950 text-white">
        <div className="section-shell text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to grow your business?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Let us help you move from confusion to clear action with expert guidance and tailored service support.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate('services')} className="primary-action">
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate('contact')} className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
