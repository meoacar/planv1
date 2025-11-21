import { checkUserBan } from "@/lib/check-ban";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/footer";
import { SinStatsClient } from "./sin-stats-client";
import { SinLanding } from "@/components/food-sins/sin-landing";

export const metadata = {
  title: "Yemek Günah Sayacı | Zayıflama Planı",
  description: "Kaçamak davranışlarını mizahla takip et, farkındalığını artır!",
};

export default async function GunahSayaciPage() {
  const session = await checkUserBan();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-pink-950/20">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {session?.user ? (
          <>
            {/* Hero Section - Sadece giriş yapmış kullanıcılar için */}
            <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 p-8 md:p-10 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
              <div className="relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  🍰 Yemek Günah Sayacı 😈
                </h1>
                <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
                  Kaçamak yaparsan bile, kendinle dalga geçmeyi unutma!
                </p>
              </div>
            </div>

            {/* Client Component - Mevcut özellikler */}
            <SinStatsClient />
          </>
        ) : (
          <>
            {/* Landing Page - Giriş yapmamış kullanıcılar için */}
            <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 p-8 md:p-10 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
              <div className="relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  🍰 Yemek Günah Sayacı 😈
                </h1>
                <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
                  Kaçamak yaparsan bile, kendinle dalga geçmeyi unutma!
                </p>
              </div>
            </div>

            <SinLanding />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
