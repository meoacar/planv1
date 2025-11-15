import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeForm } from '@/components/admin/badge-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Yeni Rozet | Admin',
  description: 'Yeni rozet oluştur',
};

export default async function NewBadgePage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/giris');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/gamification/badges">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Yeni Rozet Oluştur</h1>
          <p className="text-muted-foreground">
            Kullanıcıların kazanabileceği yeni bir rozet ekle
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Rozet Bilgileri</CardTitle>
          <CardDescription>
            Rozet detaylarını girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgeForm />
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tips Card */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              💡 İpuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>• <strong>Key:</strong> Kodda kullanılacak benzersiz anahtar (örn: first_plan, weight_loss_5kg)</p>
            <p>• <strong>Kategori:</strong> Rozetin hangi kategoriye ait olduğunu belirler</p>
            <p>• <strong>Nadirlik:</strong> Rozetin ne kadar özel olduğunu gösterir</p>
            <p>• <strong>XP/Coin Ödülü:</strong> Rozet kazanıldığında verilecek ödüller</p>
            <p>• <strong>Sıralama:</strong> Aynı kategorideki rozetlerin sıralaması (0 = en üstte)</p>
          </CardContent>
        </Card>

        {/* Key Examples Card */}
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">
              🔑 Key Örnekleri
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-green-800 dark:text-green-200 space-y-3">
            <div>
              <p className="font-semibold mb-1">Başarı Rozetleri:</p>
              <p className="text-xs">first_plan, first_recipe, first_comment, plan_10, recipe_50</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Kilo Kaybı Rozetleri:</p>
              <p className="text-xs">weight_loss_5kg, weight_loss_10kg, weight_loss_20kg, weight_loss_50kg</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Seri Rozetleri:</p>
              <p className="text-xs">streak_7, streak_30, streak_100, streak_365</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Sosyal Rozetleri:</p>
              <p className="text-xs">social_10_followers, social_50_followers, social_100_likes, social_influencer</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Özel Rozetleri:</p>
              <p className="text-xs">early_adopter, guild_founder, season_winner, top_contributor</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Guide Card */}
      <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-900 dark:text-amber-100">
            ⚙️ Rozet Entegrasyonu
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-800 dark:text-amber-200 space-y-3">
          <p className="font-semibold">Rozet oluşturduktan sonra kodda kullanmak için:</p>
          <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-md font-mono text-xs">
            <p className="mb-2">// Rozet verme örneği:</p>
            <p>await awardBadge(userId, 'your_badge_key');</p>
            <p className="mt-3 mb-2">// Örnek kullanım yerleri:</p>
            <p>• Plan oluşturma: src/app/api/v1/plans/route.ts</p>
            <p>• Kilo kaybı: src/app/api/v1/weight-logs/route.ts</p>
            <p>• Yorum yapma: src/app/api/v1/comments/route.ts</p>
          </div>
          <p className="text-xs mt-2">
            <strong>Not:</strong> Rozet otomatik olarak verilmez. İlgili API endpoint'ine entegre etmeniz gerekir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
