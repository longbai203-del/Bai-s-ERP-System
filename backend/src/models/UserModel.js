const BaseModel = require('./BaseModel');

/**
 * 用户模型 - 纯数据定义
 */
class UserModel extends BaseModel {
    constructor() {
        super({
            id: { type: 'uuid', required: false },
            email: { type: 'string', required: true },
            password_hash: { type: 'string', required: true },
            name: { type: 'string', required: false },
            role: { type: 'string', required: false, default: 'user' },
            status: { type: 'string', required: false, default: 'active' },
            avatar: { type: 'string', required: false },
            phone: { type: 'string', required: false },
            created_at: { type: 'datetime', required: false },
            updated_at: { type: 'datetime', required: false }
        });
    }

    /**
     * 获取公开字段（不包含敏感信息）
     */
    getPublicFields() {
        return ['id', 'email', 'name', 'role', 'status', 'avatar', 'phone', 'created_at'];
    }

    /**
     * 转换为公开JSON
     */
    toPublicJSON(data) {
        const result = {};
        for (const field of this.getPublicFields()) {
            if (data[field] !== undefined) {
                result[field] = data[field];
            }
        }
        return result;
    }

    /**
     * 验证用户数据
     */
    validateUser(data) {
        const errors = [];

        // 验证邮箱
        if (data.email && !this.isValidEmail(data.email)) {
            errors.push('邮箱格式不正确');
        }

        // 验证手机号
        if (data.phone && !this.isValidPhone(data.phone)) {
            errors.push('手机号格式不正确');
        }

        // 验证角色
        if (data.role && !['user', 'admin', 'manager'].includes(data.role)) {
            errors.push('角色值无效');
        }

        return errors;
    }

    /**
     * 验证邮箱格式
     */
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * 验证手机号格式
     */
    isValidPhone(phone) {
        return /^1[3-9]\d{9}$/.test(phone);
    }
}

module.exports = new UserModel();
