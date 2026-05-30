'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTheme } from 'next-themes'
import { useAppStore, type Page } from '@/store/app'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  FileText,
  Edit3,
  Building2,
  Settings,
  Star,
  HelpCircle,
  Users,
  BarChart3,
  LogOut,
  Menu,
  ChevronLeft,
  Shield,
  Sun,
  Moon,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  page: Page
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Dashboard', page: 'admin-dashboard', icon: LayoutDashboard },
  { label: 'Inquiries', page: 'admin-inquiries', icon: MessageSquare },
  { label: 'Services', page: 'admin-services', icon: Briefcase },
  { label: 'Blog Posts', page: 'admin-blog', icon: FileText },
  { label: 'Content', page: 'admin-content', icon: Edit3 },
  { label: 'Careers', page: 'admin-careers', icon: Building2 },
  { label: 'Schemes', page: 'admin-schemes', icon: Briefcase },
  { label: 'Testimonials', page: 'admin-testimonials', icon: Star },
  { label: 'FAQs', page: 'admin-faqs', icon: HelpCircle },
  { label: 'Team', page: 'admin-team', icon: Users },
  { label: 'Stats', page: 'admin-stats', icon: BarChart3 },
  { label: 'Settings', page: 'admin-settings', icon: Settings },
]

function SidebarNav({
  currentPage,
  onNavigate,
  collapsed,
}: {
  currentPage: Page
  onNavigate: (page: Page) => void
  collapsed: boolean
}) {
  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className={cn(
        'flex items-center gap-3 px-4 h-16 border-b border-border',
        collapsed && 'justify-center px-2'
      )}>
        <Shield className="h-6 w-6 shrink-0 text-primary" />
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm truncate text-foreground">FundGrow</span>
            <span className="text-[10px] text-muted-foreground">Admin Panel</span>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.page
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left w-full',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="border-t border-border p-2">
        <button
          onClick={() => onNavigate('home')}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left w-full text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Back to Site' : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Back to Site</span>}
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { currentPage, adminName, navigate, setAdmin, isAdmin: storeIsAdmin } = useAppStore()
  const { setTheme, resolvedTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const isDark = mounted ? resolvedTheme === 'dark' : false
  const hasSetInitialDark = useRef(false)

  // Set dark theme ONCE when admin first loads (don't override user toggle)
  useEffect(() => {
    if (mounted && storeIsAdmin && !hasSetInitialDark.current) {
      hasSetInitialDark.current = true
      setTheme('dark')
    }
  }, [mounted, storeIsAdmin, setTheme])

  // When leaving admin, restore light theme
  useEffect(() => {
    if (mounted && !storeIsAdmin) {
      hasSetInitialDark.current = false
      setTheme('light')
    }
  }, [mounted, storeIsAdmin, setTheme])

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/inquiries?status=new&limit=1')
      const data = await res.json()
      setUnreadCount(data.total || 0)
    } catch {
      // Silently handle
    }
  }, [])

  useEffect(() => {
    const load = () => { fetchUnreadCount() }
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  if (!mounted) {
    requestAnimationFrame(() => setMounted(true))
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const pageTitle = navItems.find((item) => item.page === currentPage)?.label || 'Dashboard'

  const handleNavigate = (page: Page) => {
    navigate(page)
    setMobileOpen(false)
  }

  const handleLogout = () => {
    setAdmin(false, '')
    setTheme('light')
    navigate('home')
  }

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300 bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border transition-all duration-300 shrink-0 bg-sidebar',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        <SidebarNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
          collapsed={collapsed}
        />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 bg-card">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SidebarNav
                  currentPage={currentPage}
                  onNavigate={handleNavigate}
                  collapsed={false}
                />
              </SheetContent>
            </Sheet>

            {/* Collapse button (desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft
                className={cn(
                  'h-4 w-4 transition-transform',
                  collapsed && 'rotate-180'
                )}
              />
            </Button>

            <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate('admin-inquiries')}
              title="View inquiries"
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {/* User Avatar & Name */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary">
                <span className="font-medium text-xs text-primary-foreground">
                  {adminName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <span className="font-medium text-foreground">{adminName}</span>
            </div>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
