/**
 * @file Config/morgan.config.ts
 * HTTP 请求日志配置 - 完整的API访问日志记录
 */

import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { createWriteStream, WriteStream } from 'fs';
import { logger } from './winston.config';
import crypto from 'crypto';

// ============================================
// 类型定义
// ============================================

export interface MorganConfigOptions {
  /** 日志格式 */
  format?: 'dev' | 'combined' | 'common' | 'short' | 'tiny' | 'json' | 'detailed';
  /** 日志输出目录 */
  logDir?: string;
  /** 是否启用控制台输出 */
  consoleOutput?: boolean;
  /** 是否记录请求体 */
  logRequestBody?: boolean;
  /** 是否记录响应体 */
  logResponseBody?: boolean;
  /** 是否记录敏感字段 */
  logSensitiveFields?: boolean;
  /** 敏感字段列表 */
  sensitiveFields?: string[];
  /** 是否启用 TraceID */
  enableTraceId?: boolean;
  /** 是否记录用户ID */
  logUserId?: boolean;
  /** 环境 */
  env?: 'development' | 'test' | 'production' | 'staging';
}

export interface RequestLogData {
  traceId: string;
  timestamp: string;
  method: string;
  url: string;
  status: number;
  responseTime: number;
  contentLength: string | number;
  userAgent: string;
  referrer: string;
  remoteAddr: string;
  userId?: string | number;
  requestBody?: any;
  responseBody?: any;
  query?: any;
  params?: any;
  headers?: Record<string, string>;
}

// ============================================
// TraceID 生成器
// ============================================

function generateTraceId(): string {
  return `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
}

// ============================================
// 敏感信息过滤
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
];

function filterSensitiveData(data: any, sensitiveFields: string[]): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const result = Array.isArray(data) ? [...data] : { ...data };
  const allSensitive = [...defaultSensitiveFields, ...sensitiveFields];

  for (const key of Object.keys(result)) {
    const lowerKey = key.toLowerCase();
    if (allSensitive.some(f => lowerKey.includes(f.toLowerCase()))) {
      result[key] = '***FILTERED***';
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = filterSensitiveData(result[key], sensitiveFields);
    }
  }

  return result;
}

// ============================================
// 日志格式构建
// ============================================

function buildLogFormat(options: MorganConfigOptions): morgan.FormatFn {
  const {
    logRequestBody = false,
    logResponseBody = false,
    logSensitiveFields = false,
    sensitiveFields = [],
    enableTraceId = true,
    logUserId = true,
    env = 'development',
  } = options;

  return (tokens, req: Request, res: Response): string => {
    const status = parseInt(tokens.status(req, res) || '0', 10);
    const responseTime = parseFloat(tokens['response-time'](req, res) || '0');
    const traceId = (req as any).traceId || generateTraceId();
    const userId = (req as any).user?.id || (req as any).user?.userId || null;

    // 保存 traceId 到请求对象
    (req as any).traceId = traceId;
    (req as any).startTime = (req as any).startTime || Date.now();

    // 构建日志数据
    const logData: RequestLogData = {
      traceId,
      timestamp: new Date().toISOString(),
      method: tokens.method(req, res) || 'UNKNOWN',
      url: tokens.url(req, res) || 'UNKNOWN',
      status,
      responseTime,
      contentLength: tokens.res(req, res, 'content-length') || 0,
      userAgent: tokens['user-agent'](req, res) || '',
      referrer: tokens.referrer(req, res) || '',
      remoteAddr: tokens['remote-addr'](req, res) || '',
    };

    // 记录用户ID
    if (logUserId && userId) {
      logData.userId = userId;
    }

    // 记录请求体（开发环境或配置启用）
    if (logRequestBody && (env === 'development' || options.logRequestBody)) {
      try {
        const body = (req as any).body;
        if (body && typeof body === 'object') {
          logData.requestBody = logSensitiveFields 
            ? body 
            : filterSensitiveData(body, sensitiveFields);
        }
      } catch (error) {
        // 忽略解析错误
      }
    }

    // 记录查询参数
    if (env === 'development' && req.query && Object.keys(req.query).length > 0) {
      logData.query = logSensitiveFields 
        ? req.query 
        : filterSensitiveData(req.query, sensitiveFields);
    }

    // 记录路径参数
    if (env === 'development' && req.params && Object.keys(req.params).length > 0) {
      logData.params = req.params;
    }

    // 输出到 Winston
    const logLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    
    const logMeta: any = {
      type: 'http_request',
      traceId,
      ...logData,
    };

    if (logLevel === 'error') {
      logger.error(`HTTP ${status}: ${req.method} ${req.url}`, logMeta);
    } else if (logLevel === 'warn') {
      logger.warn(`HTTP ${status}: ${req.method} ${req.url}`, logMeta);
    } else {
      logger.info(`HTTP ${status}: ${req.method} ${req.url}`, logMeta);
    }

    // 返回 JSON 字符串（用于文件输出）
    return JSON.stringify(logData);
  };
}

// ============================================
// 创建日志流
// ============================================

function createLogStreams(logDir: string): {
  accessStream: WriteStream;
  errorStream: WriteStream;
  jsonStream: WriteStream;
} {
  // 确保目录存在
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return {
    accessStream: createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' }),
    errorStream: createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' }),
    jsonStream: createWriteStream(path.join(logDir, 'access.json.log'), { flags: 'a' }),
  };
}

// ============================================
// 主配置函数
// ============================================

export function createMorganMiddleware(options: MorganConfigOptions = {}) {
  const {
    format = 'detailed',
    logDir = process.env.LOG_DIR || './logs',
    consoleOutput = process.env.NODE_ENV !== 'production',
    logRequestBody = process.env.NODE_ENV === 'development',
    logResponseBody = false,
    logSensitiveFields = false,
    sensitiveFields = [],
    enableTraceId = true,
    logUserId = true,
    env = (process.env.NODE_ENV as any) || 'development',
  } = options;

  const streams = createLogStreams(logDir);

  // 构建日志格式
  const logFormat = buildLogFormat({
    logRequestBody,
    logResponseBody,
    logSensitiveFields,
    sensitiveFields,
    enableTraceId,
    logUserId,
    env,
  });

  // 创建 morgan 实例
  const morganInstance = morgan(logFormat, {
    skip: (req: Request, res: Response) => {
      // 跳过健康检查等路径
      const skipPaths = ['/health', '/metrics', '/favicon.ico'];
      return skipPaths.includes(req.path);
    },
  });

  // 创建错误日志专用中间件
  const errorMorgan = morgan(logFormat, {
    skip: (req: Request, res: Response) => res.statusCode < 400,
    stream: streams.errorStream,
  });

  // 创建 JSON 日志中间件
  const jsonMorgan = morgan(logFormat, {
    skip: (req: Request, res: Response) => res.statusCode < 200 || res.statusCode > 299,
    stream: streams.jsonStream,
  });

  // 组合中间件
  return (req: Request, res: Response, next: NextFunction) => {
    // 生成 TraceID
    if (enableTraceId) {
      const headerTraceId = req.headers['x-trace-id'] as string;
      (req as any).traceId = headerTraceId || generateTraceId();
      
      // 设置响应头
      res.setHeader('X-Trace-Id', (req as any).traceId);
    }

    // 记录开始时间
    (req as any).startTime = Date.now();

    // 执行 morgan
    morganInstance(req, res, (err: any) => {
      if (err) {
        logger.error('Morgan 中间件错误', { error: err.message });
        return next(err);
      }

      // 如果是错误请求，记录错误日志
      if (res.statusCode >= 400) {
        errorMorgan(req, res, () => {});
      }

      // 如果是成功请求，记录 JSON 日志
      if (res.statusCode >= 200 && res.statusCode < 300) {
        jsonMorgan(req, res, () => {});
      }

      next();
    });
  };
}

// ============================================
// 日志工具函数
// ============================================

export const morganUtils = {
  /**
   * 获取当前请求的 TraceID
   */
  getTraceId(req: Request): string | undefined {
    return (req as any).traceId;
  },

  /**
   * 获取请求开始时间
   */
  getStartTime(req: Request): number | undefined {
    return (req as any).startTime;
  },

  /**
   * 计算请求耗时
   */
  getResponseTime(req: Request): number | undefined {
    const startTime = (req as any).startTime;
    if (startTime) {
      return Date.now() - startTime;
    }
    return undefined;
  },

  /**
   * 设置 TraceID 到响应头
   */
  setTraceIdHeader(res: Response, traceId: string): void {
    res.setHeader('X-Trace-Id', traceId);
  },
};

// ============================================
// 默认配置
// ============================================

export const morganConfig = {
  logDir: process.env.LOG_DIR || './logs',
  accessLogPath: path.join(process.env.LOG_DIR || './logs', 'access.log'),
  errorLogPath: path.join(process.env.LOG_DIR || './logs', 'error.log'),
  jsonLogPath: path.join(process.env.LOG_DIR || './logs', 'access.json.log'),
  defaultFormat: process.env.NODE_ENV === 'production' ? 'json' : 'dev',
  sensitiveFields: [...defaultSensitiveFields],
};

// 导出默认中间件
export default createMorganMiddleware;