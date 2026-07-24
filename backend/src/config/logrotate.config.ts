/**
 * @file Config/logrotate.config.ts
 * 日志轮转配置 - 生产级日志切割、压缩、清理与告警
 * 完整实现：移除所有 TODO/FIXME，实现完整的日志轮转管理
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from './winston.config';

const execAsync = promisify(exec);

// ============================================
// 类型定义
// ============================================

export interface LogRotateOptions {
  /** 日志文件路径 */
  filePath: string;
  /** 单个日志文件最大大小 (单位: MB) */
  maxSizeMB: number;
  /** 保留的日志文件数量 */
  retainCount: number;
  /** 是否启用压缩 */
  compress: boolean;
  /** 日志轮转时间间隔 (单位: 天) */
  rotateIntervalDays: number;
  /** 日志文件权限 (八进制) */
  fileMode: string;
  /** 是否启用告警回调 */
  alertEnabled: boolean;
  /** 告警回调函数 */
  alertCallback?: (message: string, error?: Error) => void;
  /** 日志目录路径 */
  logDir: string;
  /** 是否启用详细日志 */
  verbose: boolean;
  /** 最大磁盘使用率阈值 (%) */
  maxDiskUsagePercent: number;
  /** 是否启用磁盘空间检查 */
  enableDiskCheck: boolean;
}

export interface LogRotateStatus {
  currentSizeMB: number;
  totalFiles: number;
  totalSizeMB: number;
  oldestFileDate: Date | null;
  newestFileDate: Date | null;
  lastRotateTime: Date | null;
  nextScheduledRotate: Date | null;
  diskUsagePercent: number;
  diskFreeSpaceMB: number;
}

export interface RotateResult {
  success: boolean;
  rotatedFile: string | null;
  compressedFile: string | null;
  freedSpaceMB: number;
  deletedFiles: number;
  message: string;
}

// ============================================
// 日志轮转管理器
// ============================================

export class LogRotateManager {
  private options: LogRotateOptions;
  private lastRotateTime: Date | null = null;
  private timer: NodeJS.Timeout | null = null;
  private isRotating: boolean = false;
  private rotateCount: number = 0;

  constructor(options: Partial<LogRotateOptions> = {}) {
    const logDir = options.logDir || process.env.LOG_DIR || './logs';
    
    // 确保日志目录存在
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.options = {
      filePath: options.filePath || path.join(logDir, 'app.log'),
      maxSizeMB: parseInt(process.env.LOG_MAX_SIZE_MB || '100', 10),
      retainCount: parseInt(process.env.LOG_RETAIN_COUNT || '30', 10),
      compress: process.env.LOG_COMPRESS !== 'false',
      rotateIntervalDays: parseInt(process.env.LOG_ROTATE_INTERVAL_DAYS || '1', 10),
      fileMode: options.fileMode || '0644',
      alertEnabled: options.alertEnabled !== undefined ? options.alertEnabled : true,
      alertCallback: options.alertCallback,
      logDir: logDir,
      verbose: options.verbose || false,
      maxDiskUsagePercent: parseInt(process.env.LOG_MAX_DISK_USAGE_PERCENT || '80', 10),
      enableDiskCheck: process.env.LOG_ENABLE_DISK_CHECK !== 'false',
      ...options,
    };

    // 补全路径
    if (!path.isAbsolute(this.options.filePath)) {
      this.options.filePath = path.join(process.cwd(), this.options.filePath);
    }

    // 验证配置
    const validation = this.validateOptions();
    if (!validation.valid) {
      console.error('[LogRotate] 配置验证失败:', validation.errors);
    }

    this.log(`日志轮转管理器初始化完成`, {
      filePath: this.options.filePath,
      maxSizeMB: this.options.maxSizeMB,
      retainCount: this.options.retainCount,
      compress: this.options.compress,
      maxDiskUsagePercent: this.options.maxDiskUsagePercent,
    });
  }

  // ============================================
  // 私有方法
  // ============================================

  private log(message: string, data?: any): void {
    if (this.options.verbose) {
      console.log(`[LogRotate] ${message}`, data || '');
    }
    logger?.debug(`[LogRotate] ${message}`, data);
  }

  private error(message: string, error?: Error): void {
    console.error(`[LogRotate] ${message}`, error || '');
    logger?.error(`[LogRotate] ${message}`, { error: error?.message, stack: error?.stack });

    if (this.options.alertEnabled && this.options.alertCallback) {
      this.options.alertCallback(message, error);
    }
  }

  private warn(message: string, data?: any): void {
    console.warn(`[LogRotate] ${message}`, data || '');
    logger?.warn(`[LogRotate] ${message}`, data);
  }

  // ============================================
  // 核心功能
  // ============================================

  /**
   * 检查并执行日志轮转
   */
  async checkAndRotate(): Promise<RotateResult> {
    if (this.isRotating) {
      return {
        success: false,
        rotatedFile: null,
        compressedFile: null,
        freedSpaceMB: 0,
        deletedFiles: 0,
        message: '轮转进行中，跳过本次检查',
      };
    }

    this.isRotating = true;
    const result: RotateResult = {
      success: false,
      rotatedFile: null,
      compressedFile: null,
      freedSpaceMB: 0,
      deletedFiles: 0,
      message: '',
    };

    try {
      this.log('开始检查日志轮转条件...');

      // 检查磁盘空间
      if (this.options.enableDiskCheck) {
        const diskInfo = await this.checkDiskSpace();
        if (diskInfo.usagePercent > this.options.maxDiskUsagePercent) {
          this.warn(`磁盘使用率 ${diskInfo.usagePercent.toFixed(2)}% 超过阈值 ${this.options.maxDiskUsagePercent}%，触发紧急清理`, diskInfo);
          await this.emergencyCleanup();
        }
      }

      const fileStat = await this.getFileStats();

      if (!fileStat) {
        result.message = '日志文件不存在，跳过轮转';
        this.isRotating = false;
        return result;
      }

      const fileSizeMB = fileStat.size / (1024 * 1024);
      this.log(`当前日志文件大小: ${fileSizeMB.toFixed(2)} MB`);

      // 检查是否需要轮转
      const shouldRotate = fileSizeMB >= this.options.maxSizeMB;
      
      if (shouldRotate) {
        this.log(`日志文件超过阈值 (${this.options.maxSizeMB}MB)，开始轮转...`);
        const rotateResult = await this.rotateLog();
        result.rotatedFile = rotateResult.rotatedFile;
        result.compressedFile = rotateResult.compressedFile;
        result.success = true;
        result.message = '日志轮转成功';
        this.lastRotateTime = new Date();
        this.rotateCount++;
      } else {
        result.message = `日志文件大小 ${fileSizeMB.toFixed(2)}MB 未超过阈值 ${this.options.maxSizeMB}MB`;
        result.success = true;
      }

      // 清理过期日志
      const cleanResult = await this.cleanOldLogs();
      result.freedSpaceMB = cleanResult.freedSpaceMB;
      result.deletedFiles = cleanResult.deletedFiles;

      this.isRotating = false;
      this.log('日志轮转检查完成', result);
    } catch (error) {
      this.isRotating = false;
      const err = error as Error;
      result.message = `日志轮转失败: ${err.message}`;
      this.error('日志轮转检查失败', err);
    }

    return result;
  }

  /**
   * 执行日志轮转操作
   */
  private async rotateLog(): Promise<{ rotatedFile: string | null; compressedFile: string | null }> {
    const logDir = path.dirname(this.options.filePath);
    const baseName = path.basename(this.options.filePath, '.log');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_');
    const rotatedFileName = `${baseName}_${timestamp}.log`;
    const rotatedFilePath = path.join(logDir, rotatedFileName);

    let compressedFile: string | null = null;

    try {
      if (!fs.existsSync(this.options.filePath)) {
        this.log('日志文件不存在，无法轮转');
        return { rotatedFile: null, compressedFile: null };
      }

      // 移动日志文件
      fs.renameSync(this.options.filePath, rotatedFilePath);
      this.log(`日志文件已重命名: ${rotatedFileName}`);

      // 创建新的空日志文件
      fs.writeFileSync(this.options.filePath, '', { mode: this.options.fileMode });
      this.log(`已创建新的日志文件: ${path.basename(this.options.filePath)}`);

      // 压缩日志文件
      if (this.options.compress) {
        compressedFile = await this.compressLog(rotatedFilePath);
      }

      // 设置文件权限
      fs.chmodSync(rotatedFilePath, this.options.fileMode);
      fs.chmodSync(this.options.filePath, this.options.fileMode);

      this.log(`日志轮转完成: ${rotatedFileName}`);
      return { rotatedFile: rotatedFilePath, compressedFile };
    } catch (error) {
      this.error('日志轮转失败', error as Error);
      throw error;
    }
  }

  /**
   * 压缩日志文件
   */
  private async compressLog(filePath: string): Promise<string | null> {
    try {
      const gzipPath = `${filePath}.gz`;
      
      await execAsync(`gzip -c "${filePath}" > "${gzipPath}"`);
      
      fs.unlinkSync(filePath);
      fs.chmodSync(gzipPath, this.options.fileMode);
      
      this.log(`日志已压缩: ${path.basename(gzipPath)}`);
      return gzipPath;
    } catch (error) {
      this.error('日志压缩失败', error as Error);
      return null;
    }
  }

  /**
   * 清理过期的日志文件
   */
  private async cleanOldLogs(): Promise<{ deletedFiles: number; freedSpaceMB: number }> {
    const logDir = path.dirname(this.options.filePath);
    const baseName = path.basename(this.options.filePath, '.log');

    let deletedFiles = 0;
    let freedSpaceMB = 0;

    try {
      if (!fs.existsSync(logDir)) {
        return { deletedFiles: 0, freedSpaceMB: 0 };
      }

      const files = fs.readdirSync(logDir);
      const logFiles = files
        .filter(f => f.startsWith(baseName) && (f.endsWith('.log') || f.endsWith('.log.gz')))
        .map(f => ({
          name: f,
          path: path.join(logDir, f),
          mtime: fs.statSync(path.join(logDir, f)).mtime,
          size: fs.statSync(path.join(logDir, f)).size,
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      this.log(`发现 ${logFiles.length} 个日志文件，保留 ${this.options.retainCount} 个`);

      const filesToDelete = logFiles.slice(this.options.retainCount);

      for (const file of filesToDelete) {
        freedSpaceMB += file.size / (1024 * 1024);
        fs.unlinkSync(file.path);
        deletedFiles++;
        this.log(`已删除过期日志: ${file.name}`);
      }

      if (deletedFiles > 0) {
        this.log(`清理完成: 删除 ${deletedFiles} 个文件，释放 ${freedSpaceMB.toFixed(2)} MB 空间`);
      } else {
        this.log('无需清理过期日志');
      }
    } catch (error) {
      this.error('清理过期日志失败', error as Error);
    }

    return { deletedFiles, freedSpaceMB };
  }

  /**
   * 紧急清理 - 当磁盘空间不足时
   */
  private async emergencyCleanup(): Promise<void> {
    this.warn('执行紧急日志清理...');
    
    const logDir = path.dirname(this.options.filePath);
    const baseName = path.basename(this.options.filePath, '.log');

    try {
      if (!fs.existsSync(logDir)) {
        return;
      }

      const files = fs.readdirSync(logDir);
      const logFiles = files
        .filter(f => f.startsWith(baseName) && (f.endsWith('.log') || f.endsWith('.log.gz')))
        .map(f => ({
          path: path.join(logDir, f),
          mtime: fs.statSync(path.join(logDir, f)).mtime,
          size: fs.statSync(path.join(logDir, f)).size,
        }))
        .sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

      // 删除最旧的 50% 日志文件
      const filesToDelete = logFiles.slice(0, Math.ceil(logFiles.length / 2));

      let freedSpaceMB = 0;
      for (const file of filesToDelete) {
        freedSpaceMB += file.size / (1024 * 1024);
        fs.unlinkSync(file.path);
      }

      this.log(`紧急清理完成: 删除 ${filesToDelete.length} 个文件，释放 ${freedSpaceMB.toFixed(2)} MB 空间`);

      if (this.options.alertEnabled && this.options.alertCallback) {
        this.options.alertCallback(`紧急日志清理: 释放 ${freedSpaceMB.toFixed(2)} MB 空间`, undefined);
      }
    } catch (error) {
      this.error('紧急清理失败', error as Error);
    }
  }

  /**
   * 检查磁盘空间
   */
  private async checkDiskSpace(): Promise<{ usagePercent: number; freeSpaceMB: number; totalSpaceMB: number }> {
    try {
      const logDir = this.options.logDir;
      const stat = fs.statfsSync(logDir);

      const freeSpaceMB = (stat.bavail * stat.bsize) / (1024 * 1024);
      const totalSpaceMB = (stat.blocks * stat.bsize) / (1024 * 1024);
      const usagePercent = ((totalSpaceMB - freeSpaceMB) / totalSpaceMB) * 100;

      return { usagePercent, freeSpaceMB, totalSpaceMB };
    } catch (error) {
      this.error('检查磁盘空间失败', error as Error);
      return { usagePercent: 0, freeSpaceMB: 0, totalSpaceMB: 0 };
    }
  }

  /**
   * 获取文件状态
   */
  private async getFileStats(): Promise<fs.Stats | null> {
    try {
      if (!fs.existsSync(this.options.filePath)) {
        return null;
      }
      return fs.statSync(this.options.filePath);
    } catch (error) {
      this.error('获取文件状态失败', error as Error);
      return null;
    }
  }

  // ============================================
  // 状态查询方法
  // ============================================

  /**
   * 获取当前状态
   */
  getStatus(): LogRotateStatus {
    const logDir = path.dirname(this.options.filePath);
    const baseName = path.basename(this.options.filePath, '.log');

    let currentSizeMB = 0;
    try {
      if (fs.existsSync(this.options.filePath)) {
        const stat = fs.statSync(this.options.filePath);
        currentSizeMB = stat.size / (1024 * 1024);
      }
    } catch (error) {
      this.error('获取当前文件大小失败', error as Error);
    }

    let totalFiles = 0;
    let totalSizeMB = 0;
    let oldestFileDate: Date | null = null;
    let newestFileDate: Date | null = null;
    let diskUsagePercent = 0;
    let diskFreeSpaceMB = 0;

    try {
      if (fs.existsSync(logDir)) {
        const files = fs.readdirSync(logDir);
        const logFiles = files
          .filter(f => f.startsWith(baseName) && (f.endsWith('.log') || f.endsWith('.log.gz')))
          .map(f => ({
            path: path.join(logDir, f),
            mtime: fs.statSync(path.join(logDir, f)).mtime,
            size: fs.statSync(path.join(logDir, f)).size,
          }));

        totalFiles = logFiles.length;
        totalSizeMB = logFiles.reduce((sum, f) => sum + f.size / (1024 * 1024), 0);

        if (logFiles.length > 0) {
          const sorted = logFiles.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());
          oldestFileDate = sorted[0]?.mtime || null;
          newestFileDate = sorted[sorted.length - 1]?.mtime || null;
        }
      }

      // 磁盘空间
      const diskInfo = fs.statfsSync(logDir);
      diskFreeSpaceMB = (diskInfo.bavail * diskInfo.bsize) / (1024 * 1024);
      const totalSpaceMB = (diskInfo.blocks * diskInfo.bsize) / (1024 * 1024);
      diskUsagePercent = ((totalSpaceMB - diskFreeSpaceMB) / totalSpaceMB) * 100;
    } catch (error) {
      this.error('获取状态信息失败', error as Error);
    }

    return {
      currentSizeMB,
      totalFiles,
      totalSizeMB,
      oldestFileDate,
      newestFileDate,
      lastRotateTime: this.lastRotateTime,
      nextScheduledRotate: this.lastRotateTime 
        ? new Date(this.lastRotateTime.getTime() + this.options.rotateIntervalDays * 24 * 60 * 60 * 1000)
        : null,
      diskUsagePercent,
      diskFreeSpaceMB,
    };
  }

  // ============================================
  // 定时任务管理
  // ============================================

  /**
   * 启动定时轮转任务
   */
  startScheduler(): void {
    if (this.timer) {
      this.log('定时轮转任务已存在，停止旧任务');
      this.stopScheduler();
    }

    const intervalMs = this.options.rotateIntervalDays * 24 * 60 * 60 * 1000;
    
    this.timer = setInterval(() => {
      this.checkAndRotate().catch((error) => {
        this.error('定时轮转任务执行失败', error);
      });
    }, intervalMs);

    // 启动后立即检查一次
    setTimeout(() => {
      this.checkAndRotate().catch((error) => {
        this.error('启动后首次检查失败', error);
      });
    }, 1000);

    this.log(`定时轮转任务已启动，间隔: ${this.options.rotateIntervalDays} 天`);
  }

  /**
   * 停止定时轮转任务
   */
  stopScheduler(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.log('定时轮转任务已停止');
    }
  }

  /**
   * 手动执行轮转
   */
  async forceRotate(): Promise<RotateResult> {
    return await this.checkAndRotate();
  }

  /**
   * 清理所有日志
   */
  async cleanAllLogs(): Promise<{ deletedFiles: number; freedSpaceMB: number }> {
    const logDir = path.dirname(this.options.filePath);
    const baseName = path.basename(this.options.filePath, '.log');

    let deletedFiles = 0;
    let freedSpaceMB = 0;

    try {
      if (!fs.existsSync(logDir)) {
        return { deletedFiles: 0, freedSpaceMB: 0 };
      }

      const files = fs.readdirSync(logDir);
      const logFiles = files
        .filter(f => f.startsWith(baseName) && (f.endsWith('.log') || f.endsWith('.log.gz')))
        .map(f => path.join(logDir, f));

      for (const file of logFiles) {
        const stat = fs.statSync(file);
        freedSpaceMB += stat.size / (1024 * 1024);
        fs.unlinkSync(file);
        deletedFiles++;
      }

      // 重新创建空日志文件
      fs.writeFileSync(this.options.filePath, '', { mode: this.options.fileMode });

      this.log(`清理所有日志完成: 删除 ${deletedFiles} 个文件，释放 ${freedSpaceMB.toFixed(2)} MB 空间`);
      return { deletedFiles, freedSpaceMB };
    } catch (error) {
      this.error('清理所有日志失败', error as Error);
      return { deletedFiles: 0, freedSpaceMB: 0 };
    }
  }

  // ============================================
  // 配置管理
  // ============================================

  /**
   * 更新配置
   */
  updateOptions(options: Partial<LogRotateOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
    this.log('配置已更新', this.options);
  }

  /**
   * 获取配置
   */
  getOptions(): LogRotateOptions {
    return { ...this.options };
  }

  /**
   * 验证配置
   */
  validateOptions(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.options.maxSizeMB <= 0) {
      errors.push('maxSizeMB 必须大于 0');
    }
    if (this.options.retainCount <= 0) {
      errors.push('retainCount 必须大于 0');
    }
    if (this.options.rotateIntervalDays <= 0) {
      errors.push('rotateIntervalDays 必须大于 0');
    }
    if (!this.options.filePath) {
      errors.push('filePath 不能为空');
    }
    if (this.options.maxDiskUsagePercent <= 0 || this.options.maxDiskUsagePercent > 100) {
      errors.push('maxDiskUsagePercent 必须在 1-100 之间');
    }
    if (!fs.existsSync(this.options.logDir)) {
      errors.push(`日志目录不存在: ${this.options.logDir}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalRotations: number;
    lastRotateTime: Date | null;
    uptime: number;
    isRunning: boolean;
    config: LogRotateOptions;
  } {
    return {
      totalRotations: this.rotateCount,
      lastRotateTime: this.lastRotateTime,
      uptime: this.timer ? process.uptime() : 0,
      isRunning: this.timer !== null,
      config: this.options,
    };
  }
}

// ============================================
// 单例实例
// ============================================

const logDir = process.env.LOG_DIR || './logs';

export const logRotateManager = new LogRotateManager({
  filePath: process.env.LOG_FILE_PATH || path.join(logDir, 'app.log'),
  maxSizeMB: parseInt(process.env.LOG_MAX_SIZE_MB || '100', 10),
  retainCount: parseInt(process.env.LOG_RETAIN_COUNT || '30', 10),
  compress: process.env.LOG_COMPRESS !== 'false',
  rotateIntervalDays: parseInt(process.env.LOG_ROTATE_INTERVAL_DAYS || '1', 10),
  logDir: logDir,
  verbose: process.env.LOG_VERBOSE === 'true',
  maxDiskUsagePercent: parseInt(process.env.LOG_MAX_DISK_USAGE_PERCENT || '80', 10),
  enableDiskCheck: process.env.LOG_ENABLE_DISK_CHECK !== 'false',
  alertEnabled: true,
  alertCallback: (message: string, error?: Error) => {
    console.error(`[LogRotate Alert] ${message}`, error?.message || '');
    // 可接入外部告警系统
  },
});

// ============================================
// 启动自动轮转（生产环境）
// ============================================

if (process.env.NODE_ENV === 'production') {
  logRotateManager.startScheduler();

  process.on('SIGTERM', () => {
    logRotateManager.stopScheduler();
  });
  process.on('SIGINT', () => {
    logRotateManager.stopScheduler();
  });
}

export default logRotateManager;