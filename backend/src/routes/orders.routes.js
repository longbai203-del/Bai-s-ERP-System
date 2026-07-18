/**
 * @file orders.routes.js
 * @description 订单路由
 * @module routes/orders
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const Joi = require('joi');

// ============================================================
// 模拟数据 (实际应从数据库获取)
// ============================================================
let orders = [
    {
        id: 1,
        order_number: 'ORD20260101001',
        customer_id: 1,
        customer_name: '张三',
        total: 299.99,
        status: 'paid',
        payment_status: 'paid',
        items: [
            { product_id: 1, name: '产品A', quantity: 2, price: 99.99 },
            { product_id: 2, name: '产品B', quantity: 1, price: 100.01 }
        ],
        created_at: new Date('2026-01-01'),
        updated_at: new Date('2026-01-01')
    },
    {
        id: 2,
        order_number: 'ORD20260115002',
        customer_id: 2,
        customer_name: '李四',
        total: 159.50,
        status: 'pending',
        payment_status: 'unpaid',
        items: [
            { product_id: 3, name: '产品C', quantity: 3, price: 53.17 }
        ],
        created_at: new Date('2026-01-15'),
        updated_at: new Date('2026-01-15')
    }
];

// ============================================================
// 路由定义
// ============================================================

/**
 * GET /api/orders
 * 获取订单列表
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 10, status, customer_id } = req.query;
        let filtered = [...orders];
        
        if (status) {
            filtered = filtered.filter(o => o.status === status);
        }
        if (customer_id) {
            filtered = filtered.filter(o => o.customer_id === parseInt(customer_id));
        }
        
        const total = filtered.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const list = filtered.slice(start, end);
        
        res.json({
            success: true,
            data: list,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取订单列表失败',
            error: error.message
        });
    }
});

/**
 * GET /api/orders/:id
 * 获取订单详情
 */
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const order = orders.find(o => o.id === parseInt(id));
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: '订单不存在'
            });
        }
        
        res.json({
            success: true,
            data: order,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取订单失败',
            error: error.message
        });
    }
});

/**
 * POST /api/orders
 * 创建订单
 */
router.post('/', authenticate, validate(
    Joi.object({
        customer_id: Joi.number().required(),
        items: Joi.array().items(
            Joi.object({
                product_id: Joi.number().required(),
                quantity: Joi.number().min(1).required(),
                price: Joi.number().min(0).required()
            })
        ).min(1).required(),
        shipping_address: Joi.object().optional(),
        notes: Joi.string().optional()
    })
), async (req, res) => {
    try {
        const { customer_id, items, shipping_address, notes } = req.body;
        
        const newOrder = {
            id: orders.length + 1,
            order_number: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
            customer_id,
            customer_name: `客户${customer_id}`,
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: 'pending',
            payment_status: 'unpaid',
            items,
            shipping_address: shipping_address || {},
            notes: notes || '',
            created_at: new Date(),
            updated_at: new Date()
        };
        
        orders.push(newOrder);
        
        res.status(201).json({
            success: true,
            message: '订单创建成功',
            data: newOrder,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '创建订单失败',
            error: error.message
        });
    }
});

/**
 * PUT /api/orders/:id
 * 更新订单
 */
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const index = orders.findIndex(o => o.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: '订单不存在'
            });
        }
        
        const updated = {
            ...orders[index],
            ...req.body,
            updated_at: new Date()
        };
        
        orders[index] = updated;
        
        res.json({
            success: true,
            message: '订单更新成功',
            data: updated,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '更新订单失败',
            error: error.message
        });
    }
});

/**
 * PUT /api/orders/:id/status
 * 更新订单状态
 */
router.put('/:id/status', authenticate, validate(
    Joi.object({
        status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required()
    })
), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const index = orders.findIndex(o => o.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: '订单不存在'
            });
        }
        
        orders[index].status = status;
        orders[index].updated_at = new Date();
        
        res.json({
            success: true,
            message: '订单状态更新成功',
            data: orders[index],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '更新订单状态失败',
            error: error.message
        });
    }
});

/**
 * DELETE /api/orders/:id
 * 删除订单
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const index = orders.findIndex(o => o.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: '订单不存在'
            });
        }
        
        orders.splice(index, 1);
        
        res.json({
            success: true,
            message: '订单删除成功',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '删除订单失败',
            error: error.message
        });
    }
});

module.exports = router;
