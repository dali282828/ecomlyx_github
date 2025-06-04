import { prisma } from '@/lib/prisma';
import { WordPressInstaller } from './wp-installer';

interface WordPressInstallParams {
  websiteId: string;
  businessType: string;
  siteName: string;
  adminEmail: string;
}

interface WordPressCredentials {
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  adminUsername: string;
  adminPassword: string;
}

export class WordPressService {
  private static generateRandomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  private static async generateCredentials(websiteId: string): Promise<WordPressCredentials> {
    return {
      dbName: `wp_${websiteId.substring(0, 8)}`,
      dbUser: `user_${websiteId.substring(0, 8)}`,
      dbPassword: this.generateRandomString(16),
      dbHost: process.env.WORDPRESS_DB_HOST || 'localhost',
      adminUsername: 'admin',
      adminPassword: this.generateRandomString(12),
    };
  }

  private static getBusinessTypePlugins(businessType: string): string[] {
    const commonPlugins = [
      'wordpress-seo', // Yoast SEO
      'wordfence', // Security
      'w3-total-cache', // Caching
      'updraftplus', // Backups
      'contact-form-7', // Contact forms
    ];

    const businessPlugins: Record<string, string[]> = {
      hotel: [
        'hotel-booking',
        'motopress-hotel-booking',
        'booking-calendar',
      ],
      restaurant: [
        'restaurant-reservations',
        'food-menu-pro',
        'restaurant-menu-manager',
      ],
      fitness: [
        'gym-management',
        'class-booking-system',
        'appointment-booking',
      ],
      retail: [
        'woocommerce',
        'product-catalog',
        'inventory-management',
      ],
    };

    return [...commonPlugins, ...(businessPlugins[businessType] || [])];
  }

  public static async installWordPress({
    websiteId,
    businessType,
    siteName,
    adminEmail,
  }: WordPressInstallParams): Promise<any> {
    try {
      // Generate credentials
      const credentials = await this.generateCredentials(websiteId);

      // Create WordPress configuration in database
      const wpConfig = await prisma.wordPressConfig.create({
        data: {
          websiteId,
          ...credentials,
          wpVersion: 'latest',
          status: 'INSTALLING',
          installedPlugins: this.getBusinessTypePlugins(businessType),
          installedTheme: this.getBusinessTheme(businessType),
        },
      });

      // Start WordPress installation
      await WordPressInstaller.install({
        websiteId,
        siteName,
        adminEmail,
        ...credentials,
      });

      return wpConfig;
    } catch (error) {
      console.error('WordPress installation failed:', error);
      throw new Error('Failed to install WordPress');
    }
  }

  private static getBusinessTheme(businessType: string): string {
    const themes: Record<string, string> = {
      hotel: 'astra',
      restaurant: 'restaurant-and-cafe',
      fitness: 'fitness-hub',
      retail: 'storefront',
      default: 'twentytwentyfour',
    };

    return themes[businessType] || themes.default;
  }

  public static async configureWordPress(websiteId: string): Promise<void> {
    try {
      const wpConfig = await prisma.wordPressConfig.findUnique({
        where: { websiteId },
      });

      if (!wpConfig) {
        throw new Error('WordPress configuration not found');
      }

      // Update status
      await prisma.wordPressConfig.update({
        where: { websiteId },
        data: { status: 'ACTIVE' },
      });
    } catch (error) {
      console.error('WordPress configuration failed:', error);
      await prisma.wordPressConfig.update({
        where: { websiteId },
        data: { status: 'ERROR' },
      });
      throw error;
    }
  }
} 