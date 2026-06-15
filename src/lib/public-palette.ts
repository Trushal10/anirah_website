const publicAccents = ['#2D2D2D', '#F9B65B', '#16A34A']

export function publicAccent(seed?: string | null, index = 0) {
  const value = seed || ''
  const hash = value.split('').reduce((total, char) => total + char.charCodeAt(0), index)
  return publicAccents[Math.abs(hash) % publicAccents.length]
}

export const publicGreen = '#16A34A'
export const publicYellow = '#F9B65B'
export const publicBlack = '#2D2D2D'

export function publicAccentForeground(accent: string) {
  return accent.toLowerCase() === publicYellow.toLowerCase() ? '#050505' : '#ffffff'
}
