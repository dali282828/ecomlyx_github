import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import dns from 'dns';
import { promisify } from 'util';

const prisma = new PrismaClient();
const resolveDNS = promisify(dns.resolve);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { websiteId, domainName } = body;

    if (!websiteId || !domainName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if website exists and belongs to user
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
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

    // Check if domain is already taken
    const existingDomain = await prisma.domain.findUnique({
      where: { name: domainName },
    });

    if (existingDomain) {
      return NextResponse.json(
        { error: 'Domain is already taken' },
        { status: 400 }
      );
    }

    // Check if website already has a domain
    const websiteDomain = await prisma.domain.findUnique({
      where: { websiteId },
    });

    if (websiteDomain) {
      return NextResponse.json(
        { error: 'Website already has a domain' },
        { status: 400 }
      );
    }

    // Create domain
    const domain = await prisma.domain.create({
      data: {
        name: domainName,
        websiteId,
        status: 'PENDING',
        sslEnabled: false,
      },
    });

    // In a real application, here you would:
    // 1. Call a domain registrar API to register the domain
    // 2. Set up DNS records
    // 3. Configure SSL certificate
    // For now, we'll simulate this with a timeout
    setTimeout(async () => {
      await prisma.domain.update({
        where: { id: domain.id },
        data: {
          status: 'ACTIVE',
          sslEnabled: true,
        },
      });
    }, 5000);

    return NextResponse.json(domain);
  } catch (error) {
    console.error('Error creating domain:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const domainName = searchParams.get('name');

    if (domainName) {
      // Check domain availability
      try {
        // Check if domain exists in our database
        const existingDomain = await prisma.domain.findUnique({
          where: { name: domainName },
        });

        if (existingDomain) {
          return NextResponse.json({ available: false });
        }

        // Check if domain is registered (DNS lookup)
        try {
          await resolveDNS(domainName);
          return NextResponse.json({ available: false });
        } catch (error) {
          // If DNS lookup fails, domain might be available
          return NextResponse.json({ available: true });
        }
      } catch (error) {
        return NextResponse.json({ available: false });
      }
    }

    // Get all domains for user's websites
    const domains = await prisma.domain.findMany({
      where: {
        website: {
          userId: session.user.id,
        },
      },
      include: {
        website: true,
      },
    });

    return NextResponse.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 