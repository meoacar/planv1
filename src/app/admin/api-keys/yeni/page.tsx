import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NewApiKeyForm } from '@/components/admin/new-api-key-form'

export default async function NewApiKeyPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/api-keys">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Yeni API Key Oluştur</h1>
          <p className="text-muted-foreground">
            Yeni bir API anahtarı oluştur ve izinlerini belirle
          </p>
        </div>
      </div>

      <NewApiKeyForm />
    </div>
  )
}
