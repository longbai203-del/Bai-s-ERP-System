const BaseService = require('./BaseService');
const { CreateProductDTO, UpdateStockDTO } = require('../dtos');

class ProductService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    /**
     * 创建产品
     */
    async createProduct(data) {
        const dto = new CreateProductDTO(data);
        const validation = dto.getValidation();
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        const productData = dto.getData();
        
        // 检查SKU是否已存在
        const existing = await this.repository.findAll({ where: { sku: productData.sku } });
        if (existing.length > 0) {
            throw new Error(`SKU ${productData.sku} 已存在`);
        }

        return this.repository.create(productData);
    }

    /**
     * 更新产品
     */
    async updateProduct(id, data) {
        const existing = await this.getById(id);
        
        // 如果更新SKU，检查是否重复
        if (data.sku && data.sku !== existing.sku) {
            const check = await this.repository.findAll({ where: { sku: data.sku } });
            if (check.length > 0) {
                throw new Error(`SKU ${data.sku} 已存在`);
            }
        }

        return this.repository.update(id, data);
    }

    /**
     * 搜索产品
     */
    async searchProducts(keyword, options = {}) {
        if (!keyword || keyword.length < 2) {
            return this.repository.findAll(options);
        }
        return this.repository.search(keyword, options);
    }

    /**
     * 更新库存
     */
    async updateStock(id, data) {
        const dto = new UpdateStockDTO(data);
        const validation = dto.getValidation();
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        const stockData = dto.getData();
        const quantity = stockData.operation === 'add' 
            ? stockData.quantity 
            : -stockData.quantity;

        return this.repository.updateStock(id, quantity);
    }

    /**
     * 获取库存预警
     */
    async getLowStockProducts(threshold = 10) {
        return this.repository.getLowStockProducts(threshold);
    }

    /**
     * 获取产品统计
     */
    async getProductStats() {
        return this.repository.getProductStats();
    }

    /**
     * 批量更新价格
     */
    async batchUpdatePrice(productIds, percentage) {
        if (percentage === undefined || percentage === null) {
            throw new Error('百分比不能为空');
        }

        const results = [];
        for (const id of productIds) {
            const product = await this.getById(id);
            const newPrice = product.price * (1 + percentage / 100);
            const updated = await this.repository.update(id, {
                price: Math.round(newPrice * 100) / 100
            });
            results.push(updated);
        }
        return results;
    }
}

module.exports = ProductService;
