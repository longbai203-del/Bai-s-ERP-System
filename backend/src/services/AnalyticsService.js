/**
 * 分析服务 - 完整的数据分析功能
 */
class AnalyticsService {
    constructor() {
        this.reportService = require('./ReportService');
    }

    /**
     * 获取业务概览
     */
    async getBusinessOverview(dateRange = {}) {
        const report = await this.reportService.getComprehensiveReport(dateRange);
        
        return {
            overview: {
                revenue: report.summary.totalRevenue,
                orders: report.summary.totalOrders,
                customers: report.summary.totalCustomers,
                products: report.summary.totalProducts,
                averageOrderValue: report.summary.averageOrderValue,
                growthRate: await this.calculateGrowthRate(dateRange)
            },
            recentActivity: await this.getRecentActivity(10),
            alerts: await this.getAlerts(),
            performance: await this.getPerformanceMetrics(dateRange)
        };
    }

    /**
     * 计算增长率
     */
    async calculateGrowthRate(dateRange = {}) {
        const { startDate, endDate } = dateRange;
        const trends = await this.reportService.getDailyTrends(startDate, endDate);
        
        if (trends.length < 2) return 0;

        const midPoint = Math.floor(trends.length / 2);
        const firstHalf = trends.slice(0, midPoint);
        const secondHalf = trends.slice(midPoint);

        const firstAvg = firstHalf.reduce((sum, d) => sum + d.revenue, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, d) => sum + d.revenue, 0) / secondHalf.length;

        return firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg * 100) : 0;
    }

    /**
     * 获取最近活动
     */
    async getRecentActivity(limit = 10) {
        const supabase = require('../repositories').Order.supabase;
        
        const { data, error } = await supabase
            .from('orders')
            .select(`
                id,
                order_number,
                total,
                status,
                created_at,
                customer:customer_id(name, email)
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data.map(order => ({
            type: 'order',
            id: order.id,
            number: order.order_number,
            amount: order.total,
            status: order.status,
            customer: order.customer?.name || '未知客户',
            timestamp: order.created_at
        }));
    }

    /**
     * 获取预警信息
     */
    async getAlerts() {
        const alerts = [];
        
        // 1. 检查低库存产品
        const productRepo = require('../repositories').Product;
        const lowStock = await productRepo.getLowStockProducts(5);
        if (lowStock.length > 0) {
            alerts.push({
                type: 'warning',
                title: '库存预警',
                message: `${lowStock.length} 个产品库存不足`,
                details: lowStock.map(p => `${p.name}: ${p.stock}件`)
            });
        }

        // 2. 检查待处理订单
        const orderRepo = require('../repositories').Order;
        const pendingOrders = await orderRepo.findAll({ where: { status: 'pending' } });
        if (pendingOrders.length > 10) {
            alerts.push({
                type: 'info',
                title: '待处理订单',
                message: `${pendingOrders.length} 个订单待处理`
            });
        }

        // 3. 检查今日销售
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = await orderRepo.findAll({
            where: { status: 'paid' },
            orderBy: { column: 'created_at', ascending: false }
        });
        const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        
        if (todayRevenue === 0) {
            alerts.push({
                type: 'info',
                title: '今日销售提醒',
                message: '今日暂无销售记录'
            });
        }

        return alerts;
    }

    /**
     * 获取性能指标
     */
    async getPerformanceMetrics(dateRange = {}) {
        const { startDate, endDate } = dateRange;
        const trends = await this.reportService.getDailyTrends(startDate, endDate);
        
        if (trends.length === 0) {
            return { average: 0, peak: 0, growth: 0 };
        }

        const totalRevenue = trends.reduce((sum, d) => sum + d.revenue, 0);
        const average = totalRevenue / trends.length;
        const peak = Math.max(...trends.map(d => d.revenue));

        // 计算趋势
        const sorted = [...trends].sort((a, b) => new Date(a.date) - new Date(b.date));
        const first = sorted[0]?.revenue || 0;
        const last = sorted[sorted.length - 1]?.revenue || 0;
        const growth = first > 0 ? ((last - first) / first * 100) : 0;

        return {
            average: Math.round(average * 100) / 100,
            peak: Math.round(peak * 100) / 100,
            growth: Math.round(growth * 100) / 100,
            trend: growth > 5 ? '上升' : growth < -5 ? '下降' : '平稳'
        };
    }

    /**
     * 获取客户分析
     */
    async getCustomerAnalytics() {
        const supabase = require('../repositories').Order.supabase;
        
        // 客户分层
        const { data: customerOrders, error } = await supabase
            .from('orders')
            .select('customer_id, total')
            .eq('status', 'paid');

        if (error) throw error;

        // 统计每个客户的总消费
        const customerSpending = {};
        customerOrders.forEach(order => {
            const id = order.customer_id;
            if (!customerSpending[id]) {
                customerSpending[id] = 0;
            }
            customerSpending[id] += order.total || 0;
        });

        // 分层
        const tiers = {
            vip: { count: 0, minSpending: 10000 },
            premium: { count: 0, minSpending: 5000 },
            regular: { count: 0, minSpending: 1000 },
            new: { count: 0, minSpending: 0 }
        };

        Object.values(customerSpending).forEach(spending => {
            if (spending >= tiers.vip.minSpending) {
                tiers.vip.count++;
            } else if (spending >= tiers.premium.minSpending) {
                tiers.premium.count++;
            } else if (spending >= tiers.regular.minSpending) {
                tiers.regular.count++;
            } else {
                tiers.new.count++;
            }
        });

        return {
            tiers,
            totalCustomers: Object.values(customerSpending).length,
            averageSpending: Object.values(customerSpending).reduce((sum, s) => sum + s, 0) / Object.values(customerSpending).length || 0,
            topCustomers: Object.entries(customerSpending)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([id, spending]) => ({ customerId: id, totalSpending: spending }))
        };
    }

    /**
     * 获取产品分析
     */
    async getProductAnalytics() {
        const productRepo = require('../repositories').Product;
        const supabase = require('../repositories').Order.supabase;

        // 产品销售数据
        const { data: productSales, error } = await supabase
            .from('order_items')
            .select('product_id, quantity, price')
            .in('order_id', 
                supabase.from('orders').select('id').eq('status', 'paid')
            );

        if (error) throw error;

        // 统计每个产品的销售
        const productStats = {};
        productSales.forEach(item => {
            const id = item.product_id;
            if (!productStats[id]) {
                productStats[id] = { quantity: 0, revenue: 0 };
            }
            productStats[id].quantity += item.quantity || 0;
            productStats[id].revenue += (item.price || 0) * (item.quantity || 0);
        });

        // 获取产品详情
        const products = await productRepo.findAll();
        const productMap = {};
        products.forEach(p => {
            productMap[p.id] = p;
        });

        // 计算分类统计
        const categoryStats = {};
        Object.entries(productStats).forEach(([id, stats]) => {
            const product = productMap[id];
            if (product) {
                const category = product.category || '未分类';
                if (!categoryStats[category]) {
                    categoryStats[category] = { quantity: 0, revenue: 0 };
                }
                categoryStats[category].quantity += stats.quantity;
                categoryStats[category].revenue += stats.revenue;
            }
        });

        return {
            totalProducts: products.length,
            productStats,
            categoryStats,
            topSelling: Object.entries(productStats)
                .sort((a, b) => b[1].quantity - a[1].quantity)
                .slice(0, 10)
                .map(([id, stats]) => ({
                    productId: id,
                    productName: productMap[id]?.name || '未知',
                    ...stats
                }))
        };
    }
}

module.exports = new AnalyticsService();
