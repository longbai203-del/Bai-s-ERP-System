/**
 * 日志轮转配置
 * 支持按时间/大小轮转、压缩、归档
 * @module logrotate.config
 */

import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import zlib from 'zlib';
import { promisify } from 'util';

const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);
const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);
const mkdirAsync = promisify(fs.mkdir);
const accessAsync = promisify(fs.access);
const gzipAsync = promisify(zlib.gzip);

/**
 * 轮转策略
 */
export enum RotationStrategy {
  /** 按大小轮转 */
  SIZE = 'size',
  /** 按时间轮转 */
  TIME = 'time',
  /** 按大小和时间轮转 */
  BOTH = 'both',
}

/**
 * 轮转时间单位
 */
export enum RotationTimeUnit {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

/**
 * 日志轮转配置接口
 */
export interface LogRotateConfig {
  /** 日志文件路径 */
  filePath: string;
  /** 轮转策略 */
  strategy?: RotationStrategy;
  /** 最大文件大小（字节） */
  maxSize?: number;
  /** 轮转时间间隔 */
  timeInterval?: number;
  /** 时间单位 */
  timeUnit?: RotationTimeUnit;
  /** 保留文件数 */
  maxFiles?: number;
  /** 是否压缩 */
  compress?: boolean;
  /** 压缩格式 */
  compressFormat?: 'gzip' | 'brotli' | 'none';
  /** 日志格式 */
  format?: 'json' | 'text' | 'combined';
  /** 是否异步 */
  async?: boolean;
  /** 轮转后回调 */
  onRotate?: (oldPath: string, newPath: string) => void;
}

/**
 * 默认日志轮转配置
 */
export const DEFAULT_LOG_ROTATE_CONFIG: LogRotateConfig = {
  filePath: './logs/app.log',
  strategy: RotationStrategy.BOTH,
  maxSize: 50 * 1024 * 1024, // 50MB
  timeInterval: 24,
  timeUnit: RotationTimeUnit.HOUR,
  maxFiles: 30,
  compress: true,
  compressFormat: 'gzip',
  format: 'json',
  async: true,
};

/**
 * 日志轮转管理器
 */
export class LogRotateManager extends EventEmitter {
  private config: Required<LogRotateConfig>;
  private isRotating = false;
  private timer: NodeJS.Timeout | null = null;
  private fileSize: number = 0;

  constructor(config: LogRotateConfig) {
    super();
    this.config = {
      ...DEFAULT_LOG_ROTATE_CONFIG,
      ...config,
    } as Required<LogRotateConfig>;

    this.ensureDirectoryExists();
    this.checkAndCreateLogFile();
    this.startRotationTimer();
  }

  /**
   * 确保目录存在
   */
  private ensureDirectoryExists(): void {
    const dir = path.dirname(this.config.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * 检查并创建日志文件
   */
  private checkAndCreateLogFile(): void {
    try {
      if (!fs.existsSync(this.config.filePath)) {
        fs.writeFileSync(this.config.filePath, '');
        console.log(`[LogRotate] 创建日志文件: ${this.config.filePath}`);
      }
    } catch (error) {
      console.error('[LogRotate] 创建日志文件失败:', error);
    }
  }

  /**
   * 启动轮转定时器
   */
  private startRotationTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const intervalMs = this.getIntervalMs();
    this.timer = setInterval(() => {
      this.checkAndRotate();
    }, intervalMs);

    console.log(`[LogRotate] 轮转定时器已启动，间隔: ${intervalMs}ms`);
  }

  /**
   * 获取间隔毫秒数
   */
  private getIntervalMs(): number {
    const { timeInterval, timeUnit } = this.config;
    const multipliers: Record<RotationTimeUnit, number> = {
      [RotationTimeUnit.HOUR]: 60 * 60 * 1000,
      [RotationTimeUnit.DAY]: 24 * 60 * 60 * 1000,
      [RotationTimeUnit.WEEK]: 7 * 24 * 60 * 60 * 1000,
      [RotationTimeUnit.MONTH]: 30 * 24 * 60 * 60 * 1000,
    };

    return timeInterval * multipliers[timeUnit];
  }

  /**
   * 检查并执行轮转
   */
  private async checkAndRotate(): Promise<void> {
    if (this.isRotating) return;

    const shouldRotate = await this.shouldRotate();
    if (shouldRotate) {
      await this.rotate();
    }
  }

  /**
   * 判断是否应该轮转
   */
  private async shouldRotate(): Promise<boolean> {
    const strategy = this.config.strategy;

    // 按大小轮转
    if (strategy === RotationStrategy.SIZE || strategy === RotationStrategy.BOTH) {
      const size = await this.getFileSize();
      if (size >= this.config.maxSize) {
        return true;
      }
    }

    // 按时间轮转
    if (strategy === RotationStrategy.TIME || strategy === RotationStrategy.BOTH) {
      const lastModified = await this.getLastModified();
      const now = Date.now();
      const intervalMs = this.getIntervalMs();
      if (now - lastModified >= intervalMs) {
        return true;
      }
    }

    return false;
  }

  /**
   * 获取文件大小
   */
  private async getFileSize(): Promise<number> {
    try {
      const stats = await statAsync(this.config.filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * 获取最后修改时间
   */
  private async getLastModified(): Promise<number> {
    try {
      const stats = await statAsync(this.config.filePath);
      return stats.mtime.getTime();
    } catch (error) {
      return Date.now();
    }
  }

  /**
   * 执行轮转
   */
  async rotate(): Promise<void> {
    if (this.isRotating) return;

    this.isRotating = true;
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const ext = path.extname(this.config.filePath);
      const baseName = path.basename(this.config.filePath, ext);
      const dir = path.dirname(this.config.filePath);

      let rotatedName = `${baseName}.${timestamp}${ext}`;
      const rotatedPath = path.join(dir, rotatedName);

      // 关闭文件（如果使用流）
      this.emit('beforeRotate', this.config.filePath, rotatedPath);

      // 重命名文件
      await renameAsync(this.config.filePath, rotatedPath);

      // 创建新文件
      await fs.promises.writeFile(this.config.filePath, '');

      // 压缩
      if (this.config.compress) {
        await this.compressFile(rotatedPath);
      }

      // 清理旧文件
      await this.cleanupOldFiles();

      // 触发回调
      if (this.config.onRotate) {
        this.config.onRotate(this.config.filePath, rotatedPath);
      }

      this.emit('rotated', this.config.filePath, rotatedPath);
      console.log(`[LogRotate] 日志轮转完成: ${rotatedPath}`);

    } catch (error) {
      console.error('[LogRotate] 轮转失败:', error);
      this.emit('error', error);
    } finally {
      this.isRotating = false;
    }
  }

  /**
   * 压缩文件
   */
  private async compressFile(filePath: string): Promise<void> {
    if (this.config.compressFormat === 'none') return;

    try {
      const data = await fs.promises.readFile(filePath);
      let compressed: Buffer;

      if (this.config.compressFormat === 'gzip') {
        compressed = await gzipAsync(data);
      } else {
        // 使用Brotli
        const brotli = await import('zlib');
        compressed = brotli.brotliCompressSync(data);
      }

      const compressedPath = `${filePath}.${this.config.compressFormat === 'gzip' ? 'gz' : 'br'}`;
      await fs.promises.writeFile(compressedPath, compressed);
      await unlinkAsync(filePath);

      console.log(`[LogRotate] 文件已压缩: ${compressedPath}`);
    } catch (error) {
      console.error('[LogRotate] 压缩失败:', error);
    }
  }

  /**
   * 清理旧文件
   */
  private async cleanupOldFiles(): Promise<void> {
    try {
      const dir = path.dirname(this.config.filePath);
      const files = await readdirAsync(dir);

      const logFiles = files
        .filter((f) => f.startsWith(path.basename(this.config.filePath, path.extname(this.config.filePath))))
        .map((f) => ({
          name: f,
          path: path.join(dir, f),
          mtime: fs.statSync(path.join(dir, f)).mtime.getTime(),
        }))
        .sort((a, b) => b.mtime - a.mtime);

      if (logFiles.length > this.config.maxFiles) {
        const toDelete = logFiles.slice(this.config.maxFiles);
        for (const file of toDelete) {
          await unlinkAsync(file.path);
          console.log(`[LogRotate] 删除旧日志: ${file.name}`);
        }
      }

      this.emit('cleanup', { deleted: Math.max(0, logFiles.length - this.config.maxFiles) });
    } catch (error) {
      console.error('[LogRotate] 清理旧文件失败:', error);
    }
  }

  /**
   * 写入日志（格式化）
   */
  async write(logData: any): Promise<void> {
    let logLine: string;

    if (this.config.format === 'json') {
      const logEntry = {
        timestamp: new Date().toISOString(),
        ...logData,
      };
      logLine = JSON.stringify(logEntry) + '\n';
    } else {
      const timestamp = new Date().toISOString();
      const message = typeof logData === 'string' ? logData : logData.message || JSON.stringify(logData);
      logLine = `[${timestamp}] ${message}\n`;
    }

    if (this.config.async) {
      setImmediate(() => {
        fs.appendFile(this.config.filePath, logLine, (err) => {
          if (err) {
            console.error('[LogRotate] 写入日志失败:', err);
            this.emit('writeError', err);
          }
        });
      });
    } else {
      try {
        await fs.promises.appendFile(this.config.filePath, logLine);
      } catch (error) {
        console.error('[LogRotate] 写入日志失败:', error);
        this.emit('writeError', error);
      }
    }
  }

  /**
   * 批量写入
   */
  async writeBatch(logs: any[]): Promise<void> {
    let content = '';
    for (const log of logs) {
      if (this.config.format === 'json') {
        const logEntry = {
          timestamp: new Date().toISOString(),
          ...log,
        };
        content += JSON.stringify(logEntry) + '\n';
      } else {
        const timestamp = new Date().toISOString();
        const message = typeof log === 'string' ? log : log.message || JSON.stringify(log);
        content += `[${timestamp}] ${message}\n`;
      }
    }

    if (this.config.async) {
      setImmediate(() => {
        fs.appendFile(this.config.filePath, content, (err) => {
          if (err) {
            console.error('[LogRotate] 批量写入失败:', err);
            this.emit('writeError', err);
          }
        });
      });
    } else {
      try {
        await fs.promises.appendFile(this.config.filePath, content);
      } catch (error) {
        console.error('[LogRotate] 批量写入失败:', error);
        this.emit('writeError', error);
      }
    }

    // 检查是否需要轮转
    await this.checkAndRotate();
  }

  /**
   * 获取日志文件列表
   */
  getLogFiles(): string[] {
    const dir = path.dirname(this.config.filePath);
    const files = fs.readdirSync(dir);
    const baseName = path.basename(this.config.filePath, path.extname(this.config.filePath));

    return files
      .filter((f) => f.startsWith(baseName))
      .map((f) => path.join(dir, f))
      .filter((f) => fs.statSync(f).isFile());
  }

  /**
   * 获取日志统计
   */
  async getStats(): Promise<{
    currentSize: number;
    fileCount: number;
    totalSize: number;
    oldestFile: string;
    newestFile: string;
  }> {
    const files = this.getLogFiles();
    let totalSize = 0;
    let oldestFile = '';
    let newestFile = '';
    let oldestTime = Infinity;
    let newestTime = 0;

    for (const file of files) {
      const stats = await statAsync(file);
      totalSize += stats.size;
      if (stats.mtime.getTime() < oldestTime) {
        oldestTime = stats.mtime.getTime();
        oldestFile = file;
      }
      if (stats.mtime.getTime() > newestTime) {
        newestTime = stats.mtime.getTime();
        newestFile = file;
      }
    }

    return {
      currentSize: await this.getFileSize(),
      fileCount: files.length,
      totalSize,
      oldestFile,
      newestFile,
    };
  }

  /**
   * 关闭轮转管理器
   */
  close(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    console.log('[LogRotate] 轮转管理器已关闭');
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<LogRotateConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    } as Required<LogRotateConfig>;
    this.startRotationTimer();
  }
}

/**
 * 创建日志轮转管理器（工厂函数）
 */
export function createLogRotateManager(config: LogRotateConfig): LogRotateManager {
  return new LogRotateManager(config);
}

/**
 * 从环境变量创建配置
 */
export function createLogRotateFromEnv(): LogRotateConfig {
  return {
    filePath: process.env.LOG_FILE || './logs/app.log',
    strategy: (process.env.LOG_ROTATE_STRATEGY as RotationStrategy) || RotationStrategy.BOTH,
    maxSize: parseInt(process.env.LOG_MAX_SIZE || '52428800'),
    timeInterval: parseInt(process.env.LOG_TIME_INTERVAL || '24'),
    timeUnit: (process.env.LOG_TIME_UNIT as RotationTimeUnit) || RotationTimeUnit.HOUR,
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '30'),
    compress: process.env.LOG_COMPRESS !== 'false',
    compressFormat: (process.env.LOG_COMPRESS_FORMAT as 'gzip' | 'brotli' | 'none') || 'gzip',
    format: (process.env.LOG_FORMAT as 'json' | 'text' | 'combined') || 'json',
    async: process.env.LOG_ASYNC !== 'false',
  };
}

export default LogRotateManager;