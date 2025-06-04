import { NextResponse } from 'next/server';
import { MonitoringService } from '@/lib/monitoring/MonitoringService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const monitoringService = MonitoringService.getInstance();
    const health = await monitoringService.getSystemHealth();

    return NextResponse.json(health);
  } catch (error) {
    console.error('Error fetching system health:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system health' },
      { status: 500 }
    );
  }
} 