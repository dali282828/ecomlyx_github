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

    // Get user's subscription and usage data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        websites: {
          include: {
            pages: true,
            plugins: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate resource usage
    const storageUsed = user.websites.reduce((acc, website) => {
      // Calculate storage based on pages and plugins
      const pageStorage = website.pages.reduce((pageAcc, page) => {
        const content = page.content as { size?: number } || {};
        return pageAcc + (content.size || 0);
      }, 0);
      
      const pluginStorage = website.plugins.reduce((pluginAcc, plugin) => {
        const settings = plugin.settings as { size?: number } || {};
        return pluginAcc + (settings.size || 0);
      }, 0);

      return acc + pageStorage + pluginStorage;
    }, 0);

    // Convert to GB
    const storageUsedGB = Math.round((storageUsed / (1024 * 1024 * 1024)) * 100) / 100;

    // Get billing information
    const billingData = {
      currentPlan: 'Business', // This should come from a subscription table
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: 49.99,
      usage: {
        storage: storageUsedGB,
        storageLimit: 10, // GB
        bandwidth: 15, // GB
        bandwidthLimit: 50, // GB
      },
      invoices: [
        {
          id: 'INV-001',
          date: new Date().toISOString().split('T')[0],
          amount: 49.99,
          status: 'Paid',
        },
      ],
    };

    return NextResponse.json(billingData);
  } catch (error) {
    console.error('Billing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 