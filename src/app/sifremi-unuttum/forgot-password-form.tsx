'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { sendPasswordResetEmail } from './actions'
import { Loader2 } from 'lucide-react'

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const formData = new FormData(e.currentTarget)
      const result = await sendPasswordResetEmail(formData)

      if ('error' in result && result.error) {
        setError(result.error)
      } else if ('success' in result && result.success) {
        setMessage(result.message || 'Email gönderildi')
        // Clear form
        e.currentTarget.reset()
      }
    } catch (error) {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {message && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm text-green-600">{message}</p>
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          'Sıfırlama Linki Gönder'
        )}
      </Button>

      <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Geliştirme Modu:</strong> Email gönderimi henüz yapılandırılmadı. 
          Şifre sıfırlama token'ı console'da görünecek.
        </p>
      </div>
    </form>
  )
}
