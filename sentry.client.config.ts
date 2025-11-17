import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment
  environment: process.env.NODE_ENV || "development",
  
  // Tracing
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Performance Monitoring
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        "localhost",
        /^https:\/\/zayiflamaplan\.com/,
      ],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Error Filtering
  beforeSend(event, hint) {
    // Filter out specific errors
    const error = hint.originalException;
    
    // Ignore network errors
    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message);
      if (
        message.includes("Network request failed") ||
        message.includes("Failed to fetch")
      ) {
        return null;
      }
    }
    
    // Ignore cancelled requests
    if (event.exception?.values?.[0]?.type === "AbortError") {
      return null;
    }
    
    return event;
  },
  
  // Add user context
  beforeBreadcrumb(breadcrumb) {
    // Filter sensitive data from breadcrumbs
    if (breadcrumb.category === "console") {
      return null;
    }
    return breadcrumb;
  },
});
