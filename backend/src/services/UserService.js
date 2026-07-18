const BaseService = require('./BaseService');
const jwt = require('jsonwebtoken');
const { RegisterDTO, LoginDTO, UpdateUserDTO } = require('../dtos');

class UserService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    /**
     * 用户注册
     */
    async register(data) {
        const dto = new RegisterDTO(data);
        const validation = dto.getValidation();
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        const userData = dto.getData();
        
        // 检查邮箱是否已存在
        const existing = await this.repository.findByEmail(userData.email);
        if (existing) {
            throw new Error('邮箱已被注册');
        }

        const user = await this.repository.createWithHash(userData);
        return this.repository.model?.toPublicJSON ? 
            this.repository.model.toPublicJSON(user) : user;
    }

    /**
     * 用户登录
     */
    async login(data) {
        const dto = new LoginDTO(data);
        const validation = dto.getValidation();
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        const loginData = dto.getData();
        const { valid, user } = await this.repository.validatePassword(
            loginData.email,
            loginData.password
        );

        if (!valid || !user) {
            throw new Error('邮箱或密码错误');
        }

        if (user.status === 'inactive') {
            throw new Error('账户已被禁用');
        }

        // 生成JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                role: user.role 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // 返回用户信息和token
        const publicUser = this.repository.model?.toPublicJSON ?
            this.repository.model.toPublicJSON(user) : user;

        return {
            user: publicUser,
            token
        };
    }

    /**
     * 更新用户信息
     */
    async updateUser(id, data) {
        const dto = new UpdateUserDTO(data);
        const validation = dto.getValidation();
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        const userData = dto.getData();
        const user = await this.getById(id);

        // 如果更新邮箱，检查是否已被使用        if (data.email && data.email !== user.email) {
            const existing = await this.repository.findByEmail(data.email);
            if (existing && existing.id !== id) {
                throw new Error('邮箱已被其他用户使用');
            }
        }

        const updated = await this.repository.update(id, userData);
        return this.repository.model?.toPublicJSON ?
            this.repository.model.toPublicJSON(updated) : updated;
    }

    /**
     * 修改密码
     */
    async changePassword(id, oldPassword, newPassword) {
        const user = await this.getById(id);
        
        const { valid } = await this.repository.validatePassword(
            user.email,
            oldPassword
        );
        
        if (!valid) {
            throw new Error('原密码错误');
        }

        if (newPassword.length < 6) {
            throw new Error('新密码长度至少6位');
        }

        // 直接更新密码
        const { createWithHash } = this.repository;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.repository.update(id, { password_hash: hashedPassword });
    }

    /**
     * 获取用户权限
     */
    async getUserPermissions(id) {
        return this.repository.getUserPermissions(id);
    }
}

module.exports = UserService;
