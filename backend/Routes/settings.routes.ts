/**
 * settings管理路由
 * 提供完整的settings管理API接口
 * @module Routes/settings
 */

import { Router, Request, Response, NextFunction } from 'express';
import { settings.ToUpper()ettingsController } from '../Controllers/settings.controller';
import { authMiddleware } from '../Middleware/auth.middleware';
import { validationMiddleware } from '../Middleware/validation.middleware';

const router = Router();
const controller = new settings.ToUpper()ettingsController();

// ============================================================
// 基础CRUD操作
// ============================================================

/**
 * GET /api/settings
 * 获取settings列表（分页）
 */
router.get(
    '/',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.list(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/settings/:id
 * 获取settings详情
 */
router.get(
    '/:id',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.getById(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * POST /api/settings
 * 创建settings
 */
router.post(
    '/',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.create(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * PUT /api/settings/:id
 * 更新settings
 */
router.put(
    '/:id',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.update(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * DELETE /api/settings/:id
 * 删除settings
 */
router.delete(
    '/:id',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.delete(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

// ============================================================
// 高级操作
// ============================================================

/**
 * DELETE /api/settings/batch
 * 批量删除settings
 */
router.delete(
    '/batch',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.batchDelete(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * PATCH /api/settings/:id/status
 * 更新settings状态
 */
router.patch(
    '/:id/status',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.updateStatus(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/settings/search
 * 搜索settings
 */
router.get(
    '/search',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.search(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/settings/export
 * 导出settings数据
 */
router.get(
    '/export',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.export(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * POST /api/settings/import
 * 导入settings数据
 */
router.post(
    '/import',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.import(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

// ============================================================
// 统计与汇总
// ============================================================

/**
 * GET /api/settings/stats
 * 获取settings统计信息
 */
router.get(
    '/stats',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.getStats(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
