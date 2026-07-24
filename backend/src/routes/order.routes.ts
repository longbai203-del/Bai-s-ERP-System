/**
 * @file Routes/order.routes.ts
 * 订单管理路由 - 完整的订单生命周期管理
 * 完整实现：补全订单创建、查询、状态流转、取消、退款、批量处理接口，状态机校验
 */

import { Router } from 'express';
import { asyncHandler } from '../src/middlewares/error-handler.middleware';
import { authMiddleware } from '../src/middlewares/auth.middleware';
import { validate } from '../src/middlewares/validation.middleware';
import { orderController } from '../src/Controllers';
import * as Joi from 'joi';

const router = Router();

// ============================================
// 验证 Schema
// ============================================

const createOrderSchema = Joi.object({
  customerId: Joi.number().integer().positive().required(),
  orderDate: Joi.date().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.number().integer().positive().required(),
      quantity: Joi.number().integer().positive().required(),
      unitPrice: Joi.number().positive().required(),
      discount: Joi.number().min(0).max(100).default(0),
    })
  ).min(1).required(),
  shippingAddress: Joi.string().max(200).required(),
  notes: Joi.string().max(500).optional(),
  shippingMethod: Joi.string().max(50).optional(),
  expectedDeliveryDate: Joi.date().greater(Joi.ref('orderDate')).optional(),
  status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').default('pending'),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').required(),
  reason: Joi.string().max(200).optional(),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  customerId: Joi.number().integer().positive().optional(),
  status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  minAmount: Joi.number().positive().optional(),
  maxAmount: Joi.number().positive().optional(),
  keyword: Joi.string().optional(),
  sortBy: Joi.string().valid('orderDate', 'totalAmount', 'status', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const batchStatusSchema = Joi.object({
  ids: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
  status: Joi.string().valid('confirmed', 'processing', 'shipped', 'delivered', 'cancelled').required(),
  reason: Joi.string().max(200).optional(),
});

const cancelSchema = Joi.object({
  reason: Joi.string().max(200).required(),
});

const refundSchema = Joi.object({
  reason: Joi.string().max(200).required(),
  amount: Joi.number().positive().optional(),
  refundMethod: Joi.string().valid('original', 'cash', 'bank_transfer').default('original'),
});

// ============================================
// 路由定义
// ============================================

/**
 * 创建订单
 * POST /api/v1/orders
 */
router.post(
  '/',
  authMiddleware({ required: true, permissions: ['order:create'] }),
  validate(createOrderSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await orderController.createOrder(req.validatedBody);
    res.status(201).json({
      success: true,
      data: result,
      message: '订单创建成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取订单列表
 * GET /api/v1/orders
 */
router.get(
  '/',
  authMiddleware({ required: true, permissions: ['order:list'] }),
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit, sortBy, sortOrder, ...filters } = req.validatedQuery;
    const result = await orderController.getOrderList({
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
 * 获取订单详情
 * GET /api/v1/orders/:id
 */
router.get(
  '/:id',
  authMiddleware({ required: true, permissions: ['order:view'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await orderController.getOrderById(id);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 更新订单
 * PUT /api/v1/orders/:id
 */
router.put(
  '/:id',
  authMiddleware({ required: true, permissions: ['order:update'] }),
  validate(idParamSchema, 'params'),
  validate(createOrderSchema.optional(), 'body'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await orderController.updateOrder(id, req.validatedBody);
    res.json({
      success: true,
      data: result,
      message: '订单更新成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 更新订单状态（状态机流转）
 * PATCH /api/v1/orders/:id/status
 */
router.patch(
  '/:id/status',
  authMiddleware({ required: true, permissions: ['order:update-status'] }),
  validate(idParamSchema, 'params'),
  validate(updateStatusSchema, 'body'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const { status, reason } = req.validatedBody;
    const result = await orderController.updateOrderStatus(id, status, reason);
    res.json({
      success: true,
      data: result,
      message: `订单状态已更新为: ${status}`,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 取消订单
 * POST /api/v1/orders/:id/cancel
 */
router.post(
  '/:id/cancel',
  authMiddleware({ required: true, permissions: ['order:cancel'] }),
  validate(idParamSchema, 'params'),
  validate(cancelSchema, 'body'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const { reason } = req.validatedBody;
    const result = await orderController.cancelOrder(id, reason);
    res.json({
      success: true,
      data: result,
      message: '订单已取消',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 退款订单
 * POST /api/v1/orders/:id/refund
 */
router.post(
  '/:id/refund',
  authMiddleware({ required: true, permissions: ['order:refund'] }),
  validate(idParamSchema, 'params'),
  validate(refundSchema, 'body'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await orderController.refundOrder(id, req.validatedBody);
    res.json({
      success: true,
      data: result,
      message: '退款成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 删除订单
 * DELETE /api/v1/orders/:id
 */
router.delete(
  '/:id',
  authMiddleware({ required: true, permissions: ['order:delete'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    await orderController.deleteOrder(id);
    res.json({
      success: true,
      message: '订单删除成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 批量更新订单状态
 * PATCH /api/v1/orders/batch/status
 */
router.patch(
  '/batch/status',
  authMiddleware({ required: true, permissions: ['order:batch-update'] }),
  validate(batchStatusSchema, 'body'),
  asyncHandler(async (req, res) => {
    const { ids, status, reason } = req.validatedBody;
    const result = await orderController.batchUpdateStatus(ids, status, reason);
    res.json({
      success: true,
      data: result,
      message: `批量更新状态成功，影响 ${result.affected} 条记录`,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取订单统计概览
 * GET /api/v1/orders/stats
 */
router.get(
  '/stats/overview',
  authMiddleware({ required: true, permissions: ['order:stats'] }),
  asyncHandler(async (req, res) => {
    const result = await orderController.getOrderStats();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取客户订单统计
 * GET /api/v1/orders/customers/:customerId/stats
 */
router.get(
  '/customers/:customerId/stats',
  authMiddleware({ required: true, permissions: ['order:view'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const customerId = req.validatedParams.id;
    const result = await orderController.getCustomerOrderSummary(customerId);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;