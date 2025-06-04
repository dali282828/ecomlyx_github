import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Dashboard - 10Web Clone',
  description: 'Manage your websites and create new ones',
};

const prisma = new PrismaClient();

async function getWebsites(userId: string) {
  const websites = await prisma.website.findMany({
    where: { userId },
    include: {
      domain: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return websites;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const websites = session?.user?.id ? await getWebsites(session.user.id) : [];

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
} 