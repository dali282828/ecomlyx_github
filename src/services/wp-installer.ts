import axios from 'axios';
import { execSync } from 'child_process';
import { join } from 'path';
import { WordPressConfig } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface WPInstallConfig {
  websiteId: string;
  siteName: string;
  adminEmail: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  adminUsername: string;
  adminPassword: string;
}

export class WordPressInstaller {
  private static readonly WP_CLI_PATH = 'wp-cli.phar';
  private static readonly BASE_INSTALL_PATH = process.env.WP_INSTALL_BASE_PATH || '/var/www/html';

  private static async downloadWordPressCLI(): Promise<void> {
    try {
      execSync('curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar');
      execSync('chmod +x wp-cli.phar');
    } catch (error) {
      console.error('Failed to download WP-CLI:', error);
      throw new Error('Failed to download WP-CLI');
    }
  }

  private static async createInstallDirectory(websiteId: string): Promise<string> {
    const installPath = join(this.BASE_INSTALL_PATH, websiteId);
    try {
      execSync(`mkdir -p ${installPath}`);
      return installPath;
    } catch (error) {
      console.error('Failed to create installation directory:', error);
      throw new Error('Failed to create installation directory');
    }
  }

  private static async downloadWordPress(installPath: string): Promise<void> {
    try {
      execSync(`cd ${installPath} && ../wp-cli.phar core download`);
    } catch (error) {
      console.error('Failed to download WordPress:', error);
      throw new Error('Failed to download WordPress');
    }
  }

  private static async createWPConfig(installPath: string, config: WPInstallConfig): Promise<void> {
    try {
      execSync(
        `cd ${installPath} && ../wp-cli.phar config create --dbname=${config.dbName} --dbuser=${config.dbUser} --dbpass=${config.dbPassword} --dbhost=${config.dbHost}`
      );
    } catch (error) {
      console.error('Failed to create wp-config.php:', error);
      throw new Error('Failed to create WordPress configuration');
    }
  }

  private static async installWordPress(installPath: string, config: WPInstallConfig): Promise<void> {
    try {
      execSync(
        `cd ${installPath} && ../wp-cli.phar core install --url=https://${config.websiteId}.${process.env.DOMAIN_SUFFIX} --title="${config.siteName}" --admin_user=${config.adminUsername} --admin_password=${config.adminPassword} --admin_email=${config.adminEmail}`
      );
    } catch (error) {
      console.error('Failed to install WordPress:', error);
      throw new Error('Failed to install WordPress');
    }
  }

  private static async installPlugins(installPath: string, plugins: string[]): Promise<void> {
    for (const plugin of plugins) {
      try {
        execSync(`cd ${installPath} && ../wp-cli.phar plugin install ${plugin} --activate`);
      } catch (error) {
        console.error(`Failed to install plugin ${plugin}:`, error);
        // Continue with other plugins even if one fails
      }
    }
  }

  private static async installTheme(installPath: string, theme: string): Promise<void> {
    try {
      execSync(`cd ${installPath} && ../wp-cli.phar theme install ${theme} --activate`);
    } catch (error) {
      console.error(`Failed to install theme ${theme}:`, error);
      throw new Error(`Failed to install theme ${theme}`);
    }
  }

  private static async configurePermalinks(installPath: string): Promise<void> {
    try {
      execSync(`cd ${installPath} && ../wp-cli.phar rewrite structure '/%postname%/'`);
    } catch (error) {
      console.error('Failed to configure permalinks:', error);
      // Non-critical error, continue
    }
  }

  private static async setupSSL(websiteId: string): Promise<void> {
    try {
      // This would integrate with your SSL provider (e.g., Let's Encrypt)
      await axios.post(`${process.env.SSL_SERVICE_URL}/provision`, {
        domain: `${websiteId}.${process.env.DOMAIN_SUFFIX}`,
      });
    } catch (error) {
      console.error('Failed to setup SSL:', error);
      // Non-critical error, continue
    }
  }

  public static async install(config: WPInstallConfig): Promise<void> {
    try {
      // Update status to INSTALLING
      await prisma.wordPressConfig.update({
        where: { websiteId: config.websiteId },
        data: { status: 'INSTALLING' },
      });

      // Download WP-CLI if not already present
      await this.downloadWordPressCLI();

      // Create installation directory
      const installPath = await this.createInstallDirectory(config.websiteId);

      // Download WordPress core
      await this.downloadWordPress(installPath);

      // Create wp-config.php
      await this.createWPConfig(installPath, config);

      // Install WordPress
      await this.installWordPress(installPath, config);

      // Get WordPress configuration
      const wpConfig = await prisma.wordPressConfig.findUnique({
        where: { websiteId: config.websiteId },
      });

      if (!wpConfig) {
        throw new Error('WordPress configuration not found');
      }

      // Install plugins
      await this.installPlugins(installPath, wpConfig.installedPlugins as string[]);

      // Install theme
      await this.installTheme(installPath, wpConfig.installedTheme);

      // Configure permalinks
      await this.configurePermalinks(installPath);

      // Setup SSL
      await this.setupSSL(config.websiteId);

      // Update WordPress configuration with site URLs
      const siteUrl = `https://${config.websiteId}.${process.env.DOMAIN_SUFFIX}`;
      await prisma.wordPressConfig.update({
        where: { websiteId: config.websiteId },
        data: {
          status: 'ACTIVE',
          siteUrl,
          adminUrl: `${siteUrl}/wp-admin`,
        },
      });
    } catch (error) {
      console.error('WordPress installation failed:', error);
      
      // Update status to ERROR
      await prisma.wordPressConfig.update({
        where: { websiteId: config.websiteId },
        data: { status: 'ERROR' },
      });
      
      throw error;
    }
  }
} 