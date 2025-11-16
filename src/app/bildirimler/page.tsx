import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Navbar } from '@/components/navbar';
import { NotificationsList } from './notifications-list';

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/giris');
  }

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = await db.notification.count({
    where: {
      userId: session.user.id,
      read: false,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-4xl">🔔</span>
            Bildirimler
            {unreadCount > 0 && (
              <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full">
                {unreadCount} yeni
              </span>
            )}
          </h1>
          <p className="text-muted-foreground">
            Tüm bildirimleriniz burada
          </p>
        </div>

        <NotificationsList notifications={notifications} />
      </main>
    </div>
  );
}
