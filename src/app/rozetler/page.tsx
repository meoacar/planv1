import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db as prisma } from '@/lib/db';
import { Navbar } from '@/components/navbar';
import { Badge, Trophy, Star, Award, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const metadata: Metadata = {
  title: 'Rozetler | ZayiflamaPlan',
  description: 'Kazandığın rozetleri gör ve yeni rozetler kazan',
};

async function getBadgesData(userId: string) {
  const [allBadges, userBadges, user] = await Promise.all([
    prisma.badge.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    }),
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, coins: true },
    }),
  ]);

  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

  const badgesWithStatus = allBadges.map((badge) => {
    const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
    return {
      ...badge,
      earned: earnedBadgeIds.has(badge.id),
      earnedAt: userBadge?.earnedAt || null,
    };
  });

  return { badges: badgesWithStatus, user, earnedCount: userBadges.length };
}

const categoryIcons: Record<string, any> = {
  achievement: Trophy,
  milestone: Star,
  social: Badge,
  special: Award,
};

const categoryNames: Record<string, string> = {
  achievement: 'Başarılar',
  milestone: 'Kilometre Taşları',
  social: 'Sosyal',
  special: 'Özel',
};

const rarityColors: Record<string, string> = {
  common: 'text-gray-500',
  rare: 'text-blue-500',
  epic: 'text-purple-500',
  legendary: 'text-yellow-500',
};

export default async function BadgesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/giris?callbackUrl=/rozetler');
  }

  const { badges, user, earnedCount } = await getBadgesData(session.user.id);
  const totalBadges = badges.length;
  const progress = (earnedCount / totalBadges) * 100;

  const badgesByCategory = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, typeof badges>);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🏆 Rozetler</h1>
          <p className="text-muted-foreground">
            Başarılarını kutla ve yeni rozetler kazan!
          </p>
      </div>

      {/* Stats Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>İlerleme</CardTitle>
          <CardDescription>
            {earnedCount} / {totalBadges} rozet kazandın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{user?.level}</div>
              <div className="text-sm text-muted-foreground">Seviye</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{user?.xp}</div>
              <div className="text-sm text-muted-foreground">XP</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{user?.coins}</div>
              <div className="text-sm text-muted-foreground">Coin</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges by Category */}
      {Object.entries(badgesByCategory).map(([category, categoryBadges]) => {
        const Icon = categoryIcons[category] || Badge;
        return (
          <div key={category} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-5 h-5" />
              <h2 className="text-2xl font-bold">{categoryNames[category] || category}</h2>
              <span className="text-sm text-muted-foreground">
                ({categoryBadges.filter((b) => b.earned).length}/{categoryBadges.length})
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`relative ${
                    badge.earned
                      ? 'border-primary bg-primary/5'
                      : 'opacity-60 grayscale'
                  }`}
                >
                  <CardContent className="p-4">
                    {!badge.earned && (
                      <div className="absolute top-2 right-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h3 className={`font-semibold mb-1 ${rarityColors[badge.rarity]}`}>
                        {badge.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {badge.description}
                      </p>
                      {badge.earned && badge.earnedAt && (
                        <p className="text-xs text-primary">
                          {new Date(badge.earnedAt).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                      {!badge.earned && (
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
                          {badge.xpReward > 0 && <span>+{badge.xpReward} XP</span>}
                          {badge.coinReward > 0 && <span>+{badge.coinReward} 🪙</span>}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
}
