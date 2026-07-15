/**
 * @file response.js
 * @description 统一响应格式
 * @module utils/response
 */

/**
 * 标准响应格式
 * @typedef {Object} ApiResponse
 * @property {boolean} success - 是否成功
 * @property {number} code - 状态码
 * @property {string} message - 消息
 * @property {*} data - 数据
 * @property {number} timestamp - 时间戳
 */

/**
 * 成功响应
 * @param {import('express').Response} res - Express 响应对象
 * @param {*} data - 响应数据
 * @param {string} message - 成功消息
 * @param {number} code - 状态码
 * @returns {import('express').Response}
 */
export const success = (res, data = null, message = '操作成功', code = 200) => {
    return res.status(code).json({
        success: true,
        code,
        message,
        data,
        timestamp: Date.now()
    });
};

/**
 * 错误响应
 * @param {import('express').Response} res - Express 响应对象
 * @param {string} message - 错误消息
 * @param {number} code - HTTP 状态码
 * @param {string} errorCode - 错误代码
 * @param {*} details - 错误详情
 * @returns {import('express').Response}
 */
export const error = (res, message = '操作失败', code = 500, errorCode = 'INTERNAL_ERROR', details = null) => {
    const response = {
        success: false,
        code,
        message,
        errorCode,
        timestamp: Date.now()
    };
    if (details) {
        response.details = details;
    }
    return res.status(code).json(response);
};

/**
 * 分页响应
 * @param {import('express').Response} res - Express 响应对象
 * @param {Array} list - 数据列表
 * @param {number} total - 总条数
 * @param {number} page - 当前页码
 * @param {number} pageSize - 每页条数
 * @param {string} message - 成功消息
 * @returns {import('express').Response}
 */
export const paginate = (res, list, total, page, pageSize, message = '获取成功') => {
    return success(res, {
        list,
        total,
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        totalPages: Math.ceil(total / pageSize)
    }, message);
};

/**
 * 创建响应工具
 * @param {import('express').Response} res - Express 响应对象
 * @returns {Object}
 */
export const createResponse = (res) => {
    return {
        success: (data, message, code) => success(res, data, message, code),
        error: (message, code, errorCode, details) => error(res, message, code, errorCode, details),
        paginate: (list, total, page, pageSize, message) => paginate(res, list, total, page, pageSize, message)
    };
};

export default {
    success,
    error,
    paginate,
    createResponse
};
export const response = { success, error, paginate, createResponse };