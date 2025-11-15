import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Sayfa Bulunamadı</h2>
          <p className="text-muted-foreground">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button asChild>
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/kesfet">Planları Keşfet</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
