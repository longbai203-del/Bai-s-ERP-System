const BaseService = require('./BaseService');
const { CreateOrderDTO, UpdateOrderStatusDTO } = require('../dtos');
const models = require('../models');

class OrderService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    /**
     * 创建订单
     */
    async createOrder(data) {
        const dto = new CreateOrderDTO(data);
        const validation = dto.getValidation();
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        const orderData = dto.getData();
        
        // 生成订单号
        orderData.order_number = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // 使用事务创建订单
        const result = await this.repository.transaction([
            {
                type: 'create',
                data: orderData
            }
        ]);

        // 更新产品库存
        const productRepo = require('../repositories').Product;
        for (const item of orderData.items) {
            await productRepo.updateStock(item.product_id, -item.quantity);
        }

        return result[0];
    }

    /**
     * 更新订单状态
     */
    async updateOrderStatus(id, data) {
        const dto = new UpdateOrderStatusDTO(data);
        const validation = dto.getValidation();
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        const statusData = dto.getData();
        const order = await this.getById(id);

        // 验证状态转换
        const validTransitions = {
            'pending': ['processing', 'cancelled'],
            'processing': ['shipped', 'cancelled'],
            'shipped': ['delivered', 'cancelled'],
            'delivered': [],
            'cancelled': []
        };

        if (!validTransitions[order.status]?.includes(statusData.status)) {
            throw new Error(`不能从 ${order.status} 转换到 ${statusData.status}`);
        }

        return this.repository.updateStatus(id, statusData.status);
    }

    /**
     * 获取订单详情
     */
    async getOrderWithDetails(id) {
        return this.repository.getOrderWithDetails(id);
    }

    /**
     * 获取用户订单
     */
    async getOrdersByCustomer(customerId, options = {}) {
        return this.repository.getOrdersByCustomer(customerId, options);
    }

    /**
     * 获取订单统计
     */
    async getOrderStats(dateRange = {}) {
        return this.repository.getOrderStats(dateRange);
    }

    /**
     * 取消订单
     */
    async cancelOrder(id, reason = '') {
        const order = await this.getById(id);
        
        if (['delivered', 'cancelled'].includes(order.status)) {
            throw new Error(`订单已${order.status}，无法取消`);
        }

        // 回退库存
        if (order.items) {
            const productRepo = require('../repositories').Product;
            for (const item of order.items) {
                await productRepo.updateStock(item.product_id, item.quantity);
            }
        }

        return this.repository.update(id, {
            status: 'cancelled',
            cancellation_reason: reason,
            cancelled_at: new Date().toISOString()
        });
    }
}

module.exports = OrderService;
