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
  Coins
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
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('quest-claimed', handleQuestClaimed)
    }
  }, [refreshKey])

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-lg">
            🌟
          </div>
          <span className="hidden sm:inline">{siteName}</span>
        </Link>
        
        {/* Main Navigation */}
        <nav className="flex items-center gap-1 md:gap-2">
          <Link 
            href="/kesfet" 
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
          >
            Keşfet
          </Link>
          
          <Link 
            href="/tarifler" 
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
          >
            Tarifler
          </Link>
          
          <Link 
            href="/blog" 
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
          >
            📝 Blog
          </Link>
          
          <Link 
            href="/gruplar" 
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
          >
            👥 Gruplar
          </Link>
          
          <Link 
            href="/gunah-sayaci" 
            className="flex items-center gap-1 px-2 md:px-3 py-2 text-sm font-medium bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20 rounded-lg transition-colors border border-red-500/20"
          >
            😈 <span className="hidden sm:inline">Günah</span>
          </Link>
          
          {user && (
            <Link 
              href="/confessions" 
              className="hidden md:flex items-center gap-1 px-2 md:px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
            >
              🎭 <span className="hidden lg:inline">İtiraf</span>
            </Link>
          )}
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-2">
                  <Trophy className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
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
                <DropdownMenuSeparator />
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
                <DropdownMenuItem asChild>
                  <Link href="/lonca" className="cursor-pointer">
                    🏰
                    <span className="ml-2">Loncalar</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/sezonlar" className="cursor-pointer">
                    ⚔️
                    <span className="ml-2">Sezonlar & Ligler</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-2">
                    <Plus className="h-4 w-4" />
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

              {/* Coins & Level Display */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full border border-amber-500/20" key={`stats-${refreshKey}`}>
                <Coins className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {typeof user.coins === 'number' ? user.coins : 0}
                </span>
                <div className="w-px h-3 bg-amber-500/30 mx-0.5" />
                <Trophy className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  {typeof user.level === 'number' ? user.level : 1}
                </span>
              </div>

              {user.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  className="hidden lg:flex items-center gap-1 px-2 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-lg transition-colors"
                >
                  <Shield className="h-4 w-4" />
                </Link>
              )}

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/10">
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
                    <span className="text-sm font-medium hidden lg:block max-w-[100px] truncate">
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
  )
}
