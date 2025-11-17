import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  ArrowRight,
  CheckCircle2,
  Flame,
  Crown,
  Gift,
  Rocket,
  Shield,
  Smile,
  TrendingDown,
  UserPlus
} from 'lucide-react'

export default async function HomePage() {
  const session = await auth()
  const siteName = await getSetting('siteName', 'ZayiflamaPlanim.com')
  const siteDescription = await getSetting('siteDescription', 'Gerçek insanların gerçek zayıflama planları')
  
  const ctaLink = session?.user ? '/dashboard' : '/kayit'
  const ctaText = session?.user ? 'Dashboard\'a Git' : 'Ücretsiz Başla'

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950">
      <Navbar />

      {/* Hero Section - Modern & Engaging */}
      <section className="relative container mx-auto px-4 pt-20 md:pt-28 pb-12 md:pb-16">
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300/20 dark:bg-pink-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-orange-300/20 dark:bg-orange-600/10 rounded-full blur-3xl" />
        </div>

        <div className="text-center max-w-5xl mx-auto relative">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border border-purple-200 dark:border-purple-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Yeni Nesil Zayıflama Platformu 🎉
            </span>
          </div>

          {/* Main Heading with Gradient */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
              Hayalindeki Vücuda
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">
              Toplulukla Ulaş! 💪
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {siteDescription}
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            Yalnız değilsin! Topluluğumuzla birlikte hedeflerine ulaş. Planlarını paylaş, başkalarından ilham al, 
            rozetler kazan, loncalarla yarış ve topluluk desteğiyle başarıya ulaş! 🚀
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
            <Button asChild size="lg" className="text-lg px-10 h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105 group font-bold">
              <Link href={ctaLink}>
                <Rocket className="mr-2 w-5 h-5" />
                {ctaText}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 h-14 border-2 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold">
              <Link href="/kesfet">
                <Sparkles className="mr-2 w-5 h-5" />
                Planları Keşfet
              </Link>
            </Button>
          </div>

          {/* Trust Indicators - Enhanced */}
          <div className="flex flex-wrap justify-center gap-8 text-sm animate-in fade-in slide-in-from-bottom-14 duration-700 delay-700">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-bold text-slate-900 dark:text-white">67 Rozet</span>
              <span className="text-muted-foreground">Sistemi</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md">
              <Trophy className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-slate-900 dark:text-white">Lonca</span>
              <span className="text-muted-foreground">Yarışmaları</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-slate-900 dark:text-white">Günlük</span>
              <span className="text-muted-foreground">Görevler</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight - Modern Cards */}
      <section className="relative py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Rozet Sistemi */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="pt-8 pb-8 text-center relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black mb-2">
                  67
                </div>
                <div className="text-sm font-semibold opacity-90">Farklı Rozet</div>
              </CardContent>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </Card>

            {/* Günlük Görevler */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-cyan-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="pt-8 pb-8 text-center relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black mb-2">
                  ∞
                </div>
                <div className="text-sm font-semibold opacity-90">Günlük Görev</div>
              </CardContent>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </Card>

            {/* Lonca Sistemi */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 to-red-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="pt-8 pb-8 text-center relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black mb-2">
                  24/7
                </div>
                <div className="text-sm font-semibold opacity-90">Lonca Yarışı</div>
              </CardContent>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </Card>

            {/* Topluluk */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="pt-8 pb-8 text-center relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black mb-2">
                  100%
                </div>
                <div className="text-sm font-semibold opacity-90">Topluluk Desteği</div>
              </CardContent>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Modern Timeline */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <Zap className="w-4 h-4 mr-2" />
            Süper Kolay
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            4 basit adımda hedeflerine ulaşmaya başla 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { 
              icon: UserPlus, 
              title: 'Kayıt Ol', 
              desc: 'Ücretsiz hesap oluştur, hedefini belirle. Sadece 30 saniye!',
              gradient: 'from-purple-500 to-purple-600',
              iconBg: 'bg-purple-100 dark:bg-purple-900/30',
              iconColor: 'text-purple-600 dark:text-purple-400'
            },
            { 
              icon: Target, 
              title: 'Plan Seç', 
              desc: 'Binlerce gerçek plandan sana uygun olanı bul ve takip et',
              gradient: 'from-blue-500 to-blue-600',
              iconBg: 'bg-blue-100 dark:bg-blue-900/30',
              iconColor: 'text-blue-600 dark:text-blue-400'
            },
            { 
              icon: Flame, 
              title: 'Takip Et', 
              desc: 'Kilonu, ilerlemeni kaydet, fotoğraf paylaş, görevleri tamamla',
              gradient: 'from-orange-500 to-red-600',
              iconBg: 'bg-orange-100 dark:bg-orange-900/30',
              iconColor: 'text-orange-600 dark:text-orange-400'
            },
            { 
              icon: Trophy, 
              title: 'Başar!', 
              desc: 'Topluluk desteğiyle hedefine ulaş, rozetler kazan',
              gradient: 'from-green-500 to-emerald-600',
              iconBg: 'bg-green-100 dark:bg-green-900/30',
              iconColor: 'text-green-600 dark:text-green-400'
            }
          ].map((feature, i) => (
            <Card key={i} className="relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 group">
              {/* Step Number Badge */}
              <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center font-black text-xl shadow-lg`}>
                {i + 1}
              </div>
              
              <CardHeader className="space-y-4 pb-4">
                <div className={`inline-flex p-4 rounded-2xl ${feature.iconBg} w-fit group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Section - Enhanced */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <Users className="w-4 h-4 mr-2" />
              Topluluk
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
              Yalnız Değilsin! 💜
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gruplar ve loncalara katılarak motivasyonunu artır, deneyimlerini paylaş, yeni arkadaşlar edin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Gruplar Card - Enhanced */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative z-10">
                <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-4 w-fit group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl font-black">Sosyal Gruplar</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-base mb-6 leading-relaxed">
                  Sosyal destek gruplarına katıl. Motivasyon, tarif paylaşımı, günlük sohbet ve daha fazlası. 
                  Aynı hedeflere sahip insanlarla tanış!
                </CardDescription>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Motivasyon ve destek grupları</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Tarif ve ipucu paylaşımı</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Günlük sohbet ve arkadaşlık</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-0">
                    <Heart className="w-3 h-3 mr-1" />
                    Motivasyon
                  </Badge>
                  <Badge variant="secondary" className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Tarifler
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-0">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Sohbet
                  </Badge>
                </div>

                <Button asChild className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all group">
                  <Link href="/gruplar">
                    Grupları Keşfet
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Loncalar Card - Enhanced */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative z-10">
                <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 mb-4 w-fit group-hover:scale-110 transition-transform">
                  <Trophy className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-2xl font-black">Rekabetçi Loncalar</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-base mb-6 leading-relaxed">
                  Rekabetçi takımlara katıl. XP kazan, challenge'larda yarış, liderlik tablosunda yüksel. 
                  Takım ruhuyla daha güçlü ol!
                </CardDescription>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Haftalık challenge'lar ve yarışmalar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">XP sistemi ve seviye atlama</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Liderlik tablosu ve ödüller</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-0">
                    <Flame className="w-3 h-3 mr-1" />
                    Rekabet
                  </Badge>
                  <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-0">
                    <Zap className="w-3 h-3 mr-1" />
                    XP Sistemi
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Ödüller
                  </Badge>
                </div>

                <Button asChild className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all group">
                  <Link href="/lonca">
                    Loncaları Keşfet
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Confession Wall Feature - NEW! */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="relative overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-2xl">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10" />
              
              {/* NEW Badge */}
              <div className="absolute top-6 right-6 z-20">
                <Badge className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg animate-pulse">
                  <Sparkles className="w-4 h-4 mr-2" />
                  YENİ!
                </Badge>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 relative z-10">
                {/* Left Side - Content */}
                <CardContent className="pt-12 pb-12 pl-8 pr-8 lg:pr-4">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-6">
                    <span className="text-5xl">🎭</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                    İtiraf Duvarı
                  </h3>
                  
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Diyet sürecinde yaptığın "hataları" anonim paylaş, AI'dan esprili yanıtlar al, 
                    topluluktan empati gör! 🤗
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium">🎭 Tamamen anonim itiraflar</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      </div>
                      <span className="text-sm font-medium">🤖 AI destekli esprili yanıtlar</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm font-medium">❤️ Topluluk empati sistemi</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium">🏆 Özel rozetler ve ödüller</span>
                    </div>
                  </div>

                  {session?.user ? (
                    <Button asChild size="lg" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all group">
                      <Link href="/confessions">
                        🎭 İtiraf Duvarını Keşfet
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all group">
                      <Link href="/kayit">
                        Kayıt Ol ve Keşfet
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  )}
                </CardContent>

                {/* Right Side - Example Confession */}
                <div className="relative pt-12 pb-12 pr-8 pl-8 lg:pl-4 flex items-center">
                  <div className="w-full">
                    {/* Example Confession Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border-2 border-purple-200 dark:border-purple-800 mb-4">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                          ?
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-muted-foreground mb-1">Anonim • 2 saat önce</div>
                          <p className="text-sm leading-relaxed">
                            "Dün gece 23:00'te buzdolabını açtım ve yarım kutu dondurma bitirdim. 
                            Sabah kalktığımda pişman oldum ama o an çok mutluydum 😅"
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mb-3">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-2xl">🤖</span>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1">AI Yanıtı</div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              "Gece açlığı gerçekten zor! Kendinizi suçlamayın, yarın yeni bir gün. 🌟"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                          <span className="font-semibold">127</span>
                          <span>Benimki de vardı</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 text-center border border-purple-200 dark:border-purple-800">
                        <div className="text-2xl font-black text-purple-600 dark:text-purple-400">2.5K+</div>
                        <div className="text-xs text-muted-foreground font-medium">İtiraf</div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 text-center border border-pink-200 dark:border-pink-800">
                        <div className="text-2xl font-black text-pink-600 dark:text-pink-400">12K+</div>
                        <div className="text-xs text-muted-foreground font-medium">Empati</div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 text-center border border-orange-200 dark:border-orange-800">
                        <div className="text-2xl font-black text-orange-600 dark:text-orange-400">95%</div>
                        <div className="text-xs text-muted-foreground font-medium">Memnun</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Gamification Focus */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
            <Crown className="w-4 h-4 mr-2" />
            Özel Özellikler
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
            Neden ZayiflamaPlanim.com?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sadece bir uygulama değil, bir yaşam tarzı değişimi 🌟
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { 
              icon: Award, 
              title: '67 Farklı Rozet', 
              desc: 'Her başarını kutla! İlk kilondan hedefine ulaşmana kadar her adımda rozet kazan.',
              gradient: 'from-yellow-500 to-orange-600',
              iconBg: 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30'
            },
            { 
              icon: Trophy, 
              title: 'Loncalar & Rekabet', 
              desc: 'Takımınla yarış, haftalık challenge\'larda birinci ol, liderlik tablosunda yüksel!',
              gradient: 'from-orange-500 to-red-600',
              iconBg: 'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30'
            },
            { 
              icon: Zap, 
              title: 'Günlük Görevler', 
              desc: 'Her gün yeni görevler! XP kazan, coin topla, seviye atla ve ödüller kazan.',
              gradient: 'from-purple-500 to-pink-600',
              iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30'
            },
            { 
              icon: MessageCircle, 
              title: 'Gerçek Zamanlı Mesajlaşma', 
              desc: 'Toplulukla anında iletişim kur, sorularına hemen cevap al, arkadaşlıklar kur.',
              gradient: 'from-blue-500 to-cyan-600',
              iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30'
            },
            { 
              icon: Camera, 
              title: 'İlerleme Fotoğrafları', 
              desc: 'Değişimini görselleştir! Önce-sonra fotoğraflarını paylaş, motivasyonunu artır.',
              gradient: 'from-pink-500 to-rose-600',
              iconBg: 'bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30'
            },
            { 
              icon: Gift, 
              title: 'Mağaza & Ödüller', 
              desc: 'Kazandığın coinlerle mağazadan özel ödüller, rozetler ve avatarlar satın al!',
              gradient: 'from-green-500 to-emerald-600',
              iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
            }
          ].map((item, i) => (
            <Card key={i} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 relative overflow-hidden">
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <CardContent className="pt-8 pb-8 relative z-10">
                <div className={`inline-flex p-4 rounded-2xl ${item.iconBg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="font-black text-xl mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section - Modern Cards */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
              <Smile className="w-4 h-4 mr-2" />
              Erken Erişim
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
              İlk Kullanıcılarımız Ne Diyor?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Beta ve test kullanıcılarımızdan geri bildirimler 🌟
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: 'Beta Kullanıcısı',
                weight: 'Yeni Başladı',
                text: 'Platform çok kullanıcı dostu! Rozet sistemi ve günlük görevler motivasyonumu artırıyor. Topluluğun desteğini hissediyorum.',
                avatar: '👩',
                gradient: 'from-purple-500 to-pink-600',
                level: 'Seviye 3'
              },
              {
                name: 'Erken Erişim',
                weight: 'İlk Hafta',
                text: 'Lonca sistemi harika! Takımımla birlikte yarışmak çok eğlenceli. Günlük görevleri tamamlamak alışkanlık haline geldi.',
                avatar: '👨',
                gradient: 'from-blue-500 to-cyan-600',
                level: 'Seviye 5'
              },
              {
                name: 'Test Kullanıcısı',
                weight: 'Yeni Üye',
                text: 'Arayüz çok modern ve kullanımı kolay. Gamification özellikleri sayesinde her gün giriş yapmak istiyorum!',
                avatar: '👩‍🦰',
                gradient: 'from-orange-500 to-red-600',
                level: 'Seviye 2'
              }
            ].map((testimonial, i) => (
              <Card key={i} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 relative overflow-hidden">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <CardContent className="pt-8 pb-8 relative z-10">
                  {/* Avatar & Info */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`text-5xl p-3 rounded-2xl bg-gradient-to-br ${testimonial.gradient} bg-opacity-10`}>
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{testimonial.name}</div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`bg-gradient-to-r ${testimonial.gradient} text-white border-0 font-bold`}>
                          -{testimonial.weight} 🎉
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">{testimonial.level}</div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="relative mb-5">
                    <div className="absolute -top-2 -left-2 text-4xl text-muted-foreground/20">"</div>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {testimonial.text}
                    </p>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Join Community Link */}
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="text-base px-8 h-12 border-2">
              <Link href="/kayit">
                <UserPlus className="mr-2 w-5 h-5" />
                Sen de Topluluğa Katıl
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA - Epic Gradient */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8">
            <Rocket className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">
              Ücretsiz Başla - Kredi Kartı Gerektirmez
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white leading-tight">
            Hayalindeki Vücuda<br />
            Bugün Başla! 🚀
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
            Topluluğumuzla birlikte hedefine ulaş!<br />
            Yalnız değilsin, birlikte başarıyoruz! 💪
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button asChild size="lg" className="text-lg px-12 h-16 bg-white text-purple-600 hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all hover:scale-110 font-black group">
              <Link href={ctaLink}>
                <Rocket className="mr-2 w-6 h-6" />
                {ctaText}
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-12 h-16 bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold">
              <Link href="/kesfet">
                <Sparkles className="mr-2 w-6 h-6" />
                Planları İncele
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">100% Güvenli</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Ücretsiz Başla</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Topluluk Desteği</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
