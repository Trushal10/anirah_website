import type { Metadata } from 'next'
import PublicLegalRoute from '@/components/public/PublicLegalRoute'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using the website and consultancy services.',
  alternates: {
    canonical: '/terms-conditions',
  },
}

export default function TermsConditionsPage() {
  return <PublicLegalRoute kind="terms" />
}
