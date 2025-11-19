"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { TrendingDown, TrendingUp, Award, Flame, Sparkles, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface WeeklySummary {
  id?: string;
  weekStart: string;
  weekEnd: string;
  totalSins: number;
  cleanDays: number;
  longestStreak: number;
  badgesEarned: number;
  challengesCompleted: number;
  aiSummary?: string;
  mostSinType: string | null;
  motivationMessage: string;
  achievements: string[];
}

const SIN_TYPE_LABELS: Record<string, string> = {
  tatli: "Tatlı",
  fastfood: "Fast Food",
  gazli: "Gazlı İçecek",
  alkol: "Alkol",
  diger: "Diğer",
};

export function SinWeeklySummary() {
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchWeeklySummary = async () => {
    setLoading(true);
    try {
      // Önce kaydedilmiş AI özetini dene
      try {
        const summaryResponse = await fetch("/api/v1/food-sins/weekly-summary");
        if (summaryResponse.ok) {
          const savedSummary = await summaryResponse.json();
          
          // Stats'ı da al
          const statsResponse = await fetch("/api/v1/food-sins/stats?period=weekly");
          const data = await statsResponse.json();
          
          const now = new Date();
          const weekStart = startOfWeek(now, { locale: tr });
          const weekEnd = endOfWeek(now, { locale: tr });
          
          const sinsByType = data.sinsByType || {};
          const mostSinType = Object.entries(sinsByType).sort(
            ([, a], [, b]) => (b as number) - (a as number)
          )[0]?.[0] || null;
          
          setSummary({
            id: savedSummary.id,
            weekStart: format(weekStart, "d MMM", { locale: tr }),
            weekEnd: format(weekEnd, "d MMM", { locale: tr }),
            totalSins: savedSummary.totalSins,
            cleanDays: savedSummary.cleanDays,
            longestStreak: savedSummary.longestStreak,
            badgesEarned: savedSummary.badgesEarned,
            challengesCompleted: savedSummary.challengesCompleted,
            aiSummary: savedSummary.aiSummary,
            mostSinType,
            motivationMessage: "",
            achievements: [],
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        // Kaydedilmiş özet yok, devam et
      }

      // Kaydedilmiş özet yoksa normal stats'ı göster
      const response = await fetch("/api/v1/food-sins/stats?period=weekly");
      if (!response.ok) throw new Error("Özet yüklenemedi");

      const data = await response.json();

      // Haftalık özet oluştur
      const now = new Date();
      const weekStart = startOfWeek(now, { locale: tr });
      const weekEnd = endOfWeek(now, { locale: tr });

      // En çok yapılan günah türü
      const sinsByType = data.sinsByType || {};
      const mostSinType = Object.entries(sinsByType).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0]?.[0] || null;

      // Başarılar
      const achievements: string[] = [];
      if (data.cleanDays >= 5) achievements.push("5+ Temiz Gün 🌟");
      if (data.totalSins === 0) achievements.push("Sıfır Kaçamak 🏆");
      if (data.totalSins <= 3) achievements.push("Kontrollü Hafta 💪");
      if (data.motivationBar >= 80) achievements.push("Yüksek Motivasyon 🔥");

      // Motivasyon mesajı
      let motivationMessage = "";
      if (data.totalSins === 0) {
        motivationMessage = "Mükemmel bir hafta geçirdin! Hiç kaçamak yapmadın 🎉";
      } else if (data.totalSins <= 3) {
        motivationMessage = "Harika gidiyorsun! Kontrollü bir hafta 💪";
      } else if (data.totalSins <= 7) {
        motivationMessage = "Fena değil, ama biraz daha dikkatli olabilirsin 😊";
      } else {
        motivationMessage = "Bu hafta biraz fazla kaçtı, gelecek hafta daha iyi! 💚";
      }

      setSummary({
        weekStart: format(weekStart, "d MMM", { locale: tr }),
        weekEnd: format(weekEnd, "d MMM", { locale: tr }),
        totalSins: data.totalSins,
        cleanDays: data.cleanDays,
        longestStreak: 0,
        badgesEarned: 0,
        challengesCompleted: 0,
        mostSinType,
        motivationMessage,
        achievements,
      });
    } catch (error) {
      toast.error("Haftalık özet yüklenemedi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/v1/food-sins/generate-summary", {
        method: "POST",
      });

      if (!response.ok) throw new Error("AI özet oluşturulamadı");

      const data = await response.json();
      toast.success("AI özet oluşturuldu! 🤖");
      
      // Özeti yeniden yükle
      await fetchWeeklySummary();
    } catch (error) {
      toast.error("AI özet oluşturulamadı");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchWeeklySummary();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">Yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  if (!summary) return null;

  return (
    <Card className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Haftalık Özet
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {summary.weekStart} - {summary.weekEnd}
            </Badge>
            {!summary.aiSummary && (
              <Button
                size="sm"
                variant="outline"
                onClick={generateAISummary}
                disabled={generating}
                className="gap-2"
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    AI Özet
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* AI Özet */}
        {summary.aiSummary ? (
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-purple-900 dark:text-purple-100">
                AI Analiz
              </span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{summary.aiSummary}</ReactMarkdown>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={generateAISummary}
              disabled={generating}
              className="mt-3 gap-2 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              Yeniden Oluştur
            </Button>
          </div>
        ) : (
          /* Motivasyon Mesajı (Fallback) */
          <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border">
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {summary.motivationMessage}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                {summary.cleanDays} temiz gün
              </span>
              <span className="flex items-center gap-1">
                {summary.totalSins <= 3 ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
                {summary.totalSins} kaçamak
              </span>
            </div>
          </div>
        )}

        {/* İstatistikler */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <p className="text-sm opacity-90 mb-1">Temiz Günler</p>
            <p className="text-3xl font-bold">{summary.cleanDays}</p>
            <p className="text-xs opacity-75 mt-1">/ 7 gün</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white">
            <p className="text-sm opacity-90 mb-1">Toplam Kaçamak</p>
            <p className="text-3xl font-bold">{summary.totalSins}</p>
            {summary.mostSinType && (
              <p className="text-xs opacity-75 mt-1">
                En çok: {SIN_TYPE_LABELS[summary.mostSinType]}
              </p>
            )}
          </div>
        </div>

        {/* Başarılar */}
        {(summary.achievements.length > 0 || summary.badgesEarned > 0 || summary.challengesCompleted > 0) && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Award className="h-4 w-4 text-yellow-500" />
              Bu Hafta Kazandıkların
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.achievements.map((achievement, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300"
                >
                  {achievement}
                </Badge>
              ))}
              {summary.badgesEarned > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300"
                >
                  🏆 {summary.badgesEarned} Rozet
                </Badge>
              )}
              {summary.challengesCompleted > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300"
                >
                  🎯 {summary.challengesCompleted} Challenge
                </Badge>
              )}
              {summary.longestStreak > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300"
                >
                  🔥 {summary.longestStreak} Gün Seri
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Öneri (sadece AI özet yoksa göster) */}
        {!summary.aiSummary && (
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              💡 <span className="font-semibold">İpucu:</span>{" "}
              {summary.totalSins === 0
                ? "Bu tempoyu korumaya devam et! Belki arkadaşlarına da ilham verebilirsin."
                : summary.totalSins <= 3
                ? "Kaçamak yaptığın günlerde telafi için ekstra aktivite yapmayı dene."
                : "Kaçamak yapmadan önce bir bardak su iç, belki isteğin geçer."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
