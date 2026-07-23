/**
 * @file dashboard.routes.js
 * @description 仪表盘路由
 * @module routes/dashboard.routes
 */

import express from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 所有仪表盘路由需要认证
router.use(authMiddleware);

/**
 * @route GET /api/dashboard/stats
 * @description 获取仪表盘统计
 * @access Private
 */
router.get('/stats', dashboardController.getStats);

/**
 * @route GET /api/dashboard/chart
 * @description 获取图表数据
 * @access Private
 */
router.get('/chart', dashboardController.getChartData);

/**
 * @route GET /api/dashboard/today
 * @description 获取今日概览
 * @access Private
 */
router.get('/today', dashboardController.getTodayOverview);

/**
 * @route GET /api/dashboard/activities
 * @description 获取最近活动
 * @access Private
 */
router.get('/activities', dashboardController.getRecentActivities);

export default router;