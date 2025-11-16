import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export default async function MyPlansPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  // Fetch user's plans
  const plans = await db.plan.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const publishedPlans = plans.filter(p => p.status === 'published')
  const pendingPlans = plans.filter(p => p.status === 'pending')
  const draftPlans = plans.filter(p => p.status === 'draft')
  const rejectedPlans = plans.filter(p => p.status === 'rejected')

  const statusLabels = {
    published: 'Yayında',
    pending: 'Onay Bekliyor',
    draft: 'Taslak',
    rejected: 'Reddedildi',
  }

  const statusColors = {
    published: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Planlarım 📋</h1>
            <p className="text-muted-foreground">
              Oluşturduğun ve paylaştığın planlar
            </p>
          </div>
          <Button asChild>
            <Link href="/plan-ekle">+ Yeni Plan Oluştur</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{plans.length}</div>
              <div className="text-sm text-muted-foreground">Toplam Plan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{publishedPlans.length}</div>
              <div className="text-sm text-muted-foreground">Yayında</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{pendingPlans.length}</div>
              <div className="text-sm text-muted-foreground">Onay Bekliyor</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-600">{draftPlans.length}</div>
              <div className="text-sm text-muted-foreground">Taslak</div>
            </CardContent>
          </Card>
        </div>

        {/* Plans List */}
        {plans.length > 0 ? (
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded ${statusColors[plan.status]}`}>
                          {statusLabels[plan.status]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true, locale: tr })}
                        </span>
                      </div>
                      <Link href={`/plan/${plan.slug}`}>
                        <CardTitle className="text-xl mb-2 hover:text-primary transition-colors cursor-pointer">
                          {plan.title}
                        </CardTitle>
                      </Link>
                      <CardDescription className="line-clamp-2">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {plan.status === 'published' && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/plan/${plan.slug}`}>Görüntüle</Link>
                        </Button>
                      )}
                      {plan.status === 'rejected' && (
                        <>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/plan/${plan.slug}`}>İtiraz Et</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/plan-ekle?edit=${plan.id}`}>Düzenle</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                    <span>⏱️ {plan.duration} gün</span>
                    {plan.targetWeightLoss && (
                      <span>🎯 {plan.targetWeightLoss}kg</span>
                    )}
                    {plan.status === 'published' && (
                      <>
                        <span>❤️ {plan.likesCount} beğeni</span>
                        <span>💬 {plan.commentsCount} yorum</span>
                        <span>👁️ {plan.views} görüntülenme</span>
                      </>
                    )}
                    {plan.status === 'pending' && (
                      <span className="text-yellow-600">⏳ Admin onayı bekleniyor (genellikle 24 saat içinde)</span>
                    )}
                    {plan.status === 'draft' && (
                      <span className="text-gray-600">📝 Taslak - Yayınlamak için admin panelinden onaylayın</span>
                    )}
                    {plan.status === 'rejected' && (
                      <span className="text-red-600">❌ Reddedildi - Düzenleyip tekrar gönderebilirsiniz</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Henüz plan yok</h3>
              <p className="text-muted-foreground mb-6">
                İlk planını oluştur, deneyimlerini paylaş!
              </p>
              <Button asChild>
                <Link href="/plan-ekle">İlk Planı Oluştur</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
