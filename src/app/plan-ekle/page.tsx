import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/navbar'
import { CreatePlanForm } from './create-plan-form'

export default async function CreatePlanPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Yeni Plan Oluştur 📋</h1>
          <p className="text-muted-foreground">
            Kendi planını oluştur, deneyimlerini paylaş, başkalarına ilham ver!
          </p>
        </div>

        <CreatePlanForm />
      </main>
    </div>
  )
}
