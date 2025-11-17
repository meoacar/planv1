import { NextResponse } from "next/server";

/**
 * Health Check Endpoint
 * 
 * Basic health check for the application
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
}
