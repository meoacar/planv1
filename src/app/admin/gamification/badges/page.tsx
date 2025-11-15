import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db as prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Award } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rozet Yönetimi | Admin',
  description: 'Rozetleri yönet',
};

async function getBadges() {
  return prisma.badge.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    include: {
      _count: {
        select: { users: true },
      },
    },
  });
}

const categoryNames: Record<string, string> = {
  achievement: 'Başarı',
  milestone: 'Kilometre Taşı',
  social: 'Sosyal',
  special: 'Özel',
};

const rarityColors: Record<string, string> = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

export default async function AdminBadgesPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/giris');
  }

  const badges = await getBadges();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rozet Yönetimi</h1>
          <p className="text-muted-foreground">
            Rozetleri oluştur, düzenle ve yönet
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/gamification/badges/keys">
              🔑 Key Listesi
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/gamification/badges/new">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Rozet
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Toplam Rozet</CardDescription>
            <CardTitle className="text-3xl">{badges.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Aktif</CardDescription>
            <CardTitle className="text-3xl">
              {badges.filter((b) => b.isActive).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pasif</CardDescription>
            <CardTitle className="text-3xl">
              {badges.filter((b) => !b.isActive).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Toplam Kazanılan</CardDescription>
            <CardTitle className="text-3xl">
              {badges.reduce((sum, b) => sum + b._count.users, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Badges Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Rozetler</CardTitle>
          <CardDescription>
            {badges.length} rozet bulundu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{badge.name}</h3>
                      <Badge variant="outline" className={rarityColors[badge.rarity]}>
                        {badge.rarity}
                      </Badge>
                      <Badge variant="secondary">
                        {categoryNames[badge.category]}
                      </Badge>
                      {!badge.isActive && (
                        <Badge variant="destructive">Pasif</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {badge.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Key: {badge.key}</span>
                      <span>+{badge.xpReward} XP</span>
                      <span>+{badge.coinReward} Coin</span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {badge._count.users} kullanıcı kazandı
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/gamification/badges/${badge.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {badges.length === 0 && (
            <div className="text-center py-12">
              <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Henüz rozet yok</p>
              <Button asChild>
                <Link href="/admin/gamification/badges/new">
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Rozeti Oluştur
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
