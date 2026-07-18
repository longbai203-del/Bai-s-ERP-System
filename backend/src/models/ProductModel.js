const BaseModel = require('./BaseModel');

/**
 * 产品模型 - 纯数据定义
 */
class ProductModel extends BaseModel {
    constructor() {
        super({
            id: { type: 'uuid', required: false },
            sku: { type: 'string', required: true },
            name: { type: 'string', required: true },
            description: { type: 'string', required: false },
            price: { type: 'number', required: true },
            cost: { type: 'number', required: false },
            stock: { type: 'number', required: false, default: 0 },
            category: { type: 'string', required: false },
            images: { type: 'array', required: false },
            status: { type: 'string', required: false, default: 'active' },
            created_at: { type: 'datetime', required: false },
            updated_at: { type: 'datetime', required: false }
        });
    }

    /**
     * 获取产品状态列表
     */
    getStatuses() {
        return ['active', 'inactive', 'draft'];
    }

    /**
     * 检查库存是否充足
     */
    hasStock(product, quantity = 1) {
        return product.stock >= quantity;
    }

    /**
     * 计算折扣后价格
     */
    getDiscountedPrice(product, discount = 0) {
        if (discount <= 0) return product.price;
        if (discount >= 100) return 0;
        return Math.round(product.price * (1 - discount / 100) * 100) / 100;
    }
}

module.exports = new ProductModel();
