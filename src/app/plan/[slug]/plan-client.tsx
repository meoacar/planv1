'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toggleLike, addComment, savePlan, ratePlan, trackProgress } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Star, Bookmark, TrendingUp, ChevronLeft, ChevronRight, Calendar, Award, Flame } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PlanClientProps {
  planId: string
  isLiked: boolean
  likesCount: number
  isSaved?: boolean
  userRating?: number
  averageRating?: number
  ratingCount?: number
}

export function PlanActions({ planId, isLiked, likesCount, isSaved = false, userRating, averageRating = 0, ratingCount = 0 }: PlanClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const handleLike = async () => {
    setLoading(true)
    try {
      await toggleLike(planId)
      router.refresh()
      toast.success(isLiked ? 'Beğeni kaldırıldı' : '❤️ Beğenildi!')
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaveLoading(true)
    try {
      await savePlan(planId)
      router.refresh()
      toast.success(isSaved ? 'Favorilerden çıkarıldı' : '⭐ Favorilere eklendi!')
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleRate = async (rating: number) => {
    try {
      await ratePlan(planId, rating)
      router.refresh()
      toast.success(`${rating} yıldız verdiniz!`)
      setShowRating(false)
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Like Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          onClick={handleLike} 
          disabled={loading} 
          variant={isLiked ? 'default' : 'outline'}
          className={isLiked ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600' : ''}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <span className="mr-2">{isLiked ? '❤️' : '🤍'}</span>
          )}
          <span className="font-semibold">{likesCount}</span>
        </Button>
      </motion.div>

      {/* Save Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          onClick={handleSave} 
          disabled={saveLoading}
          variant={isSaved ? 'default' : 'outline'}
          className={isSaved ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : ''}
        >
          {saveLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
          )}
          {isSaved ? 'Kaydedildi' : 'Kaydet'}
        </Button>
      </motion.div>

      {/* Rating Button */}
      <div className="relative">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => setShowRating(!showRating)}
            variant="outline"
            className="gap-2"
          >
            <Star className={`h-4 w-4 ${userRating ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({ratingCount})</span>
          </Button>
        </motion.div>

        {/* Rating Dropdown */}
        <AnimatePresence>
          {showRating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 left-0 bg-card border rounded-lg shadow-lg p-4 z-50 min-w-[200px]"
            >
              <p className="text-sm font-medium mb-3">Bu planı değerlendir</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (hoveredStar || userRating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {userRating && (
                <p className="text-xs text-muted-foreground mt-2">
                  Mevcut puanınız: {userRating} ⭐
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
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
  const [showMenu, setShowMenu] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
        setShowMenu(false)
      } catch (error) {
        // User cancelled or error occurred
      }
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    toast.success('Link kopyalandı!')
    setShowMenu(false)
  }

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(fbUrl, '_blank', 'width=600,height=400')
    setShowMenu(false)
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
    setShowMenu(false)
  }

  const shareToWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`
    window.open(waUrl, '_blank')
    setShowMenu(false)
  }

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedInUrl, '_blank', 'width=600,height=400')
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setShowMenu(!showMenu)}>
        📤 Paylaş
      </Button>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)}
            />
            
            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 bg-card border rounded-xl shadow-xl p-2 z-50 min-w-[240px]"
            >
              <div className="space-y-1">
                {/* Native Share (Mobile) */}
                {typeof navigator !== 'undefined' && navigator.share && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                      📤
                    </div>
                    <div>
                      <p className="font-medium text-sm">Paylaş</p>
                      <p className="text-xs text-muted-foreground">Sistem paylaşım menüsü</p>
                    </div>
                  </button>
                )}

                {/* Facebook */}
                <button
                  onClick={shareToFacebook}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-xl">
                    f
                  </div>
                  <div>
                    <p className="font-medium text-sm">Facebook</p>
                    <p className="text-xs text-muted-foreground">Facebook'ta paylaş</p>
                  </div>
                </button>

                {/* Twitter */}
                <button
                  onClick={shareToTwitter}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white text-xl">
                    𝕏
                  </div>
                  <div>
                    <p className="font-medium text-sm">Twitter / X</p>
                    <p className="text-xs text-muted-foreground">Twitter'da paylaş</p>
                  </div>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={shareToWhatsApp}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white text-xl">
                    💬
                  </div>
                  <div>
                    <p className="font-medium text-sm">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">WhatsApp'ta paylaş</p>
                  </div>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={shareToLinkedIn}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xl">
                    in
                  </div>
                  <div>
                    <p className="font-medium text-sm">LinkedIn</p>
                    <p className="text-xs text-muted-foreground">LinkedIn'de paylaş</p>
                  </div>
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left border-t"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-xl">
                    🔗
                  </div>
                  <div>
                    <p className="font-medium text-sm">Linki Kopyala</p>
                    <p className="text-xs text-muted-foreground">Panoya kopyala</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Progress Tracker Component
interface ProgressTrackerProps {
  planId: string
  duration: number
  currentDay?: number
}

export function ProgressTracker({ planId, duration, currentDay = 0 }: ProgressTrackerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const progress = (currentDay / duration) * 100

  const handleDayComplete = async (day: number) => {
    setLoading(true)
    try {
      await trackProgress(planId, day)
      router.refresh()
      toast.success(`${day}. gün tamamlandı! 🎉`)
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">İlerleme Takibi</h3>
            <p className="text-sm text-muted-foreground">
              {currentDay} / {duration} gün tamamlandı
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            %{Math.round(progress)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"
        />
      </div>

      {currentDay < duration && (
        <Button
          onClick={() => handleDayComplete(currentDay + 1)}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Calendar className="h-4 w-4 mr-2" />
          )}
          {currentDay + 1}. Günü Tamamla
        </Button>
      )}

      {currentDay === duration && (
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border-2 border-green-300 dark:border-green-700">
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-bold text-green-700 dark:text-green-300">
            Tebrikler! Planı tamamladınız!
          </p>
        </div>
      )}
    </motion.div>
  )
}

// Stats Card Component
interface StatsCardProps {
  views: number
  likes: number
  comments: number
  saves: number
}

export function StatsCard({ views, likes, comments, saves }: StatsCardProps) {
  const stats = [
    { icon: '👁️', label: 'Görüntülenme', value: views, color: 'from-blue-500 to-cyan-500' },
    { icon: '❤️', label: 'Beğeni', value: likes, color: 'from-pink-500 to-rose-500' },
    { icon: '💬', label: 'Yorum', value: comments, color: 'from-purple-500 to-indigo-500' },
    { icon: '⭐', label: 'Kayıt', value: saves, color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          <div className="bg-card border rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
            <div className="relative">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-bold mb-1">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
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
  planId: string
  userProgress?: number
}

export function DailyMenuViewer({ days, duration, planId, userProgress = 0 }: DailyMenuViewerProps) {
  // Always start from day 1, not from userProgress
  const [activeDay, setActiveDay] = useState(1)
  const [direction, setDirection] = useState(0)
  
  // Find current day, fallback to first day if not found
  const currentDay = days.find(d => d.dayNumber === activeDay) || days[0]

  const handleDayChange = (newDay: number) => {
    // Check if the day exists in the days array
    const dayExists = days.some(d => d.dayNumber === newDay)
    if (!dayExists || newDay < 1) return
    
    setDirection(newDay > activeDay ? 1 : -1)
    setActiveDay(newDay)
    
    // Scroll to active day button
    setTimeout(() => {
      const activeButton = document.querySelector(`[data-day="${newDay}"]`)
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }, 100)
  }

  // Auto scroll to active day on mount
  useEffect(() => {
    const activeButton = document.querySelector(`[data-day="${activeDay}"]`)
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [])

  const meals = [
    { 
      key: 'breakfast', 
      label: 'Kahvaltı', 
      icon: '🍳', 
      value: currentDay?.breakfast,
      bgClass: 'bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-slate-900',
      borderClass: 'border-2 border-orange-200 dark:border-orange-800',
      iconBgClass: 'bg-gradient-to-br from-orange-400 to-orange-600',
      titleClass: 'text-orange-700 dark:text-orange-300'
    },
    { 
      key: 'snack1', 
      label: 'Ara Öğün 1', 
      icon: '🥜', 
      value: currentDay?.snack1,
      bgClass: 'bg-gradient-to-r from-green-50 to-white dark:from-green-950/20 dark:to-slate-900',
      borderClass: 'border-2 border-green-200 dark:border-green-800',
      iconBgClass: 'bg-gradient-to-br from-green-400 to-green-600',
      titleClass: 'text-green-700 dark:text-green-300'
    },
    { 
      key: 'lunch', 
      label: 'Öğle Yemeği', 
      icon: '🍽️', 
      value: currentDay?.lunch,
      bgClass: 'bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900',
      borderClass: 'border-2 border-blue-200 dark:border-blue-800',
      iconBgClass: 'bg-gradient-to-br from-blue-400 to-blue-600',
      titleClass: 'text-blue-700 dark:text-blue-300'
    },
    { 
      key: 'snack2', 
      label: 'Ara Öğün 2', 
      icon: '🍎', 
      value: currentDay?.snack2,
      bgClass: 'bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900',
      borderClass: 'border-2 border-purple-200 dark:border-purple-800',
      iconBgClass: 'bg-gradient-to-br from-purple-400 to-purple-600',
      titleClass: 'text-purple-700 dark:text-purple-300'
    },
    { 
      key: 'dinner', 
      label: 'Akşam Yemeği', 
      icon: '🌙', 
      value: currentDay?.dinner,
      bgClass: 'bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900',
      borderClass: 'border-2 border-indigo-200 dark:border-indigo-800',
      iconBgClass: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      titleClass: 'text-indigo-700 dark:text-indigo-300'
    },
  ]

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950/30 rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Günlük Menüler</h2>
              <p className="text-blue-100">
                {duration} günlük detaylı beslenme programı
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{activeDay}</div>
              <div className="text-sm text-blue-100">/ {duration} gün</div>
            </div>
          </div>
        </div>

        {/* Day Navigation */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b sticky top-0 z-20">
          <div className="flex items-center gap-2 p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const prevDay = days.find(d => d.dayNumber < activeDay && d.dayNumber === Math.max(...days.filter(d => d.dayNumber < activeDay).map(d => d.dayNumber)))
                if (prevDay) handleDayChange(prevDay.dayNumber)
              }}
              disabled={!days.some(d => d.dayNumber < activeDay)}
              className="flex-shrink-0 h-10 w-10 p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div 
              className="flex-1 overflow-x-auto scrollbar-hide touch-pan-x snap-x snap-mandatory"
              style={{ 
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="flex gap-2 px-2" style={{ minWidth: 'max-content' }}>
                {days.map((day) => (
                  <motion.button
                    key={day.id}
                    data-day={day.dayNumber}
                    onClick={() => handleDayChange(day.dayNumber)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-w-[80px] snap-center ${
                      activeDay === day.dayNumber
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {day.dayNumber <= userProgress && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs shadow-md">
                        ✓
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                      <span className="text-xs opacity-75">Gün</span>
                      <span className="text-lg font-bold">{day.dayNumber}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const nextDay = days.find(d => d.dayNumber > activeDay && d.dayNumber === Math.min(...days.filter(d => d.dayNumber > activeDay).map(d => d.dayNumber)))
                if (nextDay) handleDayChange(nextDay.dayNumber)
              }}
              disabled={!days.some(d => d.dayNumber > activeDay)}
              className="flex-shrink-0 h-10 w-10 p-0"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Day Content with Animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeDay}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {currentDay ? (
              <div className="space-y-4">
                {meals.map((meal, index) => 
                  meal.value && (
                    <motion.div
                      key={meal.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`group relative ${meal.bgClass} ${meal.borderClass} rounded-xl p-5 hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${meal.iconBgClass} flex items-center justify-center text-2xl shadow-lg`}>
                          {meal.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg mb-2 ${meal.titleClass}`}>
                            {meal.label}
                          </h3>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                            {meal.value}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}

                {currentDay.notes && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💡</div>
                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                          Günün Notları
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-wrap leading-relaxed">
                          {currentDay.notes}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Bu gün için menü eklenmemiş
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="bg-slate-100 dark:bg-slate-900 p-4 border-t flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const prevDay = days.find(d => d.dayNumber < activeDay && d.dayNumber === Math.max(...days.filter(d => d.dayNumber < activeDay).map(d => d.dayNumber)))
              if (prevDay) handleDayChange(prevDay.dayNumber)
            }}
            disabled={!days.some(d => d.dayNumber < activeDay)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Önceki Gün
          </Button>

          <div className="text-sm text-muted-foreground">
            {activeDay}. Gün / {duration} Gün
          </div>

          <Button
            variant="outline"
            onClick={() => {
              const nextDay = days.find(d => d.dayNumber > activeDay && d.dayNumber === Math.min(...days.filter(d => d.dayNumber > activeDay).map(d => d.dayNumber)))
              if (nextDay) handleDayChange(nextDay.dayNumber)
            }}
            disabled={!days.some(d => d.dayNumber > activeDay)}
            className="gap-2"
          >
            Sonraki Gün
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
