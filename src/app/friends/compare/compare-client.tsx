'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  TrendingUp,
  Award,
  Flame,
  Trophy,
  ArrowLeft,
  Lock,
  Calendar,
  Target,
} from 'lucide-react';
import Link from 'next/link';

interface ComparisonData {
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

export function CompareClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const friendId = searchParams.get('friendId');

  const [data, setData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!friendId) {
      toast.error('Arkadaş ID bulunamadı');
      router.push('/gunah-sayaci');
      return;
    }

    loadComparison();
  }, [friendId]);

  const loadComparison = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/friends/compare?friendId=${friendId}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          toast.error('Bu kullanıcıyla arkadaş değilsiniz');
        } else {
          toast.error('Karşılaştırma yüklenemedi');
        }
        router.push('/gunah-sayaci');
        return;
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Load comparison error:', error);
      toast.error('Bir hata oluştu');
      router.push('/gunah-sayaci');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Yükleniyor...</p>
      </div>
    );
  }

  const { user, friend, privacy } = data;

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center gap-4">
        <Link
          href="/gunah-sayaci"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Arkadaş Karşılaştırma</h1>
          <p className="text-muted-foreground">
            İstatistiklerinizi karşılaştırın
          </p>
        </div>
      </div>

      {/* Kullanıcı Kartları */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Kullanıcı */}
        <UserCard
          user={user}
          label="Sen"
          showAll={true}
        />

        {/* Arkadaş */}
        <UserCard
          user={friend}
          label="Arkadaş"
          showAll={false}
          privacy={privacy}
        />
      </div>

      {/* Karşılaştırma Tablosu */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Karşılaştırma
          </h2>
        </div>

        <div className="divide-y">
          {/* Level */}
          {privacy.showStats && friend.level !== undefined && friend.level !== null && (
            <ComparisonRow
              label="Seviye"
              icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
              userValue={user.level}
              friendValue={friend.level}
              format={(v) => `Seviye ${v}`}
            />
          )}

          {/* XP */}
          {privacy.showStats && friend.xp !== undefined && friend.xp !== null && (
            <ComparisonRow
              label="Deneyim Puanı"
              icon={<Target className="h-5 w-5 text-green-500" />}
              userValue={user.xp}
              friendValue={friend.xp}
              format={(v) => `${v.toLocaleString('tr-TR')} XP`}
            />
          )}

          {/* Streak */}
          {privacy.showStreak && friend.streak !== undefined && friend.streak !== null && (
            <ComparisonRow
              label="Streak"
              icon={<Flame className="h-5 w-5 text-orange-500" />}
              userValue={user.streak}
              friendValue={friend.streak}
              format={(v) => `${v} gün`}
            />
          )}

          {/* Haftalık Günah */}
          {privacy.showStats && friend.weekSins !== null && (
            <ComparisonRow
              label="Bu Hafta Kaçamak"
              icon={<Calendar className="h-5 w-5 text-red-500" />}
              userValue={user.weekSins}
              friendValue={friend.weekSins}
              format={(v) => `${v} kaçamak`}
              reverse={true}
            />
          )}

          {/* Aylık Günah */}
          {privacy.showStats && friend.monthSins !== null && (
            <ComparisonRow
              label="Bu Ay Kaçamak"
              icon={<Calendar className="h-5 w-5 text-purple-500" />}
              userValue={user.monthSins}
              friendValue={friend.monthSins}
              format={(v) => `${v} kaçamak`}
              reverse={true}
            />
          )}

          {/* Rozetler */}
          {privacy.showBadges && (
            <ComparisonRow
              label="Rozetler"
              icon={<Award className="h-5 w-5 text-yellow-500" />}
              userValue={user.sinBadges.length}
              friendValue={friend.sinBadges?.length || 0}
              format={(v) => `${v} rozet`}
            />
          )}
        </div>
      </div>

      {/* Gizlilik Uyarısı */}
      {(!privacy.showStats || !privacy.showStreak || !privacy.showBadges) && (
        <div className="border rounded-lg p-4 bg-muted/50 flex items-start gap-3">
          <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Gizlilik Ayarları</p>
            <p>
              Arkadaşınız bazı istatistiklerini gizli tutmayı tercih etmiş.
              {!privacy.showStats && ' İstatistikler gizli.'}
              {!privacy.showStreak && ' Streak gizli.'}
              {!privacy.showBadges && ' Rozetler gizli.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Kullanıcı Kartı
function UserCard({
  user,
  label,
  showAll,
  privacy,
}: {
  user: any;
  label: string;
  showAll: boolean;
  privacy?: any;
}) {
  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
        
        {/* Avatar */}
        <div className="relative inline-block mb-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || user.username || 'User'}
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl mx-auto">
              {(user.name || user.username || 'U')[0].toUpperCase()}
            </div>
          )}
          {(showAll || privacy?.showStats) && (
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-background">
              {user.level}
            </div>
          )}
        </div>

        {/* İsim */}
        <h3 className="font-bold text-xl">{user.name || user.username}</h3>
        {user.username && user.name && (
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        )}
      </div>

      {/* İstatistikler */}
      <div className="space-y-3">
        {(showAll || privacy?.showStats) && (
          <>
            <StatItem
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              label="XP"
              value={user.xp !== undefined && user.xp !== null ? user.xp.toLocaleString('tr-TR') : '?'}
            />
            <StatItem
              icon={<Trophy className="h-4 w-4 text-yellow-500" />}
              label="Seviye"
              value={user.level !== undefined && user.level !== null ? user.level : '?'}
            />
          </>
        )}
        
        {(showAll || privacy?.showStreak) && (
          <StatItem
            icon={<Flame className="h-4 w-4 text-orange-500" />}
            label="Streak"
            value={user.streak !== undefined ? `${user.streak} gün` : '?'}
          />
        )}

        {(showAll || privacy?.showBadges) && (
          <StatItem
            icon={<Award className="h-4 w-4 text-blue-500" />}
            label="Rozetler"
            value={user.sinBadges?.length !== undefined ? user.sinBadges.length : 0}
          />
        )}

        {!showAll && !privacy?.showStats && (
          <div className="text-center py-4 text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Gizli</span>
          </div>
        )}
      </div>
    </div>
  );
}

// İstatistik Item
function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="font-bold">{value}</span>
    </div>
  );
}

// Karşılaştırma Satırı
function ComparisonRow({
  label,
  icon,
  userValue,
  friendValue,
  format,
  reverse = false,
}: {
  label: string;
  icon: React.ReactNode;
  userValue: number;
  friendValue: number;
  format: (v: number) => string;
  reverse?: boolean;
}) {
  const userWins = reverse ? userValue < friendValue : userValue > friendValue;
  const tie = userValue === friendValue;

  return (
    <div className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Kullanıcı */}
        <div
          className={`text-center p-3 rounded-lg ${
            userWins && !tie
              ? 'bg-green-100 dark:bg-green-900/20 border-2 border-green-500'
              : tie
              ? 'bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-500'
              : 'bg-muted'
          }`}
        >
          <p className="text-sm text-muted-foreground mb-1">Sen</p>
          <p className="font-bold text-lg">{format(userValue)}</p>
          {userWins && !tie && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              🏆 Öndesin!
            </p>
          )}
        </div>

        {/* Arkadaş */}
        <div
          className={`text-center p-3 rounded-lg ${
            !userWins && !tie
              ? 'bg-green-100 dark:bg-green-900/20 border-2 border-green-500'
              : tie
              ? 'bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-500'
              : 'bg-muted'
          }`}
        >
          <p className="text-sm text-muted-foreground mb-1">Arkadaş</p>
          <p className="font-bold text-lg">{format(friendValue)}</p>
          {!userWins && !tie && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              🏆 Önde!
            </p>
          )}
        </div>
      </div>

      {tie && (
        <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 mt-2">
          🤝 Berabere!
        </p>
      )}
    </div>
  );
}
