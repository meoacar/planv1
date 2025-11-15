'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Gift, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Quest {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  coinReward: number;
  type: string;
  target: number;
  userProgress: {
    progress: number;
    completed: boolean;
    completedAt: string | null;
  } | null;
}

export default function QuestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callbackUrl=/gorevler');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchQuests();
    }
  }, [session]);

  const fetchQuests = async () => {
    try {
      const res = await fetch('/api/v1/quests');
      if (!res.ok) throw new Error('Failed to fetch quests');
      const data = await res.json();
      setQuests(data.data);
    } catch (error) {
      toast.error('Görevler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const claimQuest = async (questId: string) => {
    setClaiming(questId);
    try {
      const res = await fetch('/api/v1/quests/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Failed to claim quest');
      }

      toast.success('Görev ödülü alındı! 🎉');
      fetchQuests();
    } catch (error: any) {
      toast.error(error.message || 'Ödül alınamadı');
    } finally {
      setClaiming(null);
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

  const completedQuests = quests.filter((q) => q.userProgress?.completed);
  const activeQuests = quests.filter((q) => !q.userProgress?.completed);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📋 Günlük Görevler</h1>
        <p className="text-muted-foreground">
          Görevleri tamamla, XP ve coin kazan!
        </p>
      </div>

      {/* Stats */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bugünün İlerlemesi</CardTitle>
          <CardDescription>
            {completedQuests.length} / {quests.length} görev tamamlandı
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={(completedQuests.length / quests.length) * 100}
            className="mb-2"
          />
        </CardContent>
      </Card>

      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Aktif Görevler</h2>
          <div className="space-y-4">
            {activeQuests.map((quest) => {
              const progress = quest.userProgress?.progress || 0;
              const percentage = (progress / quest.target) * 100;
              const canClaim = progress >= quest.target && !quest.userProgress?.completed;

              return (
                <Card key={quest.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{quest.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{quest.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {quest.description}
                            </p>
                          </div>
                          {canClaim ? (
                            <Button
                              onClick={() => claimQuest(quest.id)}
                              disabled={claiming === quest.id}
                              size="sm"
                            >
                              {claiming === quest.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Gift className="w-4 h-4 mr-2" />
                                  Ödülü Al
                                </>
                              )}
                            </Button>
                          ) : (
                            <Circle className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>

                        <div className="mb-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              İlerleme: {progress} / {quest.target}
                            </span>
                            <span className="font-medium">{percentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={percentage} />
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-primary">+{quest.xpReward} XP</span>
                          <span className="text-yellow-600">+{quest.coinReward} 🪙</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Tamamlanan Görevler</h2>
          <div className="space-y-4">
            {completedQuests.map((quest) => (
              <Card key={quest.id} className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl grayscale">{quest.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{quest.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {quest.description}
                          </p>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Tamamlandı:{' '}
                        {quest.userProgress?.completedAt &&
                          new Date(quest.userProgress.completedAt).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {quests.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Şu anda aktif görev yok</p>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}
