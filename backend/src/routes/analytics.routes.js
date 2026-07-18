/**
 * @file analytics.routes.js
 * @description 分析路由
 * @module routes/analytics
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// ============================================================
// 路由定义
// ============================================================

router.get('/overview', authenticate, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                revenue: 125000,
                orders: 356,
                customers: 89,
                growth: 15.5,
                trends: {
                    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                    values: [18000, 22000, 19000, 25000, 28000, 32000]
                }
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取分析数据失败',
            error: error.message
        });
    }
});

module.exports = router;
