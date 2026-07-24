/**
 * @file Routes/product.routes.ts
 * 产品管理路由 - 完整的商品管理
 * 完整实现：补全商品增删改查、分类管理、上下架接口，多条件搜索、价格区间筛选、批量操作
 */

import { Router } from 'express';
import { asyncHandler } from '../src/middlewares/error-handler.middleware';
import { authMiddleware } from '../src/middlewares/auth.middleware';
import { validate } from '../src/middlewares/validation.middleware';
import { productController } from '../src/Controllers';
import * as Joi from 'joi';

const router = Router();

// ============================================
// 验证 Schema
// ============================================

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).optional(),
  category: Joi.string().max(50).required(),
  sku: Joi.string().max(50).required(),
  unitPrice: Joi.number().positive().required(),
  costPrice: Joi.number().positive().optional(),
  stockQuantity: Joi.number().integer().min(0).default(0),
  minStock: Joi.number().integer().min(0).default(5),
  maxStock: Joi.number().integer().min(1).default(100),
  weight: Joi.number().positive().optional(),
  dimensions: Joi.string().max(50).optional(),
  brand: Joi.string().max(50).optional(),
  status: Joi.string().valid('active', 'inactive', 'discontinued').default('active'),
  tags: Joi.array().items(Joi.string().max(30)).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  category: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'discontinued').optional(),
  keyword: Joi.string().optional(),
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().optional(),
  minStock: Joi.number().integer().min(0).optional(),
  maxStock: Joi.number().integer().min(0).optional(),
  brand: Joi.string().optional(),
  sortBy: Joi.string().valid('name', 'unitPrice', 'stockQuantity', 'createdAt', 'category').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const batchActionSchema = Joi.object({
  ids: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
  action: Joi.string().valid('activate', 'inactivate', 'discontinue', 'delete').required(),
});

const stockAdjustSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().required(),
  reason: Joi.string().max(200).required(),
});

// ============================================
// 路由定义
// ============================================

/**
 * 创建产品
 * POST /api/v1/products
 */
router.post(
  '/',
  authMiddleware({ required: true, permissions: ['product:create'] }),
  validate(createProductSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await productController.createProduct(req.validatedBody);
    res.status(201).json({
      success: true,
      data: result,
      message: '产品创建成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取产品列表
 * GET /api/v1/products
 */
router.get(
  '/',
  authMiddleware({ required: true, permissions: ['product:list'] }),
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit, sortBy, sortOrder, ...filters } = req.validatedQuery;
    const result = await productController.getProductList({
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
 * 获取产品详情
 * GET /api/v1/products/:id
 */
router.get(
  '/:id',
  authMiddleware({ required: true, permissions: ['product:view'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await productController.getProductById(id);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 更新产品
 * PUT /api/v1/products/:id
 */
router.put(
  '/:id',
  authMiddleware({ required: true, permissions: ['product:update'] }),
  validate(idParamSchema, 'params'),
  validate(createProductSchema.optional(), 'body'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await productController.updateProduct(id, req.validatedBody);
    res.json({
      success: true,
      data: result,
      message: '产品更新成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 删除产品
 * DELETE /api/v1/products/:id
 */
router.delete(
  '/:id',
  authMiddleware({ required: true, permissions: ['product:delete'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    await productController.deleteProduct(id);
    res.json({
      success: true,
      message: '产品删除成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 批量操作产品
 * POST /api/v1/products/batch
 */
router.post(
  '/batch',
  authMiddleware({ required: true, permissions: ['product:batch'] }),
  validate(batchActionSchema, 'body'),
  asyncHandler(async (req, res) => {
    const { ids, action } = req.validatedBody;
    const result = await productController.batchAction(ids, action);
    res.json({
      success: true,
      data: result,
      message: `批量${action}操作成功`,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 调整库存
 * PATCH /api/v1/products/:id/stock
 */
router.patch(
  '/:id/stock',
  authMiddleware({ required: true, permissions: ['product:stock'] }),
  validate(idParamSchema, 'params'),
  validate(stockAdjustSchema, 'body'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const { quantity, reason } = req.validatedBody;
    const result = await productController.adjustStock(id, quantity, reason);
    res.json({
      success: true,
      data: result,
      message: `库存调整成功，当前库存: ${result.stockQuantity}`,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取分类列表
 * GET /api/v1/products/categories
 */
router.get(
  '/categories/list',
  authMiddleware({ required: true, permissions: ['product:list'] }),
  asyncHandler(async (req, res) => {
    const result = await productController.getCategories();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取品牌列表
 * GET /api/v1/products/brands
 */
router.get(
  '/brands/list',
  authMiddleware({ required: true, permissions: ['product:list'] }),
  asyncHandler(async (req, res) => {
    const result = await productController.getBrands();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取产品统计
 * GET /api/v1/products/stats
 */
router.get(
  '/stats/overview',
  authMiddleware({ required: true, permissions: ['product:stats'] }),
  asyncHandler(async (req, res) => {
    const result = await productController.getProductStats();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;