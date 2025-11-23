'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface PremiumWidgetProps {
  isPremium: boolean
  premiumUntil?: Date | null
  premiumType?: string | null
}

export function PremiumWidget({ isPremium, premiumUntil, premiumType }: PremiumWidgetProps) {
  const isActive = isPremium && premiumUntil && new Date() < premiumUntil
  const daysLeft = premiumUntil 
    ? Math.ceil((new Date(premiumUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  if (isActive) {
    return (
      <Card className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Premium Üye
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Aktif
                  </Badge>
                </CardTitle>
                <CardDescription>Tüm özelliklere erişim</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
              <p className="text-xs text-muted-foreground">Premium Tipi</p>
              <p className="font-semibold">
                {premiumType === 'monthly' && '📅 Aylık'}
                {premiumType === 'yearly' && '📆 Yıllık'}
                {premiumType === 'lifetime' && '♾️ Ömür Boyu'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
              <p className="text-xs text-muted-foreground">Kalan Süre</p>
              <p className="font-semibold text-green-600 dark:text-green-400">
                {daysLeft > 0 ? `${daysLeft} gün` : 'Sınırsız'}
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/premium">
              Detayları Gör
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-dashed">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          <div>
            <CardTitle className="text-lg">Premium'a Geç</CardTitle>
            <CardDescription>Tüm özelliklerin kilidini aç</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>2x XP Kazancı</span>
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Reklamsız Deneyim</span>
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Özel Rozetler</span>
          </li>
        </ul>
        <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" asChild>
          <Link href="/premium">
            Premium Ol
            <Crown className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
