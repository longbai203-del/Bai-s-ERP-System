/**
 * Validation Middleware
 * 提供完整的请求验证功能，包含各种验证规则、自定义验证器、错误消息本地化等
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param, query, ValidationChain } from 'express-validator';
import logger from '../utils/logger';

// ============================================
// 类型定义
// ============================================

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================
// 核心验证中间件
// ============================================

/**
 * 主验证中间件 - 处理验证结果
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.type === 'field' ? err.path : err.type,
      message: err.msg,
      value: err.type === 'field' ? err.value : undefined
    }));

    logger.warn(`Validation failed for ${req.method} ${req.path}:`, formattedErrors);

    res.status(400).json({
      code: 400,
      message: 'Validation failed',
      errors: formattedErrors,
      timestamp: new Date().toISOString()
    });
    return;
  }

  next();
};

/**
 * 验证请求体
 */
export const validateBody = (rules: any): ValidationChain[] => {
  const validations: ValidationChain[] = [];

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];

    // 基础验证
    if (rule.required) {
      validations.push(
        body(field)
          .exists()
          .withMessage(`${field} is required`)
          .notEmpty()
          .withMessage(`${field} cannot be empty`)
      );
    }

    // 类型验证
    if (rule.type) {
      switch (rule.type) {
        case 'string':
          validations.push(
            body(field).isString().withMessage(`${field} must be a string`)
          );
          if (rule.min !== undefined) {
            validations.push(
              body(field).isLength({ min: rule.min }).withMessage(`${field} must be at least ${rule.min} characters`)
            );
          }
          if (rule.max !== undefined) {
            validations.push(
              body(field).isLength({ max: rule.max }).withMessage(`${field} must not exceed ${rule.max} characters`)
            );
          }
          if (rule.pattern) {
            validations.push(
              body(field).matches(rule.pattern).withMessage(`${field} has invalid format`)
            );
          }
          break;

        case 'number':
          validations.push(
            body(field).isNumeric().withMessage(`${field} must be a number`)
          );
          if (rule.min !== undefined) {
            validations.push(
              body(field).isFloat({ min: rule.min }).withMessage(`${field} must be at least ${rule.min}`)
            );
          }
          if (rule.max !== undefined) {
            validations.push(
              body(field).isFloat({ max: rule.max }).withMessage(`${field} must not exceed ${rule.max}`)
            );
          }
          break;

        case 'email':
          validations.push(
            body(field).isEmail().withMessage(`${field} must be a valid email address`)
          );
          break;

        case 'date':
          validations.push(
            body(field).isISO8601().withMessage(`${field} must be a valid date`)
          );
          break;

        case 'array':
          validations.push(
            body(field).isArray().withMessage(`${field} must be an array`)
          );
          if (rule.min !== undefined) {
            validations.push(
              body(field).isArray({ min: rule.min }).withMessage(`${field} must have at least ${rule.min} items`)
            );
          }
          if (rule.max !== undefined) {
            validations.push(
              body(field).isArray({ max: rule.max }).withMessage(`${field} must not exceed ${rule.max} items`)
            );
          }
          break;

        case 'boolean':
          validations.push(
            body(field).isBoolean().withMessage(`${field} must be a boolean`)
          );
          break;

        case 'object':
          validations.push(
            body(field).isObject().withMessage(`${field} must be an object`)
          );
          break;

        default:
          break;
      }
    }

    // 枚举验证
    if (rule.enum) {
      validations.push(
        body(field).isIn(rule.enum).withMessage(`${field} must be one of: ${rule.enum.join(', ')}`)
      );
    }

    // 自定义验证
    if (rule.custom) {
      validations.push(
        body(field).custom(rule.custom).withMessage(rule.customMessage || `Invalid ${field}`)
      );
    }
  });

  return validations;
};

/**
 * 验证查询参数
 */
export const validateQuery = (rules: any): ValidationChain[] => {
  const validations: ValidationChain[] = [];

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];

    if (rule.required) {
      validations.push(
        query(field)
          .exists()
          .withMessage(`${field} query parameter is required`)
          .notEmpty()
          .withMessage(`${field} query parameter cannot be empty`)
      );
    }

    if (rule.type) {
      switch (rule.type) {
        case 'string':
          validations.push(query(field).isString().withMessage(`${field} must be a string`));
          if (rule.min !== undefined) {
            validations.push(
              query(field).isLength({ min: rule.min }).withMessage(`${field} must be at least ${rule.min} characters`)
            );
          }
          break;

        case 'number':
          validations.push(query(field).isNumeric().withMessage(`${field} must be a number`));
          validations.push(query(field).toInt());
          if (rule.min !== undefined) {
            validations.push(
              query(field).isInt({ min: rule.min }).withMessage(`${field} must be at least ${rule.min}`)
            );
          }
          if (rule.max !== undefined) {
            validations.push(
              query(field).isInt({ max: rule.max }).withMessage(`${field} must not exceed ${rule.max}`)
            );
          }
          break;

        case 'email':
          validations.push(query(field).isEmail().withMessage(`${field} must be a valid email`));
          break;

        case 'date':
          validations.push(query(field).isISO8601().withMessage(`${field} must be a valid date`));
          break;

        case 'boolean':
          validations.push(query(field).isBoolean().withMessage(`${field} must be a boolean`));
          break;

        default:
          break;
      }
    }

    if (rule.enum) {
      validations.push(
        query(field).isIn(rule.enum).withMessage(`${field} must be one of: ${rule.enum.join(', ')}`)
      );
    }

    if (rule.default !== undefined) {
      validations.push(
        query(field).default(rule.default)
      );
    }
  });

  return validations;
};

/**
 * 验证路径参数
 */
export const validateParams = (rules: any): ValidationChain[] => {
  const validations: ValidationChain[] = [];

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];

    if (rule.required) {
      validations.push(
        param(field)
          .exists()
          .withMessage(`${field} path parameter is required`)
          .notEmpty()
          .withMessage(`${field} path parameter cannot be empty`)
      );
    }

    if (rule.type) {
      switch (rule.type) {
        case 'string':
          validations.push(param(field).isString().withMessage(`${field} must be a string`));
          if (rule.min !== undefined) {
            validations.push(
              param(field).isLength({ min: rule.min }).withMessage(`${field} must be at least ${rule.min} characters`)
            );
          }
          if (rule.max !== undefined) {
            validations.push(
              param(field).isLength({ max: rule.max }).withMessage(`${field} must not exceed ${rule.max} characters`)
            );
          }
          break;

        case 'number':
          validations.push(param(field).isNumeric().withMessage(`${field} must be a number`));
          validations.push(param(field).toInt());
          if (rule.min !== undefined) {
            validations.push(
              param(field).isInt({ min: rule.min }).withMessage(`${field} must be at least ${rule.min}`)
            );
          }
          break;

        case 'email':
          validations.push(param(field).isEmail().withMessage(`${field} must be a valid email`));
          break;

        case 'date':
          validations.push(param(field).isISO8601().withMessage(`${field} must be a valid date`));
          break;

        default:
          break;
      }
    }

    if (rule.enum) {
      validations.push(
        param(field).isIn(rule.enum).withMessage(`${field} must be one of: ${rule.enum.join(', ')}`)
      );
    }
  });

  return validations;
};

// ============================================
// 自定义验证器
// ============================================

/**
 * 验证 MongoDB ObjectId
 */
export const isMongoId = (value: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(value);
};

/**
 * 验证手机号（沙特阿拉伯）
 */
export const isSaudiPhone = (value: string): boolean => {
  const phoneRegex = /^05[0-9]{8}$/;
  return phoneRegex.test(value);
};

/**
 * 验证增值税号（沙特阿拉伯）
 */
export const isSaudiVatNumber = (value: string): boolean => {
  const vatRegex = /^[0-9]{15}$/;
  return vatRegex.test(value);
};

/**
 * 验证 URL
 */
export const isValidUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证 IP 地址
 */
export const isValidIp = (value: string): boolean => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  return ipRegex.test(value);
};

// ============================================
// 组合验证器
// ============================================

/**
 * 创建自定义验证器
 */
export const createValidator = (
  validator: (value: any) => boolean,
  message: string
): (value: any) => Promise<void> => {
  return async (value: any): Promise<void> => {
    if (!validator(value)) {
      throw new Error(message);
    }
  };
};

/**
 * 链式验证
 */
export const chain = (value: any, validators: ((v: any) => boolean)[]): boolean => {
  return validators.every((validator) => validator(value));
};

// ============================================
// 预定义验证规则
// ============================================

// 通用验证规则
export const commonRules = {
  id: param('id').isMongoId().withMessage('Invalid ID format'),
  page: query('page').optional().isInt({ min: 1 }).toInt(),
  limit: query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  keyword: query('keyword').optional().isString().isLength({ min: 2 }),
  sortBy: query('sortBy').optional().isString(),
  sortOrder: query('sortOrder').optional().isIn(['asc', 'desc'])
};

// 客户验证规则
export const customerRules = {
  create: [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('address').optional().isString(),
    body('company').optional().isString(),
    body('taxId').optional().isString(),
    body('status').optional().isIn(['active', 'inactive', 'suspended'])
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid customer ID'),
    body('name').optional().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail(),
    body('phone').optional().isString(),
    body('address').optional().isString()
  ]
};

// 订单验证规则
export const orderRules = {
  create: [
    body('customerId').isMongoId().withMessage('Invalid customer ID'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.productId').isMongoId().withMessage('Invalid product ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('paymentMethod').isIn(['cash', 'credit_card', 'bank_transfer', 'online'])
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('shippingAddress').optional().isString(),
    body('paymentMethod').optional().isIn(['cash', 'credit_card', 'bank_transfer', 'online']),
    body('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'])
  ]
};

// 产品验证规则
export const productRules = {
  create: [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
    body('productCode').notEmpty().withMessage('Product code is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('unit').notEmpty().withMessage('Unit is required'),
    body('status').optional().isIn(['active', 'inactive', 'discontinued'])
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name').optional().isLength({ min: 2, max: 100 }),
    body('price').optional().isFloat({ min: 0 }),
    body('status').optional().isIn(['active', 'inactive', 'discontinued'])
  ]
};

// ============================================
// 默认导出
// ============================================

export default {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  isMongoId,
  isSaudiPhone,
  isSaudiVatNumber,
  isValidUrl,
  isValidIp,
  createValidator,
  chain,
  commonRules,
  customerRules,
  orderRules,
  productRules
};