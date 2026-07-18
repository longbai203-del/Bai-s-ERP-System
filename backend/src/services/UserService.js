const BaseService = require('./BaseService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class UserService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async register(data) {
        const { email, password, name, phone } = data;
        if (!email || !password) throw new Error('邮箱和密码不能为空');
        if (password.length < 6) throw new Error('密码长度至少6位');
        
        const existing = await this.repository.findByEmail(email);
        if (existing) throw new Error('邮箱已被注册');
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.repository.create({
            email,
            password_hash: hashedPassword,
            name: name || '',
            phone: phone || '',
            role: 'user',
            status: 'active'
        });
        delete user.password_hash;
        return user;
    }

    async login(email, password) {
        if (!email || !password) throw new Error('邮箱和密码不能为空');
        const user = await this.repository.findByEmail(email);
        if (!user) throw new Error('邮箱或密码错误');
        
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) throw new Error('邮箱或密码错误');
        if (user.status === 'inactive') throw new Error('账户已被禁用');
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        delete user.password_hash;
        return { user, token };
    }

    async updateUser(id, data) {
        const user = await this.getById(id);
        if (!user) throw new Error('用户不存在');
        if (data.password) {
            data.password_hash = await bcrypt.hash(data.password, 10);
            delete data.password;
        }
        const updated = await this.repository.update(id, data);
        delete updated.password_hash;
        return updated;
    }

    async changePassword(id, oldPassword, newPassword) {
        const user = await this.getById(id);
        const isValid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isValid) throw new Error('原密码错误');
        if (newPassword.length < 6) throw new Error('新密码长度至少6位');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.repository.update(id, { password_hash: hashedPassword });
        return { success: true, message: '密码修改成功' };
    }

    async getUserPermissions(id) {
        return this.repository.getUserPermissions(id);
    }

    async getUsers(params = {}) {
        const { page = 1, limit = 10, keyword, role, status } = params;
        const where = {};
        if (role) where.role = role;
        if (status) where.status = status;
        const users = await this.repository.findAll({
            where,
            limit,
            offset: (page - 1) * limit,
            orderBy: { column: 'created_at', ascending: false }
        });
        const total = await this.repository.count(where);
        const list = users.map(user => { delete user.password_hash; return user; });
        return { list, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
}

module.exports = UserService;
