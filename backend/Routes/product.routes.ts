/**
 * product管理路由
 * 提供完整的product管理API接口
 * @module Routes/product
 */

import { Router, Request, Response, NextFunction } from 'express';
import { product.ToUpper()roductController } from '../Controllers/product.controller';
import { authMiddleware } from '../Middleware/auth.middleware';
import { validationMiddleware } from '../Middleware/validation.middleware';

const router = Router();
const controller = new product.ToUpper()roductController();

// ============================================================
// 基础CRUD操作
// ============================================================

/**
 * GET /api/product
 * 获取product列表（分页）
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
 * GET /api/product/:id
 * 获取product详情
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
 * POST /api/product
 * 创建product
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
 * PUT /api/product/:id
 * 更新product
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
 * DELETE /api/product/:id
 * 删除product
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
 * DELETE /api/product/batch
 * 批量删除product
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
 * PATCH /api/product/:id/status
 * 更新product状态
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
 * GET /api/product/search
 * 搜索product
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
 * GET /api/product/export
 * 导出product数据
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
 * POST /api/product/import
 * 导入product数据
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
 * GET /api/product/stats
 * 获取product统计信息
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
