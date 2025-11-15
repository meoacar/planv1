'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Heart, Share2 } from 'lucide-react'
import { toast } from 'sonner'

export function LikeButton({ recipeId, isLiked, likesCount }: { recipeId: string; isLiked: boolean; likesCount: number }) {
  const [liked, setLiked] = useState(isLiked)
  const [count, setCount] = useState(likesCount)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLike = async () => {
    setLoading(true)

    try {
      const res = await fetch(`/api/v1/recipes/${recipeId}/like`, {
        method: 'POST',
      })

      const data = await res.json()

      if (data.success) {
        setLiked(data.data.liked)
        setCount((prev) => (data.data.liked ? prev + 1 : prev - 1))
        toast.success(data.data.liked ? 'Tarif beğenildi!' : 'Beğeni kaldırıldı')
        router.refresh()
      } else {
        toast.error(data.error.message)
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleLike} disabled={loading} variant={liked ? 'default' : 'outline'}>
      <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
      {liked ? 'Beğenildi' : 'Beğen'} ({count})
    </Button>
  )
}

export function CommentForm({ recipeId }: { recipeId: string }) {
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!body.trim()) {
      toast.error('Yorum boş olamaz')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/v1/recipes/${recipeId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Yorum eklendi!')
        setBody('')
        router.refresh()
      } else {
        toast.error(data.error.message)
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Yorumunuzu yazın..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !body.trim()}>
        {loading ? 'Gönderiliyor...' : 'Yorum Yap'}
      </Button>
    </form>
  )
}

export function ShareButton({ title, description }: { title: string; description: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link kopyalandı!')
    }
  }

  return (
    <Button onClick={handleShare} variant="outline">
      <Share2 className="w-4 h-4 mr-2" />
      Paylaş
    </Button>
  )
}
