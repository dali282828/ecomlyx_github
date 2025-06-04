import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Website, Page } from '@prisma/client';

interface WebsiteWithRelations extends Website {
  pages: Page[];
  plugins: any[];
  settings: {
    analytics?: {
      visitors?: number;
      pageSpeed?: number;
      mobileScore?: number;
      desktopScore?: number;
    };
  } | null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's websites
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        websites: {
          include: {
            pages: true,
            plugins: true,
            settings: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate analytics data
    const totalVisitors = user.websites.reduce((acc: number, website: WebsiteWithRelations) => {
      const analytics = website.settings?.analytics || {};
      return acc + (analytics.visitors || 0);
    }, 0);

    const totalPages = user.websites.reduce((acc: number, website: WebsiteWithRelations) => acc + website.pages.length, 0);
    const totalPlugins = user.websites.reduce((acc: number, website: WebsiteWithRelations) => acc + website.plugins.length, 0);

    // Get recent activity
    const recentActivity = await prisma.page.findMany({
      where: {
        website: {
          userId: user.id,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
      include: {
        website: true,
      },
    });

    const activityData = recentActivity.map((page: Page & { website: Website }) => ({
      id: page.id,
      action: 'Page Updated',
      website: page.website.name,
      time: page.updatedAt,
    }));

    // Get performance metrics
    const performanceData = user.websites.map((website: WebsiteWithRelations) => {
      const settings = website.settings?.analytics || {};

      return {
        websiteId: website.id,
        websiteName: website.name,
        pageSpeed: settings.pageSpeed || 0,
        mobileScore: settings.mobileScore || 0,
        desktopScore: settings.desktopScore || 0,
      };
    });

    return NextResponse.json({
      totalVisitors,
      totalPages,
      totalPlugins,
      recentActivity: activityData,
      performance: performanceData,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 