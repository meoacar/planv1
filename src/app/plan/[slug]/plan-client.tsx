'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toggleLike, addComment } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface PlanClientProps {
  planId: string
  isLiked: boolean
  likesCount: number
}

export function LikeButton({ planId, isLiked, likesCount }: PlanClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    setLoading(true)
    try {
      await toggleLike(planId)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleLike} disabled={loading} variant={isLiked ? 'default' : 'outline'}>
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <span className="mr-2">{isLiked ? '❤️' : '🤍'}</span>
      )}
      Beğen ({likesCount})
    </Button>
  )
}

interface CommentFormProps {
  planId: string
}

export function CommentForm({ planId }: CommentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      toast.error('Yorum boş olamaz')
      return
    }

    setLoading(true)
    try {
      await addComment(planId, comment)
      setComment('')
      toast.success('Yorumunuz gönderildi! Admin onayından sonra görünecek.')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="Yorumunuzu yazın..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={loading}
      />
      <Button type="submit" disabled={loading}>
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Gönderiliyor...</> : 'Yorum Yap'}
      </Button>
    </form>
  )
}

interface ShareButtonProps {
  title: string
  description: string
}

export function ShareButton({ title, description }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link kopyalandı!')
    }
  }

  return (
    <Button variant="outline" onClick={handleShare}>
      📤 Paylaş
    </Button>
  )
}

interface Day {
  id: string
  dayNumber: number
  breakfast: string | null
  snack1: string | null
  lunch: string | null
  snack2: string | null
  dinner: string | null
  notes: string | null
}

interface DailyMenuViewerProps {
  days: Day[]
  duration: number
}

export function DailyMenuViewer({ days, duration }: DailyMenuViewerProps) {
  const [activeDay, setActiveDay] = useState(1)
  
  const currentDay = days.find(d => d.dayNumber === activeDay) || days[0]

  return (
    <div className="mb-8">
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Günlük Menüler</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {duration} günlük detaylı menü planı
          </p>
        </div>

        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-10 bg-card border-b">
          <div className="overflow-x-auto">
            <div className="flex gap-1 p-2 min-w-max">
              {days.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.dayNumber)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeDay === day.dayNumber
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {day.dayNumber}. Gün
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Day Content */}
        <div className="p-6">
          {currentDay ? (
            <div className="space-y-4">
              {currentDay.breakfast && (
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-semibold text-sm text-orange-700 dark:text-orange-400 mb-1">
                    🍳 Kahvaltı
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {currentDay.breakfast}
                  </p>
                </div>
              )}

              {currentDay.snack1 && (
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold text-sm text-green-700 dark:text-green-400 mb-1">
                    🥜 Ara Öğün 1
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {currentDay.snack1}
                  </p>
                </div>
              )}

              {currentDay.lunch && (
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold text-sm text-blue-700 dark:text-blue-400 mb-1">
                    🍽️ Öğle Yemeği
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {currentDay.lunch}
                  </p>
                </div>
              )}

              {currentDay.snack2 && (
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-semibold text-sm text-purple-700 dark:text-purple-400 mb-1">
                    🍎 Ara Öğün 2
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {currentDay.snack2}
                  </p>
                </div>
              )}

              {currentDay.dinner && (
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="font-semibold text-sm text-indigo-700 dark:text-indigo-400 mb-1">
                    🌙 Akşam Yemeği
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {currentDay.dinner}
                  </p>
                </div>
              )}

              {currentDay.notes && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">💡 Notlar</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {currentDay.notes}
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 border-t">
                {activeDay > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveDay(activeDay - 1)}
                  >
                    ← Önceki Gün
                  </Button>
                )}
                {activeDay < days.length && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveDay(activeDay + 1)}
                    className="ml-auto"
                  >
                    Sonraki Gün →
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Bu gün için menü eklenmemiş
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
