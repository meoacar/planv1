'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, AlertCircle } from 'lucide-react'
import { ConfessionCategory } from '@/types/confession'

interface ConfessionFormProps {
  userId: string
}

const CATEGORIES: { value: ConfessionCategory; label: string; emoji: string }[] = [
  { value: 'night_raids', label: 'Gece Saldırıları', emoji: '🌙' },
  { value: 'special_occasions', label: 'Özel Gün Bahaneleri', emoji: '🎂' },
  { value: 'stress_eating', label: 'Stres Yeme', emoji: '😰' },
  { value: 'social_pressure', label: 'Sosyal Baskı', emoji: '👥' },
  { value: 'no_regrets', label: 'Pişman Değilim', emoji: '😎' },
  { value: 'seasonal', label: 'Sezonluk', emoji: '🌟' },
]

export function ConfessionForm({ userId }: ConfessionFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<ConfessionCategory>('night_raids')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const characterCount = content.length
  const isValid = characterCount >= 10 && characterCount <= 500

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid) {
      setError('İtiraf 10-500 karakter arasında olmalıdır')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/v1/confessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          category,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'İtiraf oluşturulamadı')
      }

      // Success! Redirect to confessions page
      router.push('/confessions?success=true')
      router.refresh()
    } catch (err) {
      console.error('İtiraf oluşturma hatası:', err)
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">
          İtirafın <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          placeholder="Örnek: Dün gece 23:00'te buzdolabını açtım ve yarım kutu dondurma bitirdim. Sabah kalktığımda pişman oldum ama o an çok mutluydum 😅"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px] resize-none"
          maxLength={500}
          disabled={isSubmitting}
        />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Minimum 10 karakter gerekli
          </span>
          <span
            className={`font-medium ${
              characterCount < 10
                ? 'text-destructive'
                : characterCount > 450
                ? 'text-orange-500'
                : 'text-muted-foreground'
            }`}
          >
            {characterCount}/500
          </span>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">
          Kategori <span className="text-muted-foreground text-sm">(Opsiyonel)</span>
        </Label>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as ConfessionCategory)}
          disabled={isSubmitting}
        >
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.emoji} {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          AI, itirafına göre en uygun kategoriyi otomatik seçebilir
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1"
        >
          İptal
        </Button>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              İtirafı Paylaş
            </>
          )}
        </Button>
      </div>

      {/* Info */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
        <p className="font-medium">📌 Hatırlatma:</p>
        <ul className="space-y-1 text-muted-foreground list-disc list-inside">
          <li>İtirafın tamamen anonim olacak</li>
          <li>AI sana özel bir yanıt üretecek (5-10 saniye)</li>
          <li>Moderasyon sonrası yayınlanacak</li>
          <li>İlk itirafın için 10 XP + 5 coin kazanacaksın! 🎁</li>
        </ul>
      </div>
    </form>
  )
}
