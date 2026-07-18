/**
 * 分析控制器
 */
const BaseController = require('./BaseController');
const analyticsService = require('../services/AnalyticsService');

class AnalyticsController extends BaseController {
    constructor() {
        super(analyticsService);
    }

    /**
     * 获取业务概览
     */
    async getOverview(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const data = await analyticsService.getBusinessOverview({ startDate, endDate });
            return this.success(res, data);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取客户分析
     */
    async getCustomerAnalytics(req, res) {
        try {
            const data = await analyticsService.getCustomerAnalytics();
            return this.success(res, data);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取产品分析
     */
    async getProductAnalytics(req, res) {
        try {
            const data = await analyticsService.getProductAnalytics();
            return this.success(res, data);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取预警信息
     */
    async getAlerts(req, res) {
        try {
            const alerts = await analyticsService.getAlerts();
            return this.success(res, alerts);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取性能指标
     */
    async getPerformance(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const metrics = await analyticsService.getPerformanceMetrics({ startDate, endDate });
            return this.success(res, metrics);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取最近活动
     */
    async getRecentActivity(req, res) {
        try {
            const { limit } = req.query;
            const activity = await analyticsService.getRecentActivity(parseInt(limit) || 10);
            return this.success(res, activity);
        } catch (error) {
            return this.error(res, error);
        }
    }
}

module.exports = new AnalyticsController();
