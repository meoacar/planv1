'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { BlogComment } from '@/types/blog'

interface BlogCommentsProps {
  postSlug: string
  initialCount: number
}

export function BlogComments({ postSlug, initialCount }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/blog/${postSlug}/comments`)
      if (!res.ok) {
        throw new Error('Yorumlar yüklenemedi')
      }
      const data = await res.json()
      setComments(data.data || [])
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      setError('Yorumlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchComments}
            className="ml-4"
            aria-label="Yorumları yeniden yükle"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tekrar Dene
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4" role="status" aria-label="Yorumlar yükleniyor">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Empty state
  if (comments.length === 0) {
    return (
      <div 
        className="text-center py-8 text-muted-foreground"
        role="status"
        aria-label="Henüz yorum yok"
      >
        <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4" aria-live="polite">
        {initialCount} yorum
      </p>
      <div role="list" aria-label="Yorumlar">
        {comments.map((comment) => (
          <Card key={comment.id} role="listitem">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage 
                    src={comment.user.image || undefined}
                    alt={`${comment.user.name || comment.user.username} profil fotoğrafı`}
                  />
                  <AvatarFallback>
                    {comment.user.name?.[0] || comment.user.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {comment.user.name || comment.user.username}
                    </span>
                    <time 
                      className="text-xs text-muted-foreground"
                      dateTime={new Date(comment.createdAt).toISOString()}
                    >
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </time>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
