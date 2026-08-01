/**
 * 日志轮转配置文件
 * 负责管理应用日志的滚动、压缩、归档和清理策略
 */

import * as fs from 'fs';
import * as path from 'path';
import { createGzip } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';

const pipelineAsync = promisify(pipeline);

export interface LogRotateConfig {
  maxSize: number;
  maxFiles: number;
  compress: boolean;
  logDir: string;
  archiveDir: string;
  fileNamePattern: string;
  checkInterval: number;
  enableWatch: boolean;
}

export interface LogFileInfo {
  name: string;
  path: string;
  size: number;
  created: Date;
  modified: Date;
}

const defaultConfig: LogRotateConfig = {
  maxSize: 100,
  maxFiles: 30,
  compress: true,
  logDir: 'logs',
  archiveDir: 'logs/archive',
  fileNamePattern: 'app-%DATE%.log',
  checkInterval: 3600000,
  enableWatch: true,
};

export class LogRotateManager {
  private config: LogRotateConfig;
  private checkTimer: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(config: Partial<LogRotateConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.initializeDirectories();
  }

  private initializeDirectories(): void {
    const dirs = [this.config.logDir, this.config.archiveDir];
    dirs.forEach((dir) => {
      const fullPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`[LogRotate] 创建目录: ${fullPath}`);
      }
    });
  }

  public start(): void {
    if (this.isRunning) {
      console.warn('[LogRotate] 轮转监控已在运行');
      return;
    }

    this.isRunning = true;
    console.log('[LogRotate] 启动日志轮转监控...');
    void this.checkAndRotate();
    this.checkTimer = setInterval(() => {
      void this.checkAndRotate();
    }, this.config.checkInterval);
  }

  public stop(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
    this.isRunning = false;
    console.log('[LogRotate] 停止日志轮转监控');
  }

  private async checkAndRotate(): Promise<void> {
    try {
      const logFiles = await this.getLogFiles();
      const filesToRotate = logFiles.filter((file) => file.size > this.config.maxSize * 1024 * 1024);

      if (filesToRotate.length === 0) {
        return;
      }

      console.log(`[LogRotate] 发现 ${filesToRotate.length} 个需要轮转的日志文件`);

      for (const file of filesToRotate) {
        await this.rotateFile(file);
      }

      await this.cleanupOldFiles();
    } catch (error) {
      console.error('[LogRotate] 轮转检查失败:', error);
    }
  }

  private async getLogFiles(): Promise<LogFileInfo[]> {
    const logDir = path.join(process.cwd(), this.config.logDir);
    if (!fs.existsSync(logDir)) {
      return [];
    }

    const files = fs.readdirSync(logDir);
    const logFiles: LogFileInfo[] = [];

    for (const file of files) {
      if (!file.endsWith('.log')) continue;

      const filePath = path.join(logDir, file);
      const stats = fs.statSync(filePath);

      logFiles.push({
        name: file,
        path: filePath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      });
    }

    return logFiles.sort((a, b) => a.modified.getTime() - b.modified.getTime());
  }

  private async rotateFile(fileInfo: LogFileInfo): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseName = path.basename(fileInfo.name, '.log');
    const archiveName = `${baseName}-${timestamp}.log`;
    const archiveDir = path.join(process.cwd(), this.config.archiveDir);
    const archivePath = path.join(archiveDir, archiveName);

    try {
      fs.renameSync(fileInfo.path, archivePath);
      console.log(`[LogRotate] 轮转文件: ${fileInfo.path} -> ${archivePath}`);

      if (this.config.compress) {
        await this.compressFile(archivePath);
      }

      fs.writeFileSync(fileInfo.path, '');
      console.log(`[LogRotate] 创建新日志文件: ${fileInfo.path}`);
    } catch (error) {
      console.error('[LogRotate] 轮转文件失败:', error);
    }
  }

  private async compressFile(filePath: string): Promise<void> {
    const gzipPath = `${filePath}.gz`;

    try {
      const readStream = fs.createReadStream(filePath);
      const writeStream = fs.createWriteStream(gzipPath);
      const gzip = createGzip();

      await pipelineAsync(readStream, gzip, writeStream);
      fs.unlinkSync(filePath);
      console.log(`[LogRotate] 压缩完成: ${gzipPath}`);
    } catch (error) {
      console.error('[LogRotate] 压缩失败:', error);
    }
  }

  private async cleanupOldFiles(): Promise<void> {
    try {
      const archiveDir = path.join(process.cwd(), this.config.archiveDir);
      if (!fs.existsSync(archiveDir)) return;

      const archiveFiles = fs.readdirSync(archiveDir);

      const filesWithStats = archiveFiles
        .map((file) => ({
          name: file,
          path: path.join(archiveDir, file),
          mtime: fs.statSync(path.join(archiveDir, file)).mtime,
        }))
        .sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

      while (filesWithStats.length > this.config.maxFiles) {
        const oldest = filesWithStats.shift();
        if (oldest) {
          fs.unlinkSync(oldest.path);
          console.log(`[LogRotate] 删除过期文件: ${oldest.path}`);
        }
      }
    } catch (error) {
      console.error('[LogRotate] 清理过期文件失败:', error);
    }
  }

  public async rotateNow(): Promise<void> {
    await this.checkAndRotate();
  }

  public getConfig(): LogRotateConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<LogRotateConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[LogRotate] 配置已更新');
  }
}

export const logRotateManager = new LogRotateManager();

if (require.main === module) {
  logRotateManager.start();
  process.on('SIGTERM', () => {
    logRotateManager.stop();
    process.exit(0);
  });
}

