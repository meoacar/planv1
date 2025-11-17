# Monitoring Setup Guide

Bu dokuman, Confession Wall sistemi için monitoring ve error tracking kurulumunu açıklar.

## 📊 Overview

Monitoring stack:
- **Sentry**: Error tracking ve performance monitoring
- **Vercel Analytics**: Frontend performance ve Web Vitals
- **Custom Metrics**: Business metrics ve system health
- **Alert System**: Proactive monitoring ve notifications

## 🔧 Sentry Setup

### 1. Sentry Projesi Oluşturma

```bash
# 1. Sentry hesabı oluştur: https://sentry.io/signup/

# 2. Yeni proje oluştur
# - Platform: Next.js
# - Alert frequency: On every new issue
# - Team: Engineering

# 3. DSN'i kopyala
# Format: https://[key]@[org].ingest.sentry.io/[project-id]
```

### 2. Sentry Paketlerini Yükleme

```bash
# Sentry Next.js SDK'sını yükle
pnpm add @sentry/nextjs

# Sentry wizard ile otomatik setup
npx @sentry/wizard@latest -i nextjs
```

### 3. Environment Variables

`.env.production` dosyasına ekle:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/your-project-id
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=zayiflamaplan
```

### 4. Sentry Konfigürasyonu Test Etme

```bash
# Test error gönder
node -e "
const Sentry = require('@sentry/nextjs');
Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
Sentry.captureMessage('Test from monitoring setup');
console.log('Test error sent to Sentry');
"

# Sentry dashboard'da kontrol et
```

### 5. Source Maps Upload

`next.config.js` dosyasına ekle:

```javascript
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // ... existing config
};

module.exports = withSentryConfig(
  nextConfig,
  {
    // Sentry webpack plugin options
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    // Upload source maps
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
  }
);
```

## 📈 Vercel Analytics Setup

### 1. Vercel Analytics Aktifleştirme

```bash
# 1. Vercel dashboard'a git
# 2. Project Settings > Analytics
# 3. Enable Analytics

# 2. Analytics paketini yükle
pnpm add @vercel/analytics
```

### 2. Analytics Entegrasyonu

`src/app/layout.tsx` dosyasına ekle:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Environment Variable

```bash
# .env.production
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

## 📊 Custom Metrics Setup

### 1. Metrics Endpoint Oluşturma

Kendi metrics endpoint'inizi oluşturabilir veya üçüncü parti servis kullanabilirsiniz:

**Seçenek 1: Datadog**
```bash
# Datadog agent yükle
DD_API_KEY=<your-api-key> DD_SITE="datadoghq.com" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"

# Environment variables
METRICS_ENDPOINT=https://api.datadoghq.com/api/v1/series
METRICS_API_KEY=your-datadog-api-key
```

**Seçenek 2: Prometheus + Grafana**
```bash
# Prometheus exporter endpoint oluştur
# src/app/api/metrics/route.ts

import { NextResponse } from 'next/server';
import { metricsService } from '@/services/metrics.service';

export async function GET() {
  const metrics = await metricsService.getPrometheusMetrics();
  return new NextResponse(metrics, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
```

**Seçenek 3: Custom Endpoint**
```bash
# Kendi metrics API'nizi kullanın
METRICS_ENDPOINT=https://metrics.zayiflamaplan.com/api/metrics
METRICS_API_KEY=your-custom-api-key
```

### 2. Metrics Service Kullanımı

```typescript
import { metricsService } from '@/services/metrics.service';

// İtiraf oluşturulduğunda
metricsService.trackConfessionCreated(category, status);

// AI yanıt üretildiğinde
metricsService.trackAIResponse(success, duration, tone);

// Empati gösterildiğinde
metricsService.trackEmpathy('add');

// API çağrısı yapıldığında
metricsService.trackAPICall(endpoint, method, statusCode, duration);
```

## 🚨 Alert System Setup

### 1. Slack Webhook Oluşturma

```bash
# 1. Slack workspace'e git
# 2. Apps > Incoming Webhooks
# 3. Add to Slack
# 4. Channel seç (#alerts)
# 5. Webhook URL'i kopyala
```

### 2. Alert Notification Service

`src/services/alert.service.ts` oluştur:

```typescript
export async function sendAlert(
  severity: 'critical' | 'warning' | 'info',
  message: string,
  details?: any
) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) return;
  
  const color = {
    critical: '#FF0000',
    warning: '#FFA500',
    info: '#0000FF',
  }[severity];
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{
        color,
        title: message,
        text: JSON.stringify(details, null, 2),
        footer: 'Confession Wall Monitoring',
        ts: Math.floor(Date.now() / 1000),
      }],
    }),
  });
}
```

### 3. Alert Rules Konfigürasyonu

`monitoring/alert-rules.yaml` dosyasını düzenle ve environment variables ekle:

```bash
# .env.production
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
PAGERDUTY_INTEGRATION_KEY=your-pagerduty-key
SMTP_HOST=smtp.gmail.com
```

### 4. Health Check Monitoring

Uptime monitoring servisi kullan (örn: UptimeRobot, Pingdom):

```bash
# Monitor edilecek endpoints:
https://zayiflamaplan.com/api/health
https://zayiflamaplan.com/api/health/db
https://zayiflamaplan.com/api/health/redis
https://zayiflamaplan.com/api/health/openai

# Check interval: 5 minutes
# Alert on: 2 consecutive failures
```

## 📱 PagerDuty Setup (Optional)

### 1. PagerDuty Entegrasyonu

```bash
# 1. PagerDuty hesabı oluştur
# 2. Service oluştur: "Confession Wall"
# 3. Integration ekle: "Events API v2"
# 4. Integration Key'i kopyala
```

### 2. Environment Variable

```bash
PAGERDUTY_INTEGRATION_KEY=your-integration-key
```

### 3. Critical Alert Gönderme

```typescript
import { sendPagerDutyAlert } from '@/lib/pagerduty';

// Critical error durumunda
await sendPagerDutyAlert({
  severity: 'critical',
  summary: 'Database connection failed',
  source: 'confession-wall',
  component: 'database',
});
```

## 📊 Monitoring Dashboard

### 1. Admin Monitoring Sayfası

`src/app/admin/monitoring/page.tsx` oluştur:

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      const res = await fetch('/api/admin/monitoring/metrics');
      const data = await res.json();
      setMetrics(data);
    };
    
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div>
      <h1>System Monitoring</h1>
      {/* Metrics dashboard UI */}
    </div>
  );
}
```

### 2. Grafana Dashboard (Optional)

```bash
# 1. Grafana yükle
docker run -d -p 3000:3000 grafana/grafana

# 2. Prometheus data source ekle
# 3. Dashboard import et (confession-wall-dashboard.json)
# 4. Panels:
#    - Confession creation rate
#    - AI response success rate
#    - Queue size
#    - API response time
#    - Error rate
```

## 🔍 Log Aggregation

### 1. CloudWatch Logs (AWS)

```bash
# CloudWatch agent yükle
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Konfigürasyon
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json
```

### 2. Structured Logging

```typescript
// src/lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    }));
  },
  error: (message: string, error?: Error, meta?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...meta,
    }));
  },
};
```

## ✅ Verification Checklist

- [ ] Sentry error tracking çalışıyor
- [ ] Vercel Analytics data geliyor
- [ ] Custom metrics kaydediliyor
- [ ] Health check endpoints erişilebilir
- [ ] Slack alerts çalışıyor
- [ ] PagerDuty entegrasyonu aktif (opsiyonel)
- [ ] Monitoring dashboard erişilebilir
- [ ] Alert rules test edildi
- [ ] Log aggregation çalışıyor

## 📚 Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/)
- [Grafana Dashboard Examples](https://grafana.com/grafana/dashboards/)
