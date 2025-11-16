'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Crown, Loader2, Plus, AlertCircle } from 'lucide-react';
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
  isPublic: boolean;
  maxMembers: number;
  leader: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
}

interface MyGuildData {
  guild: Guild & {
    status: string;
    rejectionReason?: string | null;
  } | null;
  membership: {
    role: string;
    joinedAt: string;
    xpEarned: number;
  } | null;
}

export default function GuildsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [myGuild, setMyGuild] = useState<MyGuildData | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callbackUrl=/lonca');
    }
  }, [status, router]);

  useEffect(() => {
    fetchGuilds();
    fetchMyGuild();
  }, []);

  const fetchGuilds = async () => {
    try {
      const res = await fetch('/api/v1/guilds');
      if (!res.ok) throw new Error('Failed to fetch guilds');
      const data = await res.json();
      setGuilds(data.data);
    } catch (error) {
      toast.error('Loncalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGuild = async () => {
    try {
      const res = await fetch('/api/v1/guilds/my-guild');
      if (!res.ok) return;
      const data = await res.json();
      setMyGuild(data.data);
    } catch (error) {
      console.error('My guild fetch error:', error);
    }
  };

  const joinGuild = async (guildId: string) => {
    setJoining(guildId);
    try {
      const res = await fetch(`/api/v1/guilds/${guildId}/join`, {
        method: 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Failed to join guild');
      }

      toast.success('Loncaya katıldın! 🎉');
      router.push(`/lonca/${guilds.find((g) => g.id === guildId)?.slug}`);
    } catch (error: any) {
      toast.error(error.message || 'Katılma başarısız');
    } finally {
      setJoining(null);
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

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Crown className="w-4 h-4" />
                Gamification Sistemi
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Loncalar
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                Aynı hedeflere sahip kullanıcılarla bir araya gel, görevler tamamla, 
                XP kazan ve liderlik tablosunda yüksel! 🚀
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button size="lg" onClick={() => router.push('/lonca/olustur')}>
                  <Plus className="w-5 h-5 mr-2" />
                  Lonca Oluştur
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push('/lonca/liderlik')}>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Liderlik Tablosu
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                <div className="relative text-8xl md:text-9xl">🏰</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* My Guild Status Banner */}
        {myGuild?.guild && myGuild.guild.status !== 'published' && (
          <Card className={`mb-6 border-2 ${
            myGuild.guild.status === 'pending' 
              ? 'border-yellow-500/50 bg-yellow-500/5' 
              : 'border-red-500/50 bg-red-500/5'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{myGuild.guild.icon || '🏰'}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{myGuild.guild.name}</h3>
                    {myGuild.guild.status === 'pending' && (
                      <Badge className="bg-yellow-500 text-white">
                        ⏳ Onay Bekliyor
                      </Badge>
                    )}
                    {myGuild.guild.status === 'rejected' && (
                      <Badge className="bg-red-500 text-white">
                        ❌ Reddedildi
                      </Badge>
                    )}
                  </div>
                  
                  {myGuild.guild.status === 'pending' && (
                    <p className="text-muted-foreground mb-3">
                      Loncanız admin onayı bekliyor. Onaylandığında bildirim alacaksınız.
                    </p>
                  )}
                  
                  {myGuild.guild.status === 'rejected' && myGuild.guild.rejectionReason && (
                    <div className="space-y-2">
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        Red Nedeni:
                      </p>
                      <p className="text-muted-foreground bg-background/50 p-3 rounded-lg">
                        {myGuild.guild.rejectionReason}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Düzenlemeler yapıp tekrar başvurabilirsiniz.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {myGuild.guild.status === 'pending' && (
                      <Button variant="outline" size="sm" disabled>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Onay Bekleniyor
                      </Button>
                    )}
                    {myGuild.guild.status === 'rejected' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/lonca/${myGuild.guild?.slug}/duzenle`)}
                      >
                        Düzenle ve Tekrar Gönder
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{guilds.length}</p>
                  <p className="text-sm text-muted-foreground">Aktif Lonca</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {guilds.reduce((sum, g) => sum + g.totalXP, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Toplam XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Crown className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {guilds.reduce((sum, g) => sum + g.memberCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Toplam Üye</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Tüm Loncalar</h2>
          <p className="text-sm text-muted-foreground">
            {guilds.length} lonca bulundu
          </p>
        </div>
      </div>

      {/* Guilds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guilds.map((guild) => {
          const isFull = guild.memberCount >= guild.maxMembers;
          const fillPercentage = (guild.memberCount / guild.maxMembers) * 100;
          const isMyGuild = myGuild?.guild?.id === guild.id;
          const isLeader = guild.leader.id === session?.user?.id;

          return (
            <Card 
              key={guild.id} 
              className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
                    <div className="relative text-5xl transform group-hover:scale-110 transition-transform">
                      {guild.icon || '🏰'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      ⭐ Lv. {guild.level}
                    </Badge>
                    {!guild.isPublic && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200">
                        🔒 Özel
                      </Badge>
                    )}
                    {isFull && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200">
                        🔒 Dolu
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {guild.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {guild.description || 'Henüz açıklama eklenmemiş'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Üye Doluluk</span>
                    <span className="font-medium">{guild.memberCount} / {guild.maxMembers}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">XP</p>
                      <p className="text-sm font-bold">{guild.totalXP.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Lider</p>
                      <p className="text-sm font-bold truncate">
                        {guild.leader?.username || guild.leader?.name || 'Anonim'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/lonca/${guild.slug}`)}
                  >
                    Görüntüle
                  </Button>
                  {isMyGuild ? (
                    <Button
                      className="flex-1"
                      variant="default"
                      onClick={() => router.push(`/lonca/${guild.slug}`)}
                    >
                      {isLeader ? '👑 Loncan' : '✓ Üyesin'}
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={() => joinGuild(guild.id)}
                      disabled={isFull || joining === guild.id}
                    >
                      {joining === guild.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isFull ? (
                        '🔒 Dolu'
                      ) : (
                        '⚔️ Katıl'
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {guilds.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative text-6xl">🏰</div>
            </div>
            <h3 className="text-xl font-bold mb-2">Henüz Lonca Yok</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              İlk loncayı sen oluştur ve lider ol! Arkadaşlarını davet et, 
              görevler tamamla ve XP kazan.
            </p>
            <Button size="lg" onClick={() => router.push('/lonca/olustur')}>
              <Plus className="w-5 h-5 mr-2" />
              İlk Loncayı Oluştur
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}
