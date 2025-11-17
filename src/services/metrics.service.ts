/**
 * Metrics Service
 * 
 * Custom metrics tracking for Confession Wall system
 * Tracks performance, usage, and business metrics
 */

interface MetricData {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: Date;
}

interface ConfessionMetrics {
  totalConfessions: number;
  publishedConfessions: number;
  pendingConfessions: number;
  rejectedConfessions: number;
  averageEmpathy: number;
  popularConfessions: number;
}

interface AIMetrics {
  totalRequests: number;
  successfulResponses: number;
  failedResponses: number;
  averageResponseTime: number;
  timeoutCount: number;
  fallbackCount: number;
}

interface QueueMetrics {
  queueSize: number;
  processingCount: number;
  completedCount: number;
  failedCount: number;
  averageProcessingTime: number;
}

class MetricsService {
  private metricsEndpoint: string | undefined;
  private metricsApiKey: string | undefined;
  private buffer: MetricData[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.metricsEndpoint = process.env.METRICS_ENDPOINT;
    this.metricsApiKey = process.env.METRICS_API_KEY;
    
    // Start auto-flush every 60 seconds
    if (this.metricsEndpoint) {
      this.flushInterval = setInterval(() => this.flush(), 60000);
    }
  }

  /**
   * Track a custom metric
   */
  track(name: string, value: number, tags?: Record<string, string>): void {
    const metric: MetricData = {
      name,
      value,
      tags: {
        environment: process.env.NODE_ENV || "development",
        ...tags,
      },
      timestamp: new Date(),
    };

    this.buffer.push(metric);

    // Auto-flush if buffer is large
    if (this.buffer.length >= 100) {
      this.flush();
    }

    // Also log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Metrics] ${name}:`, value, tags);
    }
  }

  /**
   * Track confession creation
   */
  trackConfessionCreated(category: string, status: string): void {
    this.track("confession.created", 1, { category, status });
  }

  /**
   * Track AI response generation
   */
  trackAIResponse(success: boolean, duration: number, tone?: string): void {
    this.track("ai.response.generated", 1, {
      success: success.toString(),
      tone: tone || "unknown",
    });
    this.track("ai.response.duration", duration, {
      success: success.toString(),
    });
  }

  /**
   * Track empathy action
   */
  trackEmpathy(action: "add" | "remove"): void {
    this.track("confession.empathy", 1, { action });
  }

  /**
   * Track confession report
   */
  trackReport(reason: string): void {
    this.track("confession.report", 1, { reason });
  }

  /**
   * Track moderation action
   */
  trackModeration(action: "approve" | "reject", reason?: string): void {
    this.track("confession.moderation", 1, {
      action,
      reason: reason || "none",
    });
  }

  /**
   * Track queue metrics
   */
  trackQueueJob(
    status: "completed" | "failed",
    duration: number,
    retries: number
  ): void {
    this.track("queue.job", 1, {
      status,
      retries: retries.toString(),
    });
    this.track("queue.job.duration", duration, { status });
  }

  /**
   * Track cache hit/miss
   */
  trackCache(hit: boolean, key: string): void {
    this.track("cache.access", 1, {
      hit: hit.toString(),
      key,
    });
  }

  /**
   * Track API endpoint performance
   */
  trackAPICall(
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number
  ): void {
    this.track("api.request", 1, {
      endpoint,
      method,
      status: statusCode.toString(),
    });
    this.track("api.duration", duration, {
      endpoint,
      method,
    });
  }

  /**
   * Get confession metrics
   */
  async getConfessionMetrics(): Promise<ConfessionMetrics> {
    // This would typically query from a metrics database
    // For now, return placeholder data
    return {
      totalConfessions: 0,
      publishedConfessions: 0,
      pendingConfessions: 0,
      rejectedConfessions: 0,
      averageEmpathy: 0,
      popularConfessions: 0,
    };
  }

  /**
   * Get AI metrics
   */
  async getAIMetrics(): Promise<AIMetrics> {
    return {
      totalRequests: 0,
      successfulResponses: 0,
      failedResponses: 0,
      averageResponseTime: 0,
      timeoutCount: 0,
      fallbackCount: 0,
    };
  }

  /**
   * Get queue metrics
   */
  async getQueueMetrics(): Promise<QueueMetrics> {
    return {
      queueSize: 0,
      processingCount: 0,
      completedCount: 0,
      failedCount: 0,
      averageProcessingTime: 0,
    };
  }

  /**
   * Flush metrics buffer to endpoint
   */
  private async flush(): Promise<void> {
    if (this.buffer.length === 0 || !this.metricsEndpoint) {
      return;
    }

    const metricsToSend = [...this.buffer];
    this.buffer = [];

    try {
      const response = await fetch(this.metricsEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.metricsApiKey && {
            Authorization: `Bearer ${this.metricsApiKey}`,
          }),
        },
        body: JSON.stringify({ metrics: metricsToSend }),
      });

      if (!response.ok) {
        console.error(
          "[Metrics] Failed to send metrics:",
          response.statusText
        );
        // Put metrics back in buffer for retry
        this.buffer.unshift(...metricsToSend);
      }
    } catch (error) {
      console.error("[Metrics] Error sending metrics:", error);
      // Put metrics back in buffer for retry
      this.buffer.unshift(...metricsToSend);
    }
  }

  /**
   * Cleanup on shutdown
   */
  async shutdown(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    await this.flush();
  }
}

// Singleton instance
export const metricsService = new MetricsService();

// Graceful shutdown
if (typeof process !== "undefined") {
  process.on("SIGTERM", () => {
    metricsService.shutdown();
  });
  process.on("SIGINT", () => {
    metricsService.shutdown();
  });
}
