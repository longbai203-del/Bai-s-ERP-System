/**
 * @file dashboard.controller.js
 * @description 仪表盘控制器
 * @module controllers/dashboard.controller
 */

import { supabaseService } from '../services/supabase.service.js';
import { success, error } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const dashboardController = {
    async getStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const result = await supabaseService.getDashboardStats({ startDate, endDate, userId: req.userId });
            if (!result.success) {
                return error(res, result.error || '获取统计数据失败', 500);
            }
            return success(res, result.data);
        } catch (error) {
            logger.error('[DashboardController] getStats error:', error);
            return error(res, '获取统计数据失败', 500);
        }
    },

    async getChartData(req, res) {
        try {
            const { type = 'revenue', period = 'month', startDate, endDate } = req.query;
            const result = await supabaseService.getChartData({ type, period, startDate, endDate, userId: req.userId });
            if (!result.success) {
                return error(res, result.error || '获取图表数据失败', 500);
            }
            return success(res, result.data);
        } catch (error) {
            logger.error('[DashboardController] getChartData error:', error);
            return error(res, '获取图表数据失败', 500);
        }
    },

    async getTodayOverview(req, res) {
        try {
            const { date } = req.query;
            const result = await supabaseService.getTodayOverview({ date, userId: req.userId });
            if (!result.success) {
                return error(res, result.error || '获取今日概览失败', 500);
            }
            return success(res, result.data);
        } catch (error) {
            logger.error('[DashboardController] getTodayOverview error:', error);
            return error(res, '获取今日概览失败', 500);
        }
    },

    async getRecentActivities(req, res) {
        try {
            const { limit = 10 } = req.query;
            const result = await supabaseService.getRecentActivities({ limit: parseInt(limit, 10), userId: req.userId });
            if (!result.success) {
                return error(res, result.error || '获取活动列表失败', 500);
            }
            return success(res, result.data || []);
        } catch (error) {
            logger.error('[DashboardController] getRecentActivities error:', error);
            return error(res, '获取活动列表失败', 500);
        }
    }
};

export default dashboardController;