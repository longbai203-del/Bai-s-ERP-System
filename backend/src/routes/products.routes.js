/**
 * @file products.routes.js
 * @description 产品路由
 * @module routes/products
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const Joi = require('joi');

// ============================================================
// 模拟数据
// ============================================================
let products = [
    {
        id: 1,
        sku: 'SKU-0001',
        name: 'iPhone 15 Pro',
        description: '苹果最新旗舰手机',
        price: 7999.00,
        cost: 6500.00,
        stock: 50,
        category: '电子产品',
        images: ['/images/iphone15.jpg'],
        status: 'active',
        created_at: new Date('2026-01-01'),
        updated_at: new Date('2026-01-01')
    },
    {
        id: 2,
        sku: 'SKU-0002',
        name: 'MacBook Air',
        description: '苹果轻薄笔记本电脑',
        price: 9499.00,
        cost: 7800.00,
        stock: 30,
        category: '电子产品',
        images: ['/images/macbook.jpg'],
        status: 'active',
        created_at: new Date('2026-01-15'),
        updated_at: new Date('2026-01-15')
    }
];

// ============================================================
// 路由定义
// ============================================================

router.get('/', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status, keyword } = req.query;
        let filtered = [...products];
        
        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }
        if (status) {
            filtered = filtered.filter(p => p.status === status);
        }
        if (keyword) {
            filtered = filtered.filter(p => 
                p.name.includes(keyword) || p.sku.includes(keyword)
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
            message: '获取产品列表失败',
            error: error.message
        });
    }
});

router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const product = products.find(p => p.id === parseInt(id));
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: '产品不存在'
            });
        }
        
        res.json({
            success: true,
            data: product,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取产品失败',
            error: error.message
        });
    }
});

router.post('/', authenticate, authorize('admin'), validate(
    Joi.object({
        sku: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().optional(),
        price: Joi.number().min(0).required(),
        cost: Joi.number().min(0).optional(),
        stock: Joi.number().min(0).default(0),
        category: Joi.string().optional(),
        images: Joi.array().items(Joi.string()).optional(),
        status: Joi.string().valid('active', 'inactive', 'draft').default('active')
    })
), async (req, res) => {
    try {
        const productData = req.body;
        
        // 检查 SKU 是否已存在
        const existing = products.find(p => p.sku === productData.sku);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `SKU ${productData.sku} 已存在`
            });
        }
        
        const newProduct = {
            id: products.length + 1,
            ...productData,
            created_at: new Date(),
            updated_at: new Date()
        };
        
        products.push(newProduct);
        
        res.status(201).json({
            success: true,
            message: '产品创建成功',
            data: newProduct,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '创建产品失败',
            error: error.message
        });
    }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const index = products.findIndex(p => p.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: '产品不存在'
            });
        }
        
        const updated = {
            ...products[index],
            ...req.body,
            updated_at: new Date()
        };
        
        products[index] = updated;
        
        res.json({
            success: true,
            message: '产品更新成功',
            data: updated,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '更新产品失败',
            error: error.message
        });
    }
});

router.put('/:id/stock', authenticate, authorize('admin'), validate(
    Joi.object({
        quantity: Joi.number().integer().required(),
        operation: Joi.string().valid('add', 'subtract').required()
    })
), async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, operation } = req.body;
        const index = products.findIndex(p => p.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: '产品不存在'
            });
        }
        
        const newStock = operation === 'add' 
            ? products[index].stock + quantity 
            : products[index].stock - quantity;
            
        if (newStock < 0) {
            return res.status(400).json({
                success: false,
                message: '库存不足'
            });
        }
        
        products[index].stock = newStock;
        products[index].updated_at = new Date();
        
        res.json({
            success: true,
            message: '库存更新成功',
            data: products[index],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '更新库存失败',
            error: error.message
        });
    }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const index = products.findIndex(p => p.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: '产品不存在'
            });
        }
        
        products.splice(index, 1);
        
        res.json({
            success: true,
            message: '产品删除成功',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '删除产品失败',
            error: error.message
        });
    }
});

module.exports = router;
