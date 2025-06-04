import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    external: 'up' | 'down' | 'degraded';
  };
  metrics: {
    activeUsers: number;
    activeWebsites: number;
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    version: string;
  };
  environment: string;
}

export async function GET() {
  const startTime = Date.now();
  const healthCheck: HealthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'down',
      redis: 'down',
      external: 'down',
    },
    metrics: {
      activeUsers: 0,
      activeWebsites: 0,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    },
    environment: process.env.NODE_ENV || 'development',
  };

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.services.database = 'up';

    // Get metrics
    const [activeUsers, activeWebsites] = await Promise.all([
      prisma.user.count({
        where: { 
          lastLoginAt: { 
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
          } 
        }
      }),
      prisma.website.count({
        where: { status: 'PUBLISHED' }
      }),
    ]);

    healthCheck.metrics.activeUsers = activeUsers;
    healthCheck.metrics.activeWebsites = activeWebsites;
  } catch (error) {
    console.error('Database health check failed:', error);
    healthCheck.status = 'unhealthy';
  }

  // Check Redis
  try {
    await redis.ping();
    healthCheck.services.redis = 'up';
  } catch (error) {
    console.error('Redis health check failed:', error);
    healthCheck.status = healthCheck.status === 'healthy' ? 'degraded' : 'unhealthy';
  }

  // Check external services (Google Cloud, etc.)
  try {
    const externalChecks = await Promise.all([
      // Add your external service checks here
      fetch('https://www.googleapis.com/storage/v1/b', { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) 
      }),
    ]);

    const allExternalHealthy = externalChecks.every(response => response.ok);
    healthCheck.services.external = allExternalHealthy ? 'up' : 'degraded';
    
    if (!allExternalHealthy && healthCheck.status === 'healthy') {
      healthCheck.status = 'degraded';
    }
  } catch (error) {
    console.error('External services health check failed:', error);
    healthCheck.services.external = 'degraded';
    if (healthCheck.status === 'healthy') {
      healthCheck.status = 'degraded';
    }
  }

  const responseTime = Date.now() - startTime;
  
  // Set response status based on health
  const statusCode = healthCheck.status === 'healthy' ? 200 : 
                    healthCheck.status === 'degraded' ? 200 : 503;

  return NextResponse.json(healthCheck, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache',
      'X-Response-Time': `${responseTime}ms`,
    },
  });
} 