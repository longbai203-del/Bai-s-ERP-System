/**
 * @file order.controller.js
 * @description 订单控制器
 * @module controllers/order.controller
 */

import { supabaseService } from '../services/supabase.service.js';
import { success, error } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const orderController = {
    async getList(req, res) {
        try {
            const { page = 1, pageSize = 20, status, keyword, startDate, endDate } = req.query;
            const result = await supabaseService.getOrders({
                page: parseInt(page, 10),
                pageSize: parseInt(pageSize, 10),
                status, keyword, startDate, endDate,
                userId: req.userId
            });
            if (!result.success) {
                return error(res, result.error || '获取订单列表失败', 500);
            }
            return success(res, result.data);
        } catch (error) {
            logger.error('[OrderController] getList error:', error);
            return error(res, '获取订单列表失败', 500);
        }
    },

    async getDetail(req, res) {
        try {
            const { id } = req.params;
            const result = await supabaseService.getOrderById(id, req.userId);
            if (!result.success) {
                return error(res, result.error === 'ORDER_NOT_FOUND' ? '订单不存在' : result.error, result.error === 'ORDER_NOT_FOUND' ? 404 : 500);
            }
            return success(res, result.data);
        } catch (error) {
            logger.error('[OrderController] getDetail error:', error);
            return error(res, '获取订单详情失败', 500);
        }
    },

    async create(req, res) {
        try {
            const { customerName, customerPhone, items, totalAmount, note } = req.body;
            if (!customerName || !items || !totalAmount) {
                return error(res, '缺少必填字段: customerName, items, totalAmount', 400);
            }
            if (!Array.isArray(items) || items.length === 0) {
                return error(res, '订单至少包含一个商品', 400);
            }
            const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
            const orderData = {
                order_number: orderNumber,
                customer_name: customerName,
                customer_phone: customerPhone || '-',
                total_amount: totalAmount,
                status: 'pending',
                payment_status: 'unpaid',
                items: JSON.stringify(items),
                note: note || '',
                created_by: req.userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            const result = await supabaseService.createOrder(orderData);
            if (!result.success) {
                return error(res, result.error || '创建订单失败', 500);
            }
            return success(res, result.data, '订单创建成功');
        } catch (error) {
            logger.error('[OrderController] create error:', error);
            return error(res, '创建订单失败', 500);
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { customerName, customerPhone, items, totalAmount, note } = req.body;
            const existing = await supabaseService.getOrderById(id, req.userId);
            if (!existing.success) {
                return error(res, '订单不存在', 404);
            }
            if (existing.data.status === 'completed' || existing.data.status === 'cancelled') {
                return error(res, '已完成或已取消的订单不能修改', 400);
            }
            const updateData = {};
            if (customerName) updateData.customer_name = customerName;
            if (customerPhone) updateData.customer_phone = customerPhone;
            if (items) updateData.items = JSON.stringify(items);
            if (totalAmount) updateData.total_amount = totalAmount;
            if (note !== undefined) updateData.note = note;
            updateData.updated_at = new Date().toISOString();
            const result = await supabaseService.updateOrder(id, updateData);
            if (!result.success) {
                return error(res, result.error || '更新订单失败', 500);
            }
            return success(res, result.data, '订单更新成功');
        } catch (error) {
            logger.error('[OrderController] update error:', error);
            return error(res, '更新订单失败', 500);
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const existing = await supabaseService.getOrderById(id, req.userId);
            if (!existing.success) {
                return error(res, '订单不存在', 404);
            }
            if (existing.data.status === 'completed' || existing.data.status === 'cancelled') {
                return error(res, '已完成或已取消的订单不能删除', 400);
            }
            const result = await supabaseService.deleteOrder(id);
            if (!result.success) {
                return error(res, result.error || '删除订单失败', 500);
            }
            return success(res, null, '订单删除成功');
        } catch (error) {
            logger.error('[OrderController] delete error:', error);
            return error(res, '删除订单失败', 500);
        }
    },

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, note } = req.body;
            if (!status) {
                return error(res, '请提供订单状态', 400);
            }
            const validStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return error(res, '无效的订单状态', 400);
            }
            const existing = await supabaseService.getOrderById(id, req.userId);
            if (!existing.success) {
                return error(res, '订单不存在', 404);
            }
            const result = await supabaseService.updateOrderStatus(id, status, note);
            if (!result.success) {
                return error(res, result.error || '更新订单状态失败', 500);
            }
            return success(res, result.data, '订单状态已更新');
        } catch (error) {
            logger.error('[OrderController] updateStatus error:', error);
            return error(res, '更新订单状态失败', 500);
        }
    },

    async getStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const result = await supabaseService.getOrderStats({ startDate, endDate, userId: req.userId });
            if (!result.success) {
                return error(res, result.error || '获取订单统计失败', 500);
            }
            return success(res, result.data);
        } catch (error) {
            logger.error('[OrderController] getStats error:', error);
            return error(res, '获取订单统计失败', 500);
        }
    },

    exportData: async (req, res) => {
        try {
            return success(res, null, '导出功能开发中');
        } catch (error) {
            logger.error('[OrderController] exportData error:', error);
            return error(res, '导出失败', 500);
        }
    },

    cancel: async (req, res) => {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const result = await supabaseService.updateOrderStatus(id, 'cancelled', reason || '用户取消');
            if (!result.success) {
                return error(res, result.error || '取消订单失败', 500);
            }
            return success(res, result.data, '订单已取消');
        } catch (error) {
            logger.error('[OrderController] cancel error:', error);
            return error(res, '取消订单失败', 500);
        }
    }
};

export default orderController;