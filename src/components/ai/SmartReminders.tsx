'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface SmartReminder {
  id: string;
  reminderType: string;
  optimalTime: string;
  frequency: string;
  enabled: boolean;
  clickRate: number;
  totalSent: number;
  totalClicked: number;
}

const reminderLabels: Record<string, { title: string; icon: string }> = {
  daily_checkin: { title: 'Günlük Check-in', icon: '📝' },
  weight_log: { title: 'Kilo Kaydı', icon: '⚖️' },
  meal_plan: { title: 'Öğün Planı', icon: '🍽️' },
  water_intake: { title: 'Su İçme', icon: '💧' },
  exercise: { title: 'Egzersiz', icon: '🏃' },
  sleep_reminder: { title: 'Uyku Zamanı', icon: '😴' },
  weekly_summary: { title: 'Haftalık Özet', icon: '📊' },
};

export default function SmartReminders() {
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await fetch('/api/v1/ai/smart-reminders');
      const data = await res.json();

      if (data.success) {
        setReminders(data.data.reminders);
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      toast.error('Hatırlatmalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async (reminderId: string, enabled: boolean) => {
    try {
      const reminder = reminders.find((r) => r.id === reminderId);
      if (!reminder) return;

      const res = await fetch('/api/v1/ai/smart-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reminderType: reminder.reminderType,
          frequency: reminder.frequency,
          enabled,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setReminders((prev) =>
          prev.map((r) => (r.id === reminderId ? { ...r, enabled } : r))
        );
        toast.success(enabled ? 'Hatırlatma açıldı' : 'Hatırlatma kapatıldı');
      }
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
      toast.error('Bir hata oluştu');
    }
  };

  const optimizeReminder = async (reminderId: string) => {
    try {
      const res = await fetch('/api/v1/ai/smart-reminders/optimize', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminderId }),
      });

      const data = await res.json();

      if (data.success) {
        setReminders((prev) =>
          prev.map((r) =>
            r.id === reminderId ? data.data.reminder : r
          )
        );
        toast.success('Hatırlatma zamanı optimize edildi!');
      } else {
        toast.error('Yeterli veri yok, en az 10 bildirim gerekli');
      }
    } catch (error) {
      console.error('Failed to optimize:', error);
      toast.error('Bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            Akıllı Hatırlatmalar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          Akıllı Hatırlatmalar
        </CardTitle>
        <CardDescription>
          AI sizin için en uygun zamanı öğreniyor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reminders.map((reminder) => {
            const label = reminderLabels[reminder.reminderType];
            const clickRate = reminder.totalSent > 0
              ? Math.round((reminder.totalClicked / reminder.totalSent) * 100)
              : 0;

            return (
              <div
                key={reminder.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="text-2xl">{label?.icon || '🔔'}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">
                      {label?.title || reminder.reminderType}
                    </h4>
                    {reminder.totalSent >= 10 && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {clickRate}% tıklama
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{reminder.optimalTime}</span>
                    <span className="text-gray-400">•</span>
                    <span className="capitalize">{reminder.frequency}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {reminder.totalSent >= 10 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => optimizeReminder(reminder.id)}
                      className="text-xs"
                    >
                      Optimize Et
                    </Button>
                  )}
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={(checked) =>
                      toggleReminder(reminder.id, checked)
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        {reminders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Henüz hatırlatma yok</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
