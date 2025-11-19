'use client';

/**
 * Friend Compare Component
 * İki kullanıcıyı karşılaştırır
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { TrendingUp, Award, Flame, Coins, Trophy, Lock } from 'lucide-react';

interface CompareData {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    level: number;
    xp: number;
    streak: number;
    coins: number;
    weekSins: number;
    monthSins: number;
    sinBadges: any[];
  };
  friend: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    level?: number;
    xp?: number;
    streak?: number;
    coins?: number;
    weekSins: number | null;
    monthSins: number | null;
    sinBadges?: any[];
  };
  privacy: {
    showStats: boolean;
    showStreak: boolean;
    showBadges: boolean;
  };
}

interface Props {
  friendId: string;
}

export function FriendCompare({ friendId }: Props) {
  const [data, setData] = useState<CompareData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComparison();
  }, [friendId]);

  const loadComparison = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/friends/compare?friendId=${friendId}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        throw new Error('Load failed');
      }
    } catch (error) {
      console.error('Load comparison error:', error);
      toast.error('Karşılaştırma yüklenemedi');
    } finally {
      setIsLoading(false);
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

  if (!data) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground">Veri yüklenemedi</p>
      </div>
    );
  }

  const { user, friend, privacy } = data;

  const ComparisonCard = ({
    icon: Icon,
    label,
    userValue,
    friendValue,
    locked = false,
  }: {
    icon: any;
    label: string;
    userValue: number | string;
    friendValue: number | string | null;
    locked?: boolean;
  }) => (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{userValue}</div>
          <div className="text-xs text-muted-foreground mt-1">Sen</div>
        </div>
        <div className="text-center">
          {locked ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Lock className="h-6 w-6 text-muted-foreground mb-1" />
              <div className="text-xs text-muted-foreground">Gizli</div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-blue-600">{friendValue}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {friend.name || friend.username}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Başlıklar */}
      <div className="grid grid-cols-2 gap-4">
        {/* Kullanıcı */}
        <div className="text-center">
          <div className="relative inline-block">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || user.username || 'User'}
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto">
                {(user.name || user.username || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center">
              {user.level}
            </div>
          </div>
          <h3 className="font-semibold text-lg mt-3">{user.name || user.username}</h3>
        </div>

        {/* Arkadaş */}
        <div className="text-center">
          <div className="relative inline-block">
            {friend.image ? (
              <img
                src={friend.image}
                alt={friend.name || friend.username || 'User'}
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl mx-auto">
                {(friend.name || friend.username || 'U')[0].toUpperCase()}
              </div>
            )}
            {privacy.showStats && friend.level && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center">
                {friend.level}
              </div>
            )}
          </div>
          <h3 className="font-semibold text-lg mt-3">
            {friend.name || friend.username}
          </h3>
        </div>
      </div>

      {/* Karşılaştırma */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Level */}
        <ComparisonCard
          icon={Trophy}
          label="Level"
          userValue={user.level}
          friendValue={friend.level || 0}
          locked={!privacy.showStats}
        />

        {/* XP */}
        <ComparisonCard
          icon={TrendingUp}
          label="XP"
          userValue={user.xp}
          friendValue={friend.xp || 0}
          locked={!privacy.showStats}
        />

        {/* Streak */}
        <ComparisonCard
          icon={Flame}
          label="Streak"
          userValue={`${user.streak} gün`}
          friendValue={friend.streak ? `${friend.streak} gün` : '0 gün'}
          locked={!privacy.showStreak}
        />

        {/* Coins */}
        <ComparisonCard
          icon={Coins}
          label="Coins"
          userValue={user.coins}
          friendValue={friend.coins || 0}
          locked={!privacy.showStats}
        />

        {/* Haftalık Günah */}
        <ComparisonCard
          icon={TrendingUp}
          label="Bu Hafta"
          userValue={`${user.weekSins} günah`}
          friendValue={
            friend.weekSins !== null ? `${friend.weekSins} günah` : '0 günah'
          }
          locked={!privacy.showStats}
        />

        {/* Aylık Günah */}
        <ComparisonCard
          icon={TrendingUp}
          label="Bu Ay"
          userValue={`${user.monthSins} günah`}
          friendValue={
            friend.monthSins !== null ? `${friend.monthSins} günah` : '0 günah'
          }
          locked={!privacy.showStats}
        />
      </div>

      {/* Rozetler */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
          <Award className="h-4 w-4" />
          <span className="text-sm font-medium">Rozetler</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Kullanıcı Rozetleri */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Sen</div>
            <div className="flex flex-wrap gap-2">
              {user.sinBadges.slice(0, 6).map((ub) => (
                <div
                  key={ub.badge.id}
                  className="text-2xl"
                  title={ub.badge.name}
                >
                  {ub.badge.icon}
                </div>
              ))}
              {user.sinBadges.length > 6 && (
                <div className="text-sm text-muted-foreground">
                  +{user.sinBadges.length - 6}
                </div>
              )}
            </div>
            <div className="text-sm font-medium mt-2">
              {user.sinBadges.length} rozet
            </div>
          </div>

          {/* Arkadaş Rozetleri */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">
              {friend.name || friend.username}
            </div>
            {privacy.showBadges && friend.sinBadges ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {friend.sinBadges.slice(0, 6).map((ub: any) => (
                    <div
                      key={ub.badge.id}
                      className="text-2xl"
                      title={ub.badge.name}
                    >
                      {ub.badge.icon}
                    </div>
                  ))}
                  {friend.sinBadges.length > 6 && (
                    <div className="text-sm text-muted-foreground">
                      +{friend.sinBadges.length - 6}
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium mt-2">
                  {friend.sinBadges.length} rozet
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Gizli</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gizlilik Uyarısı */}
      {(!privacy.showStats || !privacy.showStreak || !privacy.showBadges) && (
        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Gizlilik Ayarları</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Arkadaşınız bazı bilgilerini gizli tutmayı tercih etmiş.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
