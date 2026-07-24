/**
 * @file Routes/inventory.routes.ts
 * 库存管理路由 - 入库、出库、盘点、预警
 */

import { Router } from 'express';
import { asyncHandler } from '../src/middlewares/error-handler.middleware';
import { authMiddleware } from '../src/middlewares/auth.middleware';
import { validate } from '../src/middlewares/validation.middleware';
import { inventoryController } from '../src/Controllers';
import * as Joi from 'joi';

const router = Router();

// ============================================
// 验证 Schema
// ============================================

const createItemSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  warehouse: Joi.string().max(50).required(),
  quantity: Joi.number().integer().min(0).required(),
  minStock: Joi.number().integer().min(0).default(10),
  maxStock: Joi.number().integer().min(1).default(100),
  location: Joi.string().max(50).optional(),
  batchNumber: Joi.string().max(50).optional(),
  expiryDate: Joi.date().optional(),
});

const stockInSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  warehouse: Joi.string().max(50).required(),
  quantity: Joi.number().integer().positive().required(),
  reference: Joi.string().max(50).required(),
  note: Joi.string().max(200).optional(),
  unitCost: Joi.number().min(0).optional(),
});

const stockOutSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  warehouse: Joi.string().max(50).required(),
  quantity: Joi.number().integer().positive().required(),
  reference: Joi.string().max(50).required(),
  note: Joi.string().max(200).optional(),
  destination: Joi.string().max(100).optional(),
});

const transferSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  fromWarehouse: Joi.string().max(50).required(),
  toWarehouse: Joi.string().max(50).required(),
  quantity: Joi.number().integer().positive().required(),
  note: Joi.string().max(200).optional(),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  productId: Joi.number().integer().positive().optional(),
  warehouse: Joi.string().optional(),
  lowStockOnly: Joi.boolean().default(false),
  keyword: Joi.string().optional(),
  sortBy: Joi.string().valid('productId', 'quantity', 'warehouse', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const transactionQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  productId: Joi.number().integer().positive().optional(),
  warehouse: Joi.string().optional(),
  type: Joi.string().valid('in', 'out', 'transfer', 'adjustment').optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
});

// ============================================
// 路由定义
// ============================================

/**
 * 创建库存项
 * POST /api/v1/inventory/items
 * 权限: inventory:item:create
 */
router.post(
  '/items',
  authMiddleware({ required: true, permissions: ['inventory:item:create'] }),
  validate(createItemSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await inventoryController.createInventoryItem(req.validatedBody);
    res.status(201).json({
      success: true,
      data: result,
      message: '库存项创建成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取库存列表
 * GET /api/v1/inventory/items
 * 权限: inventory:item:list
 */
router.get(
  '/items',
  authMiddleware({ required: true, permissions: ['inventory:item:list'] }),
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit, sortBy, sortOrder, ...filters } = req.validatedQuery;
    const result = await inventoryController.getInventoryList({
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
 * 获取库存详情
 * GET /api/v1/inventory/items/:id
 * 权限: inventory:item:view
 */
router.get(
  '/items/:id',
  authMiddleware({ required: true, permissions: ['inventory:item:view'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await inventoryController.getInventoryItemById(id);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 入库操作
 * POST /api/v1/inventory/stock/in
 * 权限: inventory:stock:in
 */
router.post(
  '/stock/in',
  authMiddleware({ required: true, permissions: ['inventory:stock:in'] }),
  validate(stockInSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await inventoryController.stockIn(req.validatedBody);
    res.json({
      success: true,
      data: result,
      message: '入库操作成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 出库操作
 * POST /api/v1/inventory/stock/out
 * 权限: inventory:stock:out
 */
router.post(
  '/stock/out',
  authMiddleware({ required: true, permissions: ['inventory:stock:out'] }),
  validate(stockOutSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await inventoryController.stockOut(req.validatedBody);
    res.json({
      success: true,
      data: result,
      message: '出库操作成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 库存调拨
 * POST /api/v1/inventory/transfer
 * 权限: inventory:transfer
 */
router.post(
  '/transfer',
  authMiddleware({ required: true, permissions: ['inventory:transfer'] }),
  validate(transferSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await inventoryController.transferStock(req.validatedBody);
    res.json({
      success: true,
      data: result,
      message: '库存调拨成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取库存变动流水
 * GET /api/v1/inventory/transactions
 * 权限: inventory:transaction:list
 */
router.get(
  '/transactions',
  authMiddleware({ required: true, permissions: ['inventory:transaction:list'] }),
  validate(transactionQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit, ...filters } = req.validatedQuery;
    const result = await inventoryController.getStockTransactions({
      page,
      limit,
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
 * 获取低库存预警列表
 * GET /api/v1/inventory/low-stock
 * 权限: inventory:stats
 */
router.get(
  '/low-stock',
  authMiddleware({ required: true, permissions: ['inventory:stats'] }),
  asyncHandler(async (req, res) => {
    const result = await inventoryController.getLowStockItems();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取库存统计
 * GET /api/v1/inventory/stats
 * 权限: inventory:stats
 */
router.get(
  '/stats/overview',
  authMiddleware({ required: true, permissions: ['inventory:stats'] }),
  asyncHandler(async (req, res) => {
    const result = await inventoryController.getInventoryStats();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;