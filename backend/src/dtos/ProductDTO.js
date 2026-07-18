const BaseDTO = require('./BaseDTO');

/**
 * 创建产品DTO
 */
class CreateProductDTO extends BaseDTO {
    constructor(data) {
        super(data);
    }

    transform() {
        return {
            sku: this.raw.sku?.trim().toUpperCase(),
            name: this.raw.name?.trim(),
            description: this.raw.description?.trim() || '',
            price: parseFloat(this.raw.price) || 0,
            cost: parseFloat(this.raw.cost) || 0,
            stock: parseInt(this.raw.stock) || 0,
            category: this.raw.category?.trim() || '',
            images: this.raw.images || [],
            status: this.raw.status || 'active'
        };
    }

    validate() {
        const errors = [];
        const data = this.getData();

        if (!data.sku) errors.push('SKU不能为空');
        if (!data.name) errors.push('产品名称不能为空');
        if (data.price < 0) errors.push('价格不能为负数');
        if (data.stock < 0) errors.push('库存不能为负数');

        if (data.status && !['active', 'inactive', 'draft'].includes(data.status)) {
            errors.push('状态值无效');
        }

        return { valid: errors.length === 0, errors };
    }
}

/**
 * 更新库存DTO
 */
class UpdateStockDTO extends BaseDTO {
    constructor(data) {
        super(data);
    }

    transform() {
        return {
            quantity: parseInt(this.raw.quantity) || 0,
            operation: this.raw.operation || 'add' // 'add' or 'subtract'
        };
    }

    validate() {
        const errors = [];
        const data = this.getData();

        if (data.quantity === 0) {
            errors.push('数量不能为0');
        }
        if (!['add', 'subtract'].includes(data.operation)) {
            errors.push('操作类型无效');
        }

        return { valid: errors.length === 0, errors };
    }
}

module.exports = {
    CreateProductDTO,
    UpdateStockDTO
};
