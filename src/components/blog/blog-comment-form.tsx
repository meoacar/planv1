'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'

interface BlogCommentFormProps {
  postSlug: string
  onCommentAdded?: () => void
}

export function BlogCommentForm({ postSlug, onCommentAdded }: BlogCommentFormProps) {
  const { data: session, status } = useSession()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Lütfen bir yorum yazın')
      return
    }

    if (content.length < 10) {
      toast.error('Yorum en az 10 karakter olmalıdır')
      return
    }

    if (content.length > 1000) {
      toast.error('Yorum en fazla 1000 karakter olabilir')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`/api/blog/${postSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Yorum gönderilemedi')
      }

      toast.success('Yorumunuz moderasyon onayından sonra yayınlanacaktır')
      setContent('')
      onCommentAdded?.()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4" role="status" aria-label="Yükleniyor">
            <div className="h-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Yorum yapmak için giriş yapmalısınız
          </p>
          <Button asChild>
            <Link href="/giris" aria-label="Giriş yap sayfasına git">
              Giriş Yap
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const remainingChars = 1000 - content.length
  const isContentValid = content.trim().length >= 10 && content.trim().length <= 1000

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="comment-textarea" className="sr-only">
              Yorumunuz
            </label>
            <Textarea
              id="comment-textarea"
              placeholder="Yorumunuzu yazın..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={1000}
              disabled={submitting}
              className="resize-none"
              aria-describedby="char-count"
              aria-invalid={content.length > 0 && !isContentValid}
            />
            <div className="flex justify-between items-center mt-2">
              <span 
                id="char-count"
                className={`text-xs ${
                  remainingChars < 50 
                    ? 'text-destructive font-medium' 
                    : 'text-muted-foreground'
                }`}
                aria-live="polite"
              >
                {remainingChars} karakter kaldı
              </span>
              {content.length > 0 && content.length < 10 && (
                <span className="text-xs text-destructive">
                  En az 10 karakter gerekli
                </span>
              )}
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={submitting || !isContentValid}
            aria-label={submitting ? 'Yorum gönderiliyor' : 'Yorum gönder'}
          >
            {submitting ? 'Gönderiliyor...' : 'Yorum Yap'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
