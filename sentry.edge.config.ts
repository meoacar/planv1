import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment
  environment: process.env.NODE_ENV || "development",
  
  // Tracing
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Edge runtime specific configuration
  integrations: [],
  
  // Error Filtering
  beforeSend(event) {
    // Edge runtime has limited capabilities
    // Keep error handling simple
    return event;
  },
});
