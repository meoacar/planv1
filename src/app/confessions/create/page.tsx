import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/layout/footer'
import { ConfessionForm } from '@/components/confessions/ConfessionForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { auth } from '@/lib/auth'
import type { Metadata } from 'next'
import { ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const metadata: Metadata = {
  title: 'Yeni İtiraf | İtiraf Duvarı',
  description: 'Diyet sürecindeki deneyimlerinizi anonim olarak paylaşın',
}

export default async function CreateConfessionPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris?callbackUrl=/confessions/create')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/confessions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            İtiraf Duvarına Dön
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Yeni İtiraf 💭</h1>
          <p className="text-muted-foreground text-lg">
            Diyet sürecindeki deneyimlerinizi anonim olarak paylaşın
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-purple-200 bg-purple-50 dark:bg-purple-950/20">
          <Info className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-sm">
            <strong>Anonimlik:</strong> İtirafınız tamamen anonimdir. Kimse kim olduğunuzu bilemez. 
            Sadece siz kendi itiraflarınızı "İtiraflarım" sayfasında görebilirsiniz.
          </AlertDescription>
        </Alert>

        {/* Form Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>İtirafını Yaz</CardTitle>
            <CardDescription>
              Samimi ol, detaylı anlat. AI sana özel bir yanıt üretecek! 🤖
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <ConfessionForm userId={session.user.id} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="mt-6 border-muted">
          <CardHeader>
            <CardTitle className="text-lg">📝 İyi Bir İtiraf Nasıl Olmalı?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400">✅ İyi Örnekler:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="bg-muted/50 p-3 rounded-lg">
                  "Dün gece 23:00'te buzdolabını açtım ve yarım kutu dondurma bitirdim. 
                  Sabah kalktığımda pişman oldum ama o an çok mutluydum 😅"
                </p>
                <p className="bg-muted/50 p-3 rounded-lg">
                  "Arkadaşımın doğum gününde pasta kesmek zorunda kaldım. 
                  Herkes yedi ben de dayanamadım 🎂"
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2 text-red-600 dark:text-red-400">❌ Kötü Örnekler:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="bg-muted/50 p-3 rounded-lg line-through opacity-50">
                  "Çikolata yedim" (Çok kısa, detay yok)
                </p>
                <p className="bg-muted/50 p-3 rounded-lg line-through opacity-50">
                  "AAAAAAAAAAA" (Anlamsız içerik)
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold text-sm mb-2">💡 İpuçları:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Detaylı ve samimi ol</li>
                <li>Emoji kullanabilirsin 😊</li>
                <li>Ne zaman, nerede, neden olduğunu anlat</li>
                <li>Duygularını paylaş</li>
                <li>10-500 karakter arası olmalı</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card className="mt-6 border-muted">
          <CardHeader>
            <CardTitle className="text-lg">⚠️ Kurallar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>❌ Spam ve reklam yasaktır</p>
              <p>❌ Hakaret ve küfür yasaktır</p>
              <p>❌ Kişisel bilgi paylaşımı yasaktır</p>
              <p>❌ URL/link paylaşımı yasaktır</p>
              <p>✅ Samimi ve dürüst itiraflar paylaşın</p>
              <p>✅ Topluluk kurallarına uyun</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
