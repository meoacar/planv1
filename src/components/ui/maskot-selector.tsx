'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Maskot {
  id: string
  url: string
  name: string
}

interface MaskotSelectorProps {
  selectedMaskot?: string | null
  onSelect: (url: string) => void
  className?: string
}

export function MaskotSelector({ selectedMaskot, onSelect, className }: MaskotSelectorProps) {
  const [maskots, setMaskots] = useState<Maskot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMaskots() {
      try {
        const res = await fetch('/api/maskotlar')
        const data = await res.json()
        
        if (data.success) {
          setMaskots(data.data)
        } else {
          setError('Maskotlar yüklenemedi')
        }
      } catch (err) {
        setError('Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    loadMaskots()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-medium">Hazır Maskotlardan Seç:</p>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3">
        {maskots.map((maskot) => (
          <button
            key={maskot.id}
            type="button"
            onClick={() => onSelect(maskot.url)}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
              selectedMaskot === maskot.url
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-muted hover:border-primary/50"
            )}
            title={maskot.name}
          >
            <img
              src={maskot.url}
              alt={maskot.name}
              className="w-full h-full object-cover"
            />
            {selectedMaskot === maskot.url && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
