const BaseController = require('./BaseController');

class OrderController extends BaseController {
    constructor(service) {
        super(service);
    }

    /**
     * 获取订单列表
     */
    async getAll(req, res) {
        try {
            const { page, limit, offset } = this.getPagination(req);
            const filters = this.getFilters(req, ['status', 'customer_id']);
            
            const orders = await this.service.getAll({
                where: filters,
                limit,
                offset,
                orderBy: { column: 'created_at', ascending: false }
            });
            
            const total = await this.service.count(filters);
            return this.paginated(res, orders, total, page, limit);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取订单详情
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const order = await this.service.getOrderWithDetails(id);
            return this.success(res, order);
        } catch (error) {
            return this.error(res, error, 404);
        }
    }

    /**
     * 创建订单
     */
    async create(req, res) {
        try {
            const order = await this.service.createOrder(req.body);
            return this.success(res, order, '订单创建成功', 201);
        } catch (error) {
            return this.error(res, error, 400);
        }
    }

    /**
     * 更新订单状态
     */
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const order = await this.service.updateOrderStatus(id, req.body);
            return this.success(res, order, '订单状态更新成功');
        } catch (error) {
            return this.error(res, error, 400);
        }
    }

    /**
     * 取消订单
     */
    async cancel(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const order = await this.service.cancelOrder(id, reason);
            return this.success(res, order, '订单已取消');
        } catch (error) {
            return this.error(res, error, 400);
        }
    }

    /**
     * 获取订单统计
     */
    async getStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const stats = await this.service.getOrderStats({ startDate, endDate });
            return this.success(res, stats);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 获取用户订单
     */
    async getByCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const orders = await this.service.getOrdersByCustomer(customerId);
            return this.success(res, orders);
        } catch (error) {
            return this.error(res, error);
        }
    }
}

module.exports = OrderController;
