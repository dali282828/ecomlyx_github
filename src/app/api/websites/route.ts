import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { cache } from '@/lib/cache';

const createWebsiteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessType: z.string(),
  templateId: z.string(),
  installWordPress: z.boolean().optional(),
  wordPressConfig: z.object({
    siteName: z.string(),
    adminEmail: z.string().email(),
  }).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, businessType, templateId } = body;

    if (!name || !businessType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create website with default pages based on business type
    const website = await prisma.website.create({
      data: {
        name,
        businessType,
        templateId: templateId || 'default',
        userId: user.id,
        status: 'DRAFT',
        pages: {
          create: [
            {
              title: 'Home',
              slug: 'home',
              content: {
                blocks: [
                  {
                    type: 'hero',
                    content: {
                      title: `Welcome to ${name}`,
                      subtitle: 'Your business website is being set up',
                    },
                  },
                ],
              },
              isPublished: true,
              order: 0,
            },
            {
              title: 'About',
              slug: 'about',
              content: {
                blocks: [
                  {
                    type: 'section',
                    content: {
                      title: 'About Us',
                      text: 'Tell your story here',
                    },
                  },
                ],
              },
              isPublished: false,
              order: 1,
            },
            {
              title: 'Contact',
              slug: 'contact',
              content: {
                blocks: [
                  {
                    type: 'section',
                    content: {
                      title: 'Contact Us',
                      text: 'Get in touch with us',
                    },
                  },
                ],
              },
              isPublished: false,
              order: 2,
            },
          ],
        },
        settings: {
          create: {
            seoSettings: {
              title: name,
              description: `${name} - Professional Business Website`,
              keywords: [businessType.toLowerCase()],
            },
            analytics: {
              enabled: true,
              trackingId: '',
            },
            socialMedia: {
              facebook: '',
              twitter: '',
              instagram: '',
            },
          },
        },
      },
      include: {
        pages: true,
        settings: true,
      },
    });

    // Create WordPress configuration if needed
    if (businessType === 'HOTEL' || businessType === 'RESTAURANT') {
      await prisma.wordPressConfig.create({
        data: {
          websiteId: website.id,
          adminUsername: 'admin',
          adminPassword: Math.random().toString(36).slice(-8),
          dbName: `wp_${website.id.slice(0, 8)}`,
          dbUser: 'wordpress',
          dbPassword: Math.random().toString(36).slice(-12),
          dbHost: 'localhost',
          wpVersion: '6.4',
          status: 'INSTALLING',
          installedPlugins: {
            plugins: [
              'woocommerce',
              'elementor',
              'contact-form-7',
              'wordpress-seo',
            ],
          },
        },
      });
    }

    return NextResponse.json(website);
  } catch (error) {
    console.error('Website creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Try to get from cache first
    const cacheKey = `websites:${session.user.id}`;
    const cachedWebsites = await cache.get(cacheKey);
    
    if (cachedWebsites) {
      return NextResponse.json(cachedWebsites);
    }

    // If not in cache, get from database
    const websites = await prisma.website.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Cache the result
    await cache.set(cacheKey, websites);

    return NextResponse.json(websites);
  } catch (error) {
    console.error('Error fetching websites:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Website ID is required' },
        { status: 400 }
      );
    }

    // Check if website exists and belongs to user
    const website = await prisma.website.findUnique({
      where: { id },
      select: { userId: true },
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

    // Update website
    const updatedWebsite = await prisma.website.update({
      where: { id },
      data: updateData,
      include: {
        pages: true,
        plugins: true,
        settings: true,
        domain: true,
      },
    });

    return NextResponse.json(updatedWebsite);
  } catch (error) {
    console.error('Error updating website:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions for default content
function getDefaultPages(businessType: string) {
  const commonPages = [
    {
      title: 'Home',
      slug: 'home',
      content: { blocks: [] },
      isPublished: true,
      order: 0,
    },
    {
      title: 'About',
      slug: 'about',
      content: { blocks: [] },
      isPublished: false,
      order: 1,
    },
    {
      title: 'Contact',
      slug: 'contact',
      content: { blocks: [] },
      isPublished: false,
      order: 2,
    },
  ];

  const businessTypePages: Record<string, any[]> = {
    hotel: [
      {
        title: 'Rooms',
        slug: 'rooms',
        content: { blocks: [] },
        isPublished: false,
        order: 3,
      },
      {
        title: 'Book Now',
        slug: 'book',
        content: { blocks: [] },
        isPublished: true,
        order: 4,
      },
    ],
    restaurant: [
      {
        title: 'Menu',
        slug: 'menu',
        content: { blocks: [] },
        isPublished: false,
        order: 3,
      },
      {
        title: 'Reservations',
        slug: 'reservations',
        content: { blocks: [] },
        isPublished: true,
        order: 4,
      },
    ],
    // Add more business type specific pages here
  };

  return [...commonPages, ...(businessTypePages[businessType] || [])];
}

function getDefaultPlugins(businessType: string) {
  const commonPlugins = [
    {
      name: 'seo',
      version: '1.0.0',
      isActive: true,
      settings: {},
    },
    {
      name: 'analytics',
      version: '1.0.0',
      isActive: true,
      settings: {},
    },
  ];

  const businessTypePlugins: Record<string, any[]> = {
    hotel: [
      {
        name: 'booking',
        version: '1.0.0',
        isActive: true,
        settings: {},
      },
      {
        name: 'room-management',
        version: '1.0.0',
        isActive: true,
        settings: {},
      },
    ],
    restaurant: [
      {
        name: 'reservations',
        version: '1.0.0',
        isActive: true,
        settings: {},
      },
      {
        name: 'menu-management',
        version: '1.0.0',
        isActive: true,
        settings: {},
      },
    ],
    // Add more business type specific plugins here
  };

  return [...commonPlugins, ...(businessTypePlugins[businessType] || [])];
}

function getDefaultSeoSettings(websiteName: string) {
  return {
    title: websiteName,
    description: `Welcome to ${websiteName}`,
    keywords: [],
    ogImage: null,
    ogTitle: websiteName,
    ogDescription: `Welcome to ${websiteName}`,
  };
} 