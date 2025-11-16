'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';
import { Check, CheckCheck } from 'lucide-react';

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  targetType: string | null;
  targetId: string | null;
  read: boolean;
  createdAt: Date;
};

export function NotificationsList({ notifications: initialNotifications }: { notifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      
      // Trigger custom event to update navbar
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      
      // Trigger custom event to update navbar
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'plan_approved':
        return '✅';
      case 'plan_rejected':
        return '❌';
      case 'message':
        return '📨';
      default:
        return '🔔';
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (!notification.targetType || !notification.targetId) return null;
    
    switch (notification.targetType) {
      case 'plan':
        return `/plan/${notification.targetId}`;
      case 'photo':
        return `/profil/${notification.targetId}`;
      default:
        return null;
    }
  };

  if (notifications.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-6xl mb-4">🔔</div>
        <h3 className="text-xl font-semibold mb-2">Henüz bildirim yok</h3>
        <p className="text-muted-foreground">
          Yeni bildirimler burada görünecek
        </p>
      </Card>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Tümünü Okundu İşaretle
          </Button>
        </div>
      )}

      {notifications.map(notification => {
        const link = getNotificationLink(notification);
        const content = (
          <Card
            key={notification.id}
            className={`p-4 transition-all hover:shadow-md ${
              !notification.read ? 'bg-primary/5 border-primary/20' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.body}</p>
                  </div>
                  
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        markAsRead(notification.id);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </p>
              </div>
            </div>
          </Card>
        );

        if (link) {
          return (
            <Link key={notification.id} href={link} onClick={() => markAsRead(notification.id)}>
              {content}
            </Link>
          );
        }

        return content;
      })}
    </div>
  );
}
