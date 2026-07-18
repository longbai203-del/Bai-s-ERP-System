/**
 * 基础Controller - 统一响应处理
 */
class BaseController {
    constructor(service) {
        this.service = service;
    }

    /**
     * 统一成功响应
     */
    success(res, data, message = '操作成功', statusCode = 200) {
        return res.status(statusCode).json({
            code: 0,
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * 统一错误响应
     */
    error(res, error, statusCode = 500) {
        const message = error.message || '服务器内部错误';
        const code = error.code || -1;
        
        return res.status(statusCode).json({
            code,
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? {
                stack: error.stack,
                details: error.details
            } : undefined,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * 分页响应
     */
    paginated(res, data, total, page = 1, limit = 10) {
        return res.status(200).json({
            code: 0,
            success: true,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            },
            timestamp: new Date().toISOString()
        });
    }

    /**
     * 获取分页参数
     */
    getPagination(req) {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        const offset = (page - 1) * limit;
        return { page, limit, offset };
    }

    /**
     * 获取筛选参数
     */
    getFilters(req, allowedFilters = []) {
        const filters = {};
        for (const key of allowedFilters) {
            if (req.query[key] !== undefined && req.query[key] !== '') {
                filters[key] = req.query[key];
            }
        }
        return filters;
    }
}

module.exports = BaseController;
