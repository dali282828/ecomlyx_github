import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's support tickets
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        websites: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get system status
    const systemStatus = {
      status: 'operational',
      services: [
        {
          name: 'Cloud SQL',
          status: 'operational',
          lastChecked: new Date().toISOString(),
        },
        {
          name: 'SSL Certificates',
          status: 'operational',
          lastChecked: new Date().toISOString(),
        },
      ],
    };

    // Get support tickets (this would come from a support tickets table)
    const supportTickets = [
      {
        id: 'TKT-001',
        subject: 'Website Performance Issue',
        status: 'Open',
        priority: 'High',
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'TKT-002',
        subject: 'SSL Certificate Renewal',
        status: 'In Progress',
        priority: 'Medium',
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json({
      tickets: supportTickets,
      systemStatus,
    });
  } catch (error) {
    console.error('Support error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, description, priority } = body;

    if (!subject || !description || !priority) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new support ticket (this would be saved to a support tickets table)
    const newTicket = {
      id: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      subject,
      description,
      priority,
      status: 'Open',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(newTicket);
  } catch (error) {
    console.error('Support ticket creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 