import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/layout/footer';
import AIRecommendations from '@/components/ai/AIRecommendations';
import SmartReminders from '@/components/ai/SmartReminders';
import { Sparkles, Brain, Target, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Özellikleri | Zayıflama Planı',
  description: 'Kişiselleştirilmiş AI önerileri ve akıllı hatırlatmalar',
};

export default function AIFeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-blue-950/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                AI Özellikleri
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl">
              Yapay zeka destekli kişiselleştirilmiş deneyim ile hedeflerinize daha hızlı ulaşın
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 w-fit mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Akıllı Öneriler</h3>
              <p className="text-sm text-muted-foreground">
                Geçmiş aktivitelerinize göre size özel planlar ve tarifler
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 w-fit mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Optimize Edilmiş Zamanlar</h3>
              <p className="text-sm text-muted-foreground">
                Hatırlatmalar en aktif olduğunuz saatlerde gelir
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 w-fit mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Sürekli Öğrenme</h3>
              <p className="text-sm text-muted-foreground">
                Kullandıkça sizi daha iyi tanır ve gelişir
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <AIRecommendations />
          <SmartReminders />
        </div>

        {/* Info Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-purple-500/20 p-8 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">AI Nasıl Çalışıyor?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Veri Toplama</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Beğenileriniz, tamamladığınız planlar ve aktiviteleriniz analiz edilir
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-semibold">AI Analizi</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Yapay zeka verilerinizi işleyerek size özel öneriler oluşturur
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-semibold">Kişiselleştirme</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Etkileşimlerinize göre öneriler sürekli iyileştirilir
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
