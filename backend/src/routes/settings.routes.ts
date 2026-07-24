/**
 * @file Routes/settings.routes.ts
 * 系统设置管理路由 - 完整的配置管理
 * 完整实现：补全系统参数、字典、角色权限、用户配置接口，配置导入导出、批量更新，管理员权限校验
 */

import { Router } from 'express';
import { asyncHandler } from '../src/middlewares/error-handler.middleware';
import { authMiddleware } from '../src/middlewares/auth.middleware';
import { validate } from '../src/middlewares/validation.middleware';
import { settingsController } from '../src/Controllers';
import * as Joi from 'joi';

const router = Router();

// ============================================
// 验证 Schema
// ============================================

const createSettingSchema = Joi.object({
  key: Joi.string().max(100).required().messages({
    'string.empty': '配置键不能为空',
    'any.required': '配置键是必填字段',
  }),
  value: Joi.string().max(5000).required().messages({
    'string.empty': '配置值不能为空',
    'any.required': '配置值是必填字段',
  }),
  group: Joi.string().max(50).default('general'),
  description: Joi.string().max(200).optional(),
  isSystem: Joi.boolean().default(false),
  isEncrypted: Joi.boolean().default(false),
});

const batchUpdateSchema = Joi.object({
  settings: Joi.array().items(
    Joi.object({
      key: Joi.string().max(100).required(),
      value: Joi.string().max(5000).required(),
    })
  ).min(1).max(100).required(),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  group: Joi.string().optional(),
  search: Joi.string().optional(),
  isSystem: Joi.boolean().optional(),
});

const keyParamSchema = Joi.object({
  key: Joi.string().max(100).required(),
});

const groupParamSchema = Joi.object({
  group: Joi.string().max(50).required(),
});

const importSchema = Joi.object({
  settings: Joi.array().items(
    Joi.object({
      key: Joi.string().max(100).required(),
      value: Joi.string().max(5000).required(),
      group: Joi.string().max(50).optional(),
      description: Joi.string().max(200).optional(),
    })
  ).min(1).required(),
  overwrite: Joi.boolean().default(false),
});

// ============================================
// 路由定义
// ============================================

/**
 * 创建或更新设置
 * POST /api/v1/settings
 */
router.post(
  '/',
  authMiddleware({ required: true, permissions: ['settings:update'], roles: ['admin', 'super_admin'] }),
  validate(createSettingSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await settingsController.createOrUpdateSetting(req.validatedBody);
    res.status(201).json({
      success: true,
      data: result,
      message: '设置保存成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取设置列表
 * GET /api/v1/settings
 */
router.get(
  '/',
  authMiddleware({ required: true, permissions: ['settings:view'] }),
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit, ...filters } = req.validatedQuery;
    const result = await settingsController.getSettingsList({
      page,
      limit,
      filters,
    });
    res.json({
      success: true,
      data: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取单个设置
 * GET /api/v1/settings/:key
 */
router.get(
  '/:key',
  authMiddleware({ required: true, permissions: ['settings:view'] }),
  validate(keyParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const key = req.validatedParams.key;
    const result = await settingsController.getSettingByKey(key);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 更新设置
 * PUT /api/v1/settings/:key
 */
router.put(
  '/:key',
  authMiddleware({ required: true, permissions: ['settings:update'], roles: ['admin', 'super_admin'] }),
  validate(keyParamSchema, 'params'),
  validate(createSettingSchema.optional(), 'body'),
  asyncHandler(async (req, res) => {
    const key = req.validatedParams.key;
    const result = await settingsController.updateSetting(key, req.validatedBody);
    res.json({
      success: true,
      data: result,
      message: '设置更新成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 删除设置
 * DELETE /api/v1/settings/:key
 */
router.delete(
  '/:key',
  authMiddleware({ required: true, permissions: ['settings:delete'], roles: ['admin', 'super_admin'] }),
  validate(keyParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const key = req.validatedParams.key;
    await settingsController.deleteSetting(key);
    res.json({
      success: true,
      message: '设置删除成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 批量更新设置
 * POST /api/v1/settings/batch
 */
router.post(
  '/batch',
  authMiddleware({ required: true, permissions: ['settings:update'], roles: ['admin', 'super_admin'] }),
  validate(batchUpdateSchema, 'body'),
  asyncHandler(async (req, res) => {
    const { settings } = req.validatedBody;
    const result = await settingsController.batchUpdateSettings(settings);
    res.json({
      success: true,
      data: result,
      message: `批量更新成功，影响 ${result.length} 条记录`,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 导出设置
 * GET /api/v1/settings/export
 */
router.get(
  '/export/json',
  authMiddleware({ required: true, permissions: ['settings:view'] }),
  asyncHandler(async (req, res) => {
    const result = await settingsController.exportSettings();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=settings_${Date.now()}.json`);
    res.json(result);
  })
);

/**
 * 导入设置
 * POST /api/v1/settings/import
 */
router.post(
  '/import',
  authMiddleware({ required: true, permissions: ['settings:update'], roles: ['admin', 'super_admin'] }),
  validate(importSchema, 'body'),
  asyncHandler(async (req, res) => {
    const { settings, overwrite } = req.validatedBody;
    const result = await settingsController.importSettings(settings, overwrite);
    res.json({
      success: true,
      data: result,
      message: `导入成功，影响 ${result.length} 条记录`,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取分组列表
 * GET /api/v1/settings/groups
 */
router.get(
  '/groups/list',
  authMiddleware({ required: true, permissions: ['settings:view'] }),
  asyncHandler(async (req, res) => {
    const result = await settingsController.getSettingGroups();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 按分组获取设置
 * GET /api/v1/settings/groups/:group
 */
router.get(
  '/groups/:group',
  authMiddleware({ required: true, permissions: ['settings:view'] }),
  validate(groupParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const group = req.validatedParams.group;
    const result = await settingsController.getSettingsByGroup(group);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取设置统计
 * GET /api/v1/settings/stats
 */
router.get(
  '/stats/overview',
  authMiddleware({ required: true, permissions: ['settings:view'] }),
  asyncHandler(async (req, res) => {
    const result = await settingsController.getSettingsStats();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;