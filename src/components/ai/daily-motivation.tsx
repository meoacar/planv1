'use client';

/**
 * Daily Motivation Component
 * Günlük AI motivasyon mesajı
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Sparkles, RefreshCw, Target, Loader2 } from 'lucide-react';

export function DailyMotivation() {
  const [motivation, setMotivation] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(true);
  const [isLoadingGoal, setIsLoadingGoal] = useState(false);

  useEffect(() => {
    loadMotivation();
  }, []);

  const loadMotivation = async () => {
    setIsLoadingMotivation(true);
    try {
      const response = await fetch('/api/v1/ai/motivation');
      if (response.ok) {
        const data = await response.json();
        setMotivation(data.motivation);
      }
    } catch (error) {
      console.error('Load motivation error:', error);
      setMotivation('Bugün harika bir gün! Hedeflerine ulaşmak için buradayım! 💪');
    } finally {
      setIsLoadingMotivation(false);
    }
  };

  const loadGoal = async () => {
    setIsLoadingGoal(true);
    try {
      const response = await fetch('/api/v1/ai/motivation/goal', {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        setGoal(data.goal);
        toast.success('Yeni hedef önerisi alındı!');
      }
    } catch (error) {
      console.error('Load goal error:', error);
      toast.error('Hedef önerisi alınamadı');
    } finally {
      setIsLoadingGoal(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Günlük Motivasyon */}
      <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Günlük Motivasyon</h3>
          </div>
          <button
            onClick={loadMotivation}
            disabled={isLoadingMotivation}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
            title="Yenile"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoadingMotivation ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        {isLoadingMotivation ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">AI mesaj hazırlıyor...</span>
          </div>
        ) : (
          <p className="text-lg font-medium text-purple-900">{motivation}</p>
        )}
      </div>

      {/* Hedef Önerisi */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">AI Hedef Önerisi</h3>
        </div>

        {goal ? (
          <div className="space-y-3">
            <p className="text-muted-foreground">{goal}</p>
            <button
              onClick={loadGoal}
              disabled={isLoadingGoal}
              className="w-full py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoadingGoal ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Yeni Öneri Alınıyor...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Başka Öneri Al
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={loadGoal}
            disabled={isLoadingGoal}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoadingGoal ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Öneri Hazırlanıyor...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Hedef Önerisi Al
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
