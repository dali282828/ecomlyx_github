import { NextResponse } from 'next/server';
import { WordPressService } from '@/services/wordpress';
import { prisma } from '@/lib/prisma';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30);
}

export async function POST(request: Request) {
  try {
    const { websiteId, businessName, businessType, adminEmail, installPlugins } = await request.json();
    if (!websiteId || !businessName || !businessType || !adminEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Slugify business name for subdomain
    let subdomain = slugify(businessName);
    let uniqueSubdomain = subdomain;
    let i = 1;
    const domainSuffix = process.env.DOMAIN_SUFFIX || 'yourdomain.com';
    let fqdn = `${uniqueSubdomain}.${domainSuffix}`;
    while (await prisma.domain.findFirst({ where: { name: fqdn } })) {
      uniqueSubdomain = `${subdomain}-${i}`;
      fqdn = `${uniqueSubdomain}.${domainSuffix}`;
      i++;
    }

    // Create Domain record for the subdomain
    await prisma.domain.create({
      data: {
        name: fqdn,
        websiteId,
        status: 'ACTIVE',
        sslEnabled: false,
      },
    });

    // Call real WordPress installation
    await WordPressService.installWordPress({
      websiteId,
      businessType,
      siteName: businessName,
      adminEmail,
      // installPlugins is not a valid parameter
    });

    return NextResponse.json({ success: true, subdomain: fqdn });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error?.message || String(error) }, { status: 500 });
  }
} 