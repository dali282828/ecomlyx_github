import { exec } from 'child_process';
import { promisify } from 'util';
import { prisma } from '@/lib/prisma';
import { getBusinessTypeConfig } from './config';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

interface InstallOptions {
  websiteId: string;
  domain: string;
  adminEmail: string;
  adminUsername: string;
  adminPassword: string;
  businessType: string;
}

export class WordPressInstaller {
  private readonly wpCliPath: string;
  private readonly installDir: string;

  constructor() {
    this.wpCliPath = process.env.WP_CLI_PATH || 'wp';
    this.installDir = process.env.WORDPRESS_INSTALL_DIR || '/var/www/wordpress';
  }

  async install(options: InstallOptions) {
    try {
      const { websiteId, domain, adminEmail, adminUsername, adminPassword, businessType } = options;

      // Create installation directory
      const siteDir = path.join(this.installDir, domain);
      await fs.mkdir(siteDir, { recursive: true });

      // Download WordPress
      await this.downloadWordPress(siteDir);

      // Create wp-config.php
      await this.createConfig(siteDir, {
        dbName: `wp_${websiteId}`,
        dbUser: process.env.DB_USER || 'wordpress',
        dbPassword: process.env.DB_PASSWORD || 'wordpress',
        dbHost: process.env.DB_HOST || 'localhost',
      });

      // Install WordPress
      await this.installWordPress(siteDir, {
        url: `https://${domain}`,
        title: domain,
        adminUser: adminUsername,
        adminPassword,
        adminEmail,
      });

      // Get business type configuration
      const config = getBusinessTypeConfig(businessType);

      // Install and activate theme
      await this.installTheme(siteDir, config.theme);

      // Install and activate plugins
      await this.installPlugins(siteDir, config.plugins);

      // Configure settings
      await this.configureSettings(siteDir, config.settings);

      // Update WordPress configuration in database
      await this.updateWordPressConfig(websiteId, {
        domain,
        adminEmail,
        adminUsername,
        status: 'READY',
        theme: config.theme,
        plugins: config.plugins,
      });

      return {
        success: true,
        message: 'WordPress installed successfully',
        domain,
        adminUrl: `https://${domain}/wp-admin`,
      };
    } catch (error) {
      console.error('WordPress installation error:', error);
      throw error;
    }
  }

  private async downloadWordPress(installDir: string) {
    await execAsync(`${this.wpCliPath} core download --path=${installDir}`);
  }

  private async createConfig(installDir: string, dbConfig: { dbName: string; dbUser: string; dbPassword: string; dbHost: string }) {
    await execAsync(
      `${this.wpCliPath} config create --path=${installDir} ` +
      `--dbname=${dbConfig.dbName} ` +
      `--dbuser=${dbConfig.dbUser} ` +
      `--dbpass=${dbConfig.dbPassword} ` +
      `--dbhost=${dbConfig.dbHost} ` +
      '--skip-check'
    );
  }

  private async installWordPress(
    installDir: string,
    options: { url: string; title: string; adminUser: string; adminPassword: string; adminEmail: string }
  ) {
    await execAsync(
      `${this.wpCliPath} core install --path=${installDir} ` +
      `--url=${options.url} ` +
      `--title=${options.title} ` +
      `--admin_user=${options.adminUser} ` +
      `--admin_password=${options.adminPassword} ` +
      `--admin_email=${options.adminEmail} ` +
      '--skip-email'
    );
  }

  private async installTheme(installDir: string, theme: { slug: string }) {
    await execAsync(`${this.wpCliPath} theme install ${theme.slug} --path=${installDir} --activate`);
  }

  private async installPlugins(installDir: string, plugins: { slug: string }[]) {
    for (const plugin of plugins) {
      await execAsync(`${this.wpCliPath} plugin install ${plugin.slug} --path=${installDir} --activate`);
    }
  }

  private async configureSettings(installDir: string, settings: { title: string; description: string }) {
    await execAsync(
      `${this.wpCliPath} option update blogname "${settings.title}" --path=${installDir}`
    );
    await execAsync(
      `${this.wpCliPath} option update blogdescription "${settings.description}" --path=${installDir}`
    );
  }

  private async updateWordPressConfig(
    websiteId: string,
    config: {
      domain: string;
      adminEmail: string;
      adminUsername: string;
      status: string;
      theme: any;
      plugins: any[];
    }
  ) {
    await prisma.wordPressConfig.update({
      where: { websiteId },
      data: {
        domain: config.domain,
        adminEmail: config.adminEmail,
        adminUsername: config.adminUsername,
        status: config.status,
        theme: config.theme,
        installedPlugins: {
          plugins: config.plugins,
        },
      },
    });
  }
} 