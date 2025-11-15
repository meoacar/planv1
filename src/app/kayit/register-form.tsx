'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerAction } from './actions'
import { Loader2 } from 'lucide-react'
import { MaskotSelector } from '@/components/ui/maskot-selector'

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedMaskot, setSelectedMaskot] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Add selected maskot if any
      if (selectedMaskot) {
        formData.set('image', selectedMaskot)
      }
      
      const result = await registerAction(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (error) {
      // redirect() throws error, which is expected
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        // Success - redirect is happening
        setSuccess(true)
        return
      }
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✅ Kayıt başarılı! Hoş geldin! Yönlendiriliyorsunuz...
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="ornek@email.com"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="En az 6 karakter"
            required
            disabled={loading}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            disabled={loading}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Kullanıcı Adı (opsiyonel)</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="kullanici_adi"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Profil Resmi (opsiyonel)</Label>
        <div className="p-4 bg-muted/30 rounded-lg border">
          <MaskotSelector
            selectedMaskot={selectedMaskot}
            onSelect={setSelectedMaskot}
          />
          {selectedMaskot && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <span>✓</span>
              <span>Maskot seçildi</span>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Kayıt yapılıyor...
          </>
        ) : (
          'Kayıt Ol'
        )}
      </Button>
    </form>
  )
}
