import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { CreatePlanForm } from './create-plan-form'
import { checkPlanLimit } from '@/lib/premium-features'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function CreatePlanPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  const params = await searchParams
  const editId = params.edit

  let existingPlan = null

  if (editId) {
    existingPlan = await db.plan.findUnique({
      where: { id: editId },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' },
        },
      },
    })

    // Check if user owns this plan
    if (!existingPlan || existingPlan.authorId !== session.user.id) {
      redirect('/planlarim')
    }
  }

  // Düzenleme değilse limit kontrolü yap
  if (!editId) {
    const limitCheck = await checkPlanLimit(session.user.id)
    
    if (!limitCheck.allowed) {
      return (
        <div className="min-h-screen bg-muted/30">
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-2xl">
            <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Plan Limiti Doldu</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {limitCheck.message}
                </p>
                <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20 border border-yellow-500/20">
                  <p className="text-sm font-semibold mb-2">Premium ile:</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✅ Sınırsız plan oluşturma</li>
                    <li>✅ Sınırsız fotoğraf yükleme</li>
                    <li>✅ Reklamsız deneyim</li>
                    <li>✅ Öncelikli destek</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <Button asChild className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                    <Link href="/premium">
                      <Crown className="h-4 w-4 mr-2" />
                      Premium'a Geç
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/planlarim">
                      Planlarıma Dön
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {existingPlan ? 'Planı Düzenle 📝' : 'Yeni Plan Oluştur 📋'}
          </h1>
          <p className="text-muted-foreground">
            {existingPlan 
              ? 'Planını düzenle ve tekrar gönder'
              : 'Kendi planını oluştur, deneyimlerini paylaş, başkalarına ilham ver!'
            }
          </p>
        </div>

        <CreatePlanForm existingPlan={existingPlan} />
      </main>
    </div>
  )
}
