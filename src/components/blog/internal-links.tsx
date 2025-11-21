'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, TrendingUp, BookOpen, Tag } from 'lucide-react'

interface InternalLink {
  id: string
  title: string
  slug: string
  category?: {
    name: string
    slug: string
  }
  excerpt?: string | null
}

interface InternalLinksProps {
  currentPostId?: string
  categorySlug?: string
  limit?: number
  title?: string
  showInContent?: boolean
}

export function InternalLinks({ 
  currentPostId, 
  categorySlug, 
  limit = 5,
  title = "İlgili İçerikler",
  showInContent = false
}: InternalLinksProps) {
  const [links, setLinks] = useState<InternalLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLinks() {
      try {
        const params = new URLSearchParams({
          limit: limit.toString()
        })
        
        if (currentPostId) {
          params.append('exclude', currentPostId)
        }
        
        if (categorySlug) {
          params.append('category', categorySlug)
        }

        const response = await fetch(`/api/blog/internal-links?${params}`)
        if (response.ok) {
          const data = await response.json()
          setLinks(data.links || [])
        }
      } catch (error) {
        console.error('İç linkler yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [currentPostId, categorySlug, limit])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (links.length === 0) {
    return null
  }

  // İçerik içi gösterim (daha kompakt)
  if (showInContent) {
    return (
      <div className="my-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-lg">📚 Bunları da Okumak İsteyebilirsiniz</h3>
        </div>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.id}>
              <Link 
                href={`/blog/${link.slug}`}
                className="flex items-start gap-2 group hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                <div>
                  <span className="font-medium">{link.title}</span>
                  {link.category && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {link.category.name}
                    </Badge>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Sidebar gösterimi
  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.id}>
              <Link 
                href={`/blog/${link.slug}`}
                className="group block"
              >
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  <div className="flex-1">
                    <p className="text-sm font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {link.title}
                    </p>
                    {link.category && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {link.category.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Kategori bazlı iç linkler
export function CategoryInternalLinks({ categorySlug, currentPostId }: { categorySlug: string, currentPostId?: string }) {
  return (
    <InternalLinks 
      categorySlug={categorySlug}
      currentPostId={currentPostId}
      title="Bu Kategoriden Diğer Yazılar"
      limit={5}
    />
  )
}

// Popüler içerikler
export function PopularInternalLinks({ currentPostId }: { currentPostId?: string }) {
  return (
    <InternalLinks 
      currentPostId={currentPostId}
      title="🔥 Popüler İçerikler"
      limit={5}
    />
  )
}
