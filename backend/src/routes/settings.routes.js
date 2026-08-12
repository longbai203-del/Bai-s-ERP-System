/**
 * @file settings.routes.js
 * @description 系统设置路由
 * @module routes/settings
 */

import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import { success, error } from '../utils/response.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// 所有设置路由都需要认证
router.use(authMiddleware);

// ===== 系统设置 =====
// 获取系统设置（仅管理员）
router.get('/', roleMiddleware(['admin', 'owner']), async (req, res) => {
    try {
        // TODO: 从数据库获取系统设置
        const settings = {
            companyName: '企业管理系统',
            companyLogo: '/logo.png',
            timezone: 'Asia/Shanghai',
            currency: 'CNY',
            dateFormat: 'YYYY-MM-DD',
            language: 'zh-CN'
        };
        return success(res, settings, '获取设置成功');
    } catch (err) {
        logger.error('[Settings] GET / error:', err);
        return error(res, '获取设置失败', 500);
    }
});

// 更新系统设置（仅管理员）
router.put('/', roleMiddleware(['admin', 'owner']), async (req, res) => {
    try {
        const data = req.body;
        // TODO: 更新数据库中的系统设置
        return success(res, data, '更新设置成功');
    } catch (err) {
        logger.error('[Settings] PUT / error:', err);
        return error(res, '更新设置失败', 500);
    }
});

// ===== 个人设置 =====
// 获取个人设置
router.get('/profile', async (req, res) => {
    try {
        // TODO: 获取当前用户的个人设置
        const profile = {
            userId: req.userId,
            username: req.user?.username,
            email: req.user?.email,
            avatar: req.user?.avatar,
            theme: 'light',
            notifications: true
        };
        return success(res, profile, '获取个人设置成功');
    } catch (err) {
        logger.error('[Settings] GET /profile error:', err);
        return error(res, '获取个人设置失败', 500);
    }
});

// 更新个人设置
router.put('/profile', async (req, res) => {
    try {
        const data = req.body;
        // TODO: 更新当前用户的个人设置
        return success(res, data, '更新个人设置成功');
    } catch (err) {
        logger.error('[Settings] PUT /profile error:', err);
        return error(res, '更新个人设置失败', 500);
    }
});

// ===== 公司信息（仅管理员） =====
router.get('/company', roleMiddleware(['admin', 'owner']), async (req, res) => {
    try {
        // TODO: 获取公司信息
        const company = {
            name: '示例公司',
            address: '北京市朝阳区',
            phone: '010-88888888',
            email: 'info@example.com',
            website: 'https://example.com',
            taxNumber: '123456789012345',
            registrationNumber: '123456789012345'
        };
        return success(res, company, '获取公司信息成功');
    } catch (err) {
        logger.error('[Settings] GET /company error:', err);
        return error(res, '获取公司信息失败', 500);
    }
});

router.put('/company', roleMiddleware(['admin', 'owner']), async (req, res) => {
    try {
        const data = req.body;
        // TODO: 更新公司信息
        return success(res, data, '更新公司信息成功');
    } catch (err) {
        logger.error('[Settings] PUT /company error:', err);
        return error(res, '更新公司信息失败', 500);
    }
});

// ===== 系统参数（仅管理员） =====
router.get('/system', roleMiddleware(['admin', 'owner']), async (req, res) => {
    try {
        // TODO: 获取系统参数
        const system = {
            maintenanceMode: false,
            allowRegistration: true,
            maxLoginAttempts: 5,
            sessionTimeout: 3600,
            fileUploadMaxSize: 10,
            backupEnabled: true,
            backupSchedule: 'daily'
        };
        return success(res, system, '获取系统参数成功');
    } catch (err) {
        logger.error('[Settings] GET /system error:', err);
        return error(res, '获取系统参数失败', 500);
    }
});

router.put('/system', roleMiddleware(['admin', 'owner']), async (req, res) => {
    try {
        const data = req.body;
        // TODO: 更新系统参数
        return success(res, data, '更新系统参数成功');
    } catch (err) {
        logger.error('[Settings] PUT /system error:', err);
        return error(res, '更新系统参数失败', 500);
    }
});

export default router;