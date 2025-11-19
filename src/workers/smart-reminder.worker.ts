import { Queue, Worker, Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { optimizeReminderTime } from '@/lib/ai';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export const smartReminderQueue = new Queue('smart-reminders', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

interface OptimizeReminderJobData {
  userId: string;
  reminderId?: string;
}

interface SendReminderJobData {
  reminderId: string;
}

/**
 * Worker to optimize reminder timing using ML
 */
export const smartReminderWorker = new Worker<OptimizeReminderJobData | SendReminderJobData>(
  'smart-reminders',
  async (job: Job<OptimizeReminderJobData | SendReminderJobData>) => {
    if (job.name === 'optimize-reminder') {
      return await handleOptimizeReminder(job as Job<OptimizeReminderJobData>);
    } else if (job.name === 'send-reminder') {
      return await handleSendReminder(job as Job<SendReminderJobData>);
    }
  },
  {
    connection,
    concurrency: 10,
  }
);

async function handleOptimizeReminder(job: Job<OptimizeReminderJobData>) {
  const { userId, reminderId } = job.data;

  console.log(`[Smart Reminder Worker] Optimizing reminders for user ${userId}`);

  try {
    // Get reminders to optimize
    const reminders = reminderId
      ? [await prisma.smartReminder.findUnique({ where: { id: reminderId } })]
      : await prisma.smartReminder.findMany({ where: { userId, enabled: true } });

    const optimized = [];

    for (const reminder of reminders) {
      if (!reminder) continue;

      // Fetch notification history
      const notificationHistory = await prisma.pushNotification.findMany({
        where: {
          userId,
          type: mapReminderTypeToPushType(reminder.reminderType),
        },
        select: {
          createdAt: true,
          clickedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      // Need at least 10 data points to optimize
      if (notificationHistory.length < 10) {
        console.log(
          `[Smart Reminder Worker] Not enough data for reminder ${reminder.id}, skipping`
        );
        continue;
      }

      // Build activity data
      const clickHistory = notificationHistory.map((notif) => ({
        time: notif.createdAt.toTimeString().slice(0, 5),
        clicked: !!notif.clickedAt,
      }));

      const activeHours = Array.from(
        new Set(
          notificationHistory
            .filter((n) => n.clickedAt)
            .map((n) => n.createdAt.getHours())
        )
      );

      // Optimize timing
      const optimalTime = await optimizeReminderTime(userId, reminder.reminderType, {
        activeHours,
        clickHistory,
      });

      // Update reminder
      const updated = await prisma.smartReminder.update({
        where: { id: reminder.id },
        data: {
          optimalTime,
          clickRate:
            reminder.totalSent > 0 ? reminder.totalClicked / reminder.totalSent : 0,
        },
      });

      optimized.push(updated);
      console.log(
        `[Smart Reminder Worker] Optimized reminder ${reminder.id} to ${optimalTime}`
      );
    }

    return {
      success: true,
      count: optimized.length,
      reminders: optimized,
    };
  } catch (error) {
    console.error(`[Smart Reminder Worker] Error optimizing reminders:`, error);
    throw error;
  }
}

async function handleSendReminder(job: Job<SendReminderJobData>) {
  const { reminderId } = job.data;

  console.log(`[Smart Reminder Worker] Sending reminder ${reminderId}`);

  try {
    const reminder = await prisma.smartReminder.findUnique({
      where: { id: reminderId },
      include: { user: true },
    });

    if (!reminder || !reminder.enabled) {
      console.log(`[Smart Reminder Worker] Reminder ${reminderId} not found or disabled`);
      return { success: false, reason: 'not_found_or_disabled' };
    }

    // Check if it's time to send
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (currentTime < reminder.optimalTime) {
      console.log(`[Smart Reminder Worker] Not yet time for reminder ${reminderId}`);
      return { success: false, reason: 'not_time_yet' };
    }

    // Create push notification
    const notification = await prisma.pushNotification.create({
      data: {
        userId: reminder.userId,
        type: mapReminderTypeToPushType(reminder.reminderType),
        title: getReminderTitle(reminder.reminderType),
        body: getReminderBody(reminder.reminderType),
        icon: '/icons/reminder.png',
        status: 'pending',
      },
    });

    // Update reminder stats
    await prisma.smartReminder.update({
      where: { id: reminderId },
      data: {
        lastSentAt: now,
        nextSendAt: calculateNextSendTime(reminder.frequency, reminder.optimalTime),
        totalSent: { increment: 1 },
      },
    });

    console.log(`[Smart Reminder Worker] Sent reminder ${reminderId}`);

    return {
      success: true,
      notificationId: notification.id,
    };
  } catch (error) {
    console.error(`[Smart Reminder Worker] Error sending reminder:`, error);
    throw error;
  }
}

smartReminderWorker.on('completed', (job) => {
  console.log(`[Smart Reminder Worker] Job ${job.id} completed`);
});

smartReminderWorker.on('failed', (job, err) => {
  console.error(`[Smart Reminder Worker] Job ${job?.id} failed:`, err);
});

// Helper functions
function mapReminderTypeToPushType(reminderType: string): string {
  const mapping: Record<string, string> = {
    daily_checkin: 'daily_reminder',
    weight_log: 'daily_reminder',
    meal_plan: 'daily_reminder',
    water_intake: 'daily_reminder',
    exercise: 'daily_reminder',
    sleep_reminder: 'daily_reminder',
    weekly_summary: 'weekly_summary',
  };
  return mapping[reminderType] || 'daily_reminder';
}

function getReminderTitle(reminderType: string): string {
  const titles: Record<string, string> = {
    daily_checkin: '📝 Günlük Check-in Zamanı!',
    weight_log: '⚖️ Kilo Kaydı Hatırlatması',
    meal_plan: '🍽️ Öğün Planı Hazır',
    water_intake: '💧 Su İçmeyi Unutma!',
    exercise: '🏃 Egzersiz Zamanı',
    sleep_reminder: '😴 Uyku Zamanı Yaklaşıyor',
    weekly_summary: '📊 Haftalık Özet Hazır',
  };
  return titles[reminderType] || '🔔 Hatırlatma';
}

function getReminderBody(reminderType: string): string {
  const bodies: Record<string, string> = {
    daily_checkin: 'Bugünkü ilerlemenizi kaydetmeyi unutmayın!',
    weight_log: 'Kilonuzu kaydetme zamanı. Düzenli takip başarının anahtarı!',
    meal_plan: 'Bugünkü öğün planınızı kontrol edin.',
    water_intake: 'Günlük su hedefinize ulaşmak için su içmeyi unutmayın.',
    exercise: 'Bugünkü egzersiz rutininizi tamamlama zamanı!',
    sleep_reminder: 'Kaliteli uyku kilo verme sürecinde çok önemli.',
    weekly_summary: 'Bu haftaki ilerlemenizi görüntüleyin!',
  };
  return bodies[reminderType] || 'Hatırlatma mesajınız var.';
}

function calculateNextSendTime(frequency: string, optimalTime: string): Date {
  const now = new Date();
  const [hours, minutes] = optimalTime.split(':').map(Number);
  
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);

  switch (frequency) {
    case 'daily':
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'biweekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
  }

  return next;
}

/**
 * Schedule reminder optimization for a user
 */
export async function scheduleReminderOptimization(userId: string, reminderId?: string) {
  await smartReminderQueue.add(
    'optimize-reminder',
    { userId, reminderId },
    {
      jobId: `optimize-${userId}-${reminderId || 'all'}-${Date.now()}`,
      priority: 5,
    }
  );
}

/**
 * Schedule reminder to be sent
 */
export async function scheduleReminderSend(reminderId: string) {
  const reminder = await prisma.smartReminder.findUnique({
    where: { id: reminderId },
  });

  if (!reminder || !reminder.enabled) {
    return;
  }

  await smartReminderQueue.add(
    'send-reminder',
    { reminderId },
    {
      jobId: `send-${reminderId}-${Date.now()}`,
      priority: 3,
    }
  );
}

/**
 * Schedule all pending reminders
 */
export async function schedulePendingReminders() {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const pendingReminders = await prisma.smartReminder.findMany({
    where: {
      enabled: true,
      OR: [
        { nextSendAt: null },
        { nextSendAt: { lte: now } },
      ],
    },
  });

  console.log(`[Smart Reminder Worker] Scheduling ${pendingReminders.length} pending reminders`);

  for (const reminder of pendingReminders) {
    await scheduleReminderSend(reminder.id);
  }
}
