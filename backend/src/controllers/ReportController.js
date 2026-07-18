/**
 * 报表控制器
 */
const BaseController = require('./BaseController');
const reportService = require('../services/ReportService');

class ReportController extends BaseController {
    constructor() {
        super(reportService);
    }

    /**
     * 获取综合报表
     */
    async getComprehensiveReport(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const report = await reportService.getComprehensiveReport({ startDate, endDate });
            return this.success(res, report);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取订单统计
     */
    async getOrderStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const stats = await reportService.getOrderStats(startDate, endDate);
            return this.success(res, stats);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取每日趋势
     */
    async getDailyTrends(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const trends = await reportService.getDailyTrends(startDate, endDate);
            return this.success(res, trends);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取热销产品
     */
    async getTopProducts(req, res) {
        try {
            const { startDate, endDate, limit } = req.query;
            const products = await reportService.getTopProducts(
                startDate,
                endDate,
                parseInt(limit) || 10
            );
            return this.success(res, products);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取销售预测
     */
    async getSalesForecast(req, res) {
        try {
            const { days } = req.query;
            const forecast = await reportService.getSalesForecast(parseInt(days) || 30);
            return this.success(res, forecast);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 导出报表
     */
    async exportReport(req, res) {
        try {
            const { startDate, endDate, format = 'csv' } = req.query;
            const report = await reportService.getComprehensiveReport({ startDate, endDate });
            
            if (format === 'csv') {
                const csv = await reportService.exportToCSV(report);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=report_${Date.now()}.csv`);
                return res.send(csv);
            }

            return this.success(res, report);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取产品统计
     */
    async getProductStats(req, res) {
        try {
            const stats = await reportService.getProductStats();
            return this.success(res, stats);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取客户统计
     */
    async getCustomerStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const stats = await reportService.getCustomerStats(startDate, endDate);
            return this.success(res, stats);
        } catch (error) {
            return this.error(res, error);
        }
    }
}

module.exports = new ReportController();
