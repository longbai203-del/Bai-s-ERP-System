/**
 * Winston 日志配置文件
 * 提供完整的日志记录、分级输出、多传输通道支持
 */

import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

export interface WinstonConfig {
  level: LogLevel;
  format: winston.Logform.Format;
  transports: winston.transport[];
  exceptionHandlers?: winston.transport[];
  rejectionHandlers?: winston.transport[];
  exitOnError: boolean;
}

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    const serviceTag = service ? `[${service}]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${serviceTag} ${level.toUpperCase()}: ${message}${metaStr}`;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    const serviceTag = service ? `[${service}]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${serviceTag} ${level.toUpperCase()}: ${message}${metaStr}`;
  })
);

export function createLogger(service = 'app'): winston.Logger {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const logLevel = (process.env.LOG_LEVEL || 'info') as LogLevel;

  const transports: winston.transport[] = [];

  transports.push(
    new winston.transports.Console({
      level: isDevelopment ? LogLevel.DEBUG : LogLevel.INFO,
      format: isDevelopment ? consoleFormat : customFormat,
      handleExceptions: true,
    })
  );

  if (!isDevelopment) {
    transports.push(
      new winston.transports.File({
        level: LogLevel.ERROR,
        filename: path.join(logDir, 'error.log'),
        format: customFormat,
        maxsize: 50 * 1024 * 1024,
        maxFiles: 5,
        tailable: true,
        handleExceptions: true,
      })
    );
  }

  transports.push(
    new winston.transports.File({
      level: logLevel,
      filename: path.join(logDir, `${service}.log`),
      format: customFormat,
      maxsize: 100 * 1024 * 1024,
      maxFiles: 10,
      tailable: true,
    })
  );

  transports.push(
    new winston.transports.File({
      level: LogLevel.HTTP,
      filename: path.join(logDir, 'access.log'),
      format: customFormat,
      maxsize: 100 * 1024 * 1024,
      maxFiles: 10,
    })
  );

  const logger = winston.createLogger({
    level: logLevel,
    defaultMeta: { service },
    format: customFormat,
    transports,
    exceptionHandlers: [
      new winston.transports.File({
        filename: path.join(logDir, 'exceptions.log'),
        format: customFormat,
        maxsize: 50 * 1024 * 1024,
        maxFiles: 5,
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: path.join(logDir, 'rejections.log'),
        format: customFormat,
        maxsize: 50 * 1024 * 1024,
        maxFiles: 5,
      }),
    ],
    exitOnError: false,
  });

  return logger;
}

export const appLogger = createLogger('app');
export const accessLogger = createLogger('access');
export const errorLogger = createLogger('error');
export const dbLogger = createLogger('database');

export class LoggerUtils {
  private static instances: Map<string, winston.Logger> = new Map();

  public static getLogger(name = 'app'): winston.Logger {
    if (!this.instances.has(name)) {
      this.instances.set(name, createLogger(name));
    }
    return this.instances.get(name)!;
  }

  public static startTimer(label: string): () => void {
    const start = Date.now();
    const logger = this.getLogger('performance');

    return () => {
      const duration = Date.now() - start;
      logger.info(`${label} completed in ${duration}ms`);
    };
  }

  public static logRequest(req: any, res: any, duration: number): void {
    const logger = this.getLogger('access');
    logger.http({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id || 'anonymous',
    });
  }

  public static logQuery(query: string, params: any[], duration: number): void {
    const logger = this.getLogger('database');
    logger.debug({
      query: query.substring(0, 200),
      params: params?.slice(0, 10),
      duration: `${duration}ms`,
    });
  }
}

export default {
  createLogger,
  appLogger,
  accessLogger,
  errorLogger,
  dbLogger,
  LoggerUtils,
  LogLevel,
};
