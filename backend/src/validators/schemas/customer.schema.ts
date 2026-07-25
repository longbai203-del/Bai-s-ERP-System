/**
 * 客户验证器
 * 客户数据的完整验证规则
 * @module validators/schemas/customer.schema
 */

import Joi from 'joi';

/**
 * 客户状态枚举
 */
export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LEAD = 'lead',
  VIP = 'vip',
}

/**
 * 客户验证规则
 */
export class CustomerSchema {
  /**
   * 创建客户验证规则
   */
  static create(): Joi.ObjectSchema {
    return Joi.object({
      name: Joi.string()
        .min(1)
        .max(200)
        .required()
        .messages({
          'string.empty': '客户名称不能为空',
          'string.min': '客户名称至少1个字符',
          'string.max': '客户名称最多200个字符',
          'any.required': '客户名称是必填字段',
        }),
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': '邮箱格式无效',
          'string.empty': '邮箱不能为空',
          'any.required': '邮箱是必填字段',
        }),
      phone: Joi.string()
        .pattern(/^[\+\d\s\-()]{7,20}$/)
        .required()
        .messages({
          'string.pattern.base': '手机号格式无效',
          'string.empty': '手机号不能为空',
          'any.required': '手机号是必填字段',
        }),
      address: Joi.string()
        .max(500)
        .optional()
        .allow('')
        .messages({
          'string.max': '地址最多500个字符',
        }),
      city: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '城市最多100个字符',
        }),
      country: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '国家最多100个字符',
        }),
      postalCode: Joi.string()
        .max(20)
        .optional()
        .allow('')
        .messages({
          'string.max': '邮编最多20个字符',
        }),
      taxId: Joi.string()
        .max(50)
        .optional()
        .allow('')
        .messages({
          'string.max': '税号最多50个字符',
        }),
      industry: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '行业最多100个字符',
        }),
      status: Joi.string()
        .valid(...Object.values(CustomerStatus))
        .default(CustomerStatus.ACTIVE)
        .messages({
          'any.only': '状态值无效，必须是 active, inactive, lead, vip 之一',
        }),
      tags: Joi.array()
        .items(Joi.string().max(50))
        .optional()
        .default([])
        .messages({
          'array.base': '标签必须是数组',
          'string.max': '单个标签最多50个字符',
        }),
      notes: Joi.string()
        .max(1000)
        .optional()
        .allow('')
        .messages({
          'string.max': '备注最多1000个字符',
        }),
    });
  }

  /**
   * 更新客户验证规则
   */
  static update(): Joi.ObjectSchema {
    return this.create().fork(
      ['name', 'email', 'phone'],
      (schema) => schema.optional()
    );
  }

  /**
   * 客户查询参数验证规则
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
      search: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '搜索关键词最多100个字符',
        }),
      status: Joi.string()
        .valid(...Object.values(CustomerStatus))
        .optional()
        .messages({
          'any.only': '状态值无效',
        }),
      sortBy: Joi.string()
        .valid('name', 'email', 'createdAt', 'updatedAt', 'totalSpent', 'totalOrders')
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
          'array.min': '至少选择一个客户',
          'array.max': '最多选择100个客户',
          'any.required': 'ID列表是必填字段',
        }),
      action: Joi.string()
        .valid('activate', 'deactivate', 'delete', 'tag', 'untag')
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
   * 客户标签操作验证规则
   */
  static tagOperation(): Joi.ObjectSchema {
    return Joi.object({
      tags: Joi.array()
        .items(Joi.string().max(50))
        .min(1)
        .max(10)
        .required()
        .messages({
          'array.base': '标签必须是数组',
          'array.min': '至少添加一个标签',
          'array.max': '最多添加10个标签',
          'any.required': '标签是必填字段',
        }),
    });
  }

  /**
   * 客户导入验证规则
   */
  static import(): Joi.ObjectSchema {
    return Joi.object({
      data: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().min(1).max(200).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().pattern(/^[\+\d\s\-()]{7,20}$/).required(),
            address: Joi.string().max(500).optional().allow(''),
            city: Joi.string().max(100).optional().allow(''),
            country: Joi.string().max(100).optional().allow(''),
            postalCode: Joi.string().max(20).optional().allow(''),
            taxId: Joi.string().max(50).optional().allow(''),
            industry: Joi.string().max(100).optional().allow(''),
            status: Joi.string().valid(...Object.values(CustomerStatus)).default(CustomerStatus.ACTIVE),
            tags: Joi.array().items(Joi.string().max(50)).optional().default([]),
          })
        )
        .min(1)
        .max(1000)
        .required()
        .messages({
          'array.base': '导入数据必须是数组',
          'array.min': '至少导入一条数据',
          'array.max': '最多导入1000条数据',
          'any.required': '导入数据是必填字段',
        }),
      overwrite: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': '覆盖选项必须是布尔值',
        }),
      skipDuplicates: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': '跳过重复选项必须是布尔值',
        }),
    });
  }
}

export default CustomerSchema;