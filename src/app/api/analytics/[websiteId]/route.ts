import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/AnalyticsService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET(
  request: NextRequest,
  { params }: { params: { websiteId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = new Date(searchParams.get('startDate') || Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date(searchParams.get('endDate') || Date.now());

    const metrics = await AnalyticsService.getWebsiteMetrics(
      params.websiteId,
      startDate,
      endDate
    );

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 