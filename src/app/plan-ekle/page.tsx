import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { CreatePlanForm } from './create-plan-form'

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
