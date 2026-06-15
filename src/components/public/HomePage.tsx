'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '@/store/app'
import { motion, useInView } from 'framer-motion'

import {
  Star, Building2, Users, MapPin, Clock, Award, Shield, ClipboardList, Gift, Landmark, Palette, CheckCircle, TrendingUp,IndianRupee, Briefcase,
} from 'lucide-react'
import HeroSection from '@/components/public//sections/HeroSection';
import PartnersSection from '@/components/public/sections/PartnersSection';
import AboutSection from '@/components/public/sections/AboutSection';
import ServicesSection from '@/components/public/sections/ServicesSection';
import FundingSchemesSection from '@/components/public/sections/FundingSchemesSection';
import FeaturesSection from '@/components/public/sections/FeaturesSection';
import ComparisonSection from '@/components/public/sections/ComparisonSection';
import PanIndiaSection from '@/components/public/sections/PanIndiaSection';
import TestimonialsSection from '@/components/public/sections/TestimonialsSection';
import BlogSection from '@/components/public/sections/BlogSection';
import FAQSection from '@/components/public/sections/FAQSection';
import CTASection from '@/components/public/sections/CTASection';

/* ─── FadeIn Animation Wrapper ─── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Counter ─── */
function Counter({ value, suffix = '+' }: { value: number; suffix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.span ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
      {inView ? <>{value.toLocaleString()}{suffix}</> : '0'}
    </motion.span>
  )
}

/* ─── Interfaces ─── */
interface Stat { id: string; label: string; value: number; suffix: string; icon: string; color: string }
interface Service { id: string; name: string; slug: string; icon: string; tagline: string; description: string; accentColor: string; subservices?: { id: string }[] }
interface Testimonial { id: string; name: string; company: string | null; role: string | null; content: string; rating: number; avatarUrl?: string | null }
interface FAQItem { id: string; question: string; answer: string; category: string }
interface BlogPost { id: string; title: string; slug: string; excerpt: string; coverImage?: string | null; category: string; readTime: string; createdAt: string }
interface Scheme { id: string; title: string; slug: string; summary?: string | null; description: string; category: string; image?: string | null; benefits: string; eligibility: string }

/* ─── Icon Map for Services ─── */
const iconMap: Record<string, React.ElementType> = {
  'clipboard-list': ClipboardList, 'check-circle': CheckCircle, shield: Shield,
  award: Award, gift: Gift, landmark: Landmark, palette: Palette,
}

export default function HomePage() {
  const { settings } = useAppStore()

  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [blogs, setBlogs] = useState<BlogPost[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/testimonials').then((r) => r.json()),
      fetch('/api/faqs').then((r) => r.json()),
      fetch('/api/schemes').then((r) => r.json()),
      fetch('/api/blog?limit=6').then((r) => r.json()),
    ]).then(([s, sv, t, f, sc, bl]) => {
      // setStats(s || [])
      setServices(Array.isArray(sv) ? sv.slice(0, 9) : [])
      setTestimonials(t || [])
      setFaqs(f || [])
      setSchemes(Array.isArray(sc) ? sc.slice(0, 6) : [])
      const blogData = bl?.posts || bl || []
      setBlogs(Array.isArray(blogData) ? blogData.slice(0, 6) : [])
    }).catch(() => {})
  }, [])

  const statIconMap: Record<string, React.ElementType> = { Calendar: Clock, Star, Building2, MapPin, Users, Award, TrendingUp, IndianRupee, Briefcase }


  const parseBenefits = (b: string): string[] => {
    try { return JSON.parse(b) } catch { return b ? b.split('\n').filter(Boolean) : [] }
  }

  return (
    <div>
    <HeroSection settings={settings}/>
    <PartnersSection />
    <AboutSection settings={settings}/>
    <ServicesSection services={services} />
    <FundingSchemesSection schemes={schemes} />
    <FeaturesSection />
    <ComparisonSection />
    <PanIndiaSection />
    <TestimonialsSection testimonials={testimonials} />
      {blogs.length > 0 && (
        <BlogSection blogs={blogs} />
      )}
    <FAQSection faqs={faqs}/>
    <CTASection />
    </div>
  )
}
