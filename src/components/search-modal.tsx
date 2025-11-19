'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

type SearchResult = {
  id: string
  title: string
  type: 'plan' | 'recipe' | 'blog' | 'user' | 'group'
  url: string
  description?: string
}

type SearchModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results || [])
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    router.push(result.url)
    onOpenChange(false)
    setQuery('')
  }

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'plan': return '📋'
      case 'recipe': return '🍳'
      case 'blog': return '📝'
      case 'user': return '👤'
      case 'group': return '👥'
      default: return '🔍'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'plan': return 'Plan'
      case 'recipe': return 'Tarif'
      case 'blog': return 'Blog'
      case 'user': return 'Kullanıcı'
      case 'group': return 'Grup'
      default: return ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <VisuallyHidden>
          <DialogTitle>Arama</DialogTitle>
        </VisuallyHidden>
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Ara... (Plan, Tarif, Blog, Kullanıcı, Grup)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            autoFocus
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {!query.trim() ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Aramaya başlamak için yazmaya başlayın</p>
              <div className="mt-4 text-xs space-y-1">
                <p>💡 Plan, tarif, blog yazısı arayabilirsiniz</p>
                <p>💡 Kullanıcı ve grup arayabilirsiniz</p>
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">Sonuç bulunamadı</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full px-4 py-3 hover:bg-accent transition-colors text-left flex items-start gap-3"
                >
                  <span className="text-2xl">{getTypeEmoji(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{result.title}</p>
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    {result.description && (
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {result.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
          <span>ESC ile kapat</span>
          <span>Enter ile seç</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
