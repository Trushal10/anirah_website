import type { Metadata } from 'next'
import PublicSchemesRoute from '@/components/public/PublicSchemesRoute'

export const metadata: Metadata = {
  title: 'Government Scheme Details',
  description: 'View government scheme details, benefits, eligibility, and consultation support.',
}

export default async function GovernmentSchemeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PublicSchemesRoute slug={slug} />
}
