'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '@/store/app'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { MapPin, Clock, Briefcase, TrendingUp, Heart, Award, Send, ArrowRight, Building2, BookOpen, X, FileText, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import FileUpload from '@/components/admin/FileUpload'
import { ScrollAnimation, StaggerContainer, StaggerItem } from '@/components/ui/ScrollAnimation';
import PageHero from '@/components/common/PageHero'
import TurnstileWidget from '@/components/common/TurnstileWidget'

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
}

interface Career { id: string; title: string; location: string; type: string; experience: string; description: string; requirements: string; department: string; salary: string | null }

const whyJoinUs = [
  {
    icon: TrendingUp,
    title: 'Growth Opportunities',
    desc: 'Rapid career growth with clear pathways. We promote from within and invest in your professional development.',
    color: 'text-brand-600',
    bg: 'bg-brand-50',
  },
  {
    icon: Heart,
    title: 'Work-Life Balance',
    desc: 'Flexible work hours, remote options, and a supportive culture that respects your personal time and well-being.',
    color: 'text-mint-700',
    bg: 'bg-mint-50',
  },
  {
    icon: BookOpen,
    title: 'Learning & Development',
    desc: 'Regular training sessions, industry certifications, mentorship programs, and access to online learning platforms.',
    color: 'text-brand-700',
    bg: 'bg-brand-50',
  },
  {
    icon: DollarSign,
    title: 'Competitive Compensation',
    desc: 'Above-market salaries, performance bonuses, health insurance, and comprehensive benefits package.',
    color: 'text-brand-700',
    bg: 'bg-brand-50',
  },
];

const experienceOptions = ['Fresher', '1-2 years', '2-3 years', '3-5 years', '5-8 years', '8+ years']

function getFileTypeInfo(url: string): { isImage: boolean; isPdf: boolean; ext: string } {
  if (!url) return { isImage: false, isPdf: false, ext: '' }
  const lower = url.toLowerCase()
  const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(lower)
  const isPdf = /\.pdf(\?.*)?$/i.test(lower)
  return { isImage, isPdf, ext: lower.split('.').pop()?.split('?')[0] || '' }
}

export default function CareerPage() {
  const { navigate, settings } = useAppStore()
  const { toast } = useToast()
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Career | null>(null)
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', experience: '', resumeUrl: '', message: '' })
  const [applyFormStartedAt, setApplyFormStartedAt] = useState(Date.now())
  const [turnstileToken, setTurnstileToken] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/careers')
      .then((r) => r.json())
      .then((data) => { setCareers(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const openApply = (job: Career) => {
    setSelectedJob(job)
    setApplyForm({ name: '', email: '', phone: '', experience: '', resumeUrl: '', message: '' })
    setApplyFormStartedAt(Date.now())
    setTurnstileToken('')
    setFilePreview(null)
    setApplyDialogOpen(true)
  }

  const handleFileChange = (url: string) => {
    setApplyForm({ ...applyForm, resumeUrl: url })
    // Generate preview for images
    const { isImage } = getFileTypeInfo(url)
    if (isImage && url) {
      setFilePreview(url)
    } else {
      setFilePreview(null)
    }
  }

  const clearFile = () => {
    setApplyForm({ ...applyForm, resumeUrl: '' })
    setFilePreview(null)
  }

  const submitApplication = async () => {
    if (!applyForm.name || !applyForm.email) {
      toast({ title: 'Error', description: 'Please fill in name and email.', variant: 'destructive' })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...applyForm,
          subject: `Job Application: ${selectedJob?.title}`,
          businessType: selectedJob?.department,
          inquiryType: 'career',
          website: '',
          formStartedAt: applyFormStartedAt,
          turnstileToken,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to submit application')
      }
      toast({ title: 'Application Submitted!', description: `We'll review your application for ${selectedJob?.title}.` })
      setApplyDialogOpen(false)
      setTurnstileToken('')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong.',
        variant: 'destructive',
      })
    }
    setSubmitting(false)
  }

  const parseRequirements = (req: string): string[] => {
    try { return JSON.parse(req) } catch { return req ? req.split('\n').filter(Boolean) : [] }
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20"><div className="animate-pulse space-y-6"><div className="h-48 bg-gray-100 rounded-2xl" /><div className="grid sm:grid-cols-2 gap-6"><div className="h-48 bg-gray-100 rounded-2xl" /><div className="h-48 bg-gray-100 rounded-2xl" /></div></div></div>
  }

  return (
    <div>
      <PageHero
        kicker="We're Hiring"
        title="Join Our"
        highlight="Growing Team"
        description="We are looking for passionate individuals who want to make a difference in India's business ecosystem."
        icon={<Award className="h-4 w-4 text-brand-300" />}
      />

      {/* Why Join Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-4">
              Why Anirah Advisory
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Join{' '}
              <span className="text-brand-600">
                Our Team
              </span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We believe in building a workplace where talent thrives, ideas flourish, and every team member can make a real impact.
            </p>
          </ScrollAnimation>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {whyJoinUs.map((item) => (
              <StaggerItem key={item.title}>
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all h-full text-center">
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-4">
              Open Positions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Current{' '}
              <span className="text-brand-600">
                Openings
              </span>
            </h2>
            <p className="text-gray-500">
              Find a role that matches your skills and passion. We&apos;re growing fast and always looking for talented people.
            </p>
          </ScrollAnimation>

          {careers.length > 0 ? (
            <StaggerContainer className="space-y-4" staggerDelay={0.1}>
              {careers.map((job, i) => {
                const reqs = parseRequirements(job.requirements)

                return (
                  <StaggerItem key={job.id}>
                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                      
                      {/* Top Section */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {job.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2">
                            
                            {/* Location */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-mint-50 text-mint-700 text-xs font-medium">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>

                            {/* Experience */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">
                              <Clock className="w-3 h-3" />
                              {job.experience}
                            </span>

                            {/* Job Type */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">
                              <Briefcase className="w-3 h-3" />
                              {job.type}
                            </span>

                            {/* Salary */}
                            {job.salary && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-xs font-medium">
                                Rs. {job.salary}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Apply Button */}
                        <button
                          onClick={() => openApply(job)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#F0B354] bg-[#F0B354] text-black font-semibold text-sm shadow-none hover:border-[#E4A13A] hover:bg-[#E4A13A] hover:text-black hover:shadow-none hover:scale-105 transition-all whitespace-nowrap self-start"
                        >
                          Apply Now
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">
                        {job.description}
                      </p>

                      {/* Requirements / Skills */}
                      {reqs.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {reqs.slice(0, 8).map((r, ri) => (
                            <span
                              key={ri}
                              className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
            ) : (
            <div className="text-center py-16">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No open positions at the moment.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Check back soon or send us your resume at{" "}
                {settings.email || "careers@anirahadvisory.in"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name *</label><Input value={applyForm.name} onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })} placeholder="Your name" className="rounded-lg" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label><Input type="email" value={applyForm.email} onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })} placeholder="you@email.com" className="rounded-lg" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label><Input value={applyForm.phone} onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })} placeholder="+91 XXXXX" className="rounded-lg" /></div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Experience</label>
                <Select value={applyForm.experience} onValueChange={(v) => setApplyForm({ ...applyForm, experience: v })}>
                  <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{experienceOptions.map((e) => (<SelectItem key={e} value={e}>{e}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            {/* File Upload - Accepts both images and PDFs */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Upload CV/Resume or Photo</label>
              {applyForm.resumeUrl && filePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img src={filePreview} alt="Preview" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : applyForm.resumeUrl && !filePreview ? (
                <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-lg">
                  <FileText className="w-8 h-8 text-brand-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-950 truncate">File uploaded</p>
                    <p className="text-xs text-gray-500 truncate">{applyForm.resumeUrl.split('/').pop()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
              <FileUpload
                value={applyForm.resumeUrl}
                onChange={handleFileChange}
                label=""
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
              />
              <p className="text-xs text-gray-400">Accepted: PDF, DOC, DOCX, JPG, PNG, GIF, WebP (Max 10MB)</p>
            </div>

            <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Message</label><Textarea value={applyForm.message} onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })} placeholder="Tell us about yourself..." rows={3} className="rounded-lg" /></div>
            <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
            <Button onClick={submitApplication} disabled={submitting} className="w-full rounded-xl border border-[#F0B354] bg-[#F0B354] font-bold text-black shadow-none hover:border-[#E4A13A] hover:bg-[#E4A13A] hover:text-black hover:shadow-none">
              {submitting ? 'Submitting...' : 'Submit Application'} <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
