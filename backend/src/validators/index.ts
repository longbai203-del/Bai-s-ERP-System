/**
 * 验证器统一导出
 * 所有验证器的聚合入口
 * @module validators/index
 */

import CustomerSchema, { CustomerStatus } from './schemas/customer.schema';
import OrderSchema, { OrderStatus, PaymentStatus } from './schemas/order.schema';
import ProductSchema, { ProductStatus } from './schemas/product.schema';
import FinanceSchema, { FinanceTransactionType, FinanceStatus } from './schemas/finance.schema';
import ValidationErrorHandler, { ValidationErrorDetail, ValidationErrorResponse } from './schemas/validation-errors';
import CustomValidators, { extendJoiWithCustomValidators } from './schemas/custom-validators';

// 扩展Joi自定义验证器
extendJoiWithCustomValidators();

// 导出所有验证器
export {
  // 客户验证器
  CustomerSchema,
  CustomerStatus,

  // 订单验证器
  OrderSchema,
  OrderStatus,
  PaymentStatus,

  // 产品验证器
  ProductSchema,
  ProductStatus,

  // 财务验证器
  FinanceSchema,
  FinanceTransactionType,
  FinanceStatus,

  // 验证错误处理
  ValidationErrorHandler,
  ValidationErrorDetail,
  ValidationErrorResponse,

  // 自定义验证器
  CustomValidators,
};

/**
 * 通用验证函数
 */
export const Validators = {
  /**
   * 验证ID
   */
  validateId: ValidationErrorHandler.validateId,

  /**
   * 验证邮箱
   */
  validateEmail: ValidationErrorHandler.validateEmail,

  /**
   * 验证手机号
   */
  validatePhone: ValidationErrorHandler.validatePhone,

  /**
   * 验证金额
   */
  validateAmount: ValidationErrorHandler.validateAmount,

  /**
   * 验证日期
   */
  validateDate: ValidationErrorHandler.validateDate,

  /**
   * 验证日期时间
   */
  validateDateTime: ValidationErrorHandler.validateDateTime,
};

/**
 * 验证器工厂
 */
export class ValidatorFactory {
  /**
   * 创建客户验证器
   */
  static createCustomer() {
    return CustomerSchema.create();
  }

  /**
   * 创建客户更新验证器
   */
  static updateCustomer() {
    return CustomerSchema.update();
  }

  /**
   * 创建客户查询验证器
   */
  static queryCustomer() {
    return CustomerSchema.query();
  }

  /**
   * 创建客户批量操作验证器
   */
  static bulkCustomer() {
    return CustomerSchema.bulk();
  }

  /**
   * 创建客户标签操作验证器
   */
  static tagCustomer() {
    return CustomerSchema.tagOperation();
  }

  /**
   * 创建客户导入验证器
   */
  static importCustomer() {
    return CustomerSchema.import();
  }

  /**
   * 创建订单验证器
   */
  static createOrder() {
    return OrderSchema.create();
  }

  /**
   * 创建订单更新验证器
   */
  static updateOrder() {
    return OrderSchema.update();
  }

  /**
   * 创建订单状态更新验证器
   */
  static updateOrderStatus() {
    return OrderSchema.statusUpdate();
  }

  /**
   * 创建订单查询验证器
   */
  static queryOrder() {
    return OrderSchema.query();
  }

  /**
   * 创建订单取消验证器
   */
  static cancelOrder() {
    return OrderSchema.cancel();
  }

  /**
   * 创建订单批量操作验证器
   */
  static bulkOrder() {
    return OrderSchema.bulk();
  }

  /**
   * 创建产品验证器
   */
  static createProduct() {
    return ProductSchema.create();
  }

  /**
   * 创建产品更新验证器
   */
  static updateProduct() {
    return ProductSchema.update();
  }

  /**
   * 创建产品查询验证器
   */
  static queryProduct() {
    return ProductSchema.query();
  }

  /**
   * 创建产品库存更新验证器
   */
  static updateProductStock() {
    return ProductSchema.stockUpdate();
  }

  /**
   * 创建产品批量导入验证器
   */
  static bulkImportProduct() {
    return ProductSchema.bulkImport();
  }

  /**
   * 创建财务验证器
   */
  static createFinance() {
    return FinanceSchema.create();
  }

  /**
   * 创建财务更新验证器
   */
  static updateFinance() {
    return FinanceSchema.update();
  }

  /**
   * 创建财务查询验证器
   */
  static queryFinance() {
    return FinanceSchema.query();
  }

  /**
   * 创建财务报表查询验证器
   */
  static queryFinanceReport() {
    return FinanceSchema.reportQuery();
  }

  /**
   * 创建财务批量操作验证器
   */
  static bulkFinance() {
    return FinanceSchema.bulk();
  }

  /**
   * 创建财务统计查询验证器
   */
  static queryFinanceStats() {
    return FinanceSchema.statsQuery();
  }
}

/**
 * 验证中间件
 */
export class ValidationMiddleware {
  /**
   * 验证请求体
   */
  static validateBody(schema: Joi.ObjectSchema) {
    return (req: any, res: any, next: any) => {
      const result = ValidationErrorHandler.validate(req.body, schema);
      if (!result.valid) {
        return res.status(400).json(result.errors);
      }
      req.validatedBody = result.value;
      next();
    };
  }

  /**
   * 验证查询参数
   */
  static validateQuery(schema: Joi.ObjectSchema) {
    return (req: any, res: any, next: any) => {
      const result = ValidationErrorHandler.validate(req.query, schema);
      if (!result.valid) {
        return res.status(400).json(result.errors);
      }
      req.validatedQuery = result.value;
      next();
    };
  }

  /**
   * 验证路径参数
   */
  static validateParams(schema: Joi.ObjectSchema) {
    return (req: any, res: any, next: any) => {
      const result = ValidationErrorHandler.validate(req.params, schema);
      if (!result.valid) {
        return res.status(400).json(result.errors);
      }
      req.validatedParams = result.value;
      next();
    };
  }

  /**
   * 验证ID参数
   */
  static validateIdParam() {
    return (req: any, res: any, next: any) => {
      const { id } = req.params;
      if (!ValidationErrorHandler.validateId(id)) {
        return res.status(400).json({
          success: false,
          code: 'INVALID_ID',
          message: '无效的ID格式',
        });
      }
      next();
    };
  }
}

export default {
  CustomerSchema,
  OrderSchema,
  ProductSchema,
  FinanceSchema,
  ValidationErrorHandler,
  CustomValidators,
  ValidatorFactory,
  ValidationMiddleware,
  Validators,
};