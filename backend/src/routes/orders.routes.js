/**
 * @file orders.routes.js
 * @description 订单路由
 * @module routes/orders.routes
 */

import express from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 所有订单路由需要认证
router.use(authMiddleware);

/**
 * @route GET /api/orders
 * @description 获取订单列表
 * @access Private
 */
router.get('/', orderController.getList);

/**
 * @route GET /api/orders/stats
 * @description 获取订单统计
 * @access Private
 */
router.get('/stats', orderController.getStats);

/**
 * @route GET /api/orders/:id
 * @description 获取订单详情
 * @access Private
 */
router.get('/:id', orderController.getDetail);

/**
 * @route POST /api/orders
 * @description 创建订单
 * @access Private
 */
router.post('/', orderController.create);

/**
 * @route PUT /api/orders/:id
 * @description 更新订单
 * @access Private
 */
router.put('/:id', orderController.update);

/**
 * @route DELETE /api/orders/:id
 * @description 删除订单
 * @access Private
 */
router.delete('/:id', orderController.delete);

/**
 * @route PATCH /api/orders/:id/status
 * @description 更新订单状态
 * @access Private
 */
router.patch('/:id/status', orderController.updateStatus);

export default router;