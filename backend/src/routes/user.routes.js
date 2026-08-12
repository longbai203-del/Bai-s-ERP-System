/**
 * @file user.routes.js
 * @description 用户管理路由
 * @module routes/user.routes
 */

import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 所有用户路由需要认证
router.use(authMiddleware);

/**
 * @route GET /api/users
 * @description 获取用户列表（仅管理员）
 * @access Private - Admin/Owner only
 */
router.get('/', roleMiddleware(['admin', 'owner']), userController.getList);

/**
 * @route GET /api/users/stats
 * @description 获取用户统计（仅管理员）
 * @access Private - Admin/Owner only
 */
router.get('/stats', roleMiddleware(['admin', 'owner']), userController.getStats);

/**
 * @route GET /api/users/search
 * @description 搜索用户（仅管理员）
 * @access Private - Admin/Owner only
 */
router.get('/search', roleMiddleware(['admin', 'owner']), userController.search);

/**
 * @route GET /api/users/:id
 * @description 获取用户详情
 * @access Private - Admin/Owner 或本人
 */
router.get('/:id', userController.getDetail);

/**
 * @route GET /api/users/:id/permissions
 * @description 获取用户权限（仅管理员）
 * @access Private - Admin/Owner only
 */
router.get('/:id/permissions', roleMiddleware(['admin', 'owner']), userController.getPermissions);

/**
 * @route POST /api/users
 * @description 创建用户（仅管理员）
 * @access Private - Admin/Owner only
 */
router.post('/', roleMiddleware(['admin', 'owner']), userController.create);

/**
 * @route PUT /api/users/:id
 * @description 更新用户
 * @access Private - Admin/Owner 或本人
 */
router.put('/:id', userController.update);

/**
 * @route PUT /api/users/:id/permissions
 * @description 更新用户权限（仅管理员）
 * @access Private - Admin/Owner only
 */
router.put('/:id/permissions', roleMiddleware(['admin', 'owner']), userController.updatePermissions);

/**
 * @route DELETE /api/users/:id
 * @description 删除用户（仅管理员）
 * @access Private - Admin/Owner only
 */
router.delete('/:id', roleMiddleware(['admin', 'owner']), userController.delete);

/**
 * @route POST /api/users/:id/activate
 * @description 激活用户（仅管理员）
 * @access Private - Admin/Owner only
 */
router.post('/:id/activate', roleMiddleware(['admin', 'owner']), userController.activate);

/**
 * @route POST /api/users/:id/deactivate
 * @description 禁用用户（仅管理员）
 * @access Private - Admin/Owner only
 */
router.post('/:id/deactivate', roleMiddleware(['admin', 'owner']), userController.deactivate);

export default router;