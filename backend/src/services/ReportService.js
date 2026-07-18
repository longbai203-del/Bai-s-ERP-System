/**
 * 报表服务 - 完整的报表业务逻辑
 */
const BaseService = require('./BaseService');
const repositories = require('../repositories');

class ReportService extends BaseService {
    constructor() {
        super(null); // 报表服务使用多个Repository
    }

    /**
     * 获取综合报表数据
     */
    async getComprehensiveReport(dateRange = {}) {
        const { startDate, endDate } = dateRange;
        
        // 并行获取所有数据
        const [orderStats, productStats, customerStats] = await Promise.all([
            this.getOrderStats(startDate, endDate),
            this.getProductStats(),
            this.getCustomerStats(startDate, endDate)
        ]);

        return {
            summary: {
                totalRevenue: orderStats.totalRevenue,
                totalOrders: orderStats.total,
                totalCustomers: customerStats.total,
                totalProducts: productStats.total,
                averageOrderValue: orderStats.averageValue
            },
            orders: orderStats,
            products: productStats,
            customers: customerStats,
            period: { startDate, endDate },
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * 获取订单统计数据
     */
    async getOrderStats(startDate, endDate) {
        const orderRepo = repositories.Order;
        const stats = await orderRepo.getOrderStats({ startDate, endDate });
        
        // 获取每日趋势
        const trends = await this.getDailyTrends(startDate, endDate);
        
        return {
            ...stats,
            trends,
            revenueByStatus: await this.getRevenueByStatus(),
            topProducts: await this.getTopProducts(startDate, endDate, 10)
        };
    }

    /**
     * 获取每日趋势
     */
    async getDailyTrends(startDate, endDate) {
        const supabase = require('../repositories').Order.supabase;
        
        let query = supabase
            .from('orders')
            .select('created_at, total')
            .order('created_at', { ascending: true });

        if (startDate) {
            query = query.gte('created_at', startDate);
        }
        if (endDate) {
            query = query.lte('created_at', endDate);
        }

        const { data, error } = await query;
        if (error) throw error;

        // 按日期分组
        const dailyData = {};
        data.forEach(order => {
            const date = order.created_at.split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = { date, orders: 0, revenue: 0 };
            }
            dailyData[date].orders += 1;
            dailyData[date].revenue += order.total || 0;
        });

        return Object.values(dailyData);
    }

    /**
     * 获取按状态的收入统计
     */
    async getRevenueByStatus() {
        const supabase = require('../repositories').Order.supabase;
        
        const { data, error } = await supabase
            .from('orders')
            .select('status, total')
            .eq('status', 'paid');

        if (error) throw error;

        const result = {};
        data.forEach(order => {
            const status = order.status || 'unknown';
            if (!result[status]) {
                result[status] = { count: 0, revenue: 0 };
            }
            result[status].count += 1;
            result[status].revenue += order.total || 0;
        });

        return result;
    }

    /**
     * 获取热销产品
     */
    async getTopProducts(startDate, endDate, limit = 10) {
        const supabase = require('../repositories').Order.supabase;
        
        let query = supabase
            .from('order_items')
            .select(`
                product_id,
                products:product_id(name, sku, price),
                quantity,
                price
            `)
            .order('quantity', { ascending: false })
            .limit(limit);

        const { data, error } = await query;
        if (error) throw error;

        // 汇总产品数据
        const productMap = {};
        data.forEach(item => {
            const productId = item.product_id;
            if (!productMap[productId]) {
                productMap[productId] = {
                    id: productId,
                    name: item.products?.name || '未知产品',
                    sku: item.products?.sku || '',
                    totalQuantity: 0,
                    totalRevenue: 0
                };
            }
            productMap[productId].totalQuantity += item.quantity || 0;
            productMap[productId].totalRevenue += (item.price || 0) * (item.quantity || 0);
        });

        return Object.values(productMap)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, limit);
    }

    /**
     * 获取产品统计数据
     */
    async getProductStats() {
        const productRepo = repositories.Product;
        return productRepo.getProductStats();
    }

    /**
     * 获取客户统计数据
     */
    async getCustomerStats(startDate, endDate) {
        const supabase = require('../repositories').Order.supabase;
        
        // 总客户数
        const { count: total, error: countError } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        // 新客户（在时间范围内）
        let newQuery = supabase
            .from('customers')
            .select('*', { count: 'exact', head: true });

        if (startDate) {
            newQuery = newQuery.gte('created_at', startDate);
        }
        if (endDate) {
            newQuery = newQuery.lte('created_at', endDate);
        }

        const { count: newCustomers } = await newQuery;

        // 活跃客户（有订单的客户）
        const { count: activeCustomers, error: activeError } = await supabase
            .from('orders')
            .select('customer_id', { count: 'exact', head: true })
            .not('customer_id', 'is', null);

        if (activeError) throw activeError;

        return {
            total: total || 0,
            newCustomers: newCustomers || 0,
            activeCustomers: activeCustomers || 0,
            retentionRate: total > 0 ? ((activeCustomers || 0) / total * 100).toFixed(2) : 0
        };
    }

    /**
     * 导出报表为CSV
     */
    async exportToCSV(reportData) {
        const headers = ['日期', '订单数', '收入', '客户数'];
        const rows = [headers];

        if (reportData.orders?.trends) {
            reportData.orders.trends.forEach(day => {
                rows.push([
                    day.date,
                    day.orders.toString(),
                    day.revenue.toFixed(2),
                    '0'
                ]);
            });
        }

        return rows.map(row => row.join(',')).join('\n');
    }

    /**
     * 获取销售预测（简单趋势预测）
     */
    async getSalesForecast(days = 30) {
        const trends = await this.getDailyTrends(
            new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            new Date().toISOString()
        );

        if (trends.length < 7) {
            return { forecast: [], message: '数据不足，无法预测' };
        }

        // 计算平均日销售额
        const totalRevenue = trends.reduce((sum, d) => sum + d.revenue, 0);
        const avgDailyRevenue = totalRevenue / trends.length;

        // 计算增长率
        const half = Math.floor(trends.length / 2);
        const firstHalf = trends.slice(0, half).reduce((sum, d) => sum + d.revenue, 0) / half;
        const secondHalf = trends.slice(-half).reduce((sum, d) => sum + d.revenue, 0) / half;
        const growthRate = firstHalf > 0 ? (secondHalf - firstHalf) / firstHalf : 0;

        // 生成预测
        const forecast = [];
        const lastDate = new Date(trends[trends.length - 1].date);
        for (let i = 1; i <= days; i++) {
            const date = new Date(lastDate);
            date.setDate(date.getDate() + i);
            const predictedRevenue = avgDailyRevenue * (1 + growthRate * (i / days));
            forecast.push({
                date: date.toISOString().split('T')[0],
                predictedRevenue: Math.round(predictedRevenue * 100) / 100
            });
        }

        return {
            forecast,
            avgDailyRevenue: Math.round(avgDailyRevenue * 100) / 100,
            growthRate: Math.round(growthRate * 10000) / 100,
            confidence: Math.min(80, Math.max(50, 100 - (1 / Math.sqrt(trends.length)) * 100))
        };
    }
}

module.exports = new ReportService();
