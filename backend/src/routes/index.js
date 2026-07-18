/**
 * @file routes/index.js
 * @description 路由汇总 - 统一注册所有API路由
 * @module routes/index
 */

import express from 'express';

// ============================================================
// 导入所有路由模块
// ============================================================
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import orderRoutes from './order.routes.js';
import productRoutes from './product.routes.js';
import customerRoutes from './customer.routes.js';
import newModuleRoutes from './new-module.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import settingsRoutes from './settings.routes.js';

// ============================================================
// 创建主路由
// ============================================================
const router = express.Router();

// ============================================================
// API 版本信息
// ============================================================
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'ERP System API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            orders: '/api/orders',
            products: '/api/products',
            customers: '/api/customers',
            'new-module': '/api/new-module',
            dashboard: '/api/dashboard',
            settings: '/api/settings'
        }
    });
});

// ============================================================
// 健康检查
// ============================================================
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ============================================================
// 挂载路由模块
// ============================================================

// ----- 认证模块 -----
// POST   /api/auth/login      - 用户登录
// POST   /api/auth/register   - 用户注册
// POST   /api/auth/logout     - 用户登出
// POST   /api/auth/refresh    - 刷新令牌
// GET    /api/auth/me         - 获取当前用户信息
// POST   /api/auth/forgot-password - 忘记密码
// POST   /api/auth/reset-password  - 重置密码
router.use('/auth', authRoutes);

// ----- 用户管理模块 -----
// GET    /api/users           - 获取用户列表
// GET    /api/users/:id       - 获取用户详情
// POST   /api/users           - 创建用户
// PUT    /api/users/:id       - 更新用户
// DELETE /api/users/:id       - 删除用户
// GET    /api/users/:id/permissions - 获取用户权限
// PUT    /api/users/:id/permissions - 更新用户权限
router.use('/users', userRoutes);

// ----- 订单管理模块 -----
// GET    /api/orders          - 获取订单列表
// GET    /api/orders/:id      - 获取订单详情
// POST   /api/orders          - 创建订单
// PUT    /api/orders/:id      - 更新订单
// DELETE /api/orders/:id      - 删除订单
// PATCH  /api/orders/:id/status - 更新订单状态
// GET    /api/orders/stats    - 获取订单统计
// GET    /api/orders/export   - 导出订单
router.use('/orders', orderRoutes);

// ----- 商品管理模块 -----
// GET    /api/products        - 获取商品列表
// GET    /api/products/all    - 获取所有商品（导出用）
// GET    /api/products/:id    - 获取商品详情
// POST   /api/products        - 创建商品
// PUT    /api/products/:id    - 更新商品
// DELETE /api/products/:id    - 删除商品
// GET    /api/products/search  - 搜索商品
// GET    /api/products/categories - 获取分类列表
// GET    /api/products/stats  - 获取商品统计
// POST   /api/products/stock/log - 创建库存日志
router.use('/products', productRoutes);

// ----- 客户管理模块 -----
// GET    /api/customers       - 获取客户列表
// GET    /api/customers/:id   - 获取客户详情
// POST   /api/customers       - 创建客户
// PUT    /api/customers/:id   - 更新客户
// DELETE /api/customers/:id   - 删除客户
// GET    /api/customers/search - 搜索客户
// GET    /api/customers/stats - 获取客户统计
router.use('/customers', customerRoutes);

// ----- 新模块（示例） -----
// GET    /api/new-module      - 获取列表
// GET    /api/new-module/:id  - 获取详情
// POST   /api/new-module      - 创建
// PUT    /api/new-module/:id  - 更新
// DELETE /api/new-module/:id  - 删除
router.use('/new-module', newModuleRoutes);

// ----- 仪表盘模块 -----
// GET    /api/dashboard/stats  - 获取仪表盘统计
// GET    /api/dashboard/chart  - 获取图表数据
// GET    /api/dashboard/today  - 获取今日概览
// GET    /api/dashboard/activities - 获取最近活动
router.use('/dashboard', dashboardRoutes);

// ----- 系统设置模块 -----
// GET    /api/settings        - 获取系统设置
// PUT    /api/settings        - 更新系统设置
// GET    /api/settings/profile - 获取个人设置
// PUT    /api/settings/profile - 更新个人设置
// GET    /api/settings/company - 获取公司信息
// PUT    /api/settings/company - 更新公司信息
// GET    /api/settings/system - 获取系统参数
// PUT    /api/settings/system - 更新系统参数
router.use('/settings', settingsRoutes);

// ============================================================
// 404 处理（未匹配的路由）
// ============================================================
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        code: 404,
        message: 'API 端点不存在',
        path: req.originalUrl,
        timestamp: Date.now()
    });
});

// ============================================================
// 导出路由
// ============================================================
export default router;
