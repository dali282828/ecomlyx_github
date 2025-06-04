import axios from 'axios';
import { emailService } from '../src/lib/email';
import { logger } from '../src/lib/logger';

interface HealthStatus {
  url: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  timestamp: Date;
  details?: any;
}

class HealthMonitor {
  private endpoints: string[];
  private alertEmails: string[];
  private checkInterval: number;
  private alertThreshold: number;
  private failureCount: Map<string, number> = new Map();

  constructor() {
    this.endpoints = [
      `${process.env.APP_URL}/api/health`,
      `${process.env.APP_URL}/`,
    ];
    this.alertEmails = (process.env.ALERT_EMAILS || '').split(',').filter(Boolean);
    this.checkInterval = parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'); // 30 seconds
    this.alertThreshold = 3; // Alert after 3 consecutive failures
  }

  async startMonitoring(): Promise<void> {
    console.log('🏥 Starting health monitoring...');
    console.log(`Monitoring ${this.endpoints.length} endpoints every ${this.checkInterval / 1000}s`);

    setInterval(async () => {
      await this.performHealthChecks();
    }, this.checkInterval);

    // Initial check
    await this.performHealthChecks();
  }

  private async performHealthChecks(): Promise<void> {
    const checks = this.endpoints.map(url => this.checkEndpoint(url));
    const results = await Promise.allSettled(checks);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const endpoint = this.endpoints[i];

      if (result.status === 'fulfilled') {
        const healthStatus = result.value;
        await this.handleHealthResult(endpoint, healthStatus);
      } else {
        await this.handleHealthResult(endpoint, {
          url: endpoint,
          status: 'unhealthy',
          responseTime: 0,
          timestamp: new Date(),
          details: { error: result.reason.message },
        });
      }
    }
  }

  private async checkEndpoint(url: string): Promise<HealthStatus> {
    const startTime = Date.now();

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        validateStatus: (status) => status < 500, // Accept 4xx as healthy
      });

      const responseTime = Date.now() - startTime;
      const isHealthy = response.status < 400;

      return {
        url,
        status: isHealthy ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date(),
        details: {
          statusCode: response.status,
          data: response.data,
        },
      };
    } catch (error: any) {
      return {
        url,
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        timestamp: new Date(),
        details: {
          error: error.message,
          code: error.code,
        },
      };
    }
  }

  private async handleHealthResult(endpoint: string, result: HealthStatus): Promise<void> {
    logger.info({
      endpoint,
      status: result.status,
      responseTime: result.responseTime,
    }, 'Health check completed');

    if (result.status === 'healthy') {
      // Reset failure count on success
      this.failureCount.set(endpoint, 0);
    } else {
      // Increment failure count
      const currentFailures = this.failureCount.get(endpoint) || 0;
      const newFailureCount = currentFailures + 1;
      this.failureCount.set(endpoint, newFailureCount);

      // Send alert if threshold reached
      if (newFailureCount === this.alertThreshold) {
        await this.sendAlert(endpoint, result);
      }

      logger.warn({
        endpoint,
        status: result.status,
        failureCount: newFailureCount,
        details: result.details,
      }, 'Health check failed');
    }
  }

  private async sendAlert(endpoint: string, result: HealthStatus): Promise<void> {
    if (this.alertEmails.length === 0) {
      console.log('No alert emails configured');
      return;
    }

    const subject = `🚨 Health Alert: ${endpoint} is ${result.status}`;
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #dc3545;">Health Check Alert</h2>
        <p><strong>Endpoint:</strong> ${endpoint}</p>
        <p><strong>Status:</strong> ${result.status}</p>
        <p><strong>Response Time:</strong> ${result.responseTime}ms</p>
        <p><strong>Timestamp:</strong> ${result.timestamp.toISOString()}</p>
        
        ${result.details ? `
          <h3>Details:</h3>
          <pre style="background: #f8f9fa; padding: 10px; border-radius: 4px;">
${JSON.stringify(result.details, null, 2)}
          </pre>
        ` : ''}
        
        <p>Please investigate and resolve the issue as soon as possible.</p>
      </div>
    `;

    try {
      for (const email of this.alertEmails) {
        await emailService.sendEmail({
          to: email,
          subject,
          html,
        });
      }

      logger.info({
        endpoint,
        alertsSent: this.alertEmails.length,
      }, 'Health alert sent');
    } catch (error) {
      logger.error({
        error,
        endpoint,
      }, 'Failed to send health alert');
    }
  }
}

export const healthMonitor = new HealthMonitor();

// CLI execution
if (require.main === module) {
  healthMonitor.startMonitoring()
    .then(() => {
      console.log('✅ Health monitoring started');
    })
    .catch(error => {
      console.error('❌ Health monitoring failed to start:', error);
      process.exit(1);
    });
} 