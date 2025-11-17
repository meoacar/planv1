import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

/**
 * Redis Health Check
 * 
 * Checks if Redis connection is working
 */
export async function GET() {
  try {
    const redis = await getRedisClient();
    
    if (!redis) {
      return NextResponse.json({
        status: "degraded",
        redis: "not_configured",
        message: "Redis is not configured, using graceful degradation",
        timestamp: new Date().toISOString(),
      });
    }
    
    // Test Redis connection
    const pong = await redis.ping();
    
    if (pong === "PONG") {
      return NextResponse.json({
        status: "healthy",
        redis: "connected",
        timestamp: new Date().toISOString(),
      });
    }
    
    throw new Error("Redis ping failed");
  } catch (error) {
    console.error("[Health Check] Redis error:", error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        redis: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
