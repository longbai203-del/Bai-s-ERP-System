const BaseDTO = require('./BaseDTO');

/**
 * 用户注册DTO
 */
class RegisterDTO extends BaseDTO {
    constructor(data) {
        super(data);
    }

    transform() {
        return {
            email: this.raw.email?.trim().toLowerCase(),
            password: this.raw.password,
            name: this.raw.name?.trim() || '',
            phone: this.raw.phone?.trim() || '',
            role: this.raw.role || 'user'
        };
    }

    validate() {
        const errors = [];
        const data = this.getData();

        if (!data.email) {
            errors.push('邮箱不能为空');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('邮箱格式不正确');
        }

        if (!data.password) {
            errors.push('密码不能为空');
        } else if (data.password.length < 6) {
            errors.push('密码长度至少6位');
        }

        return { valid: errors.length === 0, errors };
    }
}

/**
 * 用户登录DTO
 */
class LoginDTO extends BaseDTO {
    constructor(data) {
        super(data);
    }

    transform() {
        return {
            email: this.raw.email?.trim().toLowerCase(),
            password: this.raw.password
        };
    }

    validate() {
        const errors = [];
        const data = this.getData();

        if (!data.email) errors.push('邮箱不能为空');
        if (!data.password) errors.push('密码不能为空');

        return { valid: errors.length === 0, errors };
    }
}

/**
 * 用户更新DTO
 */
class UpdateUserDTO extends BaseDTO {
    constructor(data) {
        super(data);
    }

    transform() {
        return {
            name: this.raw.name?.trim(),
            phone: this.raw.phone?.trim(),
            avatar: this.raw.avatar,
            role: this.raw.role,
            status: this.raw.status
        };
    }

    validate() {
        const errors = [];
        const data = this.getData();

        if (data.role && !['user', 'admin', 'manager'].includes(data.role)) {
            errors.push('角色值无效');
        }
        if (data.status && !['active', 'inactive', 'suspended'].includes(data.status)) {
            errors.push('状态值无效');
        }

        return { valid: errors.length === 0, errors };
    }
}

module.exports = {
    RegisterDTO,
    LoginDTO,
    UpdateUserDTO
};
