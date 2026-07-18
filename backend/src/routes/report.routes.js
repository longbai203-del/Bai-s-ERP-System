/**
 * 报表路由
 */
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ReportController');
const { authenticate, authorize } = require('../middleware/auth');

// 所有报表路由需要认证
router.use(authenticate);

// 报表查询
router.get('/comprehensive', reportController.getComprehensiveReport.bind(reportController));
router.get('/orders', reportController.getOrderStats.bind(reportController));
router.get('/trends', reportController.getDailyTrends.bind(reportController));
router.get('/top-products', reportController.getTopProducts.bind(reportController));
router.get('/forecast', reportController.getSalesForecast.bind(reportController));
router.get('/export', reportController.exportReport.bind(reportController));
router.get('/products', reportController.getProductStats.bind(reportController));
router.get('/customers', reportController.getCustomerStats.bind(reportController));

module.exports = router;
