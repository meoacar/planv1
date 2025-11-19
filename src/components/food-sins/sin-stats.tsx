"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SinStats {
  period: string;
  totalSins: number;
  cleanDays: number;
  motivationBar: number;
  sinsByType: Record<string, number>;
}

const PERIODS = [
  { value: "daily", label: "Bugün" },
  { value: "weekly", label: "Bu Hafta" },
  { value: "monthly", label: "Bu Ay" },
] as const;

const SIN_TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  tatli: { label: "Tatlı", emoji: "🍰" },
  fastfood: { label: "Fast Food", emoji: "🍟" },
  gazli: { label: "Gazlı İçecek", emoji: "🥤" },
  alkol: { label: "Alkol", emoji: "🍺" },
  diger: { label: "Diğer", emoji: "🍩" },
};

export function SinStats() {
  const [stats, setStats] = useState<SinStats | null>(null);
  const [period, setPeriod] = useState<string>("weekly");
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/food-sins/stats?period=${period}`);
      if (!response.ok) throw new Error("İstatistikler yüklenemedi");
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast.error("İstatistikler yüklenemedi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const motivationColor =
    stats.motivationBar >= 70
      ? "bg-green-500"
      : stats.motivationBar >= 40
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="space-y-4">
      {/* Dönem Seçici */}
      <div className="flex gap-2">
        {PERIODS.map((p) => (
          <Button
            key={p.value}
            size="sm"
            variant={period === p.value ? "default" : "outline"}
            onClick={() => setPeriod(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Toplam Günah */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Kaçamak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.totalSins}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalSins === 0
                ? "Tertemizsin! 😇"
                : stats.totalSins <= 3
                ? "İyi gidiyorsun! 💪"
                : "Biraz fazla olmuş 😅"}
            </p>
          </CardContent>
        </Card>

        {/* Temiz Günler */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Temiz Günler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-500">
              {stats.cleanDays}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.cleanDays >= 5
                ? "Harika bir seri! 🔥"
                : "Devam et! 💚"}
            </p>
          </CardContent>
        </Card>

        {/* Motivasyon Barı */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Motivasyon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              %{stats.motivationBar}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${motivationColor}`}
                style={{ width: `${stats.motivationBar}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Günah Türü Dağılımı */}
      <Card>
        <CardHeader>
          <CardTitle>Kaçamak Dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats.sinsByType || Object.keys(stats.sinsByType).length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Henüz veri yok 📊
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.sinsByType)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => {
                  const typeInfo = SIN_TYPE_LABELS[type];
                  const percentage = Math.round(
                    (count / stats.totalSins) * 100
                  );

                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-xl">{typeInfo?.emoji}</span>
                          <span className="font-medium">
                            {typeInfo?.label || type}
                          </span>
                        </span>
                        <span className="text-muted-foreground">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
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
