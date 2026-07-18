/**
 * @file index.js
 * @description 路由层统一入口
 * @module routes
 */

const express = require('express');
const router = express.Router();

// 导入路由模块
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const orderRoutes = require('./orders.routes');
const productRoutes = require('./products.routes');
const customerRoutes = require('./customers.routes');
const dashboardRoutes = require('./dashboard.routes');
const analyticsRoutes = require('./analytics.routes');
const reportsRoutes = require('./reports.routes');
const settingsRoutes = require('./settings.routes');

// ============================================================
// 路由挂载
// ============================================================

// 认证路由 (公开)
router.use('/auth', authRoutes);

// 用户路由
router.use('/users', userRoutes);

// 订单路由
router.use('/orders', orderRoutes);

// 产品路由
router.use('/products', productRoutes);

// 客户路由
router.use('/customers', customerRoutes);

// 仪表板路由
router.use('/dashboard', dashboardRoutes);

// 分析路由
router.use('/analytics', analyticsRoutes);

// 报表路由
router.use('/reports', reportsRoutes);

// 设置路由
router.use('/settings', settingsRoutes);

// ============================================================
// 系统路由
// ============================================================

/**
 * GET /api/health
 * @description 健康检查
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: require('../../package.json').version || '1.0.0',
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
    });
});

/**
 * GET /api/version
 * @description API版本信息
 */
router.get('/version', (req, res) => {
    res.json({
        version: require('../../package.json').version || '1.0.0',
        name: require('../../package.json').name || 'ERP API',
        description: require('../../package.json').description || 'Bai\'s ERP System API',
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
    });
});

module.exports = router;
