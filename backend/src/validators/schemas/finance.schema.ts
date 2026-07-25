/**
 * 财务验证器
 * 财务数据的完整验证规则
 * @module validators/schemas/finance.schema
 */

import Joi from 'joi';

/**
 * 财务交易类型枚举
 */
export enum FinanceTransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
  REFUND = 'refund',
  ADJUSTMENT = 'adjustment',
}

/**
 * 财务状态枚举
 */
export enum FinanceStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * 财务验证规则
 */
export class FinanceSchema {
  /**
   * 创建财务记录验证规则
   */
  static create(): Joi.ObjectSchema {
    return Joi.object({
      type: Joi.string()
        .valid(...Object.values(FinanceTransactionType))
        .required()
        .messages({
          'any.only': '交易类型无效',
          'any.required': '交易类型是必填字段',
        }),
      category: Joi.string()
        .max(100)
        .required()
        .messages({
          'string.empty': '分类不能为空',
          'string.max': '分类最多100个字符',
          'any.required': '分类是必填字段',
        }),
      subCategory: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '子分类最多100个字符',
        }),
      amount: Joi.number()
        .min(0.01)
        .max(99999999.99)
        .required()
        .messages({
          'number.base': '金额必须是数字',
          'number.min': '金额必须大于0',
          'any.required': '金额是必填字段',
        }),
      currency: Joi.string()
        .length(3)
        .uppercase()
        .default('CNY')
        .messages({
          'string.length': '货币代码必须是3个字符',
          'string.uppercase': '货币代码必须是大写',
        }),
      exchangeRate: Joi.number()
        .min(0)
        .default(1)
        .messages({
          'number.base': '汇率必须是数字',
          'number.min': '汇率不能为负数',
        }),
      description: Joi.string()
        .min(1)
        .max(500)
        .required()
        .messages({
          'string.empty': '描述不能为空',
          'string.min': '描述至少1个字符',
          'string.max': '描述最多500个字符',
          'any.required': '描述是必填字段',
        }),
      referenceId: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '参考ID最多100个字符',
        }),
      referenceType: Joi.string()
        .max(50)
        .optional()
        .allow('')
        .messages({
          'string.max': '参考类型最多50个字符',
        }),
      customerId: Joi.string()
        .optional()
        .allow('')
        .messages({
          'string.empty': '客户ID不能为空',
        }),
      accountId: Joi.string()
        .optional()
        .allow('')
        .messages({
          'string.empty': '账户ID不能为空',
        }),
      paymentMethod: Joi.string()
        .max(50)
        .optional()
        .allow('')
        .messages({
          'string.max': '支付方式最多50个字符',
        }),
      transactionDate: Joi.date()
        .iso()
        .default(() => new Date())
        .messages({
          'date.base': '交易日期格式无效',
          'date.format': '交易日期格式无效，请使用ISO格式',
        }),
    });
  }

  /**
   * 更新财务记录验证规则
   */
  static update(): Joi.ObjectSchema {
    return Joi.object({
      category: Joi.string()
        .max(100)
        .optional()
        .messages({
          'string.max': '分类最多100个字符',
        }),
      subCategory: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '子分类最多100个字符',
        }),
      description: Joi.string()
        .min(1)
        .max(500)
        .optional()
        .messages({
          'string.empty': '描述不能为空',
          'string.min': '描述至少1个字符',
          'string.max': '描述最多500个字符',
        }),
      status: Joi.string()
        .valid(...Object.values(FinanceStatus))
        .optional()
        .messages({
          'any.only': '状态值无效',
        }),
      paymentMethod: Joi.string()
        .max(50)
        .optional()
        .allow('')
        .messages({
          'string.max': '支付方式最多50个字符',
        }),
    });
  }

  /**
   * 财务查询参数验证规则
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
      type: Joi.string()
        .valid(...Object.values(FinanceTransactionType))
        .optional()
        .messages({
          'any.only': '交易类型无效',
        }),
      status: Joi.string()
        .valid(...Object.values(FinanceStatus))
        .optional()
        .messages({
          'any.only': '状态值无效',
        }),
      category: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '分类最多100个字符',
        }),
      customerId: Joi.string()
        .optional()
        .allow('')
        .messages({
          'string.empty': '客户ID不能为空',
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
        .valid('createdAt', 'updatedAt', 'amount', 'transactionDate')
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
   * 财务报表查询验证规则
   */
  static reportQuery(): Joi.ObjectSchema {
    return Joi.object({
      reportType: Joi.string()
        .valid('income_statement', 'balance_sheet', 'cash_flow', 'profit_loss', 'tax_report')
        .required()
        .messages({
          'any.only': '报表类型无效',
          'any.required': '报表类型是必填字段',
        }),
      startDate: Joi.date()
        .iso()
        .required()
        .messages({
          'date.base': '开始日期格式无效',
          'date.format': '开始日期格式无效，请使用ISO格式',
          'any.required': '开始日期是必填字段',
        }),
      endDate: Joi.date()
        .iso()
        .min(Joi.ref('startDate'))
        .required()
        .messages({
          'date.base': '结束日期格式无效',
          'date.format': '结束日期格式无效，请使用ISO格式',
          'date.min': '结束日期不能早于开始日期',
          'any.required': '结束日期是必填字段',
        }),
      currency: Joi.string()
        .length(3)
        .uppercase()
        .optional()
        .messages({
          'string.length': '货币代码必须是3个字符',
          'string.uppercase': '货币代码必须是大写',
        }),
      groupBy: Joi.string()
        .valid('day', 'week', 'month', 'quarter', 'year')
        .optional()
        .messages({
          'any.only': '分组方式无效',
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
          'array.min': '至少选择一个记录',
          'array.max': '最多选择100个记录',
          'any.required': 'ID列表是必填字段',
        }),
      action: Joi.string()
        .valid('complete', 'cancel', 'delete', 'export')
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

  /**
   * 财务统计查询验证规则
   */
  static statsQuery(): Joi.ObjectSchema {
    return Joi.object({
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
      groupBy: Joi.string()
        .valid('day', 'week', 'month', 'quarter', 'year')
        .default('month')
        .messages({
          'any.only': '分组方式无效',
        }),
      categories: Joi.array()
        .items(Joi.string())
        .optional()
        .messages({
          'array.base': '分类列表必须是数组',
        }),
    });
  }
}

export default FinanceSchema;