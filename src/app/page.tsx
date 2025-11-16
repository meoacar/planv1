import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/layout/footer'
import { getSetting } from '@/lib/settings'
import { auth } from '@/lib/auth'
import { 
  Sparkles, 
  Users, 
  TrendingUp, 
  Target, 
  Heart, 
  Zap,
  Award,
  MessageCircle,
  Camera,
  Trophy,
  Star,
  ArrowRight
} from 'lucide-react'

export default async function HomePage() {
  const session = await auth()
  const siteName = await getSetting('siteName', 'ZayiflamaPlan')
  const siteDescription = await getSetting('siteDescription', 'Gerçek insanların gerçek zayıflama planları')
  
  const ctaLink = session?.user ? '/dashboard' : '/kayit'
  const ctaText = session?.user ? 'Dashboard\'a Git' : 'Hemen Başla'

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />

      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 via-cyan-500/10 to-teal-500/10 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section - Ultra Modern */}
      <section className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-8 backdrop-blur-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              15,000+ Mutlu Kullanıcı
            </span>
          </div>

          {/* Main Heading with Gradient */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
              {siteName}
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold mb-4 text-foreground/90">
            {siteDescription}
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Binlerce kişiyle birlikte hedeflerine ulaş. Planlarını paylaş, başkalarından ilham al, 
            <span className="text-purple-600 font-semibold"> topluluk desteğiyle</span> başar!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 group">
              <Link href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-2 hover:bg-accent/50 backdrop-blur-sm">
              <Link href="/kesfet">
                Planları Keşfet
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>4.9/5 Kullanıcı Puanı</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span>%98 Memnuniyet</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span>45,678 kg Kayıp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Glassmorphism */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, value: '15,234', label: 'Aktif Kullanıcı', color: 'from-blue-500 to-cyan-500' },
              { icon: TrendingUp, value: '2,456', label: 'Paylaşılan Plan', color: 'from-purple-500 to-pink-500' },
              { icon: Target, value: '45,678 kg', label: 'Toplam Kilo Kaybı', color: 'from-orange-500 to-red-500' }
            ].map((stat, i) => (
              <div 
                key={i}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" 
                     style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                <Card className="relative backdrop-blur-sm bg-background/50 border-2 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-5xl font-black mb-2 bg-gradient-to-r bg-clip-text text-transparent" 
                         style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Nasıl Çalışır?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            4 basit adımda hedeflerine ulaşmaya başla
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { 
              icon: Sparkles, 
              title: 'Kayıt Ol', 
              desc: 'Ücretsiz hesap oluştur, hedefini belirle',
              color: 'from-purple-500 to-pink-500',
              delay: '0'
            },
            { 
              icon: Target, 
              title: 'Plan Seç', 
              desc: 'Binlerce gerçek plandan sana uygun olanı bul',
              color: 'from-blue-500 to-cyan-500',
              delay: '100'
            },
            { 
              icon: Camera, 
              title: 'Takip Et', 
              desc: 'Kilonu, ilerlemeni kaydet, fotoğraf paylaş',
              color: 'from-orange-500 to-red-500',
              delay: '200'
            },
            { 
              icon: Trophy, 
              title: 'Başar!', 
              desc: 'Topluluk desteğiyle hedefine ulaş',
              color: 'from-green-500 to-emerald-500',
              delay: '300'
            }
          ].map((feature, i) => (
            <div key={i} className="group">
              <Card className="h-full border-2 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-background to-accent/20">
                <CardHeader>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="text-3xl font-black text-muted-foreground/30">{i + 1}</span>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section - Bento Grid Style */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-pink-500/5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Topluluk Gücü
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Yalnız değilsin! Gruplar ve loncalara katılarak motivasyonunu artır, deneyimlerini paylaş.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Gruplar Card */}
            <Card className="relative overflow-hidden border-2 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <CardHeader className="relative">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4 w-fit">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Gruplar</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-base mb-6 leading-relaxed">
                  Sosyal destek gruplarına katıl. Motivasyon, tarif paylaşımı, günlük sohbet ve daha fazlası.
                </CardDescription>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-sm font-medium">Motivasyon</span>
                  <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 text-sm font-medium">Tarifler</span>
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-sm font-medium">Sohbet</span>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link href="/gruplar">
                    Grupları Keşfet
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Loncalar Card */}
            <Card className="relative overflow-hidden border-2 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <CardHeader className="relative">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-4 w-fit">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Loncalar</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-base mb-6 leading-relaxed">
                  Rekabetçi takımlara katıl. XP kazan, challenge'larda yarış, liderlik tablosunda yüksel.
                </CardDescription>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-sm font-medium">Rekabet</span>
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-sm font-medium">XP Sistemi</span>
                  <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-sm font-medium">Ödüller</span>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                  <Link href="/lonca">
                    Loncaları Keşfet
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { icon: MessageCircle, title: 'Mesajlaşma', desc: 'Gerçek zamanlı sohbet ve destek' },
            { icon: Camera, title: 'Fotoğraf Paylaşımı', desc: 'İlerleme fotoğraflarını paylaş' },
            { icon: Award, title: 'Rozetler & Ödüller', desc: 'Başarılarını kutla ve ödüller kazan' }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-background to-accent/20 border hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA - Gradient Background */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-8">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Şimdi Başla, Ücretsiz!
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Hazır mısın?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
            Yalnız değilsin, birlikte başarıyoruz! 💪
          </p>
          
          <Button asChild size="lg" className="text-lg px-10 py-7 rounded-full bg-white text-purple-600 hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <Link href={ctaLink}>
              {ctaText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
