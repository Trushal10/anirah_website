import { create } from 'zustand'

export type Page = 'home' | 'services' | 'service-detail' | 'subservice-detail' | 'government-schemes' | 'scheme-detail' | 'blog' | 'blog-detail' | 'content' | 'content-detail' | 'about' | 'career' | 'contact' | 'terms-conditions' | 'privacy-policy' | 'admin' | 'admin-dashboard' | 'admin-settings' | 'admin-services' | 'admin-blog' | 'admin-content' | 'admin-careers' | 'admin-schemes' | 'admin-inquiries' | 'admin-testimonials' | 'admin-faqs' | 'admin-team' | 'admin-stats'

const VALID_PAGES: Page[] = ['home', 'services', 'service-detail', 'subservice-detail', 'government-schemes', 'scheme-detail', 'blog', 'blog-detail', 'content', 'content-detail', 'about', 'career', 'contact', 'terms-conditions', 'privacy-policy', 'admin', 'admin-dashboard', 'admin-settings', 'admin-services', 'admin-blog', 'admin-content', 'admin-careers', 'admin-schemes', 'admin-inquiries', 'admin-testimonials', 'admin-faqs', 'admin-team', 'admin-stats']

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(`fg_${key}`)
    if (stored !== null) {
      const parsed = JSON.parse(stored)
      return parsed
    }
  } catch {
    // ignore
  }
  return fallback
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`fg_${key}`, JSON.stringify(value))
  } catch {
    // ignore
  }
}

interface AppState {
  currentPage: Page
  pageParam: string | null
  settings: Record<string, string>
  isAdmin: boolean
  adminName: string
  sidebarOpen: boolean
  navigate: (page: Page, param?: string) => void
  setSettings: (settings: Record<string, string>) => void
  setAdmin: (isAdmin: boolean, name?: string) => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => {
  const storedIsAdmin = loadFromStorage<boolean>('isAdmin', false)
  const storedAdminName = loadFromStorage<string>('adminName', '')
  const storedPage = loadFromStorage<Page>('currentPage', 'home')
  const storedParam = loadFromStorage<string | null>('pageParam', null)

  const isValidStoredPage = VALID_PAGES.includes(storedPage)
  const isStoredAdminPage = isValidStoredPage && storedPage.startsWith('admin')
  const canRestoreStoredPage = isValidStoredPage && (!isStoredAdminPage || storedIsAdmin)

  // Restore the last public/admin page after browser refresh. Admin pages still require login.
  const initialPage = canRestoreStoredPage ? storedPage : 'home'
  const initialParam = canRestoreStoredPage ? storedParam : null

  return {
    currentPage: initialPage,
    pageParam: initialParam,
    settings: {},
    isAdmin: storedIsAdmin,
    adminName: storedAdminName,
    sidebarOpen: true,
    navigate: (page, param) => {
      const nextParam = param ?? null
      set({ currentPage: page, pageParam: nextParam })
      saveToStorage('currentPage', page)
      saveToStorage('pageParam', nextParam)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    setSettings: (settings) => set({ settings }),
    setAdmin: (isAdmin, name = '') => {
      set({ isAdmin, adminName: name })
      saveToStorage('isAdmin', isAdmin)
      saveToStorage('adminName', name)
    },
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  }
})
