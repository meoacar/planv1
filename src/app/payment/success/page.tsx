import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
              Ödeme Başarılı! 🎉
            </CardTitle>
            <CardDescription className="text-base">
              Premium özellikleriniz aktif edildi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                Siparişiniz başarıyla tamamlandı. Premium özelliklerden hemen yararlanmaya başlayabilirsiniz!
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Premium Özellikler:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Tüm özelliklere sınırsız erişim
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Özel rozetler ve avatarlar
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Reklamsız deneyim
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Öncelikli destek
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  Dashboard'a Git
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/magaza/premium">
                  Mağazaya Dön
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
