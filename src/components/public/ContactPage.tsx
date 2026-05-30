'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app'
import { Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function ContactPage() {
  const { settings } = useAppStore()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', businessType: '', fundingAmount: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [services, setServices] = useState<{ name: string; slug: string }[]>([])

  useEffect(() => {
    fetch('/api/services').then((r) => r.json()).then((data) => setServices(Array.isArray(data) ? data : [])).catch(() => {})
  }, [])

  const phone = settings.phone || '+91 9998006734'
  const phone2 = settings.phone2 || ''
  const email = settings.email || 'support@fundgrow.in'
  const email2 = settings.email2 || ''
  const address = settings.address || 'Ahmedabad, Gujarat, India'

  const submitContact = async () => {
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, inquiryType: 'general' }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Success', description: "Your message has been sent. We'll contact you soon." })
      setForm({ name: '', email: '', phone: '', businessType: '', fundingAmount: '', message: '' })
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <section className="bg-gray-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="section-shell text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm text-white/90">
            <Sparkles className="h-4 w-4 text-brand-300" />
            Get in touch
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Contact <span className="brand-gradient-text">our experts</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            Tell us what you are building. Our team will help you choose the right registration, compliance, certification, or funding path.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
            <div className="lg:col-span-2">
              <h2 className="section-heading text-3xl lg:text-4xl">Start your growth journey</h2>
              <p className="section-copy mt-4">Fill the form and we will contact you within 24 hours.</p>

              <div className="mt-8 space-y-5">
                <div className="surface-card flex items-start gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                    <Phone className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-950">Call us</h3>
                    <a href={`tel:${phone}`} className="mt-1 block text-sm text-gray-600 hover:text-brand-700">{phone}</a>
                    {phone2 && <a href={`tel:${phone2}`} className="block text-sm text-gray-600 hover:text-brand-700">{phone2}</a>}
                  </div>
                </div>

                <div className="surface-card flex items-start gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-mint-50">
                    <Mail className="h-5 w-5 text-mint-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-950">Email</h3>
                    <a href={`mailto:${email}`} className="mt-1 block text-sm text-gray-600 hover:text-brand-700">{email}</a>
                    {email2 && <a href={`mailto:${email2}`} className="block text-sm text-gray-600 hover:text-brand-700">{email2}</a>}
                  </div>
                </div>

                <div className="surface-card flex items-start gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <MapPin className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-950">Visit us</h3>
                    <p className="mt-1 text-sm text-gray-600">{address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="surface-card p-5 sm:p-6 lg:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">Full name *</span>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20" />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">Phone</span>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20" />
                  </label>
                </div>

                <label className="mt-5 block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Email *</span>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20" />
                </label>

                <label className="mt-5 block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Service</span>
                  <select value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20">
                    <option value="">Select service</option>
                    {services.map((service) => <option key={service.slug} value={service.name}>{service.name}</option>)}
                  </select>
                </label>

                <label className="mt-5 block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Message *</span>
                  <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20" />
                </label>

                <Button onClick={submitContact} disabled={submitting} className="mt-6 h-12 rounded-lg bg-gradient-to-r from-brand-500 to-mint-600 px-8 font-semibold text-white hover:from-brand-400 hover:to-mint-500">
                  {submitting ? 'Sending...' : 'Submit enquiry'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
