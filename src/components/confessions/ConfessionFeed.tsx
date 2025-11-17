'use client'

import { useState, useEffect } from 'react'
import { ConfessionCard } from './ConfessionCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, MessageSquare, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ConfessionCategory, ConfessionWithUser } from '@/types/confession'

interface ConfessionFeedProps {
  initialConfessions?: ConfessionWithUser[]
  category?: ConfessionCategory
  popular?: boolean
  userId?: string // Kullanıcının kendi itirafları için
}

export function ConfessionFeed({
  initialConfessions = [],
  category,
  popular,
  userId
}: ConfessionFeedProps) {
  const [confessions, setConfessions] = useState<ConfessionWithUser[]>(initialConfessions)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch confessions
  const fetchConfessions = async (pageNum: number, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20'
      })

      if (category) params.append('category', category)
      if (popular) params.append('popular', 'true')
      if (userId) params.append('userId', userId)

      const response = await fetch(`/api/v1/confessions?${params}`)

      if (!response.ok) {
        throw new Error('İtiraflar yüklenemedi')
      }

      const data = await response.json()

      if (data.success && data.data) {
        const newConfessions = data.data.items || []

        if (append) {
          setConfessions((prev) => [...prev, ...newConfessions])
        } else {
          setConfessions(newConfessions)
        }

        // Check if there are more pages
        const pagination = data.data.pagination
        setHasMore(pagination && pagination.page < pagination.totalPages)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      toast.error('İtiraflar yüklenemedi', {
        description: 'Lütfen sayfayı yenileyin'
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  // Load more
  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchConfessions(nextPage, true)
  }

  // Refresh
  const refresh = () => {
    setPage(1)
    setHasMore(true)
    fetchConfessions(1, false)
  }

  // Handle empathy toggle
  const handleEmpathy = async (confessionId: string) => {
    // Optimistic update
    setConfessions((prev) =>
      prev.map((c) => {
        if (c.id === confessionId) {
          const hasEmpathized = c.hasEmpathized ?? false
          const newCount = hasEmpathized
            ? c.empathyCount - 1
            : c.empathyCount + 1

          return {
            ...c,
            hasEmpathized: !hasEmpathized,
            empathyCount: newCount,
            _count: c._count ? { ...c._count, empathies: newCount } : undefined
          }
        }
        return c
      })
    )

    // API call
    try {
      const confession = confessions.find((c) => c.id === confessionId)
      const method = confession?.hasEmpathized ? 'DELETE' : 'POST'

      const response = await fetch(`/api/v1/confessions/${confessionId}/empathy`, {
        method
      })

      if (!response.ok) {
        throw new Error('Empati güncellenemedi')
      }
    } catch (err) {
      // Revert on error
      setConfessions((prev) =>
        prev.map((c) => {
          if (c.id === confessionId) {
            const hasEmpathized = c.hasEmpathized ?? false
            const newCount = hasEmpathized
              ? c.empathyCount + 1
              : c.empathyCount - 1

            return {
              ...c,
              hasEmpathized: !hasEmpathized,
              empathyCount: newCount,
              _count: c._count ? { ...c._count, empathies: newCount } : undefined
            }
          }
          return c
        })
      )

      toast.error('Bir hata oluştu', {
        description: 'Lütfen tekrar deneyin'
      })
    }
  }

  // Handle report
  const handleReport = async (confessionId: string) => {
    // TODO: Implement report modal
    toast.info('Rapor özelliği yakında eklenecek')
  }

  // Initial load if no initial data
  useEffect(() => {
    if (initialConfessions.length === 0) {
      fetchConfessions(1, false)
    }
  }, [category, popular, userId])

  // Loading skeleton
  if (isLoading && confessions.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error && confessions.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // Empty state
  if (confessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="w-16 h-16 text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Henüz İtiraf Yok</h3>
        <p className="text-muted-foreground mb-4">
          İlk itirafı siz yapın ve topluluğa öncülük edin!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {/* Confessions List */}
      <AnimatePresence mode="popLayout">
        {confessions.map((confession) => (
          <motion.div
            key={confession.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ConfessionCard
              confession={confession}
              showAuthor={!!userId}
              onEmpathy={handleEmpathy}
              onReport={handleReport}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              'Daha Fazla Yükle'
            )}
          </Button>
        </div>
      )}

      {/* End Message */}
      {!hasMore && confessions.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Tüm itirafları gördünüz 🎉
        </p>
      )}
    </div>
  )
}
