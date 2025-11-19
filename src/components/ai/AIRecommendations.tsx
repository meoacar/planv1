'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  recommendationType: string;
  targetId: string;
  targetTitle: string | null;
  score: number;
  reason: string | null;
  clicked: boolean;
  dismissed: boolean;
  createdAt: string;
}

const typeIcons: Record<string, string> = {
  plan: '📋',
  recipe: '🍽️',
  group: '👥',
  guild: '⚔️',
  challenge: '🏆',
};

const typeLabels: Record<string, string> = {
  plan: 'Plan',
  recipe: 'Tarif',
  group: 'Grup',
  guild: 'Lonca',
  challenge: 'Meydan Okuma',
};

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendations = async (refresh = false) => {
    try {
      setRefreshing(refresh);
      const res = await fetch(`/api/v1/ai/recommendations?refresh=${refresh}`);
      const data = await res.json();

      if (data.success) {
        setRecommendations(data.data.recommendations);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      toast.error('Öneriler yüklenemedi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleClick = async (rec: Recommendation) => {
    try {
      await fetch('/api/v1/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId: rec.id,
          action: 'clicked',
        }),
      });

      // Navigate to target
      const routes: Record<string, string> = {
        plan: '/plans',
        recipe: '/recipes',
        group: '/groups',
        guild: '/guilds',
        challenge: '/challenges',
      };
      
      const route = routes[rec.recommendationType];
      if (route) {
        window.location.href = `${route}/${rec.targetId}`;
      }
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const handleDismiss = async (recId: string) => {
    try {
      await fetch('/api/v1/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId: recId,
          action: 'dismissed',
        }),
      });

      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
      toast.success('Öneri kaldırıldı');
    } catch (error) {
      console.error('Failed to dismiss:', error);
      toast.error('Bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Önerileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Önerileri
          </CardTitle>
          <CardDescription>
            Sizin için kişiselleştirilmiş öneriler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Henüz öneri yok</p>
            <p className="text-sm mt-1">Biraz daha aktivite gösterin!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Önerileri
            </CardTitle>
            <CardDescription>
              Sizin için özel seçildi
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchRecommendations(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-2xl">{typeIcons[rec.recommendationType]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {typeLabels[rec.recommendationType]}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {Math.round(rec.score * 100)}% eşleşme
                  </span>
                </div>
                <h4 className="font-medium text-sm mb-1 truncate">
                  {rec.targetTitle || 'Başlık yok'}
                </h4>
                {rec.reason && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {rec.reason}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClick(rec)}
                  className="h-8 w-8 p-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(rec.id)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
