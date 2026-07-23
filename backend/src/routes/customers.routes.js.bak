/**
 * @file customers.routes.js
 * @description 客户路由
 * @module routes/customers.routes
 */

import express from 'express';
import { customerController } from '../controllers/customer.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 所有客户路由需要认证
router.use(authMiddleware);

/**
 * @route GET /api/customers
 * @description 获取客户列表
 * @access Private
 */
router.get('/', customerController.getList);

/**
 * @route GET /api/customers/stats
 * @description 获取客户统计
 * @access Private
 */
router.get('/stats', customerController.getStats);

/**
 * @route GET /api/customers/search
 * @description 搜索客户
 * @access Private
 */
router.get('/search', customerController.search);

/**
 * @route GET /api/customers/:id
 * @description 获取客户详情
 * @access Private
 */
router.get('/:id', customerController.getDetail);

/**
 * @route POST /api/customers
 * @description 创建客户
 * @access Private
 */
router.post('/', customerController.create);

/**
 * @route PUT /api/customers/:id
 * @description 更新客户
 * @access Private
 */
router.put('/:id', customerController.update);

/**
 * @route DELETE /api/customers/:id
 * @description 删除客户
 * @access Private
 */
router.delete('/:id', customerController.delete);

export default router;