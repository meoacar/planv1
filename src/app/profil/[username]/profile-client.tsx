'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toggleFollowAction } from './actions'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FollowButtonProps {
  targetUserId: string
  initialIsFollowing: boolean
  isOwnProfile: boolean
}

export function FollowButton({ targetUserId, initialIsFollowing, isOwnProfile }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (isOwnProfile) {
    return null
  }

  const handleFollow = async () => {
    setLoading(true)
    try {
      const result = await toggleFollowAction(targetUserId)
      
      if (result.error) {
        alert(result.error)
      } else if (result.success) {
        setIsFollowing(result.isFollowing)
        router.refresh()
      }
    } catch (error) {
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleFollow} disabled={loading} variant={isFollowing ? 'outline' : 'default'}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          İşleniyor...
        </>
      ) : isFollowing ? (
        'Takipten Çık'
      ) : (
        'Takip Et'
      )}
    </Button>
  )
}

interface MessageButtonProps {
  userId: string
  username: string
  isOwnProfile: boolean
}

export function MessageButton({ userId, username, isOwnProfile }: MessageButtonProps) {
  const router = useRouter()
  
  if (isOwnProfile) {
    return null
  }

  const handleMessage = () => {
    // Redirect to messages page with userId as query param
    router.push(`/mesajlar?userId=${userId}`)
  }

  return (
    <Button variant="outline" onClick={handleMessage}>
      💬 Mesaj Gönder
    </Button>
  )
}
