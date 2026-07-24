/**
 * Logger Utility - 日志工具
 * 提供完整的日志记录功能，包含日志级别、文件轮转、结构化日志、性能日志等
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import config from '../config';

// ============================================
// 类型定义
// ============================================

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  level: string;
  message: string;
  timestamp?: string;
  context?: LogContext;
  error?: Error;
  [key: string]: any;
}

// ============================================
// 日志目录初始化
// ============================================

const LOG_DIR = path.join(process.cwd(), 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// ============================================
// 日志格式配置
// ============================================

const customFormat = winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
  const contextStr = context ? ` [${JSON.stringify(context)}]` : '';
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} ${level.toUpperCase()}: ${message}${contextStr}${metaStr}`;
});

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.colorize(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  customFormat
);

// ============================================
// 日志传输配置
// ============================================

// 控制台输出
const consoleTransport = new winston.transports.Console({
  level: config.log.level || 'info',
  format: consoleFormat
});

// 错误日志文件（只记录错误级别）
const errorFileTransport = new DailyRotateFile({
  filename: path.join(LOG_DIR, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: config.log.maxSize || '20m',
  maxFiles: config.log.maxFiles || '30d',
  format: logFormat
});

// 应用日志文件
const appFileTransport = new DailyRotateFile({
  filename: path.join(LOG_DIR, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: config.log.maxSize || '20m',
  maxFiles: config.log.maxFiles || '30d',
  format: logFormat
});

// 访问日志文件
const accessFileTransport = new DailyRotateFile({
  filename: path.join(LOG_DIR, 'access-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'info',
  maxSize: config.log.maxSize || '20m',
  maxFiles: config.log.maxFiles || '30d',
  format: logFormat
});

// ============================================
// 日志实例创建
// ============================================

const logger = winston.createLogger({
  level: config.log.level || 'info',
  defaultMeta: {
    service: 'erp-backend',
    environment: config.env
  },
  transports: [
    consoleTransport,
    errorFileTransport,
    appFileTransport
  ]
});

// ============================================
// 日志工具类
// ============================================

export class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * 获取当前日志上下文
   */
  private getContext(): LogContext {
    return {
      pid: process.pid,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(message: string, context?: LogContext): string {
    return message;
  }

  /**
   * 记录信息日志
   */
  info(message: string, context?: LogContext): void {
    logger.info(this.formatMessage(message, context), { context });
  }

  /**
   * 记录警告日志
   */
  warn(message: string, context?: LogContext): void {
    logger.warn(this.formatMessage(message, context), { context });
  }

  /**
   * 记录错误日志
   */
  error(message: string, error?: Error | any, context?: LogContext): void {
    const errorInfo = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error;

    logger.error(this.formatMessage(message, context), {
      context,
      error: errorInfo
    });
  }

  /**
   * 记录调试日志
   */
  debug(message: string, context?: LogContext): void {
    logger.debug(this.formatMessage(message, context), { context });
  }

  /**
   * 记录访问日志
   */
  access(message: string, context?: LogContext): void {
    accessFileTransport.log({
      level: 'info',
      message: this.formatMessage(message, context),
      context
    });
  }

  /**
   * 记录性能日志
   */
  performance(message: string, duration: number, context?: LogContext): void {
    const perfContext = {
      ...context,
      duration_ms: duration
    };
    logger.info(`[PERF] ${message}`, { context: perfContext });
  }

  /**
   * 记录审计日志
   */
  audit(action: string, userId: string, data?: any): void {
    logger.info(`[AUDIT] ${action}`, {
      context: {
        action,
        userId,
        data,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * 记录请求日志
   */
  request(req: any, res: any, duration: number): void {
    this.access(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  }

  /**
   * 记录数据库查询日志
   */
  query(operation: string, collection: string, query: any, duration: number): void {
    this.debug(`[DB] ${operation} on ${collection}`, {
      operation,
      collection,
      query,
      duration_ms: duration
    });
  }

  /**
   * 创建日志上下文
   */
  createContext(data: LogContext): LogContext {
    return {
      ...this.getContext(),
      ...data
    };
  }

  /**
   * 开始性能追踪
   */
  startPerformanceTracking(operation: string): () => void {
    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      this.performance(operation, duration);
    };
  }
}

// ============================================
// 简化的日志函数
// ============================================

/**
 * 信息日志
 */
export const logInfo = (message: string, context?: LogContext): void => {
  Logger.getInstance().info(message, context);
};

/**
 * 警告日志
 */
export const logWarn = (message: string, context?: LogContext): void => {
  Logger.getInstance().warn(message, context);
};

/**
 * 错误日志
 */
export const logError = (message: string, error?: Error | any, context?: LogContext): void => {
  Logger.getInstance().error(message, error, context);
};

/**
 * 调试日志
 */
export const logDebug = (message: string, context?: LogContext): void => {
  Logger.getInstance().debug(message, context);
};

/**
 * 审计日志
 */
export const logAudit = (action: string, userId: string, data?: any): void => {
  Logger.getInstance().audit(action, userId, data);
};

/**
 * 请求日志
 */
export const logRequest = (req: any, res: any, duration: number): void => {
  Logger.getInstance().request(req, res, duration);
};

/**
 * 性能日志
 */
export const logPerformance = (message: string, duration: number, context?: LogContext): void => {
  Logger.getInstance().performance(message, duration, context);
};

// ============================================
// 默认导出
// ============================================

export default logger;
export { Logger };