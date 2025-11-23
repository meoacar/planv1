import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Sparkles, Zap, Check, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription'

export default async function PremiumPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/giris')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      isPremium: true,
      premiumUntil: true,
      premiumType: true,
      subscriptions: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  })

  const premiumFeatures = await db.premiumFeature.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })

  const isPremium = user?.isPremium && user.premiumUntil && new Date() < user.premiumUntil

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-12 w-12 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Premium Üyelik
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {isPremium 
            ? 'Premium üyeliğinizin tüm ayrıcalıklarından yararlanın'
            : 'Premium üye olun, tüm özelliklerin kilidini açın'}
        </p>
      </div>

      {/* Premium Status */}
      {isPremium ? (
        <Card className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    Premium Üye
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Aktif
                    </Badge>
                  </CardTitle>
                  <CardDescription>Tüm premium özelliklere erişiminiz var</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Premium Tipi</span>
                </div>
                <p className="font-semibold text-lg">
                  {user.premiumType === 'monthly' && '📅 Aylık'}
                  {user.premiumType === 'yearly' && '📆 Yıllık'}
                  {user.premiumType === 'lifetime' && '♾️ Ömür Boyu'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Bitiş Tarihi</span>
                </div>
                <p className="font-semibold text-lg">
                  {user.premiumUntil 
                    ? new Date(user.premiumUntil).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Sınırsız'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Zap className="h-4 w-4" />
                  <span>Kalan Süre</span>
                </div>
                <p className="font-semibold text-lg text-green-600 dark:text-green-400">
                  {user.premiumUntil 
                    ? `${Math.ceil((new Date(user.premiumUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} gün`
                    : 'Sınırsız'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="text-center">Premium Üye Değilsiniz</CardTitle>
            <CardDescription className="text-center">
              Premium üye olarak tüm özelliklerin kilidini açın
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Premium Features */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          Premium Özellikler
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {premiumFeatures.map((feature) => (
            <Card key={feature.id} className={isPremium ? 'border-green-500/50' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isPremium ? 'bg-green-500/10' : 'bg-muted'
                  }`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{feature.name}</h3>
                      {isPremium && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Aktif
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Premium Plans */}
      {!isPremium && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Premium Paketleri</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
              <Card key={plan.type} className={plan.type === 'yearly' ? 'border-2 border-yellow-500 relative' : ''}>
                {plan.type === 'yearly' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      En Popüler
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center">{plan.name}</CardTitle>
                  <div className="text-center">
                    <span className="text-4xl font-bold">{plan.price} ₺</span>
                    <span className="text-muted-foreground">/{plan.duration} gün</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    asChild
                  >
                    <Link href="/magaza/premium">
                      Premium Ol
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
