import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment
  environment: process.env.NODE_ENV || "development",
  
  // Tracing
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Performance Monitoring
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Prisma({ client: undefined }), // Will be set at runtime
  ],
  
  // Error Filtering
  beforeSend(event, hint) {
    // Add server-side context
    const error = hint.originalException;
    
    // Log critical errors
    if (event.level === "fatal" || event.level === "error") {
      console.error("[Sentry]", error);
    }
    
    // Filter out expected errors
    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message);
      
      // Ignore rate limit errors (expected behavior)
      if (message.includes("RATE_LIMIT_EXCEEDED")) {
        return null;
      }
      
      // Ignore daily limit errors (expected behavior)
      if (message.includes("DAILY_LIMIT_EXCEEDED")) {
        return null;
      }
    }
    
    return event;
  },
  
  // Add tags for better filtering
  initialScope: {
    tags: {
      service: "confession-wall",
    },
  },
});
