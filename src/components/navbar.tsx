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
  Camera
} from 'lucide-react'

type User = {
  id: string
  name: string | null
  username: string | null
  image: string | null
  role: string
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [siteName, setSiteName] = useState('ZayiflamaPlan')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        
        if (data.user) {
          setUser(data.user)
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
  }, [])

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          🌟 {siteName}
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/kesfet" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Keşfet
          </Link>
          
          <Link 
            href="/tarifler" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Tarifler
          </Link>
          
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Ekle
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                </DropdownMenuContent>
              </DropdownMenu>

              {user.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
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
                    <span className="text-sm font-medium hidden md:block">
                      {user?.name || user?.username || 'Kullanıcı'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
                    <Link href="/mesajlar" className="cursor-pointer">
                      💬
                      <span className="ml-2">Mesajlar</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/ayarlar" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Ayarlar
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <LogoutButton asMenuItem>Çıkış Yap</LogoutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/giris">Giriş Yap</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/kayit">Kayıt Ol</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
