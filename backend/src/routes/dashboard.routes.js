/**
 * @file dashboard.routes.js
 * @description 仪表板路由
 * @module routes/dashboard
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// ============================================================
// 路由定义
// ============================================================

router.get('/', authenticate, async (req, res) => {
    try {
        const stats = {
            totalRevenue: 125000.00,
            totalOrders: 356,
            totalCustomers: 89,
            totalProducts: 156,
            recentOrders: [
                { id: 1, order_number: 'ORD20260718001', customer: '张三', total: 299.99, status: 'paid', created_at: new Date() },
                { id: 2, order_number: 'ORD20260718002', customer: '李四', total: 159.50, status: 'pending', created_at: new Date() }
            ],
            lowStockProducts: [
                { id: 5, name: '产品E', stock: 3 },
                { id: 8, name: '产品H', stock: 5 }
            ],
            chartData: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                revenue: [12000, 15000, 18000, 14000, 20000, 16000, 13000],
                orders: [25, 32, 38, 28, 45, 35, 22]
            }
        };
        
        res.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取仪表板数据失败',
            error: error.message
        });
    }
});

module.exports = router;
