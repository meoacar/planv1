import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Coins, Zap, Target, ChevronRight } from 'lucide-react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GamificationWidget() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  try {
    // Fetch user data
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        coins: true,
        xp: true,
        level: true,
        streak: true,
        _count: {
          select: {
            badges: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Fetch quests - simplified
    const completedQuests = 0;
    const totalQuests = 0;

    const data = {
      coins: user.coins || 0,
      xp: user.xp || 0,
      level: user.level || 1,
      streak: user.streak || 0,
      badges: user._count.badges || 0,
      quests: {
        completed: completedQuests,
        total: totalQuests,
      },
    };

    const xpForNextLevel = Math.floor(100 * Math.pow(1.5, data.level - 1));
    const xpProgress = (data.xp / xpForNextLevel) * 100;

    return (
    <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Oyunlaştırma</CardTitle>
            <CardDescription className="text-xs">İlerleme ve ödüllerin</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level & XP */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Seviye {data.level}</span>
            <span className="text-xs text-muted-foreground">
              {data.xp} / {xpForNextLevel} XP
            </span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg">
            <Coins className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="text-lg font-bold">{data.coins}</div>
              <div className="text-xs text-muted-foreground">Coin</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-orange-500/10 rounded-lg">
            <Zap className="w-5 h-5 text-orange-600" />
            <div>
              <div className="text-lg font-bold">{data.streak}</div>
              <div className="text-xs text-muted-foreground">Gün Seri</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-purple-500/10 rounded-lg">
            <Trophy className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-lg font-bold">{data.badges}</div>
              <div className="text-xs text-muted-foreground">Rozet</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
            <Target className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-lg font-bold">
                {data.quests.completed}/{data.quests.total}
              </div>
              <div className="text-xs text-muted-foreground">Görev</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2 pt-2">
          <Button variant="outline" className="w-full justify-between" asChild>
            <Link href="/gorevler">
              Günlük Görevler
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-between" asChild>
            <Link href="/magaza">
              Mağaza
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
    );
  } catch (error) {
    console.error('GamificationWidget error:', error);
    return null;
  }
}
