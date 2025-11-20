"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SinModal } from "@/components/food-sins/sin-modal";
import { SinStats } from "@/components/food-sins/sin-stats";
import { SinHistory } from "@/components/food-sins/sin-history";
import { SinCalendar } from "@/components/food-sins/sin-calendar";
import { SinWeeklySummary } from "@/components/food-sins/sin-weekly-summary";
import { SinBadges } from "@/components/food-sins/sin-badges";
import { SinChallenges } from "@/components/food-sins/sin-challenges";
import SinLeaderboard from "@/components/food-sins/sin-leaderboard";
import SinStreak from "@/components/food-sins/sin-streak";
import { FriendList } from "@/components/friends/friend-list";
import { AIChatbot } from "@/components/ai/ai-chatbot";
import { NotificationSettingsComponent } from "@/components/push/notification-settings";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function SinStatsClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Sayfa açıldığında rozet kontrolü yap
  useEffect(() => {
    const checkBadges = async () => {
      try {
        const response = await fetch('/api/v1/food-sins/check-badges', {
          method: 'POST',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.badgesAwarded > 0) {
            toast.success(`🎉 ${data.badgesAwarded} yeni rozet kazandın!`);
            setRefreshKey((prev) => prev + 1);
          }
        }
      } catch (error) {
        console.error('Badge check error:', error);
      }
    };

    checkBadges();
  }, []);

  const handleSuccess = () => {
    // Verileri yenile
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      {/* Kaçamak Ekle Butonu */}
      <div className="mb-6 flex justify-center">
        <Button
          size="lg"
          onClick={() => setModalOpen(true)}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold text-lg px-8 py-6"
        >
          <Plus className="h-6 w-6 mr-2" />
          Kaçamak Ekle 😈
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stats" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
          <TabsList className="inline-flex w-auto justify-start gap-1 flex-nowrap h-auto p-1">
            <TabsTrigger value="stats" className="whitespace-nowrap flex-shrink-0 text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2">📊 İstatistikler</TabsTrigger>
            <TabsTrigger value="streak" className="whitespace-nowrap flex-shrink-0 text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2">🔥 Streak</TabsTrigger>
            <TabsTrigger value="calendar" className="whitespace-nowrap flex-shrink-0 text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2">📅 Takvim</TabsTrigger>
            <TabsTrigger value="summary" className="whitespace-nowrap flex-shrink-0 text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2">📈 Özet</TabsTrigger>
            <TabsTrigger value="badges" className="whitespace-nowrap flex-shrink-0 text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2">🏆 Rozetler</TabsTrigger>
            <TabsTrigger value="challenges" className="whitespace-nowrap flex-shrink-0 text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2">🎯 Challenge</TabsTrigger>
            <TabsTrigger value="leaderboard" className="whitespace-nowrap flex-shrink-0 text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2">🏅 Liderlik</TabsTrigger>
            <TabsTrigger value="friends" className="whitespace-nowrap flex-shrink-0 text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2">👥 Arkadaşlar</TabsTrigger>
            <TabsTrigger value="ai" className="whitespace-nowrap flex-shrink-0 text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2">🤖 AI Koç</TabsTrigger>
            <TabsTrigger value="settings" className="whitespace-nowrap flex-shrink-0 text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2">⚙️ Ayarlar</TabsTrigger>
          </TabsList>
        </div>

        {/* İstatistikler */}
        <TabsContent value="stats" className="space-y-6">
          <div key={`stats-${refreshKey}`}>
            <SinStats />
          </div>
          <div key={`history-${refreshKey}`}>
            <SinHistory />
          </div>
        </TabsContent>

        {/* Streak */}
        <TabsContent value="streak" key={`streak-${refreshKey}`}>
          <SinStreak />
        </TabsContent>

        {/* Takvim */}
        <TabsContent value="calendar" key={`calendar-${refreshKey}`}>
          <SinCalendar />
        </TabsContent>

        {/* Haftalık Özet */}
        <TabsContent value="summary" key={`summary-${refreshKey}`}>
          <SinWeeklySummary />
        </TabsContent>

        {/* Rozetler */}
        <TabsContent value="badges" key={`badges-${refreshKey}`}>
          <SinBadges />
        </TabsContent>

        {/* Challenge'lar */}
        <TabsContent value="challenges" key={`challenges-${refreshKey}`}>
          <SinChallenges />
        </TabsContent>

        {/* Liderlik Tablosu */}
        <TabsContent value="leaderboard" key={`leaderboard-${refreshKey}`}>
          <SinLeaderboard />
        </TabsContent>

        {/* Arkadaşlar */}
        <TabsContent value="friends" key={`friends-${refreshKey}`}>
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-bold mb-4">👥 Arkadaş Sistemi</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <FriendList />
            </Suspense>
          </div>
        </TabsContent>

        {/* AI Koç */}
        <TabsContent value="ai">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-bold mb-4">🤖 AI Beslenme Koçu</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <AIChatbot />
            </Suspense>
          </div>
        </TabsContent>

        {/* Ayarlar (Push Notifications) */}
        <TabsContent value="settings">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-bold mb-4">⚙️ Bildirim Ayarları</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <NotificationSettingsComponent />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <SinModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
