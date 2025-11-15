'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addWeightLog } from './actions'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function WeightForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const form = e.currentTarget
    const formData = new FormData(form)
    const result = await addWeightLog(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result?.success) {
      setSuccess(true)
      form.reset()
      
      // Set today's date again
      const dateInput = form.querySelector('input[type="date"]') as HTMLInputElement
      if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0]
      }
      
      // Refresh page data
      router.refresh()
      
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError('Beklenmeyen bir hata oluştu')
    }

    setLoading(false)
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
          <p className="text-sm text-green-600 dark:text-green-400">✅ Kilo kaydedildi!</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="weight">Kilo (kg) *</Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          placeholder="75.5"
          step="0.1"
          min="30"
          max="300"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Tarih</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={new Date().toISOString().split('T')[0]}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Not (opsiyonel)</Label>
        <Textarea
          id="note"
          name="note"
          placeholder="Örn: Sabah aç karnına"
          disabled={loading}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Kaydediliyor...
          </>
        ) : (
          '💾 Kaydet'
        )}
      </Button>
    </form>
  )
}
