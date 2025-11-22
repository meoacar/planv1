'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Snowflake, RefreshCw, TrendingUp, Calendar, Award } from 'lucide-react';
import { toast } from 'sonner';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCleanDate: Date | null;
  streakBroken: boolean;
  achievedMilestones?: number[]; // Kazanılmış milestone günleri
}

export default function SinStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [freezeCount, setFreezeCount] = useState(0);
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    fetchStreakData();
    fetchUserData();
  }, []);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/food-sins/streak');
      if (!response.ok) throw new Error('Failed to fetch streak');

      const data = await response.json();
      setStreakData(data);
    } catch (error) {
      console.error('Streak fetch error:', error);
      toast.error('Streak verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (!response.ok) return;

      const data = await response.json();
      if (data.user) {
        setFreezeCount(data.user.streakFreezeCount || 0);
        setUserCoins(data.user.coins || 0);
      }
    } catch (error) {
      console.error('User data fetch error:', error);
    }
  };

  const handleUseFreeze = async () => {
    try {
      const response = await fetch('/api/v1/food-sins/streak/freeze', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to use freeze');
      }

      const data = await response.json();
      toast.success('❄️ Streak freeze kullanıldı!');
      setFreezeCount(data.remainingFreezes);
      fetchStreakData();
    } catch (error: any) {
      toast.error(error.message || 'Streak freeze kullanılamadı');
    }
  };

  const handleRecoverStreak = async () => {
    if (!streakData) return;

    const streakToRecover = streakData.longestStreak;
    const coinsCost = Math.min(streakToRecover * 10, 500);

    if (userCoins < coinsCost) {
      toast.error(`Yetersiz coin! ${coinsCost} coin gerekli.`);
      return;
    }

    if (!confirm(`${streakToRecover} günlük streak'i ${coinsCost} coin karşılığında geri almak istiyor musun?`)) {
      return;
    }

    try {
      const response = await fetch('/api/v1/food-sins/streak/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streakToRecover }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to recover streak');
      }

      const data = await response.json();
      toast.success(`🔥 ${data.streakRecovered} günlük streak geri alındı!`);
      setUserCoins(data.remainingCoins);
      fetchStreakData();
    } catch (error: any) {
      toast.error(error.message || 'Streak geri alınamadı');
    }
  };

  const getStreakLevel = (streak: number) => {
    if (streak >= 365) return { level: 'Efsane', color: 'text-purple-500', emoji: '👑' };
    if (streak >= 180) return { level: 'Usta', color: 'text-yellow-500', emoji: '⭐' };
    if (streak >= 90) return { level: 'İleri', color: 'text-blue-500', emoji: '💎' };
    if (streak >= 30) return { level: 'Orta', color: 'text-green-500', emoji: '🌟' };
    if (streak >= 7) return { level: 'Başlangıç', color: 'text-orange-500', emoji: '🔥' };
    return { level: 'Yeni', color: 'text-gray-500', emoji: '🌱' };
  };

  const getNextMilestone = (streak: number) => {
    const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
    const next = milestones.find((m) => m > streak);
    return next || 365;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Streak Sistemi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!streakData) return null;

  const streakLevel = getStreakLevel(streakData.currentStreak);
  const nextMilestone = getNextMilestone(streakData.currentStreak);
  const progressToNext = (streakData.currentStreak / nextMilestone) * 100;

  return (
    <div className="space-y-4">
      {/* Ana Streak Kartı */}
      <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Temiz Gün Serisi
          </CardTitle>
          <CardDescription>
            Ardışık günah yapmadığın günler
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mevcut Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-6xl">{streakLevel.emoji}</span>
              <div>
                <p className="text-5xl font-bold text-orange-500">
                  {streakData.currentStreak}
                </p>
                <p className="text-sm text-muted-foreground">gün</p>
              </div>
            </div>
            <Badge variant="secondary" className={`${streakLevel.color} text-lg px-4 py-1`}>
              {streakLevel.emoji} {streakLevel.level} Seviye
            </Badge>
          </div>

          {/* İlerleme Barı */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Hedef: {nextMilestone} gün
              </span>
              <span className="font-semibold text-foreground">
                {nextMilestone - streakData.currentStreak} gün kaldı
              </span>
            </div>
            <Progress value={progressToNext} className="h-3" />
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-background/50 border">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-foreground">{streakData.longestStreak}</p>
              <p className="text-xs text-muted-foreground">En Uzun Streak</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50 border">
              <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-foreground">
                {streakData.lastCleanDate
                  ? new Date(streakData.lastCleanDate).toLocaleDateString('tr-TR')
                  : '-'}
              </p>
              <p className="text-xs text-muted-foreground">Son Temiz Gün</p>
            </div>
          </div>

          {/* Streak Kırıldı Uyarısı */}
          {streakData.streakBroken && (
            <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200 text-center">
                ⚠️ Bugün günah yaptın! Streak sıfırlandı.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streak Koruma Araçları */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Streak Koruma
          </CardTitle>
          <CardDescription>
            Streak'ini korumak için özel araçlar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Streak Freeze */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Snowflake className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-semibold text-foreground">Streak Freeze</p>
                <p className="text-sm text-muted-foreground">
                  Bir günlük hata yapsan bile streak'in korunur
                </p>
                <Badge variant="secondary" className="mt-1">
                  {freezeCount} adet mevcut
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUseFreeze}
              disabled={freezeCount <= 0}
            >
              <Snowflake className="w-4 h-4 mr-2" />
              Kullan
            </Button>
          </div>

          {/* Streak Recovery */}
          {streakData.streakBroken && streakData.longestStreak > 0 && (
            <div className="flex items-center justify-between p-4 rounded-lg border border-orange-300 bg-orange-50 dark:bg-orange-950/20">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="font-semibold text-foreground">Streak Geri Al</p>
                  <p className="text-sm text-muted-foreground">
                    {streakData.longestStreak} günlük streak'ini geri al
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {Math.min(streakData.longestStreak * 10, 500)} coin
                  </Badge>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleRecoverStreak}
                disabled={userCoins < Math.min(streakData.longestStreak * 10, 500)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Geri Al
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestone Rozetleri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Streak Milestone'ları
          </CardTitle>
          <CardDescription>
            Belirli streak günlerine ulaşarak rozet kazan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { days: 3, emoji: '🔥', xp: 50 },
              { days: 7, emoji: '🔥', xp: 100 },
              { days: 14, emoji: '🔥', xp: 200 },
              { days: 30, emoji: '🔥', xp: 500 },
              { days: 60, emoji: '🔥', xp: 1000 },
              { days: 90, emoji: '🔥', xp: 2000 },
              { days: 180, emoji: '🔥', xp: 5000 },
              { days: 365, emoji: '👑', xp: 10000 },
            ].map((milestone) => {
              const achieved = streakData.achievedMilestones?.includes(milestone.days) || false;
              return (
                <div
                  key={milestone.days}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    achieved
                      ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800'
                      : 'bg-muted/50 opacity-50'
                  }`}
                >
                  <span className="text-3xl">{milestone.emoji}</span>
                  <p className="text-sm font-semibold mt-1 text-foreground">{milestone.days} gün</p>
                  <p className="text-xs text-muted-foreground">+{milestone.xp} XP</p>
                  {achieved && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      ✓ Kazanıldı
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
