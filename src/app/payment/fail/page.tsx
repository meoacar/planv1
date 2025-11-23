import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Navbar } from '@/components/navbar'

export default function PaymentFailPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
              Ödeme Başarısız
            </CardTitle>
            <CardDescription className="text-base">
              İşleminiz tamamlanamadı
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                Ödeme işleminiz sırasında bir hata oluştu. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Olası Nedenler:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Yetersiz bakiye</li>
                <li>• Kart bilgileri hatalı</li>
                <li>• Banka tarafından reddedildi</li>
                <li>• İşlem zaman aşımına uğradı</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/magaza/premium">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tekrar Dene
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard'a Dön
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Sorun devam ederse{' '}
                <Link href="/iletisim" className="text-primary hover:underline">
                  destek ekibimizle iletişime geçin
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
