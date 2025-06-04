import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { WordPressInstaller } from '@/lib/wordpress/installer';

export async function POST(
  request: Request,
  { params }: { params: { websiteId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const websiteId = params.websiteId;
    const body = await request.json();
    const { domain, adminEmail, adminUsername, adminPassword } = body;

    // Get website and check ownership
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: { wordPressConfig: true },
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || website.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create WordPress installer instance
    const installer = new WordPressInstaller();

    // Install WordPress
    const result = await installer.install({
      websiteId,
      domain,
      adminEmail,
      adminUsername,
      adminPassword,
      businessType: website.businessType,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('WordPress installation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { websiteId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const websiteId = params.websiteId;

    // Get website and check ownership
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: { wordPressConfig: true },
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || website.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(website.wordPressConfig);
  } catch (error) {
    console.error('Error fetching WordPress configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 