import { Storage } from '@google-cloud/storage';
import { PrismaClient } from '@prisma/client';
import { logger } from '../src/lib/logger';

const storage = new Storage();
const prisma = new PrismaClient();

interface CostReport {
  storage: {
    totalSize: number;
    totalFiles: number;
    oldFiles: number;
    unusedFiles: number;
    potentialSavings: number;
  };
  database: {
    totalRecords: number;
    oldRecords: number;
    largeRecords: number;
    potentialSavings: number;
  };
  recommendations: string[];
}

class CostOptimizer {
  async generateCostReport(): Promise<CostReport> {
    console.log('📊 Generating cost optimization report...');

    const report: CostReport = {
      storage: {
        totalSize: 0,
        totalFiles: 0,
        oldFiles: 0,
        unusedFiles: 0,
        potentialSavings: 0,
      },
      database: {
        totalRecords: 0,
        oldRecords: 0,
        largeRecords: 0,
        potentialSavings: 0,
      },
      recommendations: [],
    };

    await this.analyzeStorageCosts(report);
    await this.analyzeDatabaseCosts(report);
    this.generateRecommendations(report);

    return report;
  }

  private async analyzeStorageCosts(report: CostReport): Promise<void> {
    try {
      const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
      if (!bucketName) return;

      const bucket = storage.bucket(bucketName);
      const [files] = await bucket.getFiles();

      const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);

      for (const file of files) {
        const metadata = file.metadata;
        const size = parseInt(metadata.size || '0');
        const created = new Date(metadata.timeCreated).getTime();

        report.storage.totalSize += size;
        report.storage.totalFiles++;

        if (created < ninetyDaysAgo) {
          report.storage.oldFiles++;
        }

        const isReferenced = await this.isFileReferenced(file.name);
        if (!isReferenced) {
          report.storage.unusedFiles++;
          report.storage.potentialSavings += size;
        }
      }
    } catch (error) {
      logger.error({ error }, 'Failed to analyze storage costs');
    }
  }

  private async analyzeDatabaseCosts(report: CostReport): Promise<void> {
    try {
      const ninetyDaysAgo = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000));

      const [totalUsers, totalWebsites, totalPages, totalPageViews] = await Promise.all([
        prisma.user.count(),
        prisma.website.count(),
        prisma.page.count(),
        prisma.pageView.count(),
      ]);

      report.database.totalRecords = totalUsers + totalWebsites + totalPages + totalPageViews;

      const oldPageViews = await prisma.pageView.count({
        where: { timestamp: { lt: ninetyDaysAgo } }
      });

      report.database.oldRecords = oldPageViews;
    } catch (error) {
      logger.error({ error }, 'Failed to analyze database costs');
    }
  }

  private async isFileReferenced(fileName: string): Promise<boolean> {
    try {
      const pageCount = await prisma.page.count({
        where: {
          content: { path: '$', string_contains: fileName }
        }
      });
      return pageCount > 0;
    } catch (error) {
      return true; // Assume referenced to be safe
    }
  }

  private generateRecommendations(report: CostReport): void {
    if (report.storage.unusedFiles > 0) {
      report.recommendations.push(
        `Delete ${report.storage.unusedFiles} unused files to save storage costs`
      );
    }

    if (report.database.oldRecords > 1000) {
      report.recommendations.push(
        `Archive ${report.database.oldRecords} old records to reduce database size`
      );
    }
  }
}

export const costOptimizer = new CostOptimizer();

if (require.main === module) {
  costOptimizer.generateCostReport()
    .then(report => {
      console.log('📊 Cost Report:', JSON.stringify(report, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Cost analysis failed:', error);
      process.exit(1);
    });
} 