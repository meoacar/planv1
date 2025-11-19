'use client';

/**
 * Friend Activity Feed Component
 * Arkadaş aktivitelerini gösterir
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Activity,
  Award,
  Flame,
  Target,
  TrendingUp,
  Cookie,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface FriendActivity {
  id: string;
  userId: string;
  activityType: string;
  activityData: any;
  isPublic: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    level: number;
  };
}

export function FriendActivityFeed() {
  const [activities, setActivities] = useState<FriendActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/friends/activity?limit=20');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Load activities error:', error);
      toast.error('Aktiviteler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sin_added':
        return Cookie;
      case 'badge_earned':
        return Award;
      case 'streak_milestone':
        return Flame;
      case 'challenge_completed':
        return Target;
      case 'level_up':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getActivityText = (activity: FriendActivity) => {
    const { activityType, activityData } = activity;

    switch (activityType) {
      case 'sin_added':
        return `bir günah ekledi${activityData?.sinType ? ` (${activityData.sinType})` : ''}`;
      case 'badge_earned':
        return `"${activityData?.badgeName}" rozetini kazandı! ${activityData?.badgeIcon || '🏆'}`;
      case 'streak_milestone':
        return `${activityData?.streak} günlük streak'e ulaştı! 🔥`;
      case 'challenge_completed':
        return `"${activityData?.challengeTitle}" challenge'ını tamamladı!`;
      case 'level_up':
        return `Level ${activityData?.level}'e yükseldi! 🎉`;
      default:
        return 'bir aktivite gerçekleştirdi';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sin_added':
        return 'bg-orange-100 text-orange-700';
      case 'badge_earned':
        return 'bg-yellow-100 text-yellow-700';
      case 'streak_milestone':
        return 'bg-red-100 text-red-700';
      case 'challenge_completed':
        return 'bg-green-100 text-green-700';
      case 'level_up':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Yükleniyor...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/50">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Henüz aktivite yok</h3>
        <p className="text-muted-foreground">
          Arkadaşlarınızın aktiviteleri burada görünecek
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.activityType);
        const colorClass = getActivityColor(activity.activityType);

        return (
          <div
            key={activity.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {activity.user.image ? (
                  <img
                    src={activity.user.image}
                    alt={activity.user.name || activity.user.username || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {(activity.user.name || activity.user.username || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div
                  className={`absolute -bottom-1 -right-1 rounded-full w-6 h-6 flex items-center justify-center ${colorClass}`}
                >
                  <Icon className="h-3 w-3" />
                </div>
              </div>

              {/* İçerik */}
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">
                    {activity.user.name || activity.user.username}
                  </span>{' '}
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Daha Fazla Yükle */}
      {activities.length >= 20 && (
        <button
          onClick={loadActivities}
          className="w-full py-2 text-sm text-primary hover:underline"
        >
          Daha fazla yükle
        </button>
      )}
    </div>
  );
}
