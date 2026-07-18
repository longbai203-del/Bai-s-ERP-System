const BaseRepository = require('./BaseRepository');

class OrderRepository extends BaseRepository {
    constructor(supabase) {
        super(supabase, 'orders');
    }

    /**
     * 获取订单详情（包含关联数据）
     */
    async getOrderWithDetails(id) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select(`
                *,
                customer:customer_id (*),
                items:order_items (
                    *,
                    product:product_id (*)
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * 获取用户的所有订单
     */
    async getOrdersByCustomer(customerId, options = {}) {
        return this.findAll({
            where: { customer_id: customerId },
            orderBy: { column: 'created_at', ascending: false },
            ...options
        });
    }

    /**
     * 获取订单统计
     */
    async getOrderStats(dateRange = {}) {
        let query = this.supabase.from(this.tableName).select('*');
        
        if (dateRange.startDate) {
            query = query.gte('created_at', dateRange.startDate);
        }
        if (dateRange.endDate) {
            query = query.lte('created_at', dateRange.endDate);
        }

        const { data, error } = await query;
        if (error) throw error;

        const stats = {
            total: data.length,
            byStatus: {},
            totalRevenue: 0,
            averageValue: 0
        };

        data.forEach(order => {
            stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
            stats.totalRevenue += order.total || 0;
        });

        stats.averageValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;
        return stats;
    }

    /**
     * 更新订单状态
     */
    async updateStatus(id, status) {
        return this.update(id, { 
            status, 
            updated_at: new Date().toISOString()
        });
    }
}

module.exports = OrderRepository;
