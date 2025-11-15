'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Crown, Loader2, Plus } from 'lucide-react';
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

export default function GuildsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callbackUrl=/lonca');
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
      setGuilds(data.data);
    } catch (error) {
      toast.error('Loncalar yüklenemedi');
    } finally {
      setLoading(false);
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">🏰 Loncalar</h1>
          <p className="text-muted-foreground">
            Bir loncaya katıl veya kendi loncanı oluştur!
          </p>
        </div>
        <Button onClick={() => router.push('/lonca/olustur')}>
          <Plus className="w-4 h-4 mr-2" />
          Lonca Oluştur
        </Button>
      </div>

      {/* Info Card */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Lonca Nedir?</h3>
          <p className="text-sm text-muted-foreground">
            Loncalar, aynı hedeflere sahip kullanıcıların bir araya geldiği takımlardır.
            Loncanızla birlikte görevler tamamlayın, XP kazanın ve liderlik tablosunda
            yükselişe geçin!
          </p>
        </CardContent>
      </Card>

      {/* Guilds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guilds.map((guild) => {
          const isFull = guild.memberCount >= guild.maxMembers;

          return (
            <Card key={guild.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-4xl">{guild.icon || '🏰'}</div>
                  <Badge variant="secondary">Seviye {guild.level}</Badge>
                </div>
                <CardTitle className="flex items-center gap-2">
                  {guild.name}
                  {guild.leader && (
                    <Crown className="w-4 h-4 text-yellow-500" title="Lider" />
                  )}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {guild.description || 'Açıklama yok'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      Üyeler
                    </span>
                    <span className="font-medium">
                      {guild.memberCount} / {guild.maxMembers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      Toplam XP
                    </span>
                    <span className="font-medium">{guild.totalXP.toLocaleString()}</span>
                  </div>
                  {guild.leader && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lider</span>
                      <span className="font-medium">
                        {guild.leader.username || guild.leader.name || 'Anonim'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/lonca/${guild.slug}`)}
                  >
                    Görüntüle
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => joinGuild(guild.id)}
                    disabled={isFull || joining === guild.id}
                  >
                    {joining === guild.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isFull ? (
                      'Dolu'
                    ) : (
                      'Katıl'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {guilds.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Henüz lonca yok</p>
            <Button onClick={() => router.push('/lonca/olustur')}>
              <Plus className="w-4 h-4 mr-2" />
              İlk Loncayı Oluştur
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}
