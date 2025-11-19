'use client';

/**
 * Trend Analysis Component
 * 4 haftalık trend analizi gösterimi
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  Calendar,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface WeeklyData {
  week: number;
  startDate: string;
  endDate: string;
  totalSins: number;
  sinsByType: Record<string, number>;
  cleanDays: number;
  averagePerDay: number;
}

interface TrendAnalysis {
  summary: string;
  trends: string[];
  insights: string[];
  recommendations: string[];
  prediction: string;
  weeklyData: WeeklyData[];
}

export function TrendAnalysis() {
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/ai/trends');
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
      } else {
        throw new Error('Failed to load analysis');
      }
    } catch (error) {
      console.error('Load analysis error:', error);
      toast.error('Analiz yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">AI analiz yapıyor...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground">Analiz yüklenemedi</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Özet */}
      <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-start gap-3">
          <Sparkles className="h-6 w-6 text-purple-600 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">AI Analiz Özeti</h3>
            <p className="text-muted-foreground">{analysis.summary}</p>
          </div>
        </div>
      </div>

      {/* Haftalık Veriler */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">4 Haftalık Veri</h3>
        </div>
        <div className="grid gap-3">
          {analysis.weeklyData.map((week, index) => (
            <div
              key={week.week}
              className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-medium">Hafta {index + 1}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(week.startDate).toLocaleDateString('tr-TR')} -{' '}
                  {new Date(week.endDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {week.totalSins}
                </p>
                <p className="text-xs text-muted-foreground">
                  {week.cleanDays} temiz gün
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trendler */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold">Trendler</h3>
        </div>
        <ul className="space-y-2">
          {analysis.trends.map((trend, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span className="text-sm">{trend}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* İçgörüler */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <h3 className="font-semibold">İçgörüler</h3>
        </div>
        <ul className="space-y-2">
          {analysis.insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">💡</span>
              <span className="text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Öneriler */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Öneriler</h3>
        </div>
        <ul className="space-y-2">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">🎯</span>
              <span className="text-sm">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tahmin */}
      <div className="border rounded-lg p-6 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="flex items-start gap-3">
          <TrendingDown className="h-6 w-6 text-green-600 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Gelecek Hafta Tahmini</h3>
            <p className="text-muted-foreground">{analysis.prediction}</p>
          </div>
        </div>
      </div>

      {/* Yenile Butonu */}
      <button
        onClick={loadAnalysis}
        disabled={isLoading}
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analiz Yapılıyor...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Yeniden Analiz Et
          </>
        )}
      </button>
    </div>
  );
}
