/**
 * 分析路由
 */
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/AnalyticsController');
const { authenticate } = require('../middleware/auth');

// 所有分析路由需要认证
router.use(authenticate);

// 分析查询
router.get('/overview', analyticsController.getOverview.bind(analyticsController));
router.get('/customers', analyticsController.getCustomerAnalytics.bind(analyticsController));
router.get('/products', analyticsController.getProductAnalytics.bind(analyticsController));
router.get('/alerts', analyticsController.getAlerts.bind(analyticsController));
router.get('/performance', analyticsController.getPerformance.bind(analyticsController));
router.get('/activity', analyticsController.getRecentActivity.bind(analyticsController));

module.exports = router;
