'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Users, Crown, ArrowLeft, Loader2, Medal } from 'lucide-react';
import { toast } from 'sonner';

interface Guild {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  memberCount: number;
  totalXP: number;
  level: number;
  leader: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
}

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callbackUrl=/lonca/liderlik');
    }
  }, [status, router]);

  useEffect(() => {
    fetchGuilds();
  }, []);

  const fetchGuilds = async () => {
    try {
      const res = await fetch('/api/v1/guilds');
      if (!res.ok) throw new Error('Failed to fetch guilds');
      const data = await res.json();
      // XP'ye göre sırala
      const sorted = data.data.sort((a: Guild, b: Guild) => b.totalXP - a.totalXP);
      setGuilds(sorted);
    } catch (error) {
      toast.error('Liderlik tablosu yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🥇', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200', label: '1. Sıra' };
    if (rank === 2) return { icon: '🥈', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200', label: '2. Sıra' };
    if (rank === 3) return { icon: '🥉', color: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200', label: '3. Sıra' };
    return { icon: `#${rank}`, color: 'bg-muted text-muted-foreground', label: `${rank}. Sıra` };
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

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-background border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Link
            href="/lonca"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Loncalara Dön
          </Link>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Trophy className="w-4 h-4" />
                Liderlik Tablosu
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                En İyi Loncalar
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                XP sıralamasına göre en başarılı loncaları keşfet ve onlara katıl! 🏆
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
                <div className="relative text-8xl md:text-9xl">🏆</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Top 3 Podium */}
        {guilds.length >= 3 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">🏆 Podyum</h2>
            <div className="grid grid-cols-3 gap-4 items-end">
              {/* 2nd Place */}
              <Card className="border-2 border-gray-300 dark:border-gray-700 transform hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-3">🥈</div>
                  <div className="text-4xl mb-2">{guilds[1].icon || '🏰'}</div>
                  <h3 className="font-bold text-lg mb-1">{guilds[1].name}</h3>
                  <Badge variant="secondary" className="mb-2">Lv. {guilds[1].level}</Badge>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold text-foreground">{guilds[1].totalXP.toLocaleString()}</span>
                    <span>XP</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-3 w-full"
                    onClick={() => router.push(`/lonca/${guilds[1].slug}`)}
                  >
                    Görüntüle
                  </Button>
                </CardContent>
              </Card>

              {/* 1st Place */}
              <Card className="border-4 border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-transparent transform hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-3">🥇</div>
                  <div className="text-5xl mb-2">{guilds[0].icon || '🏰'}</div>
                  <h3 className="font-bold text-xl mb-1">{guilds[0].name}</h3>
                  <Badge className="mb-2 bg-yellow-500 text-white">👑 Lv. {guilds[0].level}</Badge>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold text-foreground text-lg">{guilds[0].totalXP.toLocaleString()}</span>
                    <span>XP</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => router.push(`/lonca/${guilds[0].slug}`)}
                  >
                    Görüntüle
                  </Button>
                </CardContent>
              </Card>

              {/* 3rd Place */}
              <Card className="border-2 border-orange-300 dark:border-orange-700 transform hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-3">🥉</div>
                  <div className="text-4xl mb-2">{guilds[2].icon || '🏰'}</div>
                  <h3 className="font-bold text-lg mb-1">{guilds[2].name}</h3>
                  <Badge variant="secondary" className="mb-2">Lv. {guilds[2].level}</Badge>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold text-foreground">{guilds[2].totalXP.toLocaleString()}</span>
                    <span>XP</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-3 w-full"
                    onClick={() => router.push(`/lonca/${guilds[2].slug}`)}
                  >
                    Görüntüle
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5" />
              Tüm Loncalar
            </CardTitle>
            <CardDescription>
              XP sıralamasına göre tüm loncalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {guilds.map((guild, index) => {
                const rank = index + 1;
                const badge = getRankBadge(rank);

                return (
                  <div
                    key={guild.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-16 text-center">
                      <Badge className={badge.color}>
                        {badge.icon}
                      </Badge>
                    </div>

                    {/* Icon */}
                    <div className="text-3xl flex-shrink-0">
                      {guild.icon || '🏰'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold truncate">{guild.name}</h3>
                        <Badge variant="outline" className="flex-shrink-0">
                          Lv. {guild.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {guild.memberCount} üye
                        </span>
                        <span className="flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          {guild.leader.username || guild.leader.name || 'Anonim'}
                        </span>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-2 text-lg font-bold">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        {guild.totalXP.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>

                    {/* Action */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/lonca/${guild.slug}`)}
                    >
                      Görüntüle
                    </Button>
                  </div>
                );
              })}
            </div>

            {guilds.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Henüz lonca yok</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
