'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/app'
import DynamicMetadata from '@/components/common/DynamicMetadata'
import Footer from '@/components/public/Footer'
import Header from '@/components/public/Header'
import LegalPage from '@/components/public/LegalPage'

interface PublicLegalRouteProps {
  kind: 'terms' | 'privacy'
}

export default function PublicLegalRoute({ kind }: PublicLegalRouteProps) {
  const { settings, setSettings } = useAppStore()

  useEffect(() => {
    if (Object.keys(settings).length > 0) return
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {})
  }, [settings, setSettings])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <DynamicMetadata />
      <Header />
      <main className="flex-1">
        <LegalPage kind={kind} />
      </main>
      <Footer />
    </div>
  )
}
