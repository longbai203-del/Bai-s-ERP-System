/**
 * @file Config/winston.config.ts
 * Winston 日志系统配置 - 生产级结构化日志
 * 完整实现：移除所有 TODO/FIXME，实现完整的日志分级、JSON结构化输出、多文件存储、日志脱敏
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

export const LOG_LEVEL_PRIORITY = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

export interface LogContext {
  service?: string;
  environment?: string;
  version?: string;
  traceId?: string;
  userId?: string | number;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
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
  enablePerformanceMonitoring: boolean;
  enableTraceLogging: boolean;
}

// ============================================
// 敏感数据脱敏
// ============================================

const defaultSensitiveFields = [
  'password', 'token', 'secret', 'key', 'authorization',
  'cookie', 'set-cookie', 'csrf', 'x-csrf-token',
  'api-key', 'api_key', 'access_token', 'refresh_token',
  'credit_card', 'card_number', 'cvv', 'ssn',
  'social_security', 'bank_account', 'routing_number',
  'private_key', 'certificate', 'passphrase',
  'mysql_password', 'db_password', 'redis_password',
  'jwt_secret', 'session_secret',
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
// 自定义格式化
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
        if (info.context) {
          info.context = redactSensitiveData(info.context, config.sensitiveFields);
        }
        return info;
      })()
    );
  }

  // 性能监控
  if (config.enablePerformanceMonitoring) {
    formats.push(
      winston.format((info) => {
        if (info.duration) {
          info.durationMs = info.duration;
        }
        if (info.memory) {
          info.memoryUsageMB = info.memory;
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
        replacer: (key, value) => {
          // 处理 BigInt
          if (typeof value === 'bigint') {
            return value.toString();
          }
          return value;
        },
      })
    );
  } else {
    // 可读格式
    formats.push(
      winston.format.printf(({ timestamp, level, message, service, context, traceId, ...metadata }) => {
        const contextStr = context ? `[${context}]` : '';
        const traceStr = traceId ? `[${traceId}]` : '';
        const metaStr = Object.keys(metadata).length > 0 
          ? ` ${JSON.stringify(metadata)}` 
          : '';
        return `${timestamp} ${level} ${service} ${contextStr}${traceStr} ${message}${metaStr}`;
      })
    );

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
        handleExceptions: config.enableExceptionHandling,
        handleRejections: config.enableRejectionHandling,
      })
    );
  }

  // 确保日志目录存在
  if (config.enableFile || config.enableDailyRotate || config.enableErrorFile) {
    if (!fs.existsSync(config.logDir)) {
      fs.mkdirSync(config.logDir, { recursive: true });
    }
  }

  // 文件传输 - 按天轮转
  if (config.enableFile && config.enableDailyRotate) {
    const rotateTransport = new winston.transports.DailyRotateFile({
      filename: path.join(config.logDir, `${config.service}-%DATE%.log`),
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
      handleExceptions: config.enableExceptionHandling,
      handleRejections: config.enableRejectionHandling,
    });

    rotateTransport.on('rotate', (oldFilename, newFilename) => {
      console.log(`[Winston] 日志轮转: ${oldFilename} -> ${newFilename}`);
    });

    rotateTransport.on('error', (error) => {
      console.error('[Winston] 日志轮转错误:', error);
    });

    transports.push(rotateTransport);
  }

  // 普通文件传输
  if (config.enableFile && !config.enableDailyRotate) {
    transports.push(
      new winston.transports.File({
        filename: path.join(config.logDir, `${config.service}.log`),
        format: createCustomFormat({
          ...config,
          jsonFormat: true,
          colorize: false,
        }),
        level: config.level,
        maxsize: 100 * 1024 * 1024,
        maxFiles: 10,
        handleExceptions: config.enableExceptionHandling,
        handleRejections: config.enableRejectionHandling,
      })
    );
  }

  // 错误日志单独文件
  if (config.enableErrorFile) {
    transports.push(
      new winston.transports.File({
        filename: path.join(config.logDir, `${config.service}-error.log`),
        format: createCustomFormat({
          ...config,
          jsonFormat: true,
          colorize: false,
        }),
        level: LogLevel.ERROR,
        maxsize: 50 * 1024 * 1024,
        maxFiles: 10,
        handleExceptions: config.enableExceptionHandling,
        handleRejections: config.enableRejectionHandling,
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
  private traceMap: Map<string, any> = new Map();

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

  // TraceID 管理
  setTrace(traceId: string, data: any): void {
    this.traceMap.set(traceId, data);
  }

  getTrace(traceId: string): any {
    return this.traceMap.get(traceId);
  }

  clearTrace(traceId: string): void {
    this.traceMap.delete(traceId);
  }

  getAllTraces(): Map<string, any> {
    return this.traceMap;
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
      enablePerformanceMonitoring: config.enablePerformanceMonitoring !== undefined ? config.enablePerformanceMonitoring : true,
      enableTraceLogging: config.enableTraceLogging !== undefined ? config.enableTraceLogging : true,
    };

    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const transports = createTransports(this.config);

    const logger = winston.createLogger({
      level: this.config.level,
      levels: LOG_LEVEL_PRIORITY,
      defaultMeta: {
        service: this.config.service,
        environment: this.config.environment,
        version: this.config.version,
        pid: process.pid,
        hostname: require('os').hostname(),
        nodeVersion: process.version,
        timestamp: new Date().toISOString(),
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
    };

    // 添加性能监控
    if (this.config.enablePerformanceMonitoring) {
      const memUsage = process.memoryUsage();
      allContext.memoryUsage = {
        rss: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
        external: Math.round(memUsage.external / 1024 / 1024 * 100) / 100,
      };
      allContext.cpuUsage = process.cpuUsage();
      allContext.uptime = process.uptime();
    }

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
  // 业务日志方法
  // ============================================

  /**
   * 记录 API 请求日志
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
      traceId: req.traceId || this.context.get('traceId'),
      query: req.query,
      params: req.params,
    };

    // 过滤敏感查询参数
    if (logData.query) {
      logData.query = redactSensitiveData(logData.query, this.config.sensitiveFields);
    }

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

  /**
   * 记录用户操作
   */
  logUserAction(userId: string | number, action: string, data: any = {}): void {
    this.info(`用户操作: ${action}`, {
      type: 'user_action',
      userId,
      action,
      ...data,
    });
  }

  /**
   * 记录系统启动
   */
  logStartup(): void {
    this.info(`🚀 ${this.config.service} v${this.config.version} 启动成功`, {
      type: 'system_startup',
      environment: this.config.environment,
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: process.memoryUsage(),
    });
  }

  /**
   * 记录系统关闭
   */
  logShutdown(reason: string = 'SIGTERM'): void {
    this.info(`📦 服务正在关闭`, {
      type: 'system_shutdown',
      reason,
      uptime: process.uptime(),
    });
  }

  /**
   * 记录健康检查
   */
  logHealthCheck(status: 'healthy' | 'unhealthy', details?: any): void {
    if (status === 'healthy') {
      this.debug('✅ 健康检查通过', { type: 'health_check', status, details });
    } else {
      this.warn('❌ 健康检查失败', { type: 'health_check', status, details });
    }
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
   * 检查日志级别是否启用
   */
  isLevelEnabled(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[logger.getConfig().level];
  },

  /**
   * 获取当前日志级别
   */
  getCurrentLevel(): LogLevel {
    return logger.getConfig().level;
  },

  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): void {
    logger.updateConfig({ level });
  },

  /**
   * 获取所有日志级别
   */
  getLevels(): LogLevel[] {
    return Object.values(LogLevel);
  },

  /**
   * 格式化错误对象
   */
  formatError(error: Error): Record<string, any> {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...(error as any),
    };
  },
};

export default logger;