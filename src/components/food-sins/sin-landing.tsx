"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Target,
  Trophy,
  Users,
  Calendar,
  BarChart3,
  Flame,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function SinLanding() {
  const router = useRouter();

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Günah Takibi",
      description: "Kaçamak yaptığın anları kaydet ve farkındalığını artır",
    },
    {
      icon: <Flame className="h-8 w-8" />,
      title: "Streak Sistemi",
      description: "Ardışık günlerde hedefine sadık kal, streak'ini koru",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Seviye & Rozetler",
      description: "Başarılarını kutla, özel rozetler kazan",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "İstatistikler",
      description: "Detaylı grafiklerle ilerlemenizi görselleştir",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Liderlik Tablosu",
      description: "Diğer kullanıcılarla yarış, motivasyonunu artır",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Challenge'lar",
      description: "Haftalık görevleri tamamla, ödüller kazan",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Kaçamak Ekle",
      description: "Yediğin kaçamak yiyecekleri kaydet",
    },
    {
      number: "2",
      title: "İlerlemeni Takip Et",
      description: "Grafikler ve istatistiklerle kendini gör",
    },
    {
      number: "3",
      title: "Hedefine Ulaş",
      description: "Farkındalıkla sağlıklı yaşam tarzına kavuş",
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-block">
          <div className="text-6xl md:text-8xl mb-4 animate-bounce" role="img" aria-label="Pasta emoji">🍰</div>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Kaçamak Yaparsan Bile,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500">
            Kendinle Dalga Geç!
          </span>
        </h2>
        <div className="text-5xl md:text-6xl" role="img" aria-label="Şeytan emoji">😈</div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Yemek günah sayacı ile kaçamak davranışlarını mizahla takip et,
          farkındalığını artır ve hedeflerine ulaş! Günlük takip, streak sistemi, rozetler ve liderlik tablosu ile motivasyonunu artır.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            onClick={() => router.push("/kayit")}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold text-lg px-8 py-6"
          >
            Ücretsiz Başla
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/giris")}
            className="font-semibold text-lg px-8 py-6"
          >
            Giriş Yap
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border-2 hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <CardContent className="p-6 space-y-3">
              <div className="text-primary">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Nasıl Çalışır?
          </h3>
          <p className="text-lg text-muted-foreground">
            3 basit adımda başla
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white text-2xl font-bold shadow-lg">
                {step.number}
              </div>
              <h4 className="text-xl font-bold">{step.title}</h4>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Neler Göreceksin?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Giriş yaptıktan sonra seni bekleyen özellikler
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demo Card 1 */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950/30 dark:to-orange-950/30 p-12 md:p-16 relative min-h-[280px]">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/30 dark:bg-black/30 flex items-center justify-center">
                  <div className="text-center space-y-4 px-4">
                    <div className="text-6xl mb-2">📅</div>
                    <p className="text-lg md:text-xl font-semibold">
                      Günlük Takip Takvimi
                    </p>
                    <Button
                      onClick={() => router.push("/giris")}
                      variant="secondary"
                      size="lg"
                    >
                      Giriş Yap ve Gör
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Card 2 */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 p-12 md:p-16 relative min-h-[280px]">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/30 dark:bg-black/30 flex items-center justify-center">
                  <div className="text-center space-y-4 px-4">
                    <div className="text-6xl mb-2">🏆</div>
                    <p className="text-lg md:text-xl font-semibold">Rozet Koleksiyonu</p>
                    <Button
                      onClick={() => router.push("/giris")}
                      variant="secondary"
                      size="lg"
                    >
                      Giriş Yap ve Gör
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 border-0 text-white">
        <CardContent className="p-8 md:p-12">
          <div className="text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              Neden Günah Sayacı?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
              {[
                "Mizahi yaklaşımla motivasyon",
                "Detaylı istatistikler ve grafikler",
                "Arkadaşlarınla yarış",
                "Haftalık challenge'lar",
                "Özel rozetler ve başarılar",
                "AI destekli beslenme koçu",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final CTA */}
      <div className="text-center space-y-6 py-8">
        <h3 className="text-3xl md:text-4xl font-bold">
          Hemen Başla, Ücretsiz! 🎉
        </h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Binlerce kullanıcı zaten hedeflerine ulaşıyor. Sen de aramıza katıl!
        </p>
        <Button
          size="lg"
          onClick={() => router.push("/kayit")}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold text-lg px-12 py-6"
        >
          Şimdi Kayıt Ol
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
