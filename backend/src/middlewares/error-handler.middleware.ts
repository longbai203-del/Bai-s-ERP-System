/**
 * @file src/middlewares/error-handler.middleware.ts
 * 全局异常处理中间件 - 统一错误捕获与响应
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../../Config/winston.config';
import { config } from '../../Config';

// 自定义错误类
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 数据库错误类
export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

// 验证错误类
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

// 认证错误类
export class AuthError extends AppError {
  constructor(message: string = '认证失败', code: string = 'AUTH_ERROR') {
    super(message, 401, code);
  }
}

// 权限错误类
export class ForbiddenError extends AppError {
  constructor(message: string = '权限不足') {
    super(message, 403, 'FORBIDDEN');
  }
}

// 资源未找到错误
export class NotFoundError extends AppError {
  constructor(resource: string = '资源') {
    super(`${resource}不存在`, 404, 'NOT_FOUND');
  }
}

// 业务逻辑错误
export class BusinessError extends AppError {
  constructor(message: string, code: string = 'BUSINESS_ERROR') {
    super(message, 400, code);
  }
}

// 速率限制错误
export class RateLimitError extends AppError {
  constructor(message: string = '请求过于频繁，请稍后再试') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

/**
 * 错误码映射表
 */
const ERROR_CODE_MAP: Record<string, { status: number; message: string }> = {
  'JWT_TOKEN_EXPIRED': { status: 401, message: '令牌已过期，请重新登录' },
  'JWT_INVALID_TOKEN': { status: 401, message: '无效的令牌' },
  'REFRESH_TOKEN_EXPIRED': { status: 401, message: '刷新令牌已过期，请重新登录' },
  'REFRESH_TOKEN_INVALID': { status: 401, message: '无效的刷新令牌' },
  'DUPLICATE_ENTRY': { status: 409, message: '数据已存在' },
  'FOREIGN_KEY_VIOLATION': { status: 400, message: '关联数据不存在' },
  'RECORD_NOT_FOUND': { status: 404, message: '记录不存在' },
  'VALIDATION_ERROR': { status: 400, message: '数据验证失败' },
  'DATABASE_ERROR': { status: 500, message: '数据库操作失败' },
  'NETWORK_ERROR': { status: 503, message: '网络服务异常' },
  'TIMEOUT_ERROR': { status: 504, message: '请求超时' },
};

/**
 * 全局错误处理中间件
 */
export function errorHandlerMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // 默认错误信息
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = '服务器内部错误';
  let details = undefined;
  let stack = undefined;

  // 处理 AppError 实例
  if (err instanceof AppError) {
    statusCode = err.statusCode || 500;
    code = err.code || 'INTERNAL_ERROR';
    message = err.message;
    details = err.details;
    stack = config.debug ? err.stack : undefined;
  } 
  // 处理标准 Error
  else if (err instanceof Error) {
    message = err.message;
    stack = config.debug ? err.stack : undefined;

    // 尝试通过错误码映射获取标准错误信息
    const mappedError = ERROR_CODE_MAP[err.message];
    if (mappedError) {
      statusCode = mappedError.status;
      code = err.message;
      message = mappedError.message;
    }

    // 处理数据库特定错误
    if (err.message.includes('ER_DUP_ENTRY') || err.message.includes('duplicate')) {
      statusCode = 409;
      code = 'DUPLICATE_ENTRY';
      message = '数据已存在，请检查输入';
    } else if (err.message.includes('ER_NO_REFERENCED_ROW')) {
      statusCode = 400;
      code = 'FOREIGN_KEY_VIOLATION';
      message = '关联的数据不存在';
    } else if (err.message.includes('ECONNREFUSED')) {
      statusCode = 503;
      code = 'SERVICE_UNAVAILABLE';
      message = '服务暂时不可用，请稍后重试';
    }
  } 
  // 处理未知错误
  else {
    message = '未知错误';
    stack = config.debug ? String(err) : undefined;
  }

  // 记录错误日志
  const logData = {
    path: req.path,
    method: req.method,
    statusCode,
    code,
    message,
    ip: req.ip || req.connection?.remoteAddress,
    userId: (req as any).user?.id || 'anonymous',
    userAgent: req.headers['user-agent'],
    query: req.query,
    body: req.body,
  };

  if (statusCode >= 500) {
    logger.error(`服务器错误: ${message}`, {
      ...logData,
      stack,
    });
  } else if (statusCode >= 400) {
    logger.warn(`客户端错误: ${message}`, logData);
  } else {
    logger.info(`请求错误: ${message}`, logData);
  }

  // 构建响应
  const response = {
    success: false,
    code,
    message,
    details,
    timestamp: new Date().toISOString(),
    path: req.path,
    ...(config.debug && { stack }),
  };

  // 针对特定错误码添加额外信息
  if (statusCode === 401) {
    response['hint'] = '请携带有效的认证令牌';
  } else if (statusCode === 403) {
    response['hint'] = '请联系管理员获取相关权限';
  } else if (statusCode === 429) {
    response['hint'] = '请稍后重试或联系管理员提升配额';
  }

  res.status(statusCode).json(response);
}

/**
 * 404错误处理中间件
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error = new NotFoundError(`路径 ${req.path} 不存在`);
  next(error);
}

/**
 * 异步函数错误包装器
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 错误日志工具
 */
export const errorUtils = {
  /**
   * 捕获并记录错误
   */
  captureError: (error: Error | AppError, context: any = {}) => {
    logger.error(`捕获错误: ${error.message}`, {
      errorName: error.name,
      stack: error.stack,
      ...context,
    });
  },

  /**
   * 判断是否为可操作错误
   */
  isOperationalError: (error: Error): boolean => {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  },

  /**
   * 获取错误状态码
   */
  getErrorStatus: (error: Error | AppError): number => {
    if (error instanceof AppError) {
      return error.statusCode || 500;
    }
    return 500;
  },

  /**
   * 获取错误代码
   */
  getErrorCode: (error: Error | AppError): string => {
    if (error instanceof AppError) {
      return error.code || 'INTERNAL_ERROR';
    }
    return 'INTERNAL_ERROR';
  },

  /**
   * 创建业务错误链
   */
  createErrorChain: (errors: Array<{ message: string; code?: string }>) => {
    return errors.map(e => ({
      message: e.message,
      code: e.code || 'BUSINESS_ERROR',
    }));
  },
};

export default errorHandlerMiddleware;