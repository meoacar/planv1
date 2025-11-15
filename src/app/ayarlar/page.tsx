import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { SettingsClient } from './settings-client'
import { Toaster } from '@/components/ui/sonner'

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/giris')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      username: true,
      bio: true,
      image: true,
      height: true,
      currentWeight: true,
      targetWeight: true,
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-4xl">⚙️</span>
            Ayarlar
          </h1>
          <p className="text-muted-foreground">
            Hesap ve profil ayarlarını yönet
          </p>
        </div>

        <SettingsClient user={user || {}} />
      </main>
      <Toaster />
    </div>
  )
}
