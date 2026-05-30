'use client'

import { useRouter } from 'next/navigation'
import LoginDialog from '@/components/admin/LoginDialog'

export default function LoginPage() {
  const router = useRouter()

  return (
    <LoginDialog
      onSuccess={() => router.replace('/admin')}
      onBack={() => router.replace('/')}
    />
  )
}
