import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db as prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rozet Key Listesi | Admin',
  description: 'Tüm rozet key\'lerini görüntüle',
};

async function getBadgeKeys() {
  return prisma.badge.findMany({
    select: {
      key: true,
      name: true,
      category: true,
      isActive: true,
      _count: {
        select: { users: true },
      },
    },
    orderBy: [{ category: 'asc' }, { key: 'asc' }],
  });
}

const categoryNames: Record<string, string> = {
  achievement: 'Başarı',
  milestone: 'Kilometre Taşı',
  social: 'Sosyal',
  special: 'Özel',
};

export default async function BadgeKeysPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/giris');
  }

  const badges = await getBadgeKeys();
  const badgesByCategory = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, typeof badges>);

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
          <h1 className="text-3xl font-bold">Rozet Key Listesi</h1>
          <p className="text-muted-foreground">
            Kodda kullanılabilecek tüm rozet key'leri
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            💡 Kullanım
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200">
          <p className="mb-2">Rozet vermek için kodda şu şekilde kullanın:</p>
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-md font-mono text-xs">
            <p>await awardBadge(userId, 'badge_key');</p>
          </div>
        </CardContent>
      </Card>

      {/* Keys by Category */}
      {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{categoryNames[category] || category}</CardTitle>
            <CardDescription>
              {categoryBadges.length} rozet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryBadges.map((badge) => (
                <div
                  key={badge.key}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {badge.key}
                      </code>
                      {!badge.isActive && (
                        <Badge variant="secondary">Pasif</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {badge.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge._count.users} kullanıcı kazandı
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(badge.key);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {badges.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Henüz rozet yok</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
