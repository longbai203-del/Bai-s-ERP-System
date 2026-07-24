/**
 * @file Config/winston.config.ts
 * Winston 日志系统配置 - 生产级结构化日志
 */

import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';

// ============================================
// 类型定义
// ============================================

export enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export interface LogContext {
  service?: string;
  environment?: string;
  version?: string;
  traceId?: string;
  userId?: string | number;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: any;
}

export interface LoggerConfig {
  level: LogLevel;
  service: string;
  environment: string;
  version: string;
  logDir: string;
  maxSize: string;
  maxFiles: string;
  compress: boolean;
  jsonFormat: boolean;
  colorize: boolean;
  enableConsole: boolean;
  enableFile: boolean;
  enableDailyRotate: boolean;
  enableErrorFile: boolean;
  enableExceptionHandling: boolean;
  enableRejectionHandling: boolean;
  sensitiveFields: string[];
  redactSensitiveData: boolean;
}

// ============================================
// 敏感数据脱敏
// ============================================

const defaultSensitiveFields = [
  'password',
  'token',
  'secret',
  'key',
  'authorization',
  'cookie',
  'set-cookie',
  'csrf',
  'x-csrf-token',
  'api-key',
  'api_key',
  'access_token',
  'refresh_token',
  'credit_card',
  'card_number',
  'cvv',
  'ssn',
  'social_security',
  'bank_account',
  'routing_number',
];

function redactSensitiveData(data: any, fields: string[]): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const result = Array.isArray(data) ? [...data] : { ...data };
  const allFields = [...defaultSensitiveFields, ...fields];

  for (const key of Object.keys(result)) {
    const lowerKey = key.toLowerCase();
    if (allFields.some(f => lowerKey.includes(f.toLowerCase()))) {
      const value = result[key];
      if (typeof value === 'string' && value.length > 0) {
        result[key] = '***REDACTED***';
      } else {
        result[key] = '***REDACTED***';
      }
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = redactSensitiveData(result[key], fields);
    }
  }

  return result;
}

// ============================================
// 自定义格式
// ============================================

function createCustomFormat(config: LoggerConfig) {
  const formats: winston.Logform.Format[] = [];

  // 时间戳
  formats.push(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    })
  );

  // 错误堆栈
  formats.push(winston.format.errors({ stack: true }));

  // 敏感数据脱敏
  if (config.redactSensitiveData) {
    formats.push(
      winston.format((info) => {
        if (info.metadata) {
          info.metadata = redactSensitiveData(info.metadata, config.sensitiveFields);
        }
        if (info.data) {
          info.data = redactSensitiveData(info.data, config.sensitiveFields);
        }
        return info;
      })()
    );
  }

  // JSON 格式
  if (config.jsonFormat) {
    formats.push(
      winston.format.json({
        space: config.environment === 'development' ? 2 : 0,
      })
    );
  } else {
    // 可读格式
    formats.push(
      winston.format.printf(({ timestamp, level, message, service, context, ...metadata }) => {
        const contextStr = context ? `[${context}]` : '';
        const metaStr = Object.keys(metadata).length > 0 
          ? ` ${JSON.stringify(metadata)}` 
          : '';
        return `${timestamp} ${level} ${contextStr} ${message}${metaStr}`;
      })
    );

    // 颜色
    if (config.colorize) {
      formats.push(winston.format.colorize({ all: true }));
    }
  }

  return winston.format.combine(...formats);
}

// ============================================
// 日志传输配置
// ============================================

function createTransports(config: LoggerConfig): winston.transport[] {
  const transports: winston.transport[] = [];

  // 控制台传输
  if (config.enableConsole) {
    transports.push(
      new winston.transports.Console({
        level: config.environment === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
        format: createCustomFormat({
          ...config,
          jsonFormat: false,
          colorize: true,
        }),
      })
    );
  }

  // 文件传输
  if (config.enableFile) {
    const logDir = config.logDir;
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    if (config.enableDailyRotate) {
      // 按天轮转
      const rotateTransport = new winston.transports.DailyRotateFile({
        filename: path.join(logDir, `${config.service}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        maxSize: config.maxSize || '100m',
        maxFiles: config.maxFiles || '30d',
        format: createCustomFormat({
          ...config,
          jsonFormat: true,
          colorize: false,
        }),
        level: config.level,
        zippedArchive: config.compress,
      });

      rotateTransport.on('rotate', (oldFilename, newFilename) => {
        console.log(`[Winston] 日志轮转: ${oldFilename} -> ${newFilename}`);
      });

      rotateTransport.on('error', (error) => {
        console.error('[Winston] 日志轮转错误:', error);
      });

      transports.push(rotateTransport);
    } else {
      // 普通文件
      transports.push(
        new winston.transports.File({
          filename: path.join(logDir, `${config.service}.log`),
          format: createCustomFormat({
            ...config,
            jsonFormat: true,
            colorize: false,
          }),
          level: config.level,
          maxsize: 100 * 1024 * 1024, // 100MB
          maxFiles: 10,
        })
      );
    }
  }

  // 错误日志文件
  if (config.enableErrorFile) {
    const logDir = config.logDir;
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, `${config.service}-error.log`),
        format: createCustomFormat({
          ...config,
          jsonFormat: true,
          colorize: false,
        }),
        level: LogLevel.ERROR,
        maxsize: 50 * 1024 * 1024, // 50MB
        maxFiles: 10,
      })
    );
  }

  return transports;
}

// ============================================
// 日志上下文管理
// ============================================

class LoggerContext {
  private static instance: LoggerContext;
  private context: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): LoggerContext {
    if (!LoggerContext.instance) {
      LoggerContext.instance = new LoggerContext();
    }
    return LoggerContext.instance;
  }

  set(key: string, value: any): void {
    this.context.set(key, value);
  }

  get(key: string): any {
    return this.context.get(key);
  }

  getAll(): Record<string, any> {
    return Object.fromEntries(this.context);
  }

  clear(): void {
    this.context.clear();
  }

  withContext(data: Record<string, any>): void {
    for (const [key, value] of Object.entries(data)) {
      this.context.set(key, value);
    }
  }

  child(data: Record<string, any>): Record<string, any> {
    return { ...this.getAll(), ...data };
  }
}

// ============================================
// 主日志类
// ============================================

class Logger {
  private logger: winston.Logger;
  private config: LoggerConfig;
  private context: LoggerContext;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.context = LoggerContext.getInstance();

    this.config = {
      level: (config.level || process.env.LOG_LEVEL as LogLevel || LogLevel.INFO),
      service: config.service || process.env.APP_NAME || 'erp-system',
      environment: config.environment || process.env.NODE_ENV || 'development',
      version: config.version || process.env.APP_VERSION || '1.0.0',
      logDir: config.logDir || process.env.LOG_DIR || './logs',
      maxSize: config.maxSize || process.env.LOG_MAX_SIZE || '100m',
      maxFiles: config.maxFiles || process.env.LOG_MAX_FILES || '30d',
      compress: config.compress !== undefined ? config.compress : process.env.LOG_COMPRESS !== 'false',
      jsonFormat: config.jsonFormat !== undefined ? config.jsonFormat : process.env.NODE_ENV === 'production',
      colorize: config.colorize !== undefined ? config.colorize : process.env.NODE_ENV !== 'production',
      enableConsole: config.enableConsole !== undefined ? config.enableConsole : true,
      enableFile: config.enableFile !== undefined ? config.enableFile : true,
      enableDailyRotate: config.enableDailyRotate !== undefined ? config.enableDailyRotate : true,
      enableErrorFile: config.enableErrorFile !== undefined ? config.enableErrorFile : true,
      enableExceptionHandling: config.enableExceptionHandling !== undefined ? config.enableExceptionHandling : true,
      enableRejectionHandling: config.enableRejectionHandling !== undefined ? config.enableRejectionHandling : true,
      sensitiveFields: config.sensitiveFields || [],
      redactSensitiveData: config.redactSensitiveData !== undefined ? config.redactSensitiveData : true,
    };

    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const levelMap: Record<string, string> = {
      fatal: 'error',
      error: 'error',
      warn: 'warn',
      info: 'info',
      debug: 'debug',
      trace: 'debug',
    };

    const transports = createTransports(this.config);

    const logger = winston.createLogger({
      level: this.config.level,
      levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5,
      },
      defaultMeta: {
        service: this.config.service,
        environment: this.config.environment,
        version: this.config.version,
        pid: process.pid,
        hostname: require('os').hostname(),
      },
      transports,
      exitOnError: false,
      handleExceptions: this.config.enableExceptionHandling,
      handleRejections: this.config.enableRejectionHandling,
    });

    return logger;
  }

  // ============================================
  // 日志方法
  // ============================================

  private log(level: LogLevel, message: string, context: LogContext | Record<string, any> = {}): void {
    const allContext = {
      ...this.context.getAll(),
      ...context,
      timestamp: new Date().toISOString(),
    };

    this.logger.log(level, message, allContext);
  }

  fatal(message: string, context: LogContext | Record<string, any> = {}): void {
    this.log(LogLevel.FATAL, message, context);
  }

  error(message: string, context: LogContext | Record<string, any> = {}): void {
    this.log(LogLevel.ERROR, message, context);
  }

  warn(message: string, context: LogContext | Record<string, any> = {}): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context: LogContext | Record<string, any> = {}): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context: LogContext | Record<string, any> = {}): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  trace(message: string, context: LogContext | Record<string, any> = {}): void {
    this.log(LogLevel.TRACE, message, context);
  }

  // ============================================
  // 子日志器
  // ============================================

  child(context: LogContext | Record<string, any>): Logger {
    const childLogger = new Logger(this.config);
    childLogger.context.withContext({
      ...this.context.getAll(),
      ...context,
    });
    return childLogger;
  }

  // ============================================
  // 上下文管理
  // ============================================

  setContext(key: string, value: any): void {
    this.context.set(key, value);
  }

  getContext(key: string): any {
    return this.context.get(key);
  }

  withContext(data: Record<string, any>): Logger {
    const newLogger = new Logger(this.config);
    newLogger.context.withContext({
      ...this.context.getAll(),
      ...data,
    });
    return newLogger;
  }

  // ============================================
  // 配置管理
  // ============================================

  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    this.logger = this.createLogger();
    this.info('日志配置已更新', { newConfig: this.config });
  }

  // ============================================
  // 工具方法
  // ============================================

  /**
   * 记录API请求
   */
  logApiRequest(req: any, res: any, responseTime: number): void {
    const status = res.statusCode || res.status;
    const isError = status >= 400;
    const level = isError ? LogLevel.ERROR : LogLevel.INFO;

    const logData = {
      type: 'api_request',
      method: req.method,
      url: req.url,
      status,
      responseTime: `${responseTime}ms`,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent'],
      userId: req.user?.id || 'anonymous',
      traceId: req.traceId,
    };

    this.log(level, `API ${req.method} ${req.url} ${status}`, logData);
  }

  /**
   * 记录数据库操作
   */
  logDbOperation(operation: string, collection: string, data: any = {}): void {
    this.debug(`数据库操作: ${operation}`, {
      type: 'db_operation',
      operation,
      collection,
      ...data,
    });
  }

  /**
   * 记录业务事件
   */
  logBusinessEvent(event: string, data: any = {}): void {
    this.info(`业务事件: ${event}`, {
      type: 'business_event',
      event,
      ...data,
    });
  }

  /**
   * 记录安全事件
   */
  logSecurityEvent(event: string, data: any = {}): void {
    this.warn(`安全事件: ${event}`, {
      type: 'security_event',
      event,
      ...data,
    });
  }

  /**
   * 记录性能指标
   */
  logPerformance(metric: string, value: number, data: any = {}): void {
    this.debug(`性能指标: ${metric}`, {
      type: 'performance_metric',
      metric,
      value,
      ...data,
    });
  }
}

// ============================================
// 默认实例
// ============================================

export const logger = new Logger();

// ============================================
// 便捷函数
// ============================================

export function createLogger(context: string, config?: Partial<LoggerConfig>): Logger {
  return new Logger(config).child({ context });
}

export function getLogger(): Logger {
  return logger;
}

// ============================================
// 日志工具
// ============================================

export const logUtils = {
  /**
   * 记录启动日志
   */
  logStartup(appName: string, version: string, port: number): void {
    logger.info(`🚀 ${appName} v${version} 启动成功`, {
      port,
      environment: process.env.NODE_ENV,
      pid: process.pid,
      nodeVersion: process.version,
    });
  },

  /**
   * 记录关闭日志
   */
  logShutdown(reason: string = 'SIGTERM'): void {
    logger.info(`📦 服务正在关闭`, { reason });
  },

  /**
   * 记录健康检查
   */
  logHealthCheck(status: 'healthy' | 'unhealthy', details?: any): void {
    if (status === 'healthy') {
      logger.debug('✅ 健康检查通过', details);
    } else {
      logger.warn('❌ 健康检查失败', details);
    }
  },

  /**
   * 记录配置加载
   */
  logConfigLoad(configName: string, status: 'success' | 'failed', error?: string): void {
    if (status === 'success') {
      logger.info(`配置加载成功: ${configName}`);
    } else {
      logger.error(`配置加载失败: ${configName}`, { error });
    }
  },
};

export default logger;