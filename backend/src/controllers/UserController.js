const BaseController = require('./BaseController');

class UserController extends BaseController {
    constructor(service) {
        super(service);
    }

    /**
     * 用户注册
     */
    async register(req, res) {
        try {
            const user = await this.service.register(req.body);
            return this.success(res, user, '注册成功', 201);
        } catch (error) {
            return this.error(res, error, 400);
        }
    }

    /**
     * 用户登录
     */
    async login(req, res) {
        try {
            const result = await this.service.login(req.body);
            return this.success(res, result, '登录成功');
        } catch (error) {
            return this.error(res, error, 401);
        }
    }

    /**
     * 获取当前用户信息
     */
    async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return this.error(res, new Error('未登录'), 401);
            }
            const user = await this.service.getById(userId);
            return this.success(res, user);
        } catch (error) {
            return this.error(res, error);
        }
    }

    /**
     * 更新用户信息
     */
    async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return this.error(res, new Error('未登录'), 401);
            }
            const user = await this.service.updateUser(userId, req.body);
            return this.success(res, user, '更新成功');
        } catch (error) {
            return this.error(res, error, 400);
        }
    }

    /**
     * 修改密码
     */
    async changePassword(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return this.error(res, new Error('未登录'), 401);
            }
            const { oldPassword, newPassword } = req.body;
            await this.service.changePassword(userId, oldPassword, newPassword);
            return this.success(res, null, '密码修改成功');
        } catch (error) {
            return this.error(res, error, 400);
        }
    }

    /**
     * 获取用户列表（管理员）
     */
    async getUsers(req, res) {
        try {
            const { page, limit, offset } = this.getPagination(req);
            const filters = this.getFilters(req, ['role', 'status']);
            
            const users = await this.service.getAll({
                where: filters,
                limit,
                offset,
                orderBy: { column: 'created_at', ascending: false }
            });
            
            const total = await this.service.count(filters);
            return this.paginated(res, users, total, page, limit);
        } catch (error) {
            return this.error(res, error);
        }
    }
}

module.exports = UserController;
