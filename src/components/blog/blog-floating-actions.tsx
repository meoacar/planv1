'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Bookmark, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BlogFloatingActionsProps {
  postSlug: string
}

export function BlogFloatingActions({ postSlug }: BlogFloatingActionsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked)
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
      toast.success(isLiked ? 'Beğeni kaldırıldı' : 'Yazı beğenildi!')
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleSave = async () => {
    try {
      setIsSaved(!isSaved)
      toast.success(isSaved ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi!')
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link kopyalandı!')
      }
    } catch (error) {
      // User cancelled or error
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 hidden lg:flex flex-col gap-3">
      <Button
        size="lg"
        variant={isLiked ? 'default' : 'outline'}
        className={cn(
          'rounded-full w-14 h-14 shadow-lg transition-all hover:scale-110',
          isLiked && 'bg-red-500 hover:bg-red-600'
        )}
        onClick={handleLike}
      >
        <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
      </Button>

      <Button
        size="lg"
        variant={isSaved ? 'default' : 'outline'}
        className={cn(
          'rounded-full w-14 h-14 shadow-lg transition-all hover:scale-110',
          isSaved && 'bg-yellow-500 hover:bg-yellow-600'
        )}
        onClick={handleSave}
      >
        <Bookmark className={cn('w-5 h-5', isSaved && 'fill-current')} />
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="rounded-full w-14 h-14 shadow-lg transition-all hover:scale-110"
        onClick={handleShare}
      >
        <Share2 className="w-5 h-5" />
      </Button>
    </div>
  )
}
