import type { Metadata } from 'next'
import PublicSchemesRoute from '@/components/public/PublicSchemesRoute'

export const metadata: Metadata = {
  title: 'Government Schemes',
  description: 'Explore government-backed funding schemes, grants, subsidies, and support programs for startups and MSMEs.',
  alternates: {
    canonical: '/government-schemes',
  },
}

export default function GovernmentSchemesPage() {
  return <PublicSchemesRoute />
}
