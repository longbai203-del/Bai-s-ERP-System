/**
 * @file auth.routes.js
 * @description 认证路由
 * @module routes/auth.routes
 */

import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description 用户注册
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @description 用户登录
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/auth/logout
 * @description 用户登出
 * @access Private
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @route GET /api/auth/me
 * @description 获取当前用户信息
 * @access Private
 */
router.get('/me', authMiddleware, authController.getMe);

/**
 * @route POST /api/auth/refresh
 * @description 刷新认证令牌
 * @access Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route POST /api/auth/change-password
 * @description 修改密码
 * @access Private
 */
router.post('/change-password', authMiddleware, authController.changePassword);

/**
 * @route POST /api/auth/reset-password
 * @description 重置密码
 * @access Public
 */
router.post('/reset-password', authController.resetPassword);

export default router;