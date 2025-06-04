import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { websiteId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const website = await prisma.website.findUnique({
      where: {
        id: params.websiteId,
        userId: session.user.id,
      },
      include: {
        pages: true,
      },
    });

    if (!website) {
      return new NextResponse('Website not found', { status: 404 });
    }

    return NextResponse.json(website);
  } catch (error) {
    console.error('Error fetching website:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { websiteId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify website ownership
    const existingWebsite = await prisma.website.findUnique({
      where: {
        id: params.websiteId,
        userId: session.user.id,
      },
    });

    if (!existingWebsite) {
      return new NextResponse('Website not found', { status: 404 });
    }

    // Delete website and its pages
    await prisma.website.delete({
      where: {
        id: params.websiteId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting website:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { websiteId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { title, pages } = body;

    // Verify website ownership
    const existingWebsite = await prisma.website.findUnique({
      where: {
        id: params.websiteId,
        userId: session.user.id,
      },
    });

    if (!existingWebsite) {
      return new NextResponse('Website not found', { status: 404 });
    }

    // Update website and its pages
    const updatedWebsite = await prisma.website.update({
      where: {
        id: params.websiteId,
      },
      data: {
        title,
        pages: {
          deleteMany: {},
          create: pages.map((page: any) => ({
            title: page.title,
            content: page.content,
            slug: page.slug,
          })),
        },
      },
      include: {
        pages: true,
      },
    });

    return NextResponse.json(updatedWebsite);
  } catch (error) {
    console.error('Error updating website:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 