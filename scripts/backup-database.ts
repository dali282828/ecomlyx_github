import { PrismaClient } from '@prisma/client';
import { Storage } from '@google-cloud/storage';
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../src/lib/logger';
import path from 'path';

const execAsync = promisify(exec);
const prisma = new PrismaClient();
const storage = new Storage();

interface BackupMetadata {
  timestamp: string;
  size: number;
  tables: string[];
  version: string;
}

class DatabaseBackupService {
  private bucketName: string;
  
  constructor() {
    this.bucketName = process.env.BACKUP_STORAGE_BUCKET || 'your-backup-bucket';
  }

  async createBackup(): Promise<string> {
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || '3306';
    const DB_USER = process.env.DB_USER || 'root';
    const DB_PASSWORD = process.env.DB_PASSWORD || 'root123';
    const DB_NAME = process.env.DB_NAME || 'website_builder_dev';

    const backupDir = path.resolve(__dirname, '../backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `${DB_NAME}-backup-${timestamp}.sql`);

    const dumpCmd = `mysqldump -h ${DB_HOST} -P ${DB_PORT} -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > "${backupFile}"`;

    try {
      logger.info('Starting database backup...');

      await execAsync(dumpCmd);

      // Get backup metadata
      const stats = await this.getFileStats(backupFile);
      const tables = await this.getTableNames();
      
      const metadata: BackupMetadata = {
        timestamp,
        size: stats.size,
        tables,
        version: process.env.npm_package_version || '1.0.0',
      };

      // Upload to cloud storage
      await this.uploadToCloudStorage(backupFile, backupFile, metadata);

      // Cleanup old backups
      await this.cleanupOldBackups();

      logger.info({
        fileName: backupFile,
        size: stats.size,
        tablesCount: tables.length,
      }, 'Database backup completed successfully');

      return backupFile;
    } catch (error) {
      logger.error({ error }, 'Database backup failed');
      throw error;
    }
  }

  async restoreBackup(backupFileName: string): Promise<void> {
    const localRestorePath = `/tmp/${backupFileName}`;

    try {
      logger.info({ backupFileName }, 'Starting database restore...');

      // Download backup from cloud storage
      await this.downloadFromCloudStorage(backupFileName, localRestorePath);

      // Restore database
      const databaseUrl = new URL(process.env.DATABASE_URL!);
      const restoreCommand = `mysql -h ${databaseUrl.hostname} -P ${databaseUrl.port} -u ${databaseUrl.username} -p${databaseUrl.password} ${databaseUrl.pathname.slice(1)} < ${localRestorePath}`;

      await execAsync(restoreCommand);

      // Clean up local file
      await execAsync(`rm ${localRestorePath}`);

      logger.info({ backupFileName }, 'Database restore completed successfully');
    } catch (error) {
      logger.error({ error, backupFileName }, 'Database restore failed');
      throw error;
    }
  }

  async listBackups(): Promise<Array<{ name: string; created: Date; size: number }>> {
    try {
      const bucket = storage.bucket(this.bucketName);
      const [files] = await bucket.getFiles({ prefix: 'database-backup-' });

      return files.map(file => ({
        name: file.name,
        created: new Date(file.metadata.timeCreated),
        size: parseInt(file.metadata.size),
      }));
    } catch (error) {
      logger.error({ error }, 'Failed to list backups');
      throw error;
    }
  }

  private async uploadToCloudStorage(localPath: string, fileName: string, metadata: BackupMetadata): Promise<void> {
    const bucket = storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    await bucket.upload(localPath, {
      destination: fileName,
      metadata: {
        metadata: {
          backupMetadata: JSON.stringify(metadata),
        },
      },
    });
  }

  private async downloadFromCloudStorage(fileName: string, localPath: string): Promise<void> {
    const bucket = storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    await file.download({ destination: localPath });
  }

  private async getFileStats(filePath: string): Promise<{ size: number }> {
    const { stdout } = await execAsync(`stat -c%s ${filePath}`);
    return { size: parseInt(stdout.trim()) };
  }

  private async getTableNames(): Promise<string[]> {
    const result = await prisma.$queryRaw<Array<{ TABLE_NAME: string }>>`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;
    
    return result.map(row => row.TABLE_NAME);
  }

  private async cleanupOldBackups(): Promise<void> {
    const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || '14');
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    try {
      const bucket = storage.bucket(this.bucketName);
      const [files] = await bucket.getFiles({ prefix: 'database-backup-' });

      const filesToDelete = files.filter(file => 
        new Date(file.metadata.timeCreated) < cutoffDate
      );

      await Promise.all(filesToDelete.map(file => file.delete()));

      if (filesToDelete.length > 0) {
        logger.info({ deletedCount: filesToDelete.length }, 'Cleaned up old backups');
      }
    } catch (error) {
      logger.error({ error }, 'Failed to cleanup old backups');
    }
  }
}

export const backupService = new DatabaseBackupService();

// CLI script execution
if (require.main === module) {
  backupService.createBackup()
    .then(fileName => {
      console.log(`✅ Backup created: ${fileName}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Backup failed:', error);
      process.exit(1);
    });
} 