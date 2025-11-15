'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Calendar, Loader2, Medal } from 'lucide-react';
import { toast } from 'sonner';

interface League {
  id: string;
  tier: string;
  name: string;
  minPoints: number;
  maxPoints: number | null;
  icon: string | null;
}

interface Season {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  leagues: League[];
}

interface UserLeague {
  id: string;
  points: number;
  rank: number | null;
  league: League;
}

const tierColors: Record<string, string> = {
  bronze: 'text-orange-700',
  silver: 'text-gray-400',
  gold: 'text-yellow-500',
  platinum: 'text-cyan-400',
  diamond: 'text-blue-500',
};

const tierEmojis: Record<string, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
  diamond: '💠',
};

export default function SeasonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [season, setSeason] = useState<Season | null>(null);
  const [userLeague, setUserLeague] = useState<UserLeague | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callbackUrl=/sezonlar');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [seasonRes, userLeagueRes] = await Promise.all([
        fetch('/api/v1/seasons/current'),
        fetch('/api/v1/leagues/my'),
      ]);

      if (seasonRes.ok) {
        const seasonData = await seasonRes.json();
        setSeason(seasonData.data);
      }

      if (userLeagueRes.ok) {
        const userLeagueData = await userLeagueRes.json();
        setUserLeague(userLeagueData.data);
      }
    } catch (error) {
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </>
    );
  }

  if (!season) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Şu anda aktif sezon yok</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const currentLeague = userLeague?.league;
  const currentLeagueIndex = season.leagues.findIndex((l) => l.id === currentLeague?.id);
  const nextLeague = currentLeagueIndex >= 0 ? season.leagues[currentLeagueIndex + 1] : null;
  const progressToNext = nextLeague
    ? ((userLeague?.points || 0) / nextLeague.minPoints) * 100
    : 100;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🏆 Sezonlar & Ligler</h1>
        <p className="text-muted-foreground">
          Yarış, puan kazan ve ligde yüksel!
        </p>
      </div>

      {/* Current Season */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {season.name}
              </CardTitle>
              <CardDescription>{season.description}</CardDescription>
            </div>
            <Badge variant="default">Aktif</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Başlangıç: {new Date(season.startDate).toLocaleDateString('tr-TR')}
            </span>
            <span className="text-muted-foreground">
              Bitiş: {new Date(season.endDate).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* User League Status */}
      {userLeague && currentLeague && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mevcut Ligin</CardTitle>
            <CardDescription>İlerleme ve sıralaman</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">{tierEmojis[currentLeague.tier]}</div>
              <div className="flex-1">
                <h3 className={`text-2xl font-bold ${tierColors[currentLeague.tier]}`}>
                  {currentLeague.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {userLeague.points} puan
                  </span>
                  {userLeague.rank && (
                    <span className="flex items-center gap-1">
                      <Medal className="w-4 h-4" />
                      #{userLeague.rank}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {nextLeague && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Sonraki lig: {nextLeague.name}
                  </span>
                  <span className="font-medium">
                    {userLeague.points} / {nextLeague.minPoints}
                  </span>
                </div>
                <Progress value={Math.min(progressToNext, 100)} />
              </div>
            )}

            {!nextLeague && (
              <div className="text-center py-4">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm font-medium">En yüksek ligdesin! 🎉</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Leagues */}
      <div>
        <h2 className="text-xl font-bold mb-4">Tüm Ligler</h2>
        <div className="space-y-4">
          {season.leagues.map((league, index) => {
            const isCurrentLeague = league.id === currentLeague?.id;
            const isUnlocked = userLeague && userLeague.points >= league.minPoints;

            return (
              <Card
                key={league.id}
                className={isCurrentLeague ? 'border-primary bg-primary/5' : ''}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{tierEmojis[league.tier]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-lg font-bold ${tierColors[league.tier]}`}>
                          {league.name}
                        </h3>
                        {isCurrentLeague && (
                          <Badge variant="default" className="text-xs">
                            Mevcut
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {league.minPoints} puan
                        {league.maxPoints && ` - ${league.maxPoints} puan`}
                      </p>
                    </div>
                    <div>
                      {isUnlocked ? (
                        <Badge variant="outline" className="text-green-600">
                          Açıldı
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Kilitli</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      </div>
    </>
  );
}
