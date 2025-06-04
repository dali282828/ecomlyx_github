import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { websiteId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const websiteId = params.websiteId;

    // Check if website exists and belongs to user
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: true,
        pages: true,
        plugins: true,
        settings: true,
      },
    });

    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    if (website.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate website is ready for launch
    if (!website.domain) {
      return NextResponse.json(
        { error: 'Domain is required for launch' },
        { status: 400 }
      );
    }

    if (website.domain.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Domain must be active before launch' },
        { status: 400 }
      );
    }

    if (website.status === 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Website is already published' },
        { status: 400 }
      );
    }

    // Update website status to PUBLISHED
    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: {
        status: 'PUBLISHED',
        customization: {
          ...website.customization,
          deployment: {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            environment: 'production',
          },
        },
      },
      include: {
        domain: true,
        pages: true,
        plugins: true,
        settings: true,
      },
    });

    // Simulate deployment process
    setTimeout(async () => {
      // Update website settings with deployment info
      await prisma.websiteSettings.update({
        where: { websiteId },
        data: {
          analytics: {
            ...website.settings?.analytics,
            deploymentDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          },
        },
      });

      // Activate all published pages
      await Promise.all(
        website.pages
          .filter((page) => page.isPublished)
          .map((page) =>
            prisma.page.update({
              where: { id: page.id },
              data: { isPublished: true },
            })
          )
      );

      // Activate all required plugins
      await Promise.all(
        website.plugins
          .filter((plugin) => plugin.isActive)
          .map((plugin) =>
            prisma.plugin.update({
              where: { id: plugin.id },
              data: { isActive: true },
            })
          )
      );
    }, 5000);

    return NextResponse.json(updatedWebsite);
  } catch (error) {
    console.error('Error launching website:', error);
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
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const websiteId = params.websiteId;

    // Check if website exists and belongs to user
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      select: {
        id: true,
        status: true,
        domain: true,
        customization: true,
        settings: {
          select: {
            analytics: true,
          },
        },
      },
    });

    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    if (website.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return launch status and deployment info
    return NextResponse.json({
      status: website.status,
      domain: website.domain,
      deployment: website.customization?.deployment,
      analytics: website.settings?.analytics,
    });
  } catch (error) {
    console.error('Error fetching launch status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 