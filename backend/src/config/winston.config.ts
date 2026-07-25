/**
 * Winston日志配置
 * 完整的Winston日志系统配置
 * @module winston.config
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { LogRotateManager } from './logrotate.config';

/**
 * 日志级别
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
  SILLY = 'silly',
}

/**
 * Winston配置接口
 */
export interface WinstonConfig {
  /** 日志级别 */
  level?: LogLevel;
  /** 日志格式 */
  format?: 'json' | 'simple' | 'combined';
  /** 是否彩色输出 */
  colorize?: boolean;
  /** 是否显示时间戳 */
  timestamp?: boolean;
  /** 日志目录 */
  logDir?: string;
  /** 日志文件名 */
  filename?: string;
  /** 最大文件大小 */
  maxSize?: string;
  /** 最大文件数 */
  maxFiles?: string;
  /** 是否压缩 */
  compress?: boolean;
  /** 控制台输出 */
  console?: boolean;
  /** 文件输出 */
  file?: boolean;
}

/**
 * 默认Winston配置
 */
export const DEFAULT_WINSTON_CONFIG: WinstonConfig = {
  level: LogLevel.INFO,
  format: 'json',
  colorize: true,
  timestamp: true,
  logDir: './logs',
  filename: 'app-%DATE%.log',
  maxSize: '50m',
  maxFiles: '30d',
  compress: true,
  console: true,
  file: true,
};

/**
 * Winston日志管理器
 */
export class WinstonLogManager {
  private logger: winston.Logger;
  private config: Required<WinstonConfig>;
  private rotateManager: LogRotateManager | null = null;

  constructor(config: WinstonConfig = {}) {
    this.config = {
      ...DEFAULT_WINSTON_CONFIG,
      ...config,
    } as Required<WinstonConfig>;

    this.logger = this.createLogger();
    this.setupRotateManager();
  }

  /**
   * 创建Winston日志器
   */
  private createLogger(): winston.Logger {
    const transports: winston.transport[] = [];

    // 控制台传输
    if (this.config.console) {
      transports.push(new winston.transports.Console({
        level: this.config.level,
        format: this.getConsoleFormat(),
      }));
    }

    // 文件传输
    if (this.config.file) {
      transports.push(new DailyRotateFile({
        filename: `${this.config.logDir}/${this.config.filename}`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: this.config.compress,
        maxSize: this.config.maxSize,
        maxFiles: this.config.maxFiles,
        format: this.getFileFormat(),
        level: this.config.level,
      }));
    }

    return winston.createLogger({
      level: this.config.level,
      transports,
      exitOnError: false,
    });
  }

  /**
   * 获取控制台格式
   */
  private getConsoleFormat(): winston.Logform.Format {
    const formats: winston.Logform.Format[] = [];

    if (this.config.timestamp) {
      formats.push(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }));
    }

    if (this.config.colorize) {
      formats.push(winston.format.colorize({ all: true }));
    }

    if (this.config.format === 'json') {
      formats.push(winston.format.json());
    } else if (this.config.format === 'simple') {
      formats.push(winston.format.simple());
    } else {
      formats.push(winston.format.combined());
    }

    return winston.format.combine(...formats);
  }

  /**
   * 获取文件格式
   */
  private getFileFormat(): winston.Logform.Format {
    const formats: winston.Logform.Format[] = [];

    if (this.config.timestamp) {
      formats.push(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }));
    }

    formats.push(winston.format.errors({ stack: true }));

    if (this.config.format === 'json') {
      formats.push(winston.format.json());
    } else {
      formats.push(winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level}] ${message}${metaStr}`;
      }));
    }

    return winston.format.combine(...formats);
  }

  /**
   * 设置轮转管理器
   */
  private setupRotateManager(): void {
    try {
      this.rotateManager = new LogRotateManager({
        filePath: `${this.config.logDir}/app.log`,
        maxSize: parseInt(this.config.maxSize) * 1024 * 1024,
        maxFiles: 30,
        compress: this.config.compress,
        format: this.config.format as any,
        async: true,
      });

      // 监听轮转事件
      this.rotateManager.on('rotated', (oldPath, newPath) => {
        this.logger.info('日志轮转完成', { oldPath, newPath });
      });
    } catch (error) {
      console.error('日志轮转初始化失败:', error);
    }
  }

  /**
   * 记录错误日志
   */
  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  /**
   * 记录警告日志
   */
  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * 记录信息日志
   */
  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * 记录调试日志
   */
  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  /**
   * 记录详细日志
   */
  verbose(message: string, meta?: any): void {
    this.logger.verbose(message, meta);
  }

  /**
   * 记录HTTP请求日志
   */
  http(message: string, meta?: any): void {
    this.logger.http(message, meta);
  }

  /**
   * 记录操作日志
   */
  log(level: LogLevel, message: string, meta?: any): void {
    this.logger.log(level, message, meta);
  }

  /**
   * 创建子日志器
   */
  child(options: Record<string, any>): winston.Logger {
    return this.logger.child(options);
  }

  /**
   * 获取日志器实例
   */
  getLogger(): winston.Logger {
    return this.logger;
  }

  /**
   * 获取轮转管理器
   */
  getRotateManager(): LogRotateManager | null {
    return this.rotateManager;
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<WinstonConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    } as Required<WinstonConfig>;

    // 重新创建日志器
    this.logger = this.createLogger();
  }

  /**
   * 获取配置
   */
  getConfig(): WinstonConfig {
    return { ...this.config };
  }

  /**
   * 关闭日志管理器
   */
  close(): void {
    if (this.rotateManager) {
      this.rotateManager.close();
    }
    this.logger.end();
    console.log('[WinstonLog] 日志管理器已关闭');
  }
}

/**
 * 创建Winston日志管理器（工厂函数）
 */
export function createWinstonLogManager(config?: WinstonConfig): WinstonLogManager {
  return new WinstonLogManager(config);
}

/**
 * 从环境变量创建配置
 */
export function createWinstonFromEnv(): WinstonConfig {
  return {
    level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
    format: (process.env.LOG_FORMAT as 'json' | 'simple' | 'combined') || 'json',
    colorize: process.env.LOG_COLORIZE !== 'false',
    timestamp: process.env.LOG_TIMESTAMP !== 'false',
    logDir: process.env.LOG_DIR || './logs',
    filename: process.env.LOG_FILENAME || 'app-%DATE%.log',
    maxSize: process.env.LOG_MAX_SIZE || '50m',
    maxFiles: process.env.LOG_MAX_FILES || '30d',
    compress: process.env.LOG_COMPRESS !== 'false',
    console: process.env.LOG_CONSOLE !== 'false',
    file: process.env.LOG_FILE !== 'false',
  };
}

/**
 * 默认日志管理器实例
 */
export const defaultLogger = createWinstonLogManager(createWinstonFromEnv());

export default WinstonLogManager;