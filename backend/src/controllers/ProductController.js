const BaseController = require('./BaseController');

class ProductController extends BaseController {
    constructor(service) {
        super(service);
    }

    /**
     * 获取产品列表
     */
    async getAll(req, res) {
        try {
            const { page, limit, offset } = this.getPagination(req);
            const filters = this.getFilters(req, ['category', 'status']);
            
            const products = await this.service.getAll({
                where: filters,
                limit,
                offset,
                orderBy: { column: 'created_at', ascending: false }
            });
            
            const total = await this.service.count(filters);
            return this.paginated(res, products, total, page, limit);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取产品详情
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const product = await this.service.getById(id);
            return this.success(res, product);
        } catch (error) {
            return this.error(res, error, 404);
        }
    }

    /**
     * 创建产品
     */
    async create(req, res) {
        try {
            const product = await this.service.createProduct(req.body);
            return this.success(res, product, '产品创建成功', 201);
        } catch (error) {
            return this.error(res, error, 400);
        }
    }

    /**
     * 更新产品
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const product = await this.service.updateProduct(id, req.body);
            return this.success(res, product, '产品更新成功');
        } catch (error) {
            return this.error(res, error, 400);
        }
    }

    /**
     * 删除产品
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            await this.service.delete(id);
            return this.success(res, null, '产品删除成功');
        } catch (error) {
            return this.error(res, error, 400);
        }
    }

    /**
     * 搜索产品
     */
    async search(req, res) {
        try {
            const { q, category, minPrice, maxPrice, inStock } = req.query;
            const products = await this.service.searchProducts(q, {
                category,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                inStock: inStock === 'true'
            });
            return this.success(res, products);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 更新库存
     */
    async updateStock(req, res) {
        try {
            const { id } = req.params;
            const product = await this.service.updateStock(id, req.body);
            return this.success(res, product, '库存更新成功');
        } catch (error) {
            return this.error(res, error, 400);
        }
    }

    /**
     * 获取库存预警
     */
    async getLowStock(req, res) {
        try {
            const { threshold } = req.query;
            const products = await this.service.getLowStockProducts(parseInt(threshold) || 10);
            return this.success(res, products);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取产品统计
     */
    async getStats(req, res) {
        try {
            const stats = await this.service.getProductStats();
            return this.success(res, stats);
        } catch (error) {
            return this.error(res, error);
        }
    }
}

module.exports = ProductController;
