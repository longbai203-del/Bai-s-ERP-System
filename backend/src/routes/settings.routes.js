/**
 * @file settings.routes.js
 * @description 系统设置路由 - 完整实现
 * @module routes/settings
 * 
 * @route GET /api/settings - 获取所有设置
 * @route GET /api/settings/:key - 获取特定设置
 * @route PUT /api/settings/:key - 更新设置
 * @route POST /api/settings - 创建设置
 * @route DELETE /api/settings/:key - 删除设置
 * @route GET /api/settings/backup - 备份设置
 * @route POST /api/settings/restore - 恢复设置
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const Joi = require('joi');

// ============================================================
// 设置数据存储
// ============================================================
let settings = {
    // 系统设置
    system: {
        siteName: 'Bai\'s ERP System',
        siteDescription: '企业资源管理系统',
        siteLogo: '/logo.png',
        favicon: '/favicon.ico',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss',
        maintenanceMode: false,
        maintenanceMessage: '系统维护中，请稍后访问'
    },
    // 公司信息
    company: {
        name: 'Bai\'s Company',
        address: '中国上海浦东新区',
        phone: '+86 021-8888-8888',
        email: 'info@bais-company.com',
        website: 'https://www.bais-company.com',
        taxNumber: '310000000000000',
        registrationNumber: '310000000000000'
    },
    // 邮件设置
    email: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        authUser: 'noreply@bais-company.com',
        authPass: '********',
        from: 'Bai\'s ERP <noreply@bais-company.com>',
        templates: {
            welcome: 'welcome.html',
            resetPassword: 'reset-password.html',
            orderConfirmation: 'order-confirmation.html',
            invoice: 'invoice.html'
        }
    },
    // 通知设置
    notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        events: {
            orderCreated: true,
            orderUpdated: true,
            orderCancelled: true,
            paymentReceived: true,
            paymentFailed: true,
            inventoryLow: true,
            inventoryOut: true,
            userRegistered: true,
            userLogin: true,
            systemError: true
        },
        recipients: {
            admin: ['admin@bais-company.com'],
            manager: ['manager@bais-company.com'],
            support: ['support@bais-company.com']
        }
    },
    // 订单设置
    orders: {
        autoConfirm: true,
        autoShip: false,
        shippingMethods: ['standard', 'express', 'overnight'],
        paymentMethods: ['cash', 'card', 'transfer', 'wechat', 'alipay'],
        orderPrefix: 'ORD',
        orderNumberLength: 8,
        allowCancellation: true,
        cancellationWindow: 24, // 小时
        returnPolicy: '30天内支持退货'
    },
    // 产品设置
    products: {
        enableInventory: true,
        lowStockThreshold: 10,
        outOfStockThreshold: 0,
        allowBackorder: false,
        defaultTaxRate: 13,
        currency: 'CNY',
        priceFormat: 'decimal',
        decimalPlaces: 2,
        categories: ['电子产品', '服装', '食品', '家具', '文具']
    },
    // 用户设置
    users: {
        allowRegistration: true,
        requireEmailVerification: true,
        requirePhoneVerification: false,
        defaultRole: 'user',
        passwordMinLength: 6,
        passwordRequireSpecial: true,
        sessionTimeout: 3600, // 秒
        maxLoginAttempts: 5,
        lockoutDuration: 900 // 秒
    },
    // 安全设置
    security: {
        twoFactorEnabled: false,
        ipWhitelist: [],
        ipBlacklist: [],
        allowedOrigins: ['http://localhost:5173', 'https://*.vercel.app'],
        rateLimit: {
            enabled: true,
            windowMs: 15 * 60 * 1000,
            max: 100
        },
        corsEnabled: true,
        helmetEnabled: true
    },
    // 审计日志设置
    audit: {
        enabled: true,
        logLevel: 'info',
        retentionDays: 90,
        events: {
            login: true,
            logout: true,
            createUser: true,
            updateUser: true,
            deleteUser: true,
            createOrder: true,
            updateOrder: true,
            deleteOrder: true,
            createProduct: true,
            updateProduct: true,
            deleteProduct: true,
            settingChange: true
        },
        exclude: ['password', 'token', 'secret']
    }
};

// ============================================================
// 辅助函数
// ============================================================

/**
 * 深度合并对象
 */
function deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

/**
 * 获取设置值（支持路径）
 */
function getSetting(path) {
    const parts = path.split('.');
    let current = settings;
    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        } else {
            return undefined;
        }
    }
    return current;
}

/**
 * 设置值（支持路径）
 */
function setSetting(path, value) {
    const parts = path.split('.');
    let current = settings;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }
    const lastKey = parts[parts.length - 1];
    const oldValue = current[lastKey];
    current[lastKey] = value;
    return oldValue;
}

/**
 * 验证设置值
 */
function validateSettingValue(key, value) {
    const validators = {
        'system.maintenanceMode': (v) => typeof v === 'boolean',
        'system.language': (v) => ['zh-CN', 'en-US', 'ja-JP'].includes(v),
        'system.timezone': (v) => typeof v === 'string',
        'orders.orderPrefix': (v) => typeof v === 'string' && v.length > 0,
        'orders.orderNumberLength': (v) => Number.isInteger(v) && v >= 4 && v <= 12,
        'products.lowStockThreshold': (v) => Number.isInteger(v) && v >= 0,
        'products.defaultTaxRate': (v) => typeof v === 'number' && v >= 0 && v <= 100,
        'users.passwordMinLength': (v) => Number.isInteger(v) && v >= 4 && v <= 20,
        'users.sessionTimeout': (v) => Number.isInteger(v) && v >= 300 && v <= 86400,
        'security.rateLimit.max': (v) => Number.isInteger(v) && v > 0,
        'audit.retentionDays': (v) => Number.isInteger(v) && v >= 1 && v <= 365
    };

    if (key in validators) {
        return validators[key](value);
    }
    return true;
}

// ============================================================
// 路由定义
// ============================================================

/**
 * GET /api/settings
 * @description 获取所有设置
 * @param {string} req.query.category - 分类筛选
 * @returns {Object} 所有设置
 */
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { category } = req.query;
        let result = settings;
        
        if (category && category in settings) {
            result = { [category]: settings[category] };
        }
        
        // 隐藏敏感信息
        const sanitized = JSON.parse(JSON.stringify(result));
        if (sanitized.email?.authPass) {
            sanitized.email.authPass = '******';
        }
        if (sanitized.security?.ipWhitelist) {
            sanitized.security.ipWhitelist = sanitized.security.ipWhitelist.map(ip => 
                ip.includes('*') ? ip : ip.replace(/\d+$/, '*')
            );
        }
        
        res.json({
            success: true,
            data: sanitized,
            count: Object.keys(result).length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取设置失败',
            error: error.message
        });
    }
});

/**
 * GET /api/settings/:key
 * @description 获取特定设置
 * @param {string} req.params.key - 设置键名 (支持点分隔路径)
 * @returns {Object} 设置值
 */
router.get('/:key', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { key } = req.params;
        const value = getSetting(key);
        
        if (value === undefined) {
            return res.status(404).json({
                success: false,
                message: `设置 ${key} 不存在`
            });
        }
        
        // 隐藏敏感信息
        let result = value;
        if (key === 'email.authPass' || key === 'email') {
            result = typeof value === 'object' 
                ? { ...value, authPass: '******' }
                : '******';
        }
        
        res.json({
            success: true,
            data: {
                key,
                value: result
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取设置失败',
            error: error.message
        });
    }
});

/**
 * PUT /api/settings/:key
 * @description 更新设置
 * @param {string} req.params.key - 设置键名
 * @param {any} req.body.value - 新值
 * @returns {Object} 更新结果
 */
router.put('/:key', authenticate, authorize('admin'), validate(
    Joi.object({
        value: Joi.any().required()
    })
), async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        
        // 验证值
        if (!validateSettingValue(key, value)) {
            return res.status(400).json({
                success: false,
                message: `设置 ${key} 的值无效`
            });
        }
        
        const oldValue = getSetting(key);
        if (oldValue === undefined) {
            return res.status(404).json({
                success: false,
                message: `设置 ${key} 不存在`
            });
        }
        
        setSetting(key, value);
        
        // 记录变更日志
        console.log(`[Settings] ${key} 已更新:`, {
            oldValue,
            newValue: value,
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        });
        
        res.json({
            success: true,
            message: `设置 ${key} 更新成功`,
            data: {
                key,
                oldValue,
                newValue: value
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '更新设置失败',
            error: error.message
        });
    }
});

/**
 * POST /api/settings
 * @description 批量更新设置
 * @param {Object} req.body - 设置对象
 * @returns {Object} 更新结果
 */
router.post('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const updates = req.body;
        const results = [];
        const errors = [];
        
        for (const [key, value] of Object.entries(updates)) {
            try {
                if (validateSettingValue(key, value)) {
                    const oldValue = getSetting(key);
                    if (oldValue !== undefined) {
                        setSetting(key, value);
                        results.push({ key, status: 'updated' });
                    } else {
                        // 创建设置
                        setSetting(key, value);
                        results.push({ key, status: 'created' });
                    }
                } else {
                    errors.push({ key, error: '无效的值' });
                }
            } catch (error) {
                errors.push({ key, error: error.message });
            }
        }
        
        res.json({
            success: errors.length === 0,
            message: errors.length === 0 ? '所有设置更新成功' : '部分设置更新失败',
            data: {
                updated: results,
                errors: errors
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '批量更新设置失败',
            error: error.message
        });
    }
});

/**
 * DELETE /api/settings/:key
 * @description 删除设置（恢复默认值）
 * @param {string} req.params.key - 设置键名
 * @returns {Object} 删除结果
 */
router.delete('/:key', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { key } = req.params;
        const oldValue = getSetting(key);
        
        if (oldValue === undefined) {
            return res.status(404).json({
                success: false,
                message: `设置 ${key} 不存在`
            });
        }
        
        // 设置为null表示删除
        setSetting(key, null);
        
        res.json({
            success: true,
            message: `设置 ${key} 已删除`,
            data: {
                key,
                removedValue: oldValue
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '删除设置失败',
            error: error.message
        });
    }
});

/**
 * GET /api/settings/backup
 * @description 导出设置备份
 * @returns {Object} 设置备份文件
 */
router.get('/backup', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { format = 'json' } = req.query;
        const backup = {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            settings: settings,
            checksum: require('crypto').createHash('md5')
                .update(JSON.stringify(settings))
                .digest('hex')
        };
        
        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="settings_backup_${Date.now()}.json"`);
            return res.json(backup);
        }
        
        res.json({
            success: true,
            data: backup,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '备份设置失败',
            error: error.message
        });
    }
});

/**
 * POST /api/settings/restore
 * @description 恢复设置备份
 * @param {Object} req.body - 备份数据
 * @returns {Object} 恢复结果
 */
router.post('/restore', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { backup } = req.body;
        
        if (!backup || !backup.settings) {
            return res.status(400).json({
                success: false,
                message: '无效的备份数据'
            });
        }
        
        // 验证备份格式
        if (!backup.version || !backup.exportedAt) {
            return res.status(400).json({
                success: false,
                message: '备份格式无效'
            });
        }
        
        // 恢复设置（合并而不是完全替换）
        settings = deepMerge(settings, backup.settings);
        
        res.json({
            success: true,
            message: '设置恢复成功',
            data: {
                version: backup.version,
                exportedAt: backup.exportedAt,
                restoredAt: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '恢复设置失败',
            error: error.message
        });
    }
});

module.exports = router;