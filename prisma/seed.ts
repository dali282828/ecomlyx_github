import { PrismaClient, Role, PlanType, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'System Administrator',
        password: hashedPassword,
        role: Role.ADMIN,
        lastLoginAt: new Date(),
      },
    });

    // Create admin subscription
    await prisma.subscription.create({
      data: {
        userId: admin.id,
        plan: PlanType.ENTERPRISE,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        amount: 0,
        storageLimit: 1000, // 1TB
        bandwidthLimit: 10000, // 10TB
      },
    });

    console.log('✅ Admin user created');
  }

  // Create sample plans data (for reference)
  const plans = [
    {
      name: 'Basic',
      type: PlanType.BASIC,
      price: 9.99,
      storage: 1, // GB
      bandwidth: 10, // GB
      websites: 1,
      features: ['Basic templates', 'SSL certificate', 'Email support']
    },
    {
      name: 'Pro',
      type: PlanType.PRO,
      price: 29.99,
      storage: 10, // GB
      bandwidth: 100, // GB
      websites: 5,
      features: ['Premium templates', 'SSL certificate', 'Priority support', 'Analytics']
    },
    {
      name: 'Business',
      type: PlanType.BUSINESS,
      price: 99.99,
      storage: 50, // GB
      bandwidth: 500, // GB
      websites: 20,
      features: ['All templates', 'SSL certificate', '24/7 support', 'Advanced analytics', 'White label']
    },
    {
      name: 'Enterprise',
      type: PlanType.ENTERPRISE,
      price: 299.99,
      storage: 1000, // GB
      bandwidth: 10000, // GB
      websites: -1, // Unlimited
      features: ['Custom development', 'Dedicated support', 'Custom integrations', 'SLA']
    }
  ];

  console.log('📋 Plan information seeded (reference only)');

  // Create sample website templates
  const templates = [
    {
      id: 'business-modern',
      name: 'Modern Business',
      category: 'Business',
      description: 'Clean and professional business template',
      preview: 'https://storage.googleapis.com/templates/business-modern.jpg'
    },
    {
      id: 'ecommerce-store',
      name: 'E-commerce Store',
      category: 'E-commerce',
      description: 'Full-featured online store template',
      preview: 'https://storage.googleapis.com/templates/ecommerce-store.jpg'
    },
    {
      id: 'portfolio-creative',
      name: 'Creative Portfolio',
      category: 'Portfolio',
      description: 'Showcase your creative work beautifully',
      preview: 'https://storage.googleapis.com/templates/portfolio-creative.jpg'
    }
  ];

  console.log('🎨 Template information seeded');

  // Create indexes for performance
  try {
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_user_email ON User(email);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_user_last_login ON User(lastLoginAt);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_website_user_status ON Website(userId, status);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_website_created ON Website(createdAt);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_page_website_slug ON Page(websiteId, slug);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_pageview_website_timestamp ON PageView(websiteId, timestamp);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_analytics_website_date ON WebsiteAnalytics(websiteId, date);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_subscription_user ON Subscription(userId);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_support_ticket_user_status ON SupportTicket(userId, status);`;
    
    console.log('🗂️ Database indexes created');
  } catch (error) {
    console.log('ℹ️ Some indexes may already exist');
  }

  console.log('✅ Database seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 