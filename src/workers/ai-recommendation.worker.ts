import { Queue, Worker, Job } from 'bullmq';
import { prisma } from '@/lib/db';
import { generateRecommendations } from '@/lib/ai';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export const aiRecommendationQueue = new Queue('ai-recommendations', {
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

interface RecommendationJobData {
  userId: string;
  type?: 'plan' | 'recipe' | 'group' | 'guild' | 'challenge';
  limit?: number;
}

/**
 * Worker to generate AI recommendations for users
 */
export const aiRecommendationWorker = new Worker<RecommendationJobData>(
  'ai-recommendations',
  async (job: Job<RecommendationJobData>) => {
    const { userId, type, limit = 10 } = job.data;

    console.log(`[AI Recommendation Worker] Processing job ${job.id} for user ${userId}`);

    try {
      // Fetch user data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          currentWeight: true,
          targetWeight: true,
          height: true,
          level: true,
          xp: true,
        },
      });

      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      // Fetch user history
      const [completedPlans, likedRecipes, joinedGroups] = await Promise.all([
        prisma.planProgress.findMany({
          where: { userId },
          select: { planId: true },
          take: 10,
        }),
        prisma.recipeLike.findMany({
          where: { userId },
          select: { recipeId: true },
          take: 10,
        }),
        prisma.groupMember.findMany({
          where: { userId },
          select: { groupId: true },
          take: 5,
        }),
      ]);

      // Generate AI recommendations
      const recommendations = await generateRecommendations({
        userId,
        userPreferences: {
          goals: user.targetWeight ? ['weight_loss'] : [],
          activityLevel: user.level > 10 ? 'high' : user.level > 5 ? 'medium' : 'low',
        },
        userHistory: {
          completedPlans: completedPlans.map((p) => p.planId),
          likedRecipes: likedRecipes.map((r) => r.recipeId),
          joinedGroups: joinedGroups.map((g) => g.groupId),
        },
        limit,
      });

      // Filter by type if specified
      const filteredRecommendations = type
        ? recommendations.filter((r) => r.type === type)
        : recommendations;

      // Save to database
      const saved = await Promise.all(
        filteredRecommendations.map((rec) =>
          prisma.aIRecommendation.create({
            data: {
              userId,
              recommendationType: rec.type,
              targetId: rec.targetId,
              targetTitle: rec.targetTitle,
              score: rec.score,
              reason: rec.reason,
              metadata: rec.metadata ? JSON.stringify(rec.metadata) : null,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
          })
        )
      );

      console.log(
        `[AI Recommendation Worker] Generated ${saved.length} recommendations for user ${userId}`
      );

      return {
        success: true,
        count: saved.length,
        recommendations: saved,
      };
    } catch (error) {
      console.error(`[AI Recommendation Worker] Error for user ${userId}:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

aiRecommendationWorker.on('completed', (job) => {
  console.log(`[AI Recommendation Worker] Job ${job.id} completed`);
});

aiRecommendationWorker.on('failed', (job, err) => {
  console.error(`[AI Recommendation Worker] Job ${job?.id} failed:`, err);
});

/**
 * Schedule daily recommendation generation for active users
 */
export async function scheduleUserRecommendations(userId: string) {
  await aiRecommendationQueue.add(
    'generate-recommendations',
    { userId },
    {
      jobId: `recommendations-${userId}-${Date.now()}`,
      priority: 5,
    }
  );
}

/**
 * Bulk schedule recommendations for all active users
 */
export async function scheduleBulkRecommendations() {
  // Get active users (logged in within last 7 days)
  const activeUsers = await prisma.user.findMany({
    where: {
      lastCheckIn: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    select: { id: true },
    take: 1000,
  });

  console.log(`[AI Recommendation Worker] Scheduling recommendations for ${activeUsers.length} users`);

  const jobs = activeUsers.map((user) => ({
    name: 'generate-recommendations',
    data: { userId: user.id },
    opts: {
      jobId: `recommendations-${user.id}-${Date.now()}`,
      priority: 10,
    },
  }));

  await aiRecommendationQueue.addBulk(jobs);
}
