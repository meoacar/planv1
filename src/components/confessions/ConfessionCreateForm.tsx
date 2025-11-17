'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ConfessionCategory, Confession } from '@/types/confession'

// Validation schema
const confessionSchema = z.object({
  content: z
    .string()
    .min(10, 'İtiraf en az 10 karakter olmalıdır')
    .max(500, 'İtiraf en fazla 500 karakter olabilir'),
  category: z.nativeEnum(ConfessionCategory).optional()
})

type ConfessionFormData = z.infer<typeof confessionSchema>

interface ConfessionCreateFormProps {
  onSuccess?: (confession: Confession) => void
  dailyLimit?: number
  remainingConfessions?: number
}

const categoryOptions = [
  { value: 'night_attack', label: '🌙 Gece Saldırısı', emoji: '🌙' },
  { value: 'special_occasion', label: '🎉 Özel Gün', emoji: '🎉' },
  { value: 'stress_eating', label: '😰 Stres Yeme', emoji: '😰' },
  { value: 'social_pressure', label: '👥 Sosyal Baskı', emoji: '👥' },
  { value: 'no_regrets', label: '😎 Pişman Değilim', emoji: '😎' },
  { value: 'seasonal', label: '🎊 Sezonluk', emoji: '🎊' }
]

// Emoji picker (basit versiyon)
const quickEmojis = ['😅', '😭', '🍕', '🍰', '🍔', '🍟', '🍫', '🍪', '🥤', '🍦']

export function ConfessionCreateForm({
  onSuccess,
  dailyLimit = 3,
  remainingConfessions = 3
}: ConfessionCreateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ConfessionFormData>({
    resolver: zodResolver(confessionSchema),
    defaultValues: {
      content: '',
      category: undefined
    }
  })

  const content = watch('content')
  const charCount = content?.length || 0
  const isAtLimit = remainingConfessions <= 0

  // Emoji ekleme
  const addEmoji = (emoji: string) => {
    const currentContent = content || ''
    setValue('content', currentContent + emoji)
  }

  const onSubmit = async (data: ConfessionFormData) => {
    if (isAtLimit) {
      toast.error('Günlük itiraf limitine ulaştınız', {
        description: `Günde maksimum ${dailyLimit} itiraf yapabilirsiniz`
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/v1/confessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'İtiraf gönderilemedi')
      }

      const result = await response.json()

      // Success animation
      setShowSuccess(true)

      // Confetti effect (toast ile)
      toast.success('İtiraf başarıyla paylaşıldı! 🎉', {
        description: '+10 XP ve +5 coin kazandınız!',
        duration: 5000
      })

      // Form reset
      reset()

      // Callback
      if (onSuccess && result.data) {
        setTimeout(() => {
          onSuccess(result.data.confession)
          setShowSuccess(false)
        }, 2000)
      }
    } catch (error) {
      toast.error('Bir hata oluştu', {
        description: error instanceof Error ? error.message : 'Lütfen tekrar deneyin'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Yeni İtiraf
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 0.6 }}
                className="text-6xl mb-4"
              >
                ✨
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">İtiraf Paylaşıldı!</h3>
              <p className="text-muted-foreground text-center">
                AI yanıtınız hazırlanıyor...
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Günlük Limit Uyarısı */}
              {remainingConfessions <= 1 && (
                <Alert variant={isAtLimit ? 'destructive' : 'default'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {isAtLimit
                      ? `Günlük itiraf limitine ulaştınız (${dailyLimit}/${dailyLimit})`
                      : `Bugün ${remainingConfessions} itiraf hakkınız kaldı`}
                  </AlertDescription>
                </Alert>
              )}

              {/* İtiraf Metni */}
              <div className="space-y-2">
                <Label htmlFor="content">İtirafınız</Label>
                <Textarea
                  id="content"
                  placeholder="Bugün ne yaptınız? Paylaşın, rahatla yın..."
                  className="min-h-[150px] resize-none"
                  disabled={isSubmitting || isAtLimit}
                  {...register('content')}
                />
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={`${
                      charCount < 10
                        ? 'text-red-500'
                        : charCount > 500
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {charCount}/500 karakter
                  </span>
                  {charCount < 10 && (
                    <span className="text-red-500">En az 10 karakter gerekli</span>
                  )}
                </div>
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content.message}</p>
                )}
              </div>

              {/* Emoji Picker */}
              <div className="space-y-2">
                <Label>Hızlı Emoji</Label>
                <div className="flex flex-wrap gap-2">
                  {quickEmojis.map((emoji) => (
                    <Button
                      key={emoji}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addEmoji(emoji)}
                      disabled={isSubmitting || isAtLimit}
                      className="text-lg"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Kategori Seçimi (Opsiyonel) */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Kategori <span className="text-muted-foreground">(opsiyonel)</span>
                </Label>
                <Select
                  disabled={isSubmitting || isAtLimit}
                  onValueChange={(value) =>
                    setValue('category', value as ConfessionCategory)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="AI otomatik belirleyecek" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Boş bırakırsanız AI otomatik olarak kategori belirleyecek
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isAtLimit || charCount < 10 || charCount > 500}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    AI Yanıt Hazırlanıyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    İtiraf Et
                  </>
                )}
              </Button>

              {/* Bilgilendirme */}
              <p className="text-xs text-center text-muted-foreground">
                İtirafınız anonim olarak paylaşılacak. +10 XP ve +5 coin kazanacaksınız.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
