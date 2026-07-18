const BaseDTO = require('./BaseDTO');

/**
 * 创建订单DTO
 */
class CreateOrderDTO extends BaseDTO {
    constructor(data) {
        super(data);
    }

    transform() {
        return {
            customer_id: this.raw.customer_id,
            items: this.raw.items || [],
            shipping_address: this.raw.shipping_address || {},
            notes: this.raw.notes || '',
            payment_method: this.raw.payment_method || 'cash',
            total: this.calculateTotal(this.raw.items || [])
        };
    }

    calculateTotal(items) {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    validate() {
        const errors = [];
        const data = this.getData();

        if (!data.customer_id) {
            errors.push('客户ID不能为空');
        }
        if (!data.items || data.items.length === 0) {
            errors.push('订单商品不能为空');
        } else {
            data.items.forEach((item, index) => {
                if (!item.product_id) {
                    errors.push(`第${index + 1}个商品缺少产品ID`);
                }
                if (!item.quantity || item.quantity <= 0) {
                    errors.push(`第${index + 1}个商品数量无效`);
                }
                if (!item.price || item.price <= 0) {
                    errors.push(`第${index + 1}个商品价格无效`);
                }
            });
        }

        return { valid: errors.length === 0, errors };
    }
}

/**
 * 更新订单状态DTO
 */
class UpdateOrderStatusDTO extends BaseDTO {
    constructor(data) {
        super(data);
    }

    transform() {
        return {
            status: this.raw.status,
            reason: this.raw.reason || ''
        };
    }

    validate() {
        const errors = [];
        const data = this.getData();
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!data.status) {
            errors.push('状态不能为空');
        } else if (!validStatuses.includes(data.status)) {
            errors.push(`无效的状态值: ${data.status}`);
        }

        return { valid: errors.length === 0, errors };
    }
}

module.exports = {
    CreateOrderDTO,
    UpdateOrderStatusDTO
};
