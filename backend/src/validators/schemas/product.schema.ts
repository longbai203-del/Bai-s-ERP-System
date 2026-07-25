/**
 * 产品验证器
 * 产品数据的完整验证规则
 * @module validators/schemas/product.schema
 */

import Joi from 'joi';

/**
 * 产品状态枚举
 */
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

/**
 * 产品验证规则
 */
export class ProductSchema {
  /**
   * 创建产品验证规则
   */
  static create(): Joi.ObjectSchema {
    return Joi.object({
      name: Joi.string()
        .min(1)
        .max(200)
        .required()
        .messages({
          'string.empty': '产品名称不能为空',
          'string.min': '产品名称至少1个字符',
          'string.max': '产品名称最多200个字符',
          'any.required': '产品名称是必填字段',
        }),
      sku: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
          'string.empty': 'SKU不能为空',
          'string.min': 'SKU至少1个字符',
          'string.max': 'SKU最多50个字符',
          'any.required': 'SKU是必填字段',
        }),
      description: Joi.string()
        .max(5000)
        .optional()
        .allow('')
        .messages({
          'string.max': '描述最多5000个字符',
        }),
      category: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '分类最多100个字符',
        }),
      brand: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '品牌最多100个字符',
        }),
      price: Joi.number()
        .min(0)
        .max(9999999.99)
        .required()
        .messages({
          'number.base': '价格必须是数字',
          'number.min': '价格不能为负数',
          'any.required': '价格是必填字段',
        }),
      cost: Joi.number()
        .min(0)
        .max(9999999.99)
        .optional()
        .messages({
          'number.base': '成本必须是数字',
          'number.min': '成本不能为负数',
        }),
      quantity: Joi.number()
        .integer()
        .min(0)
        .max(99999999)
        .default(0)
        .messages({
          'number.base': '数量必须是数字',
          'number.min': '数量不能为负数',
        }),
      reorderLevel: Joi.number()
        .integer()
        .min(0)
        .default(10)
        .messages({
          'number.base': '补货点必须是数字',
          'number.min': '补货点不能为负数',
        }),
      weight: Joi.number()
        .min(0)
        .max(999999.99)
        .optional()
        .messages({
          'number.base': '重量必须是数字',
          'number.min': '重量不能为负数',
        }),
      dimensions: Joi.object({
        length: Joi.number().min(0).optional(),
        width: Joi.number().min(0).optional(),
        height: Joi.number().min(0).optional(),
        unit: Joi.string().valid('cm', 'in', 'mm').default('cm'),
      }).optional(),
      images: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .default([])
        .messages({
          'array.base': '图片必须是数组',
          'string.uri': '图片URL格式无效',
        }),
      status: Joi.string()
        .valid(...Object.values(ProductStatus))
        .default(ProductStatus.ACTIVE)
        .messages({
          'any.only': '状态值无效',
        }),
      isFeatured: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': '精选选项必须是布尔值',
        }),
      tags: Joi.array()
        .items(Joi.string().max(50))
        .optional()
        .default([])
        .messages({
          'array.base': '标签必须是数组',
          'string.max': '单个标签最多50个字符',
        }),
    });
  }

  /**
   * 更新产品验证规则
   */
  static update(): Joi.ObjectSchema {
    return this.create().fork(
      ['name', 'sku', 'price'],
      (schema) => schema.optional()
    );
  }

  /**
   * 产品查询参数验证规则
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
      category: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '分类最多100个字符',
        }),
      brand: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '品牌最多100个字符',
        }),
      status: Joi.string()
        .valid(...Object.values(ProductStatus))
        .optional()
        .messages({
          'any.only': '状态值无效',
        }),
      minPrice: Joi.number()
        .min(0)
        .optional()
        .messages({
          'number.base': '最低价格必须是数字',
          'number.min': '最低价格不能为负数',
        }),
      maxPrice: Joi.number()
        .min(0)
        .optional()
        .messages({
          'number.base': '最高价格必须是数字',
          'number.min': '最高价格不能为负数',
        }),
      isFeatured: Joi.boolean()
        .optional()
        .messages({
          'boolean.base': '精选选项必须是布尔值',
        }),
      sortBy: Joi.string()
        .valid('name', 'price', 'quantity', 'createdAt', 'updatedAt', 'rating')
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
   * 库存更新验证规则
   */
  static stockUpdate(): Joi.ObjectSchema {
    return Joi.object({
      quantity: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
          'number.base': '数量必须是数字',
          'number.min': '数量不能为负数',
          'any.required': '数量是必填字段',
        }),
      reason: Joi.string()
        .max(500)
        .optional()
        .allow('')
        .messages({
          'string.max': '原因最多500个字符',
        }),
      reference: Joi.string()
        .max(100)
        .optional()
        .allow('')
        .messages({
          'string.max': '参考号最多100个字符',
        }),
    });
  }

  /**
   * 批量导入验证规则
   */
  static bulkImport(): Joi.ObjectSchema {
    return Joi.object({
      products: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().min(1).max(200).required(),
            sku: Joi.string().min(1).max(50).required(),
            description: Joi.string().max(5000).optional().allow(''),
            category: Joi.string().max(100).optional().allow(''),
            brand: Joi.string().max(100).optional().allow(''),
            price: Joi.number().min(0).max(9999999.99).required(),
            cost: Joi.number().min(0).max(9999999.99).optional(),
            quantity: Joi.number().integer().min(0).default(0),
            reorderLevel: Joi.number().integer().min(0).default(10),
            weight: Joi.number().min(0).max(999999.99).optional(),
            status: Joi.string().valid(...Object.values(ProductStatus)).default(ProductStatus.ACTIVE),
            tags: Joi.array().items(Joi.string().max(50)).optional().default([]),
          })
        )
        .min(1)
        .max(500)
        .required()
        .messages({
          'array.base': '产品列表必须是数组',
          'array.min': '至少导入一个产品',
          'array.max': '最多导入500个产品',
          'any.required': '产品列表是必填字段',
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

export default ProductSchema;