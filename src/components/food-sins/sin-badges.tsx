"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Award, Lock, Sparkles } from "lucide-react";

interface SinBadge {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  xpReward: number;
  coinReward: number;
}

interface UserBadge {
  id: number;
  badge: SinBadge;
  earnedAt: string;
}

export function SinBadges() {
  const [allBadges, setAllBadges] = useState<SinBadge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      // Tüm rozetleri ve kullanıcının kazandıklarını çek
      const [badgesRes, userBadgesRes] = await Promise.all([
        fetch("/api/v1/sin-badges"),
        fetch("/api/v1/sin-badges/my"),
      ]);

      if (badgesRes.ok) {
        const badgesData = await badgesRes.json();
        setAllBadges(badgesData.badges || []);
      }

      if (userBadgesRes.ok) {
        const userBadgesData = await userBadgesRes.json();
        setUserBadges(userBadgesData.badges || []);
      }
    } catch (error) {
      toast.error("Rozetler yüklenemedi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badge.id));

  const handleCheckBadges = async () => {
    setChecking(true);
    try {
      const response = await fetch("/api/v1/sin-badges/check", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Kontrol başarısız");

      const data = await response.json();
      toast.success(data.message);

      // Rozetleri yenile
      if (data.awarded && data.awarded.length > 0) {
        await fetchBadges();
      }
    } catch (error) {
      toast.error("Rozet kontrolü başarısız");
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

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
      {/* Manuel Kontrol Butonu */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Rozet Kontrolü
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kazanabileceğin yeni rozetleri kontrol et
              </p>
            </div>
            <Button
              onClick={handleCheckBadges}
              disabled={checking}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {checking ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Kontrol Ediliyor...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Rozetleri Kontrol Et
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kazanılan Rozetler */}
      {userBadges.length > 0 && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Kazandığın Rozetler
              <Badge variant="secondary" className="ml-auto">
                {userBadges.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userBadges.map((userBadge) => (
                <div
                  key={userBadge.id}
                  className="relative p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-700 shadow-lg"
                >
                  {/* Parlama Efekti */}
                  <div className="absolute top-2 right-2">
                    <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                  </div>

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="text-5xl flex-shrink-0">
                      {userBadge.badge.icon}
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {userBadge.badge.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {userBadge.badge.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <Badge variant="outline" className="bg-white/50">
                          +{userBadge.badge.xpReward} XP
                        </Badge>
                        <Badge variant="outline" className="bg-white/50">
                          +{userBadge.badge.coinReward} Coin
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Kazanıldı:{" "}
                        {format(new Date(userBadge.earnedAt), "d MMM yyyy", {
                          locale: tr,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tüm Rozetler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Tüm Rozetler
            <Badge variant="outline" className="ml-auto">
              {earnedBadgeIds.size} / {allBadges.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBadges.map((badge) => {
              const isEarned = earnedBadgeIds.has(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all
                    ${
                      isEarned
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700"
                        : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60"
                    }
                  `}
                >
                  {/* Kilit İkonu */}
                  {!isEarned && (
                    <div className="absolute top-2 right-2">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`text-4xl flex-shrink-0 ${
                        !isEarned ? "grayscale opacity-50" : ""
                      }`}
                    >
                      {badge.icon}
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        {badge.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {badge.description}
                      </p>
                      <p className="text-xs text-gray-500 italic mb-2">
                        📋 {badge.requirement}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge
                          variant="outline"
                          className={
                            isEarned ? "bg-white/50" : "bg-gray-100 dark:bg-gray-800"
                          }
                        >
                          {badge.xpReward} XP
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            isEarned ? "bg-white/50" : "bg-gray-100 dark:bg-gray-800"
                          }
                        >
                          {badge.coinReward} Coin
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {allBadges.length === 0 && (
            <div className="text-center py-12">
              <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Henüz rozet tanımlanmamış</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
