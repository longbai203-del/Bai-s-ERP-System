/**
 * @file src/middlewares/validation.middleware.ts
 * 参数校验中间件 - 请求数据验证与清洗
 */

import { Request, Response, NextFunction } from 'express';
import { AnySchema, ValidationError } from 'joi';
import { logger } from '../../Config/winston.config';

// 校验选项接口
export interface ValidationOptions {
  /** 是否在验证失败时返回详细错误 */
  detailedErrors?: boolean;
  /** 是否剥离未知字段 */
  stripUnknown?: boolean;
  /** 是否进行类型转换 */
  convert?: boolean;
  /** 是否允许未知字段 */
  allowUnknown?: boolean;
}

// 扩展 Request 类型
declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
      validatedHeaders?: any;
    }
  }
}

/**
 * 通用验证器类
 */
export class Validator {
  /**
   * 验证请求体
   */
  static validateBody(schema: AnySchema, options: ValidationOptions = {}) {
    const {
      detailedErrors = true,
      stripUnknown = true,
      convert = true,
      allowUnknown = false,
    } = options;

    return (req: Request, res: Response, next: NextFunction): void => {
      const result = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown,
        convert,
        allowUnknown,
      });

      if (result.error) {
        const errors = Validator.formatErrors(result.error, detailedErrors);
        logger.warn('请求体验证失败', {
          path: req.path,
          method: req.method,
          errors,
          body: req.body,
        });

        res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: '请求参数验证失败',
          errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      req.validatedBody = result.value;
      next();
    };
  }

  /**
   * 验证查询参数
   */
  static validateQuery(schema: AnySchema, options: ValidationOptions = {}) {
    const {
      detailedErrors = true,
      stripUnknown = true,
      convert = true,
      allowUnknown = false,
    } = options;

    return (req: Request, res: Response, next: NextFunction): void => {
      const result = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown,
        convert,
        allowUnknown,
      });

      if (result.error) {
        const errors = Validator.formatErrors(result.error, detailedErrors);
        logger.warn('查询参数验证失败', {
          path: req.path,
          method: req.method,
          errors,
          query: req.query,
        });

        res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: '查询参数验证失败',
          errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      req.validatedQuery = result.value;
      next();
    };
  }

  /**
   * 验证路径参数
   */
  static validateParams(schema: AnySchema, options: ValidationOptions = {}) {
    const {
      detailedErrors = true,
      stripUnknown = true,
      convert = true,
      allowUnknown = false,
    } = options;

    return (req: Request, res: Response, next: NextFunction): void => {
      const result = schema.validate(req.params, {
        abortEarly: false,
        stripUnknown,
        convert,
        allowUnknown,
      });

      if (result.error) {
        const errors = Validator.formatErrors(result.error, detailedErrors);
        logger.warn('路径参数验证失败', {
          path: req.path,
          method: req.method,
          errors,
          params: req.params,
        });

        res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: '路径参数验证失败',
          errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      req.validatedParams = result.value;
      next();
    };
  }

  /**
   * 验证请求头
   */
  static validateHeaders(schema: AnySchema, options: ValidationOptions = {}) {
    const {
      detailedErrors = true,
      stripUnknown = true,
      convert = true,
      allowUnknown = false,
    } = options;

    return (req: Request, res: Response, next: NextFunction): void => {
      const result = schema.validate(req.headers, {
        abortEarly: false,
        stripUnknown,
        convert,
        allowUnknown,
      });

      if (result.error) {
        const errors = Validator.formatErrors(result.error, detailedErrors);
        logger.warn('请求头验证失败', {
          path: req.path,
          method: req.method,
          errors,
        });

        res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: '请求头验证失败',
          errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      req.validatedHeaders = result.value;
      next();
    };
  }

  /**
   * 格式化验证错误
   */
  private static formatErrors(error: ValidationError, detailed: boolean): any[] {
    if (!detailed) {
      return error.details.map(d => d.message);
    }

    return error.details.map(d => ({
      field: d.path.join('.'),
      message: d.message,
      type: d.type,
      context: d.context,
    }));
  }
}

/**
 * 快速创建验证中间件
 */
export function validate(schema: AnySchema, target: 'body' | 'query' | 'params' | 'headers' = 'body') {
  const validatorMap = {
    body: Validator.validateBody,
    query: Validator.validateQuery,
    params: Validator.validateParams,
    headers: Validator.validateHeaders,
  };

  return validatorMap[target](schema);
}

/**
 * 链式验证 - 同时验证多个部分
 */
export function validateAll(options: {
  body?: AnySchema;
  query?: AnySchema;
  params?: AnySchema;
  headers?: AnySchema;
}) {
  const middlewares: any[] = [];

  if (options.body) {
    middlewares.push(Validator.validateBody(options.body));
  }
  if (options.query) {
    middlewares.push(Validator.validateQuery(options.query));
  }
  if (options.params) {
    middlewares.push(Validator.validateParams(options.params));
  }
  if (options.headers) {
    middlewares.push(Validator.validateHeaders(options.headers));
  }

  return middlewares;
}

/**
 * 通用数据清洗函数
 */
export function sanitize(data: any, schema: AnySchema): any {
  const result = schema.validate(data, {
    stripUnknown: true,
    convert: true,
    abortEarly: false,
  });

  if (result.error) {
    throw result.error;
  }

  return result.value;
}

/**
 * 验证工具函数
 */
export const validationUtils = {
  /**
   * 验证是否为有效的ID
   */
  isValidId(id: string | number): boolean {
    const num = Number(id);
    return !isNaN(num) && num > 0 && Number.isInteger(num);
  },

  /**
   * 验证是否为有效的邮箱
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 验证是否为有效的手机号
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  /**
   * 验证是否为有效的URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 验证是否为有效的UUID
   */
  isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },

  /**
   * 验证是否为有效的日期
   */
  isValidDate(date: string): boolean {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  },

  /**
   * 验证是否为有效的枚举值
   */
  isValidEnum(value: any, enumObj: any): boolean {
    return Object.values(enumObj).includes(value);
  },

  /**
   * 验证是否为有效的范围
   */
  isValidRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  },

  /**
   * 验证字符串长度
   */
  isValidLength(value: string, min: number, max: number): boolean {
    const length = value.length;
    return length >= min && length <= max;
  },
};

export default Validator;