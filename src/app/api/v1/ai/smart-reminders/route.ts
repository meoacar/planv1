import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { optimizeReminderTime } from '@/lib/ai';
import { z } from 'zod';

const reminderSchema = z.object({
  reminderType: z.enum([
    'daily_checkin',
    'weight_log',
    'meal_plan',
    'water_intake',
    'exercise',
    'sleep_reminder',
    'weekly_summary',
  ]),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']).optional().default('daily'),
  enabled: z.boolean().optional().default(true),
});

/**
 * GET /api/v1/ai/smart-reminders
 * Get user's smart reminders
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const reminders = await prisma.smartReminder.findMany({
      where: { userId: session.user.id },
      orderBy: { reminderType: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: { reminders },
      meta: { version: 'v1' },
    });
  } catch (error) {
    console.error('Get smart reminders error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch reminders',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/ai/smart-reminders
 * Create or update a smart reminder
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data = reminderSchema.parse(body);

    // Check if reminder already exists
    const existing = await prisma.smartReminder.findUnique({
      where: {
        userId_reminderType: {
          userId: session.user.id,
          reminderType: data.reminderType,
        },
      },
    });

    let reminder;

    if (existing) {
      // Update existing reminder
      reminder = await prisma.smartReminder.update({
        where: { id: existing.id },
        data: {
          frequency: data.frequency,
          enabled: data.enabled,
        },
      });
    } else {
      // Create new reminder with default time
      reminder = await prisma.smartReminder.create({
        data: {
          userId: session.user.id,
          reminderType: data.reminderType,
          optimalTime: getDefaultReminderTime(data.reminderType),
          frequency: data.frequency,
          enabled: data.enabled,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { reminder },
      meta: { version: 'v1' },
    });
  } catch (error) {
    console.error('Create smart reminder error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create reminder',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/ai/smart-reminders/optimize
 * Optimize reminder timing using ML
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { reminderId } = z.object({ reminderId: z.string() }).parse(body);

    const reminder = await prisma.smartReminder.findUnique({
      where: { id: reminderId },
    });

    if (!reminder || reminder.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Reminder not found' } },
        { status: 404 }
      );
    }

    // Fetch user's push notification history for this reminder type
    const notificationHistory = await prisma.pushNotification.findMany({
      where: {
        userId: session.user.id,
        type: mapReminderTypeToPushType(reminder.reminderType),
      },
      select: {
        createdAt: true,
        clickedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Build activity data for ML
    const clickHistory = notificationHistory.map((notif) => ({
      time: notif.createdAt.toTimeString().slice(0, 5),
      clicked: !!notif.clickedAt,
    }));

    // Get user's active hours (simplified: hours when they have activity)
    const activeHours = Array.from(
      new Set(
        notificationHistory
          .filter((n) => n.clickedAt)
          .map((n) => n.createdAt.getHours())
      )
    );

    // Optimize timing
    const optimalTime = await optimizeReminderTime(
      session.user.id,
      reminder.reminderType,
      { activeHours, clickHistory }
    );

    // Update reminder
    const updated = await prisma.smartReminder.update({
      where: { id: reminderId },
      data: {
        optimalTime,
        clickRate:
          reminder.totalSent > 0 ? reminder.totalClicked / reminder.totalSent : 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        reminder: updated,
        message: `Optimal time updated to ${optimalTime}`,
      },
      meta: { version: 'v1' },
    });
  } catch (error) {
    console.error('Optimize reminder error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to optimize reminder',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/ai/smart-reminders/:id
 * Delete a smart reminder
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reminderId = searchParams.get('id');

    if (!reminderId) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'Reminder ID required' } },
        { status: 400 }
      );
    }

    const reminder = await prisma.smartReminder.findUnique({
      where: { id: reminderId },
    });

    if (!reminder || reminder.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Reminder not found' } },
        { status: 404 }
      );
    }

    await prisma.smartReminder.delete({
      where: { id: reminderId },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Reminder deleted successfully' },
      meta: { version: 'v1' },
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete reminder',
        },
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getDefaultReminderTime(reminderType: string): string {
  const defaults: Record<string, string> = {
    daily_checkin: '20:00',
    weight_log: '07:00',
    meal_plan: '08:00',
    water_intake: '14:00',
    exercise: '18:00',
    sleep_reminder: '22:00',
    weekly_summary: '09:00',
  };
  return defaults[reminderType] || '20:00';
}

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
