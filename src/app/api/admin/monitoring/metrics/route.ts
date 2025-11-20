import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// import { getRedisClient } from "@/lib/redis";
// import { getQueue } from "@/lib/queue";

/**
 * Admin Monitoring Metrics Endpoint
 * 
 * Returns comprehensive system metrics for monitoring dashboard
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Collect metrics from various sources
    const [
      confessionMetrics,
      aiMetrics,
      queueMetrics,
      systemMetrics,
    ] = await Promise.all([
      getConfessionMetrics(),
      getAIMetrics(),
      getQueueMetrics(),
      getSystemMetrics(),
    ]);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      confession: confessionMetrics,
      ai: aiMetrics,
      queue: queueMetrics,
      system: systemMetrics,
    });
  } catch (error) {
    console.error("[Monitoring] Error fetching metrics:", error);
    
    return NextResponse.json(
      {
        error: "Failed to fetch metrics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Get confession-related metrics
 */
async function getConfessionMetrics() {
  const [
    total,
    published,
    pending,
    rejected,
    hidden,
    popular,
    avgEmpathy,
    todayCount,
  ] = await Promise.all([
    prisma.confession.count(),
    prisma.confession.count({ where: { status: "published" } }),
    prisma.confession.count({ where: { status: "pending" } }),
    prisma.confession.count({ where: { status: "rejected" } }),
    prisma.confession.count({ where: { status: "hidden" } }),
    prisma.confession.count({ where: { isPopular: true } }),
    prisma.confession.aggregate({
      _avg: { empathyCount: true },
      where: { status: "published" },
    }),
    prisma.confession.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  // Category breakdown
  const categoryBreakdown = await prisma.confession.groupBy({
    by: ["category"],
    _count: true,
    where: { status: "published" },
  });

  return {
    total,
    published,
    pending,
    rejected,
    hidden,
    popular,
    averageEmpathy: avgEmpathy._avg.empathyCount || 0,
    todayCount,
    categoryBreakdown: categoryBreakdown.map((item) => ({
      category: item.category,
      count: item._count,
    })),
  };
}

/**
 * Get AI-related metrics
 */
async function getAIMetrics() {
  const [totalWithAI, totalWithoutAI, avgResponseTime] = await Promise.all([
    prisma.confession.count({
      where: { aiResponse: { not: null } },
    }),
    prisma.confession.count({
      where: { aiResponse: null, status: "published" },
    }),
    // This would ideally come from a metrics database
    // For now, return placeholder
    Promise.resolve(0),
  ]);

  const successRate =
    totalWithAI + totalWithoutAI > 0
      ? (totalWithAI / (totalWithAI + totalWithoutAI)) * 100
      : 0;

  return {
    totalRequests: totalWithAI + totalWithoutAI,
    successfulResponses: totalWithAI,
    failedResponses: totalWithoutAI,
    successRate: Math.round(successRate * 100) / 100,
    averageResponseTime: avgResponseTime,
  };
}

/**
 * Get queue-related metrics
 */
async function getQueueMetrics() {
  // TODO: Re-enable when queue is properly configured
  // try {
  //   const queue = await getQueue("ai-response-generation");
  //   
  //   if (!queue) {
  //     return {
  //       queueSize: 0,
  //       active: 0,
  //       completed: 0,
  //       failed: 0,
  //       delayed: 0,
  //     };
  //   }

  //   const [waiting, active, completed, failed, delayed] = await Promise.all([
  //     queue.getWaitingCount(),
  //     queue.getActiveCount(),
  //     queue.getCompletedCount(),
  //     queue.getFailedCount(),
  //     queue.getDelayedCount(),
  //   ]);

  //   return {
  //     queueSize: waiting,
  //     active,
  //     completed,
  //     failed,
  //     delayed,
  //   };
  // } catch (error) {
  //   console.error("[Monitoring] Queue metrics error:", error);
    return {
      queueSize: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
    };
  // }
}

/**
 * Get system-related metrics
 */
async function getSystemMetrics() {
  // TODO: Re-enable when redis is properly configured
  // const redis = await getRedisClient();
  
  let redisStatus = "not_configured";
  let redisMemory = 0;
  
  // if (redis) {
  //   try {
  //     const info = await redis.info("memory");
  //     const memoryMatch = info.match(/used_memory:(\d+)/);
  //     redisMemory = memoryMatch ? parseInt(memoryMatch[1]) : 0;
  //     redisStatus = "connected";
  //   } catch (error) {
  //     redisStatus = "error";
  //   }
  // }

  return {
    uptime: process.uptime(),
    memory: {
      heapUsed: process.memoryUsage().heapUsed,
      heapTotal: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external,
      rss: process.memoryUsage().rss,
    },
    redis: {
      status: redisStatus,
      memoryUsed: redisMemory,
    },
    environment: process.env.NODE_ENV,
  };
}
