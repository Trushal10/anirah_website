const publicAccents = ['#E8A23E', '#16A34A']

export function publicAccent(seed?: string | null, index = 0) {
  const value = seed || ''
  const hash = value.split('').reduce((total, char) => total + char.charCodeAt(0), index)
  return publicAccents[Math.abs(hash) % publicAccents.length]
}

export const publicGreen = '#16A34A'
export const publicYellow = '#E8A23E'

export function publicAccentForeground(accent: string) {
  return accent.toLowerCase() === publicGreen.toLowerCase() ? '#ffffff' : '#050505'
}
