/**
 * 路由层 - 统一导出
 */
const express = require('express');
const router = express.Router();

// 导入路由模块
const userRoutes = require('./user.routes');
const orderRoutes = require('./order.routes');
const productRoutes = require('./product.routes');
const dashboardRoutes = require('./dashboard.routes');
const analyticsRoutes = require('./analytics.routes');
const reportRoutes = require('./report.routes');
const settingsRoutes = require('./settings.routes');

// 挂载路由
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportRoutes);
router.use('/settings', settingsRoutes);

// 健康检查
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: require('../../package.json').version || '1.0.0'
    });
});

// API 版本信息
router.get('/version', (req, res) => {
    res.json({
        version: require('../../package.json').version || '1.0.0',
        name: require('../../package.json').name || 'ERP API',
        description: require('../../package.json').description || 'Bai\'s ERP System API'
    });
});

module.exports = router;
