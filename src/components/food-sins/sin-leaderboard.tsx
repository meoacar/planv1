'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, TrendingUp, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

type Period = 'daily' | 'weekly' | 'monthly' | 'alltime';
type Metric = 'cleanDays' | 'leastSins' | 'motivation';

interface LeaderboardUser {
  userId: string;
  name: string;
  username: string | null;
  image: string | null;
  level: number;
  xp: number;
  totalSins: number;
  cleanDays: number;
  motivationScore: number;
  badges: Array<{ icon: string; name: string }>;
  isCurrentUser: boolean;
  rank: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[];
  currentUser: LeaderboardUser | null;
  period: string;
  metric: string;
  totalUsers: number;
}

export default function SinLeaderboard() {
  const [period, setPeriod] = useState<Period>('weekly');
  const [metric, setMetric] = useState<Metric>('cleanDays');
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period, metric]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/food-sins/leaderboard?period=${period}&metric=${metric}`
      );

      if (!response.ok) throw new Error('Failed to fetch leaderboard');

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Leaderboard error:', error);
      toast.error('Liderlik tablosu yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getMetricValue = (user: LeaderboardUser) => {
    switch (metric) {
      case 'leastSins':
        return `${user.totalSins} günah`;
      case 'motivation':
        return `${user.motivationScore}% motivasyon`;
      case 'cleanDays':
      default:
        return `${user.cleanDays} temiz gün`;
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'daily':
        return 'Bugün';
      case 'weekly':
        return 'Bu Hafta';
      case 'monthly':
        return 'Bu Ay';
      case 'alltime':
        return 'Tüm Zamanlar';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Liderlik Tablosu
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

  return (
    <div className="space-y-4">
      {/* Mevcut Kullanıcı Kartı */}
      {data?.currentUser && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex-shrink-0">
                  {getRankIcon(data.currentUser.rank)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-base">Senin Sıralaman</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {data.totalUsers} kullanıcı arasında
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg sm:text-2xl font-bold whitespace-nowrap">{getMetricValue(data.currentUser)}</p>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  Lv {data.currentUser.level} • {data.currentUser.xp} XP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ana Liderlik Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Liderlik Tablosu
          </CardTitle>
          <CardDescription>
            En başarılı kullanıcıları keşfet ve motivasyonunu artır
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cleanDays" onValueChange={(v) => setMetric(v as Metric)}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="cleanDays" className="text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Temiz Günler</span>
                <span className="sm:hidden">Temiz</span>
              </TabsTrigger>
              <TabsTrigger value="leastSins" className="text-xs sm:text-sm">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">En Az Günah</span>
                <span className="sm:hidden">Günah</span>
              </TabsTrigger>
              <TabsTrigger value="motivation" className="text-xs sm:text-sm">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Motivasyon</span>
                <span className="sm:hidden">Motiv.</span>
              </TabsTrigger>
            </TabsList>

            {/* Dönem Seçimi */}
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
              {(['daily', 'weekly', 'monthly', 'alltime'] as Period[]).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className="whitespace-nowrap text-xs sm:text-sm"
                >
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  {p === 'daily' && 'Bugün'}
                  {p === 'weekly' && 'Bu Hafta'}
                  {p === 'monthly' && 'Bu Ay'}
                  {p === 'alltime' && 'Tüm Zamanlar'}
                </Button>
              ))}
            </div>

            {/* Tüm metrikler için aynı içerik */}
            {['cleanDays', 'leastSins', 'motivation'].map((m) => (
              <TabsContent key={m} value={m} className="space-y-3">
                {data?.leaderboard.map((user) => (
                  <div
                  key={user.userId}
                  className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-colors ${
                    user.isCurrentUser
                      ? 'bg-primary/5 border-primary'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  {/* Sıralama */}
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex-shrink-0">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    <AvatarImage src={user.image || undefined} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Kullanıcı Bilgileri */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate text-sm sm:text-base">
                        {user.name}
                      </span>
                      {user.isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          Sen
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                      <span>Lv {user.level}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{user.xp} XP</span>
                      {user.badges.length > 0 && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex gap-1">
                            {user.badges.slice(0, 2).map((badge, idx) => (
                              <span key={idx} title={badge.name} className="text-sm">
                                {badge.icon}
                              </span>
                            ))}
                            {user.badges.length > 2 && (
                              <span className="text-xs">+{user.badges.length - 2}</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Metrik Değeri */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-base sm:text-xl font-bold whitespace-nowrap">{getMetricValue(user)}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {metric === 'cleanDays' && 'temiz gün'}
                      {metric === 'leastSins' && 'toplam günah'}
                      {metric === 'motivation' && 'motivasyon skoru'}
                    </p>
                  </div>
                </div>
                ))}

                {data?.leaderboard.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Henüz veri yok</p>
                    <p className="text-sm">İlk sen ol!</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
