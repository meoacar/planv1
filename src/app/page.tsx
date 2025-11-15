import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { getSetting } from '@/lib/settings'
import { auth } from '@/lib/auth'

export default async function HomePage() {
  const session = await auth()
  const siteName = await getSetting('siteName', 'ZayiflamaPlan')
  const siteDescription = await getSetting('siteDescription', 'Gerçek insanların gerçek zayıflama planları')
  
  // Determine CTA link based on auth status
  const ctaLink = session?.user ? '/dashboard' : '/kayit'
  const ctaText = session?.user ? 'Dashboard\'a Git' : 'Hemen Başla'

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          🌟 {siteName}
        </h1>
        <p className="text-2xl text-muted-foreground mb-4">
          {siteDescription}
        </p>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Binlerce kişiyle birlikte hedeflerine ulaş. Planlarını paylaş, başkalarından ilham al, topluluk desteğiyle başar!
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/kesfet">Planları Keşfet</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15,234</div>
              <div className="text-muted-foreground">Aktif Kullanıcı</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2,456</div>
              <div className="text-muted-foreground">Paylaşılan Plan</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">45,678 kg</div>
              <div className="text-muted-foreground">Toplam Kilo Kaybı</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nasıl Çalışır?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Kayıt Ol</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Ücretsiz hesap oluştur, hedefini belirle
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Plan Seç</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Binlerce gerçek plandan sana uygun olanı bul
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Takip Et</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Kilonu, ilerlemeni kaydet, fotoğraf paylaş
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4. Başar!</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Topluluk desteğiyle hedefine ulaş
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Hazır mısın?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Yalnız değilsin, birlikte başarıyoruz! 💪
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 ZayiflamaPlan. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
