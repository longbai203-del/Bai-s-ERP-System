/**
 * Response Utility - 统一响应格式
 * 提供统一的 API 响应格式，包含成功、错误、分页等响应包装器
 */

import { Response } from 'express';

// ============================================
// 类型定义
// ============================================

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  errors?: any[];
  timestamp: string;
  path?: string;
  method?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse extends ApiResponse {
  error: {
    code: string;
    details?: any;
  };
}

// ============================================
// HTTP 状态码常量
// ============================================

export const HttpStatus = {
  // 成功
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 重定向
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // 客户端错误
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 服务器错误
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

// ============================================
// 响应构建器
// ============================================

export class ResponseBuilder<T = any> {
  private response: Partial<ApiResponse<T>> = {};

  constructor() {
    this.response.timestamp = new Date().toISOString();
  }

  /**
   * 设置状态码
   */
  setCode(code: number): this {
    this.response.code = code;
    return this;
  }

  /**
   * 设置消息
   */
  setMessage(message: string): this {
    this.response.message = message;
    return this;
  }

  /**
   * 设置数据
   */
  setData(data: T): this {
    this.response.data = data;
    return this;
  }

  /**
   * 设置错误
   */
  setErrors(errors: any[]): this {
    this.response.errors = errors;
    return this;
  }

  /**
   * 设置请求路径
   */
  setPath(path: string): this {
    this.response.path = path;
    return this;
  }

  /**
   * 设置请求方法
   */
  setMethod(method: string): this {
    this.response.method = method;
    return this;
  }

  /**
   * 构建响应对象
   */
  build(): ApiResponse<T> {
    return this.response as ApiResponse<T>;
  }

  /**
   * 发送响应
   */
  send(res: Response): Response {
    return res.status(this.response.code || 200).json(this.build());
  }
}

// ============================================
// 成功响应
// ============================================

/**
 * 成功响应 (200)
 */
export const success = <T>(
  res: Response,
  data?: T,
  message: string = 'Success',
  code: number = HttpStatus.OK
): Response => {
  return new ResponseBuilder<T>()
    .setCode(code)
    .setMessage(message)
    .setData(data)
    .send(res);
};

/**
 * 创建成功响应 (201)
 */
export const created = <T>(
  res: Response,
  data?: T,
  message: string = 'Created successfully'
): Response => {
  return new ResponseBuilder<T>()
    .setCode(HttpStatus.CREATED)
    .setMessage(message)
    .setData(data)
    .send(res);
};

/**
 * 无内容响应 (204)
 */
export const noContent = (
  res: Response,
  message: string = 'No content'
): Response => {
  return new ResponseBuilder()
    .setCode(HttpStatus.NO_CONTENT)
    .setMessage(message)
    .send(res);
};

// ============================================
// 分页响应
// ============================================

/**
 * 分页响应
 */
export const paginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Success'
): Response => {
  const totalPages = Math.ceil(total / limit);

  const response: PaginatedResponse<T> = {
    code: HttpStatus.OK,
    message,
    data,
    timestamp: new Date().toISOString(),
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };

  return res.status(HttpStatus.OK).json(response);
};

// ============================================
// 错误响应
// ============================================

/**
 * 错误响应
 */
export const error = (
  res: Response,
  message: string = 'Internal server error',
  code: number = HttpStatus.INTERNAL_SERVER_ERROR,
  errors?: any[]
): Response => {
  return new ResponseBuilder()
    .setCode(code)
    .setMessage(message)
    .setErrors(errors)
    .send(res);
};

/**
 * 错误响应（带错误码）
 */
export const errorWithCode = (
  res: Response,
  errorCode: string,
  message: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: any
): Response => {
  const response: ErrorResponse = {
    code: statusCode,
    message,
    timestamp: new Date().toISOString(),
    error: {
      code: errorCode,
      details
    }
  };

  return res.status(statusCode).json(response);
};

// ============================================
// 特定 HTTP 错误响应
// ============================================

/**
 * 400 Bad Request
 */
export const badRequest = (
  res: Response,
  message: string = 'Bad request',
  errors?: any[]
): Response => {
  return error(res, message, HttpStatus.BAD_REQUEST, errors);
};

/**
 * 401 Unauthorized
 */
export const unauthorized = (
  res: Response,
  message: string = 'Unauthorized'
): Response => {
  return error(res, message, HttpStatus.UNAUTHORIZED);
};

/**
 * 403 Forbidden
 */
export const forbidden = (
  res: Response,
  message: string = 'Forbidden'
): Response => {
  return error(res, message, HttpStatus.FORBIDDEN);
};

/**
 * 404 Not Found
 */
export const notFound = (
  res: Response,
  message: string = 'Resource not found'
): Response => {
  return error(res, message, HttpStatus.NOT_FOUND);
};

/**
 * 409 Conflict
 */
export const conflict = (
  res: Response,
  message: string = 'Conflict',
  errors?: any[]
): Response => {
  return error(res, message, HttpStatus.CONFLICT, errors);
};

/**
 * 422 Unprocessable Entity
 */
export const unprocessable = (
  res: Response,
  message: string = 'Unprocessable entity',
  errors?: any[]
): Response => {
  return error(res, message, HttpStatus.UNPROCESSABLE_ENTITY, errors);
};

/**
 * 429 Too Many Requests
 */
export const tooManyRequests = (
  res: Response,
  message: string = 'Too many requests'
): Response => {
  return error(res, message, HttpStatus.TOO_MANY_REQUESTS);
};

/**
 * 500 Internal Server Error
 */
export const internalError = (
  res: Response,
  message: string = 'Internal server error'
): Response => {
  return error(res, message, HttpStatus.INTERNAL_SERVER_ERROR);
};

// ============================================
// 响应工具类
// ============================================

export class ApiResponseHandler {
  /**
   * 处理响应（根据结果自动选择成功或错误）
   */
  static handle<T>(
    res: Response,
    result: { success: boolean; data?: T; message?: string; error?: any }
  ): Response {
    if (result.success) {
      return success(res, result.data, result.message);
    } else {
      return badRequest(res, result.message || 'Operation failed', result.error);
    }
  }

  /**
   * 处理 Promise 响应
   */
  static async handlePromise<T>(
    res: Response,
    promise: Promise<T>,
    successMessage: string = 'Success'
  ): Promise<Response> {
    try {
      const data = await promise;
      return success(res, data, successMessage);
    } catch (err: any) {
      const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      return error(res, err.message || 'Internal server error', statusCode);
    }
  }

  /**
   * 创建成功响应（链式调用）
   */
  static success<T>(data?: T, message: string = 'Success'): ApiResponse<T> {
    return {
      code: HttpStatus.OK,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 创建错误响应（链式调用）
   */
  static error(message: string = 'Error', code: number = HttpStatus.INTERNAL_SERVER_ERROR): ApiResponse {
    return {
      code,
      message,
      timestamp: new Date().toISOString()
    };
  }
}

// ============================================
// 默认导出
// ============================================

export default {
  // 状态码
  HttpStatus,

  // 成功响应
  success,
  created,
  noContent,
  paginated,

  // 错误响应
  error,
  errorWithCode,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessable,
  tooManyRequests,
  internalError,

  // 工具类
  ResponseBuilder,
  ApiResponseHandler
};