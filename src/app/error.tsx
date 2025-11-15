'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Bir Hata Oluştu</h1>
          <p className="text-muted-foreground">
            Üzgünüz, bir şeyler yanlış gitti. Lütfen tekrar deneyin.
          </p>
        </div>

        {error.message && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-2 justify-center">
          <Button onClick={reset}>
            Tekrar Dene
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  )
}
