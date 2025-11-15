'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  children?: React.ReactNode
  asMenuItem?: boolean
}

export function LogoutButton({ 
  variant = 'ghost', 
  size = 'sm',
  showIcon = false,
  children,
  asMenuItem = false
}: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (asMenuItem) {
    return (
      <span onClick={handleLogout} className="w-full">
        {children || 'Çıkış Yap'}
      </span>
    )
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleLogout}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {children || 'Çıkış Yap'}
    </Button>
  )
}
