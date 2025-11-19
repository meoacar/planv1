"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Target, Trophy, Users, Calendar, Zap } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  sinType: string | null;
  targetDays: number;
  maxSins: number;
  xpReward: number;
  coinReward: number;
  startDate: string;
  endDate: string;
  participantCount: number;
}

interface UserChallenge {
  id: string;
  progress: number;
  isCompleted: boolean;
  completedAt: string | null;
  joinedAt: string;
  challenge: Challenge;
}

const SIN_TYPE_LABELS: Record<string, string> = {
  tatli: "Tatlı",
  fastfood: "Fast Food",
  gazli: "Gazlı İçecek",
  alkol: "Alkol",
  diger: "Diğer",
};

export function SinChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [myChallenges, setMyChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [challengesRes, myChallengesRes] = await Promise.all([
        fetch("/api/v1/sin-challenges"),
        fetch("/api/v1/sin-challenges/my?status=active"),
      ]);

      if (challengesRes.ok) {
        const data = await challengesRes.json();
        setChallenges(data.challenges || []);
      }

      if (myChallengesRes.ok) {
        const data = await myChallengesRes.json();
        setMyChallenges(data.participations || []);
      }
    } catch (error) {
      toast.error("Challenge'lar yüklenemedi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJoin = async (challengeId: string) => {
    setJoining(challengeId);
    try {
      const response = await fetch("/api/v1/sin-challenges/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Katılma başarısız");
      }

      toast.success(data.message);
      await fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setJoining(null);
    }
  };

  const joinedChallengeIds = new Set(myChallenges.map((c) => c.challenge.id));

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">Yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Aktif Challenge'larım */}
      {myChallenges.length > 0 && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              Aktif Challenge'larım
              <Badge variant="secondary" className="ml-auto">
                {myChallenges.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {myChallenges.map((userChallenge) => {
              const c = userChallenge.challenge;
              const daysLeft = Math.ceil(
                (new Date(c.endDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={userChallenge.id}
                  className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {c.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {c.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {daysLeft} gün kaldı
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {c.targetDays} gün hedef
                        </span>
                        {c.sinType && (
                          <Badge variant="outline" className="text-xs">
                            {SIN_TYPE_LABELS[c.sinType]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* İlerleme */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        İlerleme
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        %{userChallenge.progress}
                      </span>
                    </div>
                    <Progress value={userChallenge.progress} className="h-2" />
                  </div>

                  {/* Ödüller */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                      +{c.xpReward} XP
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20">
                      +{c.coinReward} Coin
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Tüm Challenge'lar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Tüm Challenge'lar
            <Badge variant="outline" className="ml-auto">
              {challenges.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {challenges.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Henüz aktif challenge yok</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => {
                const isJoined = joinedChallengeIds.has(challenge.id);
                const daysLeft = Math.ceil(
                  (new Date(challenge.endDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={challenge.id}
                    className="p-4 rounded-xl border-2 bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                          {challenge.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {challenge.description}
                        </p>
                      </div>
                    </div>

                    {/* Detaylar */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {challenge.targetDays} gün
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {challenge.participantCount} katılımcı
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {daysLeft} gün kaldı
                        </span>
                      </div>

                      {challenge.sinType && (
                        <Badge variant="outline" className="text-xs">
                          {SIN_TYPE_LABELS[challenge.sinType]}
                        </Badge>
                      )}

                      <p className="text-xs text-gray-500">
                        Hedef: En fazla {challenge.maxSins} kaçamak
                      </p>
                    </div>

                    {/* Ödüller ve Buton */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {challenge.xpReward} XP
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {challenge.coinReward} Coin
                        </Badge>
                      </div>

                      {isJoined ? (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Katıldın
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleJoin(challenge.id)}
                          disabled={joining === challenge.id}
                          className="h-8 text-xs"
                        >
                          {joining === challenge.id ? "Katılıyor..." : "Katıl"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
