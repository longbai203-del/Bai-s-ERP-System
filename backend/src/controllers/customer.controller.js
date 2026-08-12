/**
 * @file customer.controller.js
 * @description 客户控制器
 * @module controllers/customer.controller
 */

import { supabaseService } from '../services/supabase.service.js';
import { success, error } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const customerController = {
    async getList(req, res) {
        try {
            const { page = 1, pageSize = 20, name, phone, level } = req.query;
            const result = await supabaseService.getCustomers({
                page: parseInt(page, 10),
                pageSize: parseInt(pageSize, 10),
                name, phone, level
            });
            if (!result.success) {
                return error(res, result.error || '获取客户列表失败', 500);
            }
            return success(res, result.data);
        } catch (error) {
            logger.error('[CustomerController] getList error:', error);
            return error(res, '获取客户列表失败', 500);
        }
    },

    async getDetail(req, res) {
        try {
            const { id } = req.params;
            const result = await supabaseService.getCustomerById(id);
            if (!result.success) {
                return error(res, result.error === 'CUSTOMER_NOT_FOUND' ? '客户不存在' : result.error, result.error === 'CUSTOMER_NOT_FOUND' ? 404 : 500);
            }
            return success(res, result.data);
        } catch (error) {
            logger.error('[CustomerController] getDetail error:', error);
            return error(res, '获取客户详情失败', 500);
        }
    },

    async create(req, res) {
        try {
            const { name, phone, email, level, address, notes } = req.body;
            if (!name || !phone) {
                return error(res, '缺少必填字段: name, phone', 400);
            }
            const customerData = {
                name, phone, email: email || '', level: level || 'bronze',
                address: address || '', notes: notes || '',
                created_by: req.userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            const result = await supabaseService.createCustomer(customerData);
            if (!result.success) {
                return error(res, result.error || '创建客户失败', 500);
            }
            return success(res, result.data, '客户创建成功');
        } catch (error) {
            logger.error('[CustomerController] create error:', error);
            return error(res, '创建客户失败', 500);
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, phone, email, level, address, notes } = req.body;
            const existing = await supabaseService.getCustomerById(id);
            if (!existing.success) {
                return error(res, '客户不存在', 404);
            }
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (phone !== undefined) updateData.phone = phone;
            if (email !== undefined) updateData.email = email;
            if (level !== undefined) updateData.level = level;
            if (address !== undefined) updateData.address = address;
            if (notes !== undefined) updateData.notes = notes;
            updateData.updated_at = new Date().toISOString();
            const result = await supabaseService.updateCustomer(id, updateData);
            if (!result.success) {
                return error(res, result.error || '更新客户失败', 500);
            }
            return success(res, result.data, '客户更新成功');
        } catch (error) {
            logger.error('[CustomerController] update error:', error);
            return error(res, '更新客户失败', 500);
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await supabaseService.deleteCustomer(id);
            if (!result.success) {
                return error(res, result.error === 'CUSTOMER_NOT_FOUND' ? '客户不存在' : result.error, result.error === 'CUSTOMER_NOT_FOUND' ? 404 : 500);
            }
            return success(res, null, '客户删除成功');
        } catch (error) {
            logger.error('[CustomerController] delete error:', error);
            return error(res, '删除客户失败', 500);
        }
    },

    async search(req, res) {
        try {
            const { keyword, limit = 10 } = req.query;
            if (!keyword || keyword.length < 2) {
                return error(res, '请输入至少2个字符的搜索关键词', 400);
            }
            const result = await supabaseService.searchCustomers(keyword, parseInt(limit, 10));
            return success(res, result.data || []);
        } catch (error) {
            logger.error('[CustomerController] search error:', error);
            return error(res, '搜索客户失败', 500);
        }
    },

    async getStats(req, res) {
        try {
            const result = await supabaseService.getCustomerStats();
            return success(res, result.data || {});
        } catch (error) {
            logger.error('[CustomerController] getStats error:', error);
            return error(res, '获取客户统计失败', 500);
        }
    },

    exportData: async (req, res) => {
        try {
            return success(res, null, '导出功能开发中');
        } catch (error) {
            logger.error('[CustomerController] exportData error:', error);
            return error(res, '导出失败', 500);
        }
    }
};

export default customerController;