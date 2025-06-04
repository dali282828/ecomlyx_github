import { prisma } from '@/lib/prisma';

export interface WebsiteMetrics {
  pageViews: number;
  uniqueVisitors: number;
  averageLoadTime: number;
  bounceRate: number;
}

export class AnalyticsService {
  static async trackPageView(websiteId: string, path: string, userId?: string) {
    await prisma.pageView.create({
      data: {
        websiteId,
        path,
        userId,
        timestamp: new Date(),
      },
    });
  }

  static async getWebsiteMetrics(websiteId: string, startDate: Date, endDate: Date): Promise<WebsiteMetrics> {
    const pageViews = await prisma.pageView.count({
      where: {
        websiteId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const uniqueVisitors = await prisma.pageView.groupBy({
      by: ['userId'],
      where: {
        websiteId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    }).then(results => results.length);

    // Calculate average load time (mock data for now)
    const averageLoadTime = 2.5;

    // Calculate bounce rate (mock data for now)
    const bounceRate = 0.45;

    return {
      pageViews,
      uniqueVisitors,
      averageLoadTime,
      bounceRate,
    };
  }

  static async getSystemMetrics() {
    const totalWebsites = await prisma.website.count();
    const activeWebsites = await prisma.website.count({
      where: { status: 'PUBLISHED' },
    });
    const totalUsers = await prisma.user.count();
    const totalPageViews = await prisma.pageView.count();

    return {
      totalWebsites,
      activeWebsites,
      totalUsers,
      totalPageViews,
    };
  }
} 