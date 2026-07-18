/**
 * @file auth.routes.js
 * @description 认证路由
 * @module routes/auth
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const Joi = require('joi');

// ============================================================
// 控制器函数 (内联实现)
// ============================================================

// 模拟用户数据 (实际应从数据库获取)
const users = [
    {
        id: 1,
        email: 'admin@example.com',
        password: '$2a$10$hashedpassword', // 实际使用 bcrypt
        name: 'Admin User',
        role: 'admin',
        status: 'active'
    }
];

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', validate(
    Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
), async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 查找用户
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '邮箱或密码错误'
            });
        }
        
        // 实际项目中验证密码
        // const isValid = await bcrypt.compare(password, user.password);
        // if (!isValid) { ... }
        
        // 生成 JWT (简化版)
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            },
            message: '登录成功',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '登录失败',
            error: error.message
        });
    }
});

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register', validate(
    Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().optional(),
        phone: Joi.string().optional()
    })
), async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        
        // 检查用户是否已存在
        const existing = users.find(u => u.email === email);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: '邮箱已被注册'
            });
        }
        
        // 实际项目中加密密码
        // const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: users.length + 1,
            email,
            password: 'hashed_password', // 实际使用 bcrypt
            name: name || '',
            phone: phone || '',
            role: 'user',
            status: 'active'
        };
        
        users.push(newUser);
        
        res.status(201).json({
            success: true,
            message: '注册成功',
            data: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '注册失败',
            error: error.message
        });
    }
});

/**
 * 用户登出
 * POST /api/auth/logout
 */
router.post('/logout', authenticate, async (req, res) => {
    res.json({
        success: true,
        message: '登出成功',
        timestamp: new Date().toISOString()
    });
});

/**
 * 刷新 Token
 * POST /api/auth/refresh
 */
router.post('/refresh', authenticate, async (req, res) => {
    try {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { id: req.user.id, email: req.user.email, role: req.user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            data: { token },
            message: 'Token 刷新成功',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '刷新 Token 失败',
            error: error.message
        });
    }
});

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        res.json({
            success: true,
            data: req.user,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取用户信息失败',
            error: error.message
        });
    }
});

module.exports = router;
