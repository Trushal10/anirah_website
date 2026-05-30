'use client'

import {
  Award,
  BadgeCheck,
  Building2,
  CheckCircle,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Gift,
  Landmark,
  Palette,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  'clipboard-list': ClipboardList,
  'check-circle': CheckCircle,
  award: Award,
  badge: BadgeCheck,
  building: Building2,
  Building2,
  check: CheckCircle,
  CheckCircle2,
  clipboard: ClipboardCheck,
  FileText,
  gift: Gift,
  landmark: Landmark,
  palette: Palette,
  rocket: Rocket,
  shield: Shield,
  Sparkles,
  trending: TrendingUp,
  Users,
}

function isImageIcon(icon: string): boolean {
  return (
    icon.startsWith('/') ||
    icon.startsWith('http://') ||
    icon.startsWith('https://') ||
    icon.startsWith('data:image/') ||
    /\.(png|jpe?g|webp|gif|svg)$/i.test(icon)
  )
}

interface ServiceIconProps {
  icon: string | null | undefined
  accentColor?: string | null
  className?: string
  imageClassName?: string
  alt?: string
}

export default function ServiceIcon({
  icon,
  accentColor = '#F9B65B',
  className = 'w-6 h-6',
  imageClassName,
  alt = 'Service icon',
}: ServiceIconProps) {
  const iconValue = icon?.trim() || ''

  if (iconValue && isImageIcon(iconValue)) {
    return (
      <img
        src={iconValue}
        alt={alt}
        className={imageClassName || `${className} object-contain`}
      />
    )
  }

  const Icon = iconMap[iconValue] || Building2
  return <Icon className={className} style={{ color: accentColor || '#F9B65B' }} />
}
