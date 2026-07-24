/**
 * @file Routes/customer.routes.ts
 * 客户管理路由 - 完整的 CRUD + 批量操作 + 统计分析
 * 完整实现：补全 GET/POST/PUT/DELETE 全量 CRUD 接口，分页查询、条件筛选、批量操作
 */

import { Router } from 'express';
import { asyncHandler } from '../src/middlewares/error-handler.middleware';
import { authMiddleware } from '../src/middlewares/auth.middleware';
import { validate } from '../src/middlewares/validation.middleware';
import { customerController } from '../src/Controllers';
import * as Joi from 'joi';

const router = Router();

// ============================================
// 验证 Schema 定义
// ============================================

const createCustomerSchema = Joi.object({
  companyName: Joi.string().min(2).max(100).required().messages({
    'string.empty': '公司名称不能为空',
    'string.min': '公司名称至少需要2个字符',
    'string.max': '公司名称不能超过100个字符',
    'any.required': '公司名称是必填字段',
  }),
  contactName: Joi.string().min(2).max(50).required().messages({
    'string.empty': '联系人姓名不能为空',
    'string.min': '联系人姓名至少需要2个字符',
    'any.required': '联系人姓名是必填字段',
  }),
  contactEmail: Joi.string().email().required().messages({
    'string.email': '请输入有效的邮箱地址',
    'string.empty': '联系邮箱不能为空',
    'any.required': '联系邮箱是必填字段',
  }),
  contactPhone: Joi.string().pattern(/^1[3-9]\d{9}$/).required().messages({
    'string.pattern.base': '请输入有效的手机号',
    'string.empty': '联系电话不能为空',
    'any.required': '联系电话是必填字段',
  }),
  address: Joi.string().max(200).optional(),
  taxId: Joi.string().max(50).optional(),
  industry: Joi.string().max(50).optional(),
  website: Joi.string().uri().optional(),
  notes: Joi.string().max(500).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended', 'pending').default('active'),
  creditLimit: Joi.number().min(0).default(0),
  customerLevel: Joi.string().max(50).optional(),
  source: Joi.string().max(20).optional(),
  salesRep: Joi.string().max(50).optional(),
});

const updateCustomerSchema = Joi.object({
  companyName: Joi.string().min(2).max(100).optional(),
  contactName: Joi.string().min(2).max(50).optional(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().pattern(/^1[3-9]\d{9}$/).optional(),
  address: Joi.string().max(200).optional(),
  taxId: Joi.string().max(50).optional(),
  industry: Joi.string().max(50).optional(),
  website: Joi.string().uri().optional(),
  notes: Joi.string().max(500).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended', 'pending').optional(),
  creditLimit: Joi.number().min(0).optional(),
  customerLevel: Joi.string().max(50).optional(),
  source: Joi.string().max(20).optional(),
  salesRep: Joi.string().max(50).optional(),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  keyword: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended', 'pending').optional(),
  industry: Joi.string().optional(),
  minCredit: Joi.number().min(0).optional(),
  maxCredit: Joi.number().min(0).optional(),
  registeredFrom: Joi.date().optional(),
  registeredTo: Joi.date().optional(),
  sortBy: Joi.string().valid('createdAt', 'companyName', 'status', 'creditLimit', 'totalSpent').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const idParamSchema = Joi.object({
  id: Joi.string().pattern(/^\d+$/).required().messages({
    'string.pattern.base': 'ID必须为数字',
    'any.required': 'ID参数不能为空',
  }),
});

const batchActionSchema = Joi.object({
  ids: Joi.array().items(Joi.string().pattern(/^\d+$/)).min(1).required().messages({
    'array.min': '至少需要选择一个客户',
    'any.required': '客户ID列表不能为空',
  }),
  action: Joi.string().valid('delete', 'activate', 'suspend', 'archive', 'export').required(),
});

const checkExistsSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).optional(),
});

// ============================================
// 路由定义
// ============================================

/**
 * 创建客户
 * POST /api/v1/customers
 */
router.post(
  '/',
  authMiddleware({ required: true, permissions: ['customer:create'] }),
  validate(createCustomerSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await customerController.createCustomer(req.validatedBody);
    res.status(201).json({
      success: true,
      data: result,
      message: '客户创建成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取客户列表（分页 + 筛选）
 * GET /api/v1/customers
 */
router.get(
  '/',
  authMiddleware({ required: true, permissions: ['customer:list'] }),
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit, sortBy, sortOrder, ...filters } = req.validatedQuery;
    const result = await customerController.getCustomerList({
      page,
      limit,
      sortBy,
      sortOrder,
      filters,
    });
    res.json({
      success: true,
      data: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取客户详情
 * GET /api/v1/customers/:id
 */
router.get(
  '/:id',
  authMiddleware({ required: true, permissions: ['customer:view'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = parseInt(req.validatedParams.id, 10);
    const result = await customerController.getCustomerById(id);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 更新客户信息
 * PUT /api/v1/customers/:id
 */
router.put(
  '/:id',
  authMiddleware({ required: true, permissions: ['customer:update'] }),
  validate(idParamSchema, 'params'),
  validate(updateCustomerSchema, 'body'),
  asyncHandler(async (req, res) => {
    const id = parseInt(req.validatedParams.id, 10);
    const result = await customerController.updateCustomer(id, req.validatedBody);
    res.json({
      success: true,
      data: result,
      message: '客户信息更新成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 删除客户（软删除）
 * DELETE /api/v1/customers/:id
 */
router.delete(
  '/:id',
  authMiddleware({ required: true, permissions: ['customer:delete'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = parseInt(req.validatedParams.id, 10);
    await customerController.deleteCustomer(id);
    res.json({
      success: true,
      message: '客户删除成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 批量操作客户
 * POST /api/v1/customers/batch
 */
router.post(
  '/batch',
  authMiddleware({ required: true, permissions: ['customer:batch'] }),
  validate(batchActionSchema, 'body'),
  asyncHandler(async (req, res) => {
    const { ids, action } = req.validatedBody;
    const result = await customerController.batchAction(ids, action);
    res.json({
      success: true,
      data: result,
      message: `批量${action}操作成功`,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取客户统计信息
 * GET /api/v1/customers/stats
 */
router.get(
  '/stats/overview',
  authMiddleware({ required: true, permissions: ['customer:stats'] }),
  asyncHandler(async (req, res) => {
    const result = await customerController.getCustomerStats();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取行业分布统计
 * GET /api/v1/customers/stats/industry
 */
router.get(
  '/stats/industry',
  authMiddleware({ required: true, permissions: ['customer:stats'] }),
  asyncHandler(async (req, res) => {
    const result = await customerController.getIndustryDistribution();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 导出客户列表
 * GET /api/v1/customers/export
 */
router.get(
  '/export',
  authMiddleware({ required: true, permissions: ['customer:export'] }),
  validate(listQuerySchema.optional(), 'query'),
  asyncHandler(async (req, res) => {
    const result = await customerController.exportCustomers(req.validatedQuery || {});
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=customers_${Date.now()}.csv`);
    res.send(result);
  })
);

/**
 * 检查客户是否存在
 * GET /api/v1/customers/check
 */
router.get(
  '/check/exists',
  authMiddleware({ required: true, permissions: ['customer:view'] }),
  validate(checkExistsSchema, 'query'),
  asyncHandler(async (req, res) => {
    const { email, phone } = req.validatedQuery;
    const exists = await customerController.checkCustomerExists({ email, phone });
    res.json({
      success: true,
      data: exists,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取客户订单统计
 * GET /api/v1/customers/:id/orders/stats
 */
router.get(
  '/:id/orders/stats',
  authMiddleware({ required: true, permissions: ['customer:view'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = parseInt(req.validatedParams.id, 10);
    const result = await customerController.getCustomerOrderStats(id);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;