/**
 * @file Config/logrotate.config.ts
 * 日志轮转配置 - 生产级日志切割、压缩、清理与告警
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
}

export interface LogRotateStatus {
  currentSizeMB: number;
  totalFiles: number;
  totalSizeMB: number;
  oldestFileDate: Date | null;
  newestFileDate: Date | null;
  lastRotateTime: Date | null;
  nextScheduledRotate: Date | null;
}

// ============================================
// 日志轮转管理器
// ============================================

export class LogRotateManager {
  private options: LogRotateOptions;
  private lastRotateTime: Date | null = null;
  private timer: NodeJS.Timeout | null = null;
  private isRotating: boolean = false;

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
      ...options,
    };

    // 补全路径
    if (!path.isAbsolute(this.options.filePath)) {
      this.options.filePath = path.join(process.cwd(), this.options.filePath);
    }

    this.log(`日志轮转管理器初始化完成`, {
      filePath: this.options.filePath,
      maxSizeMB: this.options.maxSizeMB,
      retainCount: this.options.retainCount,
      compress: this.options.compress,
    });
  }

  // ============================================
  // 私有日志方法
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

    // 触发告警
    if (this.options.alertEnabled && this.options.alertCallback) {
      this.options.alertCallback(message, error);
    }
  }

  // ============================================
  // 核心功能
  // ============================================

  /**
   * 检查并执行日志轮转
   */
  async checkAndRotate(): Promise<void> {
    if (this.isRotating) {
      this.log('轮转进行中，跳过本次检查');
      return;
    }

    this.isRotating = true;

    try {
      this.log('开始检查日志轮转条件...');
      const fileStat = await this.getFileStats();

      if (!fileStat) {
        this.log('日志文件不存在，跳过轮转');
        this.isRotating = false;
        return;
      }

      const fileSizeMB = fileStat.size / (1024 * 1024);
      this.log(`当前日志文件大小: ${fileSizeMB.toFixed(2)} MB`);

      // 检查是否需要轮转
      const shouldRotate = fileSizeMB >= this.options.maxSizeMB;
      
      if (shouldRotate) {
        this.log(`日志文件超过阈值 (${this.options.maxSizeMB}MB)，开始轮转...`);
        await this.rotateLog();
        this.lastRotateTime = new Date();
      } else {
        this.log('日志文件大小未超过阈值，无需轮转');
      }

      // 清理过期日志
      await this.cleanOldLogs();

      this.isRotating = false;
      this.log('日志轮转检查完成');
    } catch (error) {
      this.isRotating = false;
      this.error('日志轮转检查失败', error as Error);
    }
  }

  /**
   * 执行日志轮转操作
   */
  private async rotateLog(): Promise<void> {
    const logDir = path.dirname(this.options.filePath);
    const baseName = path.basename(this.options.filePath, '.log');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_');
    const rotatedFileName = `${baseName}_${timestamp}.log`;
    const rotatedFilePath = path.join(logDir, rotatedFileName);

    try {
      // 检查原日志文件是否存在
      if (!fs.existsSync(this.options.filePath)) {
        this.log('日志文件不存在，无法轮转');
        return;
      }

      // 移动日志文件
      fs.renameSync(this.options.filePath, rotatedFilePath);
      this.log(`日志文件已重命名: ${rotatedFileName}`);

      // 创建新的空日志文件
      fs.writeFileSync(this.options.filePath, '', { mode: this.options.fileMode });
      this.log(`已创建新的日志文件: ${path.basename(this.options.filePath)}`);

      // 压缩日志文件
      if (this.options.compress) {
        await this.compressLog(rotatedFilePath);
      }

      // 设置文件权限
      fs.chmodSync(rotatedFilePath, this.options.fileMode);
      fs.chmodSync(this.options.filePath, this.options.fileMode);

      this.log(`日志轮转完成: ${rotatedFileName}`);
    } catch (error) {
      this.error('日志轮转失败', error as Error);
      throw error;
    }
  }

  /**
   * 压缩日志文件
   */
  private async compressLog(filePath: string): Promise<void> {
    try {
      const gzipPath = `${filePath}.gz`;
      
      // 使用 gzip 压缩
      await execAsync(`gzip -c "${filePath}" > "${gzipPath}"`);
      
      // 删除原文件
      fs.unlinkSync(filePath);
      
      // 设置权限
      fs.chmodSync(gzipPath, this.options.fileMode);
      
      this.log(`日志已压缩: ${path.basename(gzipPath)}`);
    } catch (error) {
      this.error('日志压缩失败', error as Error);
      // 压缩失败时保留原文件
    }
  }

  /**
   * 清理过期的日志文件
   */
  private async cleanOldLogs(): Promise<void> {
    const logDir = path.dirname(this.options.filePath);
    const baseName = path.basename(this.options.filePath, '.log');

    try {
      if (!fs.existsSync(logDir)) {
        this.log('日志目录不存在，跳过清理');
        return;
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

      // 保留最新的 N 个文件
      const filesToDelete = logFiles.slice(this.options.retainCount);

      let deletedCount = 0;
      let freedSpaceMB = 0;

      for (const file of filesToDelete) {
        freedSpaceMB += file.size / (1024 * 1024);
        fs.unlinkSync(file.path);
        deletedCount++;
        this.log(`已删除过期日志: ${file.name}`);
      }

      if (deletedCount > 0) {
        this.log(`清理完成: 删除 ${deletedCount} 个文件，释放 ${freedSpaceMB.toFixed(2)} MB 空间`);
      } else {
        this.log('无需清理过期日志');
      }
    } catch (error) {
      this.error('清理过期日志失败', error as Error);
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
  async forceRotate(): Promise<boolean> {
    try {
      await this.rotateLog();
      await this.cleanOldLogs();
      this.lastRotateTime = new Date();
      this.log('手动轮转执行成功');
      return true;
    } catch (error) {
      this.error('手动轮转执行失败', error as Error);
      return false;
    }
  }

  /**
   * 清理所有日志
   */
  async cleanAllLogs(): Promise<number> {
    const logDir = path.dirname(this.options.filePath);
    const baseName = path.basename(this.options.filePath, '.log');

    try {
      if (!fs.existsSync(logDir)) {
        return 0;
      }

      const files = fs.readdirSync(logDir);
      const logFiles = files
        .filter(f => f.startsWith(baseName) && (f.endsWith('.log') || f.endsWith('.log.gz')))
        .map(f => path.join(logDir, f));

      let deletedCount = 0;
      for (const file of logFiles) {
        fs.unlinkSync(file);
        deletedCount++;
      }

      // 重新创建空日志文件
      fs.writeFileSync(this.options.filePath, '', { mode: this.options.fileMode });

      this.log(`清理所有日志完成: 删除 ${deletedCount} 个文件`);
      return deletedCount;
    } catch (error) {
      this.error('清理所有日志失败', error as Error);
      return 0;
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

    return {
      valid: errors.length === 0,
      errors,
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
  alertEnabled: true,
  alertCallback: (message: string, error?: Error) => {
    // 可接入外部告警系统
    console.error(`[LogRotate Alert] ${message}`, error?.message || '');
  },
});

// ============================================
// 启动自动轮转（生产环境）
// ============================================

if (process.env.NODE_ENV === 'production') {
  logRotateManager.startScheduler();

  // 进程退出时清理
  process.on('SIGTERM', () => {
    logRotateManager.stopScheduler();
  });
  process.on('SIGINT', () => {
    logRotateManager.stopScheduler();
  });
}

export default logRotateManager;