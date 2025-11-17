import { NextResponse } from "next/server";

/**
 * OpenAI Health Check
 * 
 * Checks if OpenAI API is configured and accessible
 */
export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        {
          status: "unhealthy",
          openai: "not_configured",
          error: "OPENAI_API_KEY is not set",
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
    
    // Test OpenAI API with a simple request
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (response.ok) {
      return NextResponse.json({
        status: "healthy",
        openai: "connected",
        timestamp: new Date().toISOString(),
      });
    }
    
    throw new Error(`OpenAI API returned ${response.status}`);
  } catch (error) {
    console.error("[Health Check] OpenAI error:", error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        openai: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
