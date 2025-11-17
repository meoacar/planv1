import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Database Health Check
 * 
 * Checks if database connection is working
 */
export async function GET() {
  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Health Check] Database error:", error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
