import { prisma } from '@/lib/prisma';
import os from 'os';

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: SystemMetrics = {
    cpuUsage: 0,
    memoryUsage: 0,
    activeConnections: 0,
    requestCount: 0,
    errorCount: 0,
    averageResponseTime: 0,
  };

  private constructor() {
    this.startMonitoring();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private async startMonitoring() {
    setInterval(async () => {
      await this.updateMetrics();
    }, 60000); // Update every minute
  }

  private async updateMetrics() {
    // Get CPU and memory usage
    const cpuUsage = os.loadavg()[0] / os.cpus().length;
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsage = (totalMemory - freeMemory) / totalMemory;

    // Get database connection count
    const activeConnections = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM information_schema.processlist
    `.then((result: any) => result[0].count);

    // Update metrics
    this.metrics = {
      ...this.metrics,
      cpuUsage,
      memoryUsage,
      activeConnections,
    };
  }

  async getMetrics(): Promise<SystemMetrics> {
    return this.metrics;
  }

  async trackRequest(duration: number, isError: boolean = false) {
    this.metrics.requestCount++;
    if (isError) {
      this.metrics.errorCount++;
    }
    
    // Update average response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.requestCount - 1) + duration) / 
      this.metrics.requestCount;
  }

  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: SystemMetrics;
  }> {
    const metrics = await this.getMetrics();
    
    // Determine system health based on metrics
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (metrics.cpuUsage > 0.9 || metrics.memoryUsage > 0.9) {
      status = 'unhealthy';
    } else if (metrics.cpuUsage > 0.7 || metrics.memoryUsage > 0.7) {
      status = 'degraded';
    }

    if (metrics.errorCount / metrics.requestCount > 0.1) {
      status = 'unhealthy';
    } else if (metrics.errorCount / metrics.requestCount > 0.05) {
      status = 'degraded';
    }

    return { status, metrics };
  }
} 