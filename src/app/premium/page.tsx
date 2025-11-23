import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Crown, Sparkles, Zap, Check, Calendar, Clock, 
  Infinity, Shield, Rocket, Award, Target, Users, 
  MessageSquare, Camera, Heart, TrendingUp, Star,
  Gift, Flame, Trophy
} from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Premium Üyelik - Sınırsız İmkanlar',
  description: 'Premium özelliklerle hedeflerine daha hızlı ulaş. Özel AI desteği, sınırsız içerik ve daha fazlası.',
}

const premiumFeatures = [
  {
    icon: '🤖',
    title: 'AI Kişisel Asistan',
    description: 'Yapay zeka destekli kişisel diyet ve egzersiz önerileri',
    category: 'AI Özellikler'
  },
  {
    icon: '📊',
    title: 'Gelişmiş Analitik',
    description: 'Detaylı ilerleme raporları ve grafikler',
    category: 'Analiz'
  },
  {
    icon: '🎯',
    title: 'Sınırsız Plan Oluşturma',
    description: 'İstediğiniz kadar diyet planı oluşturun',
    category: 'İçerik'
  },
  {
    icon: '📸',
    title: 'Sınırsız Fotoğraf',
    description: 'İlerleme fotoğraflarınızı sınırsız yükleyin',
    category: 'İçerik'
  },
  {
    icon: '🏆',
    title: 'Özel Rozetler',
    description: 'Premium üyelere özel rozetler ve başarılar',
    category: 'Gamification'
  },
  {
    icon: '⚡',
    title: 'Öncelikli Destek',
    description: '7/24 öncelikli müşteri desteği',
    category: 'Destek'
  },
  {
    icon: '🎨',
    title: 'Profil Özelleştirme',
    description: 'Özel temalar, renkler ve çerçeveler',
    category: 'Kişiselleştirme'
  },
  {
    icon: '📱',
    title: 'Reklamsız Deneyim',
    description: 'Hiç reklam görmeden kullanın',
    category: 'Deneyim'
  },
  {
    icon: '🔔',
    title: 'Akıllı Bildirimler',
    description: 'AI destekli kişiselleştirilmiş hatırlatmalar',
    category: 'AI Özellikler'
  },
  {
    icon: '👥',
    title: 'Özel Topluluk',
    description: 'Premium üyelere özel grup ve etkinlikler',
    category: 'Topluluk'
  },
  {
    icon: '📈',
    title: 'Gelişmiş İstatistikler',
    description: 'Detaylı performans ve ilerleme takibi',
    category: 'Analiz'
  },
  {
    icon: '🎁',
    title: 'Aylık Hediyeler',
    description: 'Her ay özel coin ve ödüller',
    category: 'Ödüller'
  }
]

const plans = [
  {
    id: 'monthly',
    name: 'Aylık Premium',
    price: 49.99,
    duration: 30,
    popular: false,
    savings: null,
    features: [
      'Tüm premium özellikler',
      'AI kişisel asistan',
      'Sınırsız plan oluşturma',
      'Reklamsız deneyim',
      'Öncelikli destek',
      '500 bonus coin'
    ]
  },
  {
    id: 'yearly',
    name: 'Yıllık Premium',
    price: 399.99,
    duration: 365,
    popular: true,
    savings: '33% İndirim',
    features: [
      'Tüm premium özellikler',
      'AI kişisel asistan',
      'Sınırsız plan oluşturma',
      'Reklamsız deneyim',
      'Öncelikli destek',
      '7.500 bonus coin',
      'Özel profil çerçevesi',
      'Aylık özel hediyeler'
    ]
  },
  {
    id: 'lifetime',
    name: 'Ömür Boyu Premium',
    price: 999.99,
    duration: null,
    popular: false,
    savings: 'En İyi Değer',
    features: [
      'Tüm premium özellikler',
      'AI kişisel asistan',
      'Sınırsız plan oluşturma',
      'Reklamsız deneyim',
      'Öncelikli destek',
      '25.000 bonus coin',
      'Özel profil çerçevesi',
      'Aylık özel hediyeler',
      'Kurucu rozeti',
      'Ömür boyu güncellemeler'
    ]
  }
]

export default async function PremiumPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/giris')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      isPremium: true,
      premiumUntil: true,
      premiumType: true,
    }
  })

  const isPremium = user?.isPremium && user.premiumUntil && new Date() < user.premiumUntil

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Navbar />
      
      {/* Hero Section - Lüks ve Etkileyici */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_70%)]" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Premium Status Badge */}
          {isPremium && (
            <div className="flex justify-center mb-8 animate-fade-in">
              <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white border-0 shadow-2xl shadow-yellow-500/50">
                <Crown className="h-5 w-5 mr-2 animate-bounce" />
                Premium Üye
                <Sparkles className="h-5 w-5 ml-2 animate-spin-slow" />
              </Badge>
            </div>
          )}

          {/* Main Hero Content */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 blur-3xl opacity-50 animate-pulse" />
              <Crown className="h-24 w-24 mx-auto text-yellow-500 relative z-10 drop-shadow-2xl animate-float" />
            </div>

            <h1 className="text-6xl md:text-7xl font-black">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Premium
              </span>
              <br />
              <span className="text-white">Sınırsız İmkanlar</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {isPremium 
                ? 'Premium üyeliğinizin tüm ayrıcalıklarından yararlanın ve hedeflerinize daha hızlı ulaşın'
                : 'Yapay zeka destekli kişisel asistan, sınırsız içerik ve özel özelliklerle hedeflerinize ulaşın'}
            </p>

            {!isPremium && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all hover:scale-105"
                  asChild
                >
                  <Link href="#plans">
                    <Crown className="h-5 w-5 mr-2" />
                    Premium Ol
                    <Sparkles className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                  asChild
                >
                  <Link href="#features">
                    Özellikleri Keşfet
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { icon: Users, label: 'Premium Üye', value: '10K+' },
              { icon: Star, label: 'Memnuniyet', value: '4.9/5' },
              { icon: Trophy, label: 'Başarı Oranı', value: '%95' },
              { icon: Flame, label: 'Aktif Kullanıcı', value: '50K+' }
            ].map((stat, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all hover:scale-105">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Status Card - If User is Premium */}
      {isPremium && (
        <div className="container mx-auto px-4 py-12">
          <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl shadow-yellow-500/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/50">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Premium Üyeliğiniz Aktif</h3>
                    <p className="text-slate-300">Tüm premium özelliklere sınırsız erişim</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                    <Calendar className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                    <p className="text-xs text-slate-400 mb-1">Paket</p>
                    <p className="font-bold text-white">
                      {user.premiumType === 'monthly' && 'Aylık'}
                      {user.premiumType === 'yearly' && 'Yıllık'}
                      {user.premiumType === 'lifetime' && 'Ömür Boyu'}
                    </p>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-orange-500" />
                    <p className="text-xs text-slate-400 mb-1">Kalan</p>
                    <p className="font-bold text-white">
                      {user.premiumUntil 
                        ? `${Math.ceil((new Date(user.premiumUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} gün`
                        : '∞'}
                    </p>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                    <Zap className="h-5 w-5 mx-auto mb-2 text-pink-500" />
                    <p className="text-xs text-slate-400 mb-1">Durum</p>
                    <p className="font-bold text-green-400">Aktif</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
            <Sparkles className="h-4 w-4 mr-2" />
            Premium Özellikler
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sınırsız İmkanlar, Tek Üyelik
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Premium üyelikle tüm özelliklerin kilidini açın ve hedeflerinize daha hızlı ulaşın
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="group bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-yellow-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-3 text-xs border-white/20 text-slate-400">
                      {feature.category}
                    </Badge>
                    <h3 className="font-bold text-white mb-2 text-lg">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                  {isPremium && (
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      {!isPremium && (
        <div id="plans" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
              <Crown className="h-4 w-4 mr-2" />
              Fiyatlandırma
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Size Uygun Planı Seçin
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Tüm planlarda aynı özellikler, sadece süre farkı
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative bg-white/5 backdrop-blur-xl border-white/10 hover:scale-105 transition-all ${
                  plan.popular 
                    ? 'border-2 border-yellow-500 shadow-2xl shadow-yellow-500/30' 
                    : 'hover:border-yellow-500/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-xl">
                      <Star className="h-4 w-4 mr-1" />
                      En Popüler
                    </Badge>
                  </div>
                )}

                {plan.savings && !plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-xl">
                      <Gift className="h-4 w-4 mr-1" />
                      {plan.savings}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-black text-white">{plan.price}</span>
                      <span className="text-xl text-slate-400 ml-2">₺</span>
                    </div>
                    {plan.duration && (
                      <p className="text-slate-400">
                        {plan.duration} gün boyunca
                      </p>
                    )}
                    {!plan.duration && (
                      <p className="text-yellow-500 font-semibold flex items-center justify-center gap-2">
                        <Infinity className="h-5 w-5" />
                        Ömür Boyu
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-6 text-lg font-bold ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white shadow-xl shadow-yellow-500/50'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                    asChild
                  >
                    <Link href="/magaza/premium">
                      <Crown className="h-5 w-5 mr-2" />
                      Premium Ol
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center mt-12">
            <Card className="inline-block bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 flex items-center gap-4">
                <Shield className="h-8 w-8 text-green-500" />
                <div className="text-left">
                  <p className="font-bold text-white">30 Gün Para İade Garantisi</p>
                  <p className="text-sm text-slate-400">Memnun kalmazsan paranı geri al</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {!isPremium && (
        <div className="container mx-auto px-4 py-20">
          <Card className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <Rocket className="h-16 w-16 mx-auto mb-6 text-white animate-bounce" />
              <h2 className="text-4xl font-bold text-white mb-4">
                Hedeflerinize Ulaşmaya Hazır mısınız?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Binlerce kullanıcı Premium ile hedeflerine ulaştı. Sıra sizde!
              </p>
              <Button 
                size="lg"
                className="px-12 py-6 text-lg font-bold bg-white text-orange-600 hover:bg-slate-100 shadow-2xl hover:scale-105 transition-all"
                asChild
              >
                <Link href="#plans">
                  Hemen Başla
                  <Sparkles className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
