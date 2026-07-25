/**
 * 订单验证器
 * 订单数据的完整验证规则
 * @module validators/schemas/order.schema
 */

import Joi from 'joi';

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * 支付状态枚举
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL = 'partial',
}

/**
 * 订单验证规则
 */
export class OrderSchema {
  /**
   * 创建订单验证规则
   */
  static create(): Joi.ObjectSchema {
    return Joi.object({
      customerId: Joi.string()
        .required()
        .messages({
          'string.empty': '客户ID不能为空',
          'any.required': '客户ID是必填字段',
        }),
      items: Joi.array()
        .items(
          Joi.object({
            productId: Joi.string().required(),
            name: Joi.string().min(1).max(200).required(),
            sku: Joi.string().max(50).optional().allow(''),
            quantity: Joi.number().integer().min(1).max(9999).required(),
            price: Joi.number().min(0).max(9999999.99).required(),
          })
        )
        .min(1)
        .required()
        .messages({
          'array.base': '订单项必须是数组',
          'array.min': '至少包含一个订单项',
          'any.required': '订单项是必填字段',
        }),
      shippingAddress: Joi.object({
        name: Joi.string().min(1).max(200).required(),
        address: Joi.string().min(1).max(500).required(),
        city: Joi.string().min(1).max(100).required(),
        country: Joi.string().min(1).max(100).required(),
        postalCode: Joi.string().max(20).optional().allow(''),
        phone: Joi.string().pattern(/^[\+\d\s\-()]{7,20}$/).required(),
      }).required(),
      billingAddress: Joi.object({
        name: Joi.string().min(1).max(200).required(),
        address: Joi.string().min(1).max(500).required(),
        city: Joi.string().min(1).max(100).required(),
        country: Joi.string().min(1).max(100).required(),
        postalCode: Joi.string().max(20).optional().allow(''),
        phone: Joi.string().pattern(/^[\+\d\s\-()]{7,20}$/).required(),
      }).required(),
      discountAmount: Joi.number()
        .min(0)
        .max(9999999.99)
        .default(0)
        .messages({
          'number.base': '折扣金额必须是数字',
          'number.min': '折扣金额不能为负数',
        }),
      taxAmount: Joi.number()
        .min(0)
        .max(9999999.99)
        .default(0)
        .messages({
          'number.base': '税额必须是数字',
          'number.min': '税额不能为负数',
        }),
      shippingAmount: Joi.number()
        .min(0)
        .max(9999999.99)
        .default(0)
        .messages({
          'number.base': '运费必须是数字',
          'number.min': '运费不能为负数',
        }),
      currency: Joi.string()
        .length(3)
        .uppercase()
        .default('CNY')
        .messages({
          'string.length': '货币代码必须是3个字符',
          'string.uppercase': '货币代码必须是大写',
        }),
      note: Joi.string()
        .max(1000)
        .optional()
        .allow('')
        .messages({
          'string.max': '备注最多1000个字符',
        }),
    });
  }

  /**
   * 更新订单验证规则
   */
  static update(): Joi.ObjectSchema {
    return Joi.object({
      status: Joi.string()
        .valid(...Object.values(OrderStatus))
        .optional()
        .messages({
          'any.only': '订单状态无效',
        }),
      paymentStatus: Joi.string()
        .valid(...Object.values(PaymentStatus))
        .optional()
        .messages({
          'any.only': '支付状态无效',
        }),
      shippingAddress: Joi.object({
        name: Joi.string().min(1).max(200).required(),
        address: Joi.string().min(1).max(500).required(),
        city: Joi.string().min(1).max(100).required(),
        country: Joi.string().min(1).max(100).required(),
        postalCode: Joi.string().max(20).optional().allow(''),
        phone: Joi.string().pattern(/^[\+\d\s\-()]{7,20}$/).required(),
      }).optional(),
      trackingNumber: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '物流单号最多100个字符',
        }),
      note: Joi.string()
        .max(1000)
        .optional()
        .allow('')
        .messages({
          'string.max': '备注最多1000个字符',
        }),
    });
  }

  /**
   * 订单状态更新验证规则
   */
  static statusUpdate(): Joi.ObjectSchema {
    return Joi.object({
      status: Joi.string()
        .valid(...Object.values(OrderStatus))
        .required()
        .messages({
          'any.only': '订单状态无效',
          'any.required': '订单状态是必填字段',
        }),
      reason: Joi.string()
        .max(500)
        .optional()
        .allow('')
        .messages({
          'string.max': '原因最多500个字符',
        }),
    });
  }

  /**
   * 订单查询参数验证规则
   */
  static query(): Joi.ObjectSchema {
    return Joi.object({
      page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
          'number.base': '页码必须是数字',
          'number.min': '页码至少为1',
        }),
      limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20)
        .messages({
          'number.base': '每页数量必须是数字',
          'number.min': '每页数量至少为1',
          'number.max': '每页数量最多100',
        }),
      customerId: Joi.string()
        .optional()
        .messages({
          'string.empty': '客户ID不能为空',
        }),
      status: Joi.string()
        .valid(...Object.values(OrderStatus))
        .optional()
        .messages({
          'any.only': '订单状态无效',
        }),
      paymentStatus: Joi.string()
        .valid(...Object.values(PaymentStatus))
        .optional()
        .messages({
          'any.only': '支付状态无效',
        }),
      startDate: Joi.date()
        .iso()
        .optional()
        .messages({
          'date.base': '开始日期格式无效',
          'date.format': '开始日期格式无效，请使用ISO格式',
        }),
      endDate: Joi.date()
        .iso()
        .min(Joi.ref('startDate'))
        .optional()
        .messages({
          'date.base': '结束日期格式无效',
          'date.format': '结束日期格式无效，请使用ISO格式',
          'date.min': '结束日期不能早于开始日期',
        }),
      sortBy: Joi.string()
        .valid('orderNumber', 'createdAt', 'updatedAt', 'grandTotal', 'status')
        .default('createdAt')
        .messages({
          'any.only': '排序字段无效',
        }),
      sortOrder: Joi.string()
        .valid('asc', 'desc')
        .default('desc')
        .messages({
          'any.only': '排序方向无效，必须是 asc 或 desc',
        }),
    });
  }

  /**
   * 订单取消验证规则
   */
  static cancel(): Joi.ObjectSchema {
    return Joi.object({
      reason: Joi.string()
        .max(500)
        .required()
        .messages({
          'string.empty': '取消原因不能为空',
          'string.max': '取消原因最多500个字符',
          'any.required': '取消原因是必填字段',
        }),
      refund: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': '退款选项必须是布尔值',
        }),
    });
  }

  /**
   * 批量操作验证规则
   */
  static bulk(): Joi.ObjectSchema {
    return Joi.object({
      ids: Joi.array()
        .items(Joi.string().required())
        .min(1)
        .max(100)
        .required()
        .messages({
          'array.base': 'ID列表必须是数组',
          'array.min': '至少选择一个订单',
          'array.max': '最多选择100个订单',
          'any.required': 'ID列表是必填字段',
        }),
      action: Joi.string()
        .valid('confirm', 'process', 'ship', 'deliver', 'cancel', 'refund')
        .required()
        .messages({
          'any.only': '操作类型无效',
          'any.required': '操作类型是必填字段',
        }),
      data: Joi.object()
        .optional()
        .messages({
          'object.base': '操作数据必须是对象',
        }),
    });
  }
}

export default OrderSchema;