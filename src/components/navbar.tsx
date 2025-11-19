'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoutButton } from '@/components/logout-button'
import { NotificationBell } from '@/components/notification-bell'
import { SearchModal } from '@/components/search-modal'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Shield,
  Plus,
  ChevronDown,
  Heart,
  Camera,
  Trophy,
  Coins,
  Menu,
  X,
  Search,
  Flame,
  Zap,
  Sparkles
} from 'lucide-react'

type User = {
  id: string
  name: string | null
  username: string | null
  image: string | null
  role: string
  coins?: number
  xp?: number
  level?: number
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [siteName, setSiteName] = useState('ZayiflamaPlan')
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        const data = await response.json()
        

        if (data.user) {
          // Force new object to trigger re-render
          setUser({
            id: data.user.id,
            name: data.user.name,
            username: data.user.username,
            image: data.user.image,
            role: data.user.role,
            coins: data.user.coins ?? 0,
            xp: data.user.xp ?? 0,
            level: data.user.level ?? 1,
          })
          
          // Fetch streak data
          try {
            const streakRes = await fetch('/api/gamification/streak')
            if (streakRes.ok) {
              const streakData = await streakRes.json()
              if (streakData.currentStreak) {
                setStreak(streakData.currentStreak)
              }
            }
          } catch (err) {
            // Streak API not available yet, skip silently
            console.log('Streak data not available')
          }
        }
        
        if (data.siteName) {
          setSiteName(data.siteName)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
    
    // Listen for storage events to refresh user data
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quest-claimed') {
        setRefreshKey(prev => prev + 1)
        fetchUserData()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom event
    const handleQuestClaimed = () => {
      setRefreshKey(prev => prev + 1)
      fetchUserData()
    }
    
    window.addEventListener('quest-claimed', handleQuestClaimed)
    
    // Keyboard shortcut for search (Cmd+K / Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('quest-claimed', handleQuestClaimed)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [refreshKey])
  
  // Calculate XP progress for current level
  const getXPProgress = () => {
    if (!user?.xp || !user?.level) return 0
    const currentLevelXP = (user.level - 1) * 1000
    const nextLevelXP = user.level * 1000
    const progress = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <>
      <header className="border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
          {/* XP Progress Bar - Bottom of navbar */}
          {user && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent">
              <div 
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-lg shadow-primary/50"
                style={{ width: `${getXPProgress()}%` }}
              />
            </div>
          )}
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:scale-105 transition-transform">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-lg shadow-primary/30 animate-pulse">
              🌟
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {siteName}
            </span>
          </Link>
          
          {/* Main Navigation */}
          <nav className="flex items-center gap-1 md:gap-2">
            {/* Search Button */}
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-2 md:px-3 hidden md:flex items-center gap-2 hover:bg-primary/10"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline text-xs text-muted-foreground">Ara (⌘K)</span>
              </Button>
            )}
          {/* Keşfet Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden lg:flex h-9 px-3 gap-1">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Keşfet</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/kesfet" className="cursor-pointer">
                  <Zap className="mr-2 h-4 w-4" />
                  Keşfet Ana Sayfa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tarifler" className="cursor-pointer">
                  🍳
                  <span className="ml-2">Tarifler</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/blog" className="cursor-pointer">
                  📝
                  <span className="ml-2">Blog</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/gruplar" className="cursor-pointer">
                  👥
                  <span className="ml-2">Gruplar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/lonca" className="cursor-pointer">
                  🏰
                  <span className="ml-2">Loncalar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sezonlar" className="cursor-pointer">
                  ⚔️
                  <span className="ml-2">Sezonlar</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link 
            href="/gunah-sayaci" 
            className="flex items-center gap-1 px-2 md:px-3 py-2 text-sm font-medium bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20 rounded-lg transition-all hover:scale-105 border border-red-500/20 shadow-sm hover:shadow-md"
          >
            😈 <span className="hidden sm:inline">Günah</span>
          </Link>
          
          {user && (
            <Link 
              href="/confessions" 
              className="hidden md:flex items-center gap-1 px-2 md:px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-all hover:scale-105 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 shadow-sm hover:shadow-md"
            >
              🎭 <span className="hidden lg:inline">İtiraf</span>
            </Link>
          )}
          
          {/* Aktiviteler Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden lg:flex h-9 px-3 gap-1">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-medium">Aktiviteler</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/rozetler" className="cursor-pointer">
                    🏆
                    <span className="ml-2">Rozetler</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/gorevler" className="cursor-pointer">
                    📋
                    <span className="ml-2">Görevler</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/check-in" className="cursor-pointer">
                    ✅
                    <span className="ml-2">Günlük Check-in</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/su-takibi" className="cursor-pointer">
                    💧
                    <span className="ml-2">Su Takibi</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/magaza" className="cursor-pointer">
                    🛒
                    <span className="ml-2">Mağaza</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {user ? (
            <>
              {/* AI Önerileri - Özel Buton */}
              <Link
                href="/ai-features"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 rounded-lg transition-all hover:scale-105 border border-purple-500/30 shadow-sm hover:shadow-md text-purple-600 dark:text-purple-400"
              >
                🤖 <span className="hidden xl:inline">AI Asistan</span>
              </Link>

              {/* Gamification Stats */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-full border border-amber-500/20 shadow-md hover:shadow-lg transition-all group">
                {/* Streak */}
                {streak > 0 && (
                  <div className="flex items-center gap-1 group-hover:scale-110 transition-transform">
                    <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{streak}</span>
                  </div>
                )}
                
                {/* Coins */}
                <div className="flex items-center gap-1 group-hover:scale-110 transition-transform">
                  <Coins className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                    {typeof user.coins === 'number' ? user.coins.toLocaleString() : 0}
                  </span>
                </div>
                
                {/* Level */}
                <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full group-hover:scale-110 transition-transform">
                  <Sparkles className="h-3 w-3 text-white" />
                  <span className="text-xs font-bold text-white">
                    {typeof user.level === 'number' ? user.level : 1}
                  </span>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-2 md:px-3 gap-1">
                    <Plus className="h-4 w-4" />
                    <span className="hidden md:inline text-sm">Oluştur</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link href="/plan-ekle" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Plan Ekle
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tarif-ekle" className="cursor-pointer">
                      🍳
                      <span className="ml-2">Tarif Ekle</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/gruplar/olustur" className="cursor-pointer">
                      👥
                      <span className="ml-2">Grup Oluştur</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <NotificationBell userId={user.id} />

              {user.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  className="hidden lg:flex items-center gap-1 px-2 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-lg transition-colors"
                >
                  <Shield className="h-4 w-4" />
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden h-9 px-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden lg:flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded-lg transition-all hover:scale-105">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden ring-2 ring-primary/20 shadow-lg">
                      {user?.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name || ''} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">👤</span>
                      )}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {user?.name || user?.username || 'Kullanıcı'}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || 'Kullanıcı'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        @{user?.username || 'kullanici'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/planlarim" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Planlarım
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/tariflerim" className="cursor-pointer">
                      🍳
                      <span className="ml-2">Tariflerim</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/favorilerim" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorilerim
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/fotograflar" className="cursor-pointer">
                      <Camera className="mr-2 h-4 w-4" />
                      Fotoğraflarım
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/takip-ettiklerim" className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      Takip Ettiklerim
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/itirazlarim" className="cursor-pointer">
                      📢
                      <span className="ml-2">İtirazlarım</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/mesajlar" className="cursor-pointer">
                      💬
                      <span className="ml-2">Mesajlar</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/confessions" className="cursor-pointer bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                      🎭
                      <span className="ml-2 font-semibold text-purple-600 dark:text-purple-400">İtiraf Duvarı</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/ayarlar" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Ayarlar
                    </Link>
                  </DropdownMenuItem>
                  
                  {user?.role === 'ADMIN' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profil/admin" className="cursor-pointer bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                          <Shield className="mr-2 h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-purple-600">Admin Profil</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <LogoutButton asMenuItem>Çıkış Yap</LogoutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="h-9">
                <Link href="/giris">Giriş Yap</Link>
              </Button>
              <Button asChild size="sm" className="h-9 shadow-sm">
                <Link href="/kayit">Kayıt Ol</Link>
              </Button>
            </div>
          )}
        </nav>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && user && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute right-0 top-16 bottom-0 w-80 bg-background border-l shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info */}
            <div className="p-6 border-b bg-gradient-to-br from-primary/5 to-purple-500/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden ring-4 ring-primary/20 shadow-lg">
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || ''} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">{user?.name || 'Kullanıcı'}</p>
                  <p className="text-sm text-muted-foreground">@{user?.username || 'kullanici'}</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {streak > 0 && (
                  <div className="flex flex-col items-center p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <Flame className="h-5 w-5 text-orange-500 mb-1" />
                    <span className="text-xs text-muted-foreground">Streak</span>
                    <span className="font-bold text-orange-600">{streak}</span>
                  </div>
                )}
                <div className="flex flex-col items-center p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <Coins className="h-5 w-5 text-amber-600 mb-1" />
                  <span className="text-xs text-muted-foreground">Coins</span>
                  <span className="font-bold text-amber-700">{user.coins?.toLocaleString() || 0}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <Sparkles className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Level</span>
                  <span className="font-bold text-primary">{user.level || 1}</span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-1">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <Link 
                href="/kesfet" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Zap className="h-5 w-5" />
                <span className="font-medium">Keşfet</span>
              </Link>
              
              <Link 
                href="/tarifler" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">🍳</span>
                <span className="font-medium">Tarifler</span>
              </Link>
              
              <Link 
                href="/blog" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">📝</span>
                <span className="font-medium">Blog</span>
              </Link>
              
              <Link 
                href="/gruplar" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Gruplar</span>
              </Link>
              
              <div className="h-px bg-border my-2" />
              
              <Link 
                href="/gunah-sayaci" 
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20 rounded-lg transition-colors border border-red-500/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">😈</span>
                <span className="font-medium">Günah Sayacı</span>
              </Link>
              
              <Link 
                href="/confessions" 
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-lg transition-colors border border-purple-500/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">🎭</span>
                <span className="font-medium">İtiraf Duvarı</span>
              </Link>
              
              <div className="h-px bg-border my-2" />
              
              <Link 
                href="/rozetler" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Trophy className="h-5 w-5" />
                <span className="font-medium">Rozetler</span>
              </Link>
              
              <Link 
                href="/gorevler" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">📋</span>
                <span className="font-medium">Görevler</span>
              </Link>
              
              <Link 
                href="/check-in" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">✅</span>
                <span className="font-medium">Günlük Check-in</span>
              </Link>
              
              <Link 
                href="/magaza" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">🛒</span>
                <span className="font-medium">Mağaza</span>
              </Link>
              
              <Link 
                href="/lonca" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">🏰</span>
                <span className="font-medium">Loncalar</span>
              </Link>
              
              <Link 
                href="/sezonlar" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">⚔️</span>
                <span className="font-medium">Sezonlar & Ligler</span>
              </Link>
              
              <div className="h-px bg-border my-2" />
              
              <Link 
                href="/ayarlar" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Ayarlar</span>
              </Link>
              
              {user?.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 rounded-lg transition-colors border border-orange-500/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-600">Admin Panel</span>
                </Link>
              )}
              
              <div className="h-px bg-border my-2" />
              
              <button 
                className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors w-full text-red-600"
                onClick={() => {
                  setMobileMenuOpen(false)
                  // Logout will be handled by LogoutButton
                }}
              >
                <LogOut className="h-5 w-5" />
                <LogoutButton asMenuItem>Çıkış Yap</LogoutButton>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
