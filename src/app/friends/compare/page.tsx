import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/layout/footer';
import { CompareClient } from './compare-client';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Arkadaş Karşılaştırma | Zayıflama Planı',
  description: 'Arkadaşınla istatistiklerini karşılaştır',
};

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-3 text-muted-foreground">Yükleniyor...</p>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-pink-950/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <Suspense fallback={<LoadingSpinner />}>
          <CompareClient />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
