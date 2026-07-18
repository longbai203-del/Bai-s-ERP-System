/**
 * @file user.routes.js
 * @description 用户路由
 * @module routes/user
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const Joi = require('joi');

// ============================================================
// 模拟数据
// ============================================================
let users = [
    {
        id: 1,
        email: 'admin@example.com',
        name: '管理员',
        role: 'admin',
        status: 'active',
        created_at: new Date('2026-01-01')
    },
    {
        id: 2,
        email: 'user@example.com',
        name: '普通用户',
        role: 'user',
        status: 'active',
        created_at: new Date('2026-01-15')
    }
];

// ============================================================
// 路由定义
// ============================================================

router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 10, role, status, keyword } = req.query;
        let filtered = [...users];
        
        if (role) filtered = filtered.filter(u => u.role === role);
        if (status) filtered = filtered.filter(u => u.status === status);
        if (keyword) filtered = filtered.filter(u => u.name.includes(keyword) || u.email.includes(keyword));
        
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
            message: '获取用户列表失败',
            error: error.message
        });
    }
});

module.exports = router;
