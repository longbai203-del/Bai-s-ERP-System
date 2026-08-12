/**
 * @file new-module.routes.js
 * @description 新模块路由
 * @module routes/new-module
 */

import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { supabaseService } from '../services/supabase.service.js';
import { success, error, paginate } from '../utils/response.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// ============================================================
// 所有路由都需要认证
// ============================================================
router.use(authMiddleware);

// ============================================================
// 获取列表
// ============================================================
router.get('/', async (req, res) => {
    try {
        const { page = 1, pageSize = 10, keyword = '', status = '' } = req.query;
        
        // 这里使用模拟数据，实际使用时替换为真实数据库查询
        const result = await supabaseService.getNewModuleList({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            keyword,
            status
        });

        if (result.success) {
            return paginate(
                res,
                result.data.list,
                result.data.total,
                page,
                pageSize,
                '获取列表成功'
            );
        }
        return error(res, result.error || '获取列表失败', 500);
    } catch (err) {
        logger.error('[NewModule] GET / error:', err);
        return error(res, '获取列表失败', 500);
    }
});

// ============================================================
// 获取详情
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supabaseService.getNewModuleById(id);
        
        if (result.success && result.data) {
            return success(res, result.data, '获取详情成功');
        }
        return error(res, result.error || '项目不存在', 404);
    } catch (err) {
        logger.error('[NewModule] GET /:id error:', err);
        return error(res, '获取详情失败', 500);
    }
});

// ============================================================
// 创建
// ============================================================
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        // 添加创建信息
        data.created_by = req.userId;
        data.created_at = new Date().toISOString();
        data.updated_at = new Date().toISOString();

        const result = await supabaseService.createNewModule(data);
        
        if (result.success) {
            return success(res, result.data, '创建成功', 201);
        }
        return error(res, result.error || '创建失败', 500);
    } catch (err) {
        logger.error('[NewModule] POST / error:', err);
        return error(res, '创建失败', 500);
    }
});

// ============================================================
// 更新
// ============================================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        data.updated_at = new Date().toISOString();
        data.updated_by = req.userId;

        const result = await supabaseService.updateNewModule(id, data);
        
        if (result.success) {
            return success(res, result.data, '更新成功');
        }
        return error(res, result.error || '更新失败', 500);
    } catch (err) {
        logger.error('[NewModule] PUT /:id error:', err);
        return error(res, '更新失败', 500);
    }
});

// ============================================================
// 删除
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supabaseService.deleteNewModule(id);
        
        if (result.success) {
            return success(res, null, '删除成功');
        }
        return error(res, result.error || '删除失败', 500);
    } catch (err) {
        logger.error('[NewModule] DELETE /:id error:', err);
        return error(res, '删除失败', 500);
    }
});

export default router;