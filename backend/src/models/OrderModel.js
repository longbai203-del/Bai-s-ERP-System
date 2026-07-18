const BaseModel = require('./BaseModel');

/**
 * 订单模型 - 纯数据定义
 */
class OrderModel extends BaseModel {
    constructor() {
        super({
            id: { type: 'uuid', required: false },
            order_number: { type: 'string', required: true },
            customer_id: { type: 'uuid', required: true },
            total: { type: 'number', required: true },
            status: { type: 'string', required: false, default: 'pending' },
            payment_status: { type: 'string', required: false, default: 'unpaid' },
            shipping_address: { type: 'object', required: false },
            notes: { type: 'string', required: false },
            items: { type: 'array', required: true },
            created_at: { type: 'datetime', required: false },
            updated_at: { type: 'datetime', required: false }
        });
    }

    /**
     * 获取订单状态列表
     */
    getStatuses() {
        return ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    }

    /**
     * 获取支付状态列表
     */
    getPaymentStatuses() {
        return ['unpaid', 'paid', 'refunded', 'failed'];
    }

    /**
     * 检查状态是否有效
     */
    isValidStatus(status) {
        return this.getStatuses().includes(status);
    }

    /**
     * 检查支付状态是否有效
     */
    isValidPaymentStatus(status) {
        return this.getPaymentStatuses().includes(status);
    }

    /**
     * 计算订单总额
     */
    calculateTotal(items) {
        if (!items || items.length === 0) return 0;
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
}

module.exports = new OrderModel();
