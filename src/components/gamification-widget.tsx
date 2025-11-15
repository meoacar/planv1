'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Coins, Zap, Target, ChevronRight } from 'lucide-react';

interface GamificationData {
  coins: number;
  xp: number;
  level: number;
  streak: number;
  badges: number;
  quests: {
    completed: number;
    total: number;
  };
}

export function GamificationWidget() {
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, badgesRes, questsRes] = await Promise.all([
        fetch('/api/user/me').catch(() => null),
        fetch('/api/v1/badges/my').catch(() => null),
        fetch('/api/v1/quests').catch(() => null),
      ]);

      if (!userRes || !userRes.ok) {
        setData(null);
        return;
      }

      const user = await userRes.json().catch(() => ({ data: null }));
      const badges = badgesRes && badgesRes.ok ? await badgesRes.json().catch(() => ({ data: [] })) : { data: [] };
      const quests = questsRes && questsRes.ok ? await questsRes.json().catch(() => ({ data: [] })) : { data: [] };

      const completedQuests = quests.data?.filter((q: any) => q.userProgress?.completed).length || 0;
      const totalQuests = quests.data?.length || 0;

      setData({
        coins: user.data?.coins || 0,
        xp: user.data?.xp || 0,
        level: user.data?.level || 1,
        streak: user.data?.streak || 0,
        badges: badges.data?.length || 0,
        quests: {
          completed: completedQuests,
          total: totalQuests,
        },
      });
    } catch (error) {
      // Silently fail - widget is optional
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Oyunlaştırma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const xpForNextLevel = Math.floor(100 * Math.pow(1.5, data.level - 1));
  const xpProgress = (data.xp / xpForNextLevel) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Oyunlaştırma
        </CardTitle>
        <CardDescription>İlerleme ve ödüllerin</CardDescription>
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
}
