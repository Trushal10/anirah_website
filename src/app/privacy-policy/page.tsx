import type { Metadata } from 'next'
import PublicLegalRoute from '@/components/public/PublicLegalRoute'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for information collected through the website and consultancy services.',
  alternates: {
    canonical: '/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return <PublicLegalRoute kind="privacy" />
}
