/**
 * @file customers.routes.js
 * @description 客户路由
 * @module routes/customers
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const Joi = require('joi');

// ============================================================
// 模拟数据
// ============================================================
let customers = [
    {
        id: 1,
        name: '张三',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        address: '北京市朝阳区',
        level: 'gold',
        total_spent: 15000,
        created_at: new Date('2026-01-01'),
        updated_at: new Date('2026-01-01')
    },
    {
        id: 2,
        name: '李四',
        phone: '13800138002',
        email: 'lisi@example.com',
        address: '上海市浦东新区',
        level: 'silver',
        total_spent: 8000,
        created_at: new Date('2026-01-15'),
        updated_at: new Date('2026-01-15')
    }
];

// ============================================================
// 路由定义
// ============================================================

router.get('/', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 10, keyword, level } = req.query;
        let filtered = [...customers];
        
        if (level) {
            filtered = filtered.filter(c => c.level === level);
        }
        if (keyword) {
            filtered = filtered.filter(c => 
                c.name.includes(keyword) || c.phone.includes(keyword) || c.email.includes(keyword)
            );
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
            message: '获取客户列表失败',
            error: error.message
        });
    }
});

router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const customer = customers.find(c => c.id === parseInt(id));
        
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: '客户不存在'
            });
        }
        
        res.json({
            success: true,
            data: customer,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取客户失败',
            error: error.message
        });
    }
});

router.post('/', authenticate, authorize('admin'), validate(
    Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().optional(),
        address: Joi.string().optional(),
        level: Joi.string().valid('bronze', 'silver', 'gold', 'platinum').default('bronze')
    })
), async (req, res) => {
    try {
        const customerData = req.body;
        const newCustomer = {
            id: customers.length + 1,
            ...customerData,
            total_spent: 0,
            created_at: new Date(),
            updated_at: new Date()
        };
        
        customers.push(newCustomer);
        
        res.status(201).json({
            success: true,
            message: '客户创建成功',
            data: newCustomer,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '创建客户失败',
            error: error.message
        });
    }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const index = customers.findIndex(c => c.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: '客户不存在'
            });
        }
        
        const updated = {
            ...customers[index],
            ...req.body,
            updated_at: new Date()
        };
        
        customers[index] = updated;
        
        res.json({
            success: true,
            message: '客户更新成功',
            data: updated,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '更新客户失败',
            error: error.message
        });
    }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const index = customers.findIndex(c => c.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: '客户不存在'
            });
        }
        
        customers.splice(index, 1);
        
        res.json({
            success: true,
            message: '客户删除成功',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '删除客户失败',
            error: error.message
        });
    }
});

module.exports = router;
