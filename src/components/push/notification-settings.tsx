'use client';

/**
 * Notification Settings Component
 * Kullanıcı bildirim tercihlerini yönetir
 */

import { useState, useEffect } from 'react';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { toast } from 'sonner';
import { Bell, BellOff, Clock, Trophy, Target, Flame, Users } from 'lucide-react';

interface NotificationSettings {
  dailyReminder: boolean;
  dailyReminderTime: string;
  weeklySummary: boolean;
  badgeEarned: boolean;
  challengeReminder: boolean;
  streakWarning: boolean;
  friendActivity: boolean;
}

export function NotificationSettingsComponent() {
  const {
    isSupported,
    isSubscribed,
    isLoading: pushLoading,
    permission,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  const [settings, setSettings] = useState<NotificationSettings>({
    dailyReminder: true,
    dailyReminderTime: '20:00',
    weeklySummary: true,
    badgeEarned: true,
    challengeReminder: true,
    streakWarning: true,
    friendActivity: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isSubscribed) {
      loadSettings();
    }
  }, [isSubscribed]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/push/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Load settings error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/v1/push/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        toast.success('Ayarlar kaydedildi');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Ayarlar kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleTimeChange = (time: string) => {
    const newSettings = { ...settings, dailyReminderTime: time };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleTestNotification = async () => {
    try {
      console.log('Sending test notification...');
      const response = await fetch('/api/v1/push/test', { method: 'POST' });
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        toast.success('Test bildirimi gönderildi!');
      } else {
        console.error('Test notification failed:', response.status, data);
        toast.error(data.error || 'Test bildirimi gönderilemedi');
      }
    } catch (error) {
      console.error('Test notification error:', error);
      toast.error('Test bildirimi gönderilemedi. Lütfen önce bildirimleri aktif edin.');
    }
  };

  if (!isSupported) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <BellOff className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900">Bildirimler Desteklenmiyor</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Tarayıcınız push notification özelliğini desteklemiyor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ana Anahtar */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <Bell className="h-6 w-6 text-green-600" />
            ) : (
              <BellOff className="h-6 w-6 text-gray-400" />
            )}
            <div>
              <h3 className="font-semibold text-lg">Push Bildirimler</h3>
              <p className="text-sm text-muted-foreground">
                {isSubscribed
                  ? 'Bildirimler aktif'
                  : 'Bildirimleri aktif etmek için izin verin'}
              </p>
            </div>
          </div>
          <button
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={pushLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSubscribed
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            } disabled:opacity-50`}
          >
            {pushLoading ? 'İşleniyor...' : isSubscribed ? 'Kapat' : 'Aktif Et'}
          </button>
        </div>

        {permission === 'denied' && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">
              ⚠️ Bildirim izni reddedildi. Tarayıcı ayarlarından izin vermeniz gerekiyor.
            </p>
          </div>
        )}
      </div>

      {/* Bildirim Tercihleri */}
      {isSubscribed && (
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Bildirim Tercihleri</h3>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>
          ) : (
            <>
              {/* Günlük Hatırlatıcı */}
              <div className="flex items-start justify-between py-3 border-b">
                <div className="flex items-start gap-3 flex-1">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">Günlük Hatırlatıcı</h4>
                    <p className="text-sm text-muted-foreground">
                      Her gün belirlediğiniz saatte hatırlatma
                    </p>
                    {settings.dailyReminder && (
                      <input
                        type="time"
                        value={settings.dailyReminderTime}
                        onChange={(e) => handleTimeChange(e.target.value)}
                        className="mt-2 px-3 py-1 border rounded-lg text-sm"
                      />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('dailyReminder')}
                  disabled={isSaving}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    settings.dailyReminder
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {settings.dailyReminder ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {/* Haftalık Özet */}
              <div className="flex items-start justify-between py-3 border-b">
                <div className="flex items-start gap-3 flex-1">
                  <Trophy className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Haftalık Özet</h4>
                    <p className="text-sm text-muted-foreground">
                      Her Pazar haftalık performans özeti
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('weeklySummary')}
                  disabled={isSaving}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    settings.weeklySummary
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {settings.weeklySummary ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {/* Rozet Kazanma */}
              <div className="flex items-start justify-between py-3 border-b">
                <div className="flex items-start gap-3 flex-1">
                  <Trophy className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Rozet Kazanma</h4>
                    <p className="text-sm text-muted-foreground">
                      Yeni rozet kazandığınızda bildirim
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('badgeEarned')}
                  disabled={isSaving}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    settings.badgeEarned
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {settings.badgeEarned ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {/* Challenge Hatırlatıcı */}
              <div className="flex items-start justify-between py-3 border-b">
                <div className="flex items-start gap-3 flex-1">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Challenge Hatırlatıcısı</h4>
                    <p className="text-sm text-muted-foreground">
                      Aktif challenge'larınız için hatırlatma
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('challengeReminder')}
                  disabled={isSaving}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    settings.challengeReminder
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {settings.challengeReminder ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {/* Streak Uyarısı */}
              <div className="flex items-start justify-between py-3 border-b">
                <div className="flex items-start gap-3 flex-1">
                  <Flame className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Streak Uyarısı</h4>
                    <p className="text-sm text-muted-foreground">
                      Streak'iniz tehlikedeyken uyarı
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('streakWarning')}
                  disabled={isSaving}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    settings.streakWarning
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {settings.streakWarning ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {/* Arkadaş Aktivitesi */}
              <div className="flex items-start justify-between py-3">
                <div className="flex items-start gap-3 flex-1">
                  <Users className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Arkadaş Aktivitesi</h4>
                    <p className="text-sm text-muted-foreground">
                      Arkadaşlarınızın başarıları (yakında)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('friendActivity')}
                  disabled={isSaving}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    settings.friendActivity
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {settings.friendActivity ? 'Açık' : 'Kapalı'}
                </button>
              </div>
            </>
          )}

          {/* Test Butonu */}
          <div className="pt-4 border-t">
            <button
              onClick={handleTestNotification}
              className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              🔔 Test Bildirimi Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
