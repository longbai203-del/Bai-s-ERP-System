const BaseRepository = require('./BaseRepository');

class ProductRepository extends BaseRepository {
    constructor(supabase) {
        super(supabase, 'products');
    }

    /**
     * 搜索产品
     */
    async search(keyword, options = {}) {
        let query = this.supabase
            .from(this.tableName)
            .select('*')
            .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%,sku.ilike.%${keyword}%`);

        if (options.category) {
            query = query.eq('category', options.category);
        }
        if (options.minPrice) {
            query = query.gte('price', options.minPrice);
        }
        if (options.maxPrice) {
            query = query.lte('price', options.maxPrice);
        }
        if (options.inStock !== undefined) {
            query = options.inStock ? query.gt('stock', 0) : query.eq('stock', 0);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    /**
     * 更新库存
     */
    async updateStock(id, quantity) {
        const product = await this.findById(id);
        if (!product) throw new Error('Product not found');

        const newStock = product.stock + quantity;
        if (newStock < 0) throw new Error('Insufficient stock');

        return this.update(id, { stock: newStock });
    }

    /**
     * 获取库存预警
     */
    async getLowStockProducts(threshold = 10) {
        return this.findAll({
            where: { stock: 0 },
            orderBy: { column: 'stock', ascending: true },
            limit: 20
        });
    }

    /**
     * 获取产品统计
     */
    async getProductStats() {
        const all = await this.findAll();
        return {
            total: all.length,
            totalValue: all.reduce((sum, p) => sum + (p.price * p.stock), 0),
            lowStock: all.filter(p => p.stock < 10).length,
            outOfStock: all.filter(p => p.stock === 0).length
        };
    }
}

module.exports = ProductRepository;
