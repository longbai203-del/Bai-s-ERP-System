const BaseRepository = require('./BaseRepository');
const bcrypt = require('bcryptjs');

class UserRepository extends BaseRepository {
    constructor(supabase) {
        super(supabase, 'users');
    }

    /**
     * 通过邮箱查找用户
     */
    async findByEmail(email) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    /**
     * 创建用户（自动加密密码）
     */
    async createWithHash(data) {
        const { password, ...rest } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        return this.create({
            ...rest,
            password_hash: hashedPassword
        });
    }

    /**
     * 验证密码
     */
    async validatePassword(email, password) {
        const user = await this.findByEmail(email);
        if (!user) return { valid: false, user: null };

        const isValid = await bcrypt.compare(password, user.password_hash);
        return { valid: isValid, user: isValid ? user : null };
    }

    /**
     * 获取用户权限
     */
    async getUserPermissions(userId) {
        const { data, error } = await this.supabase
            .from('user_permissions')
            .select('permission')
            .eq('user_id', userId);

        if (error) throw error;
        return data.map(p => p.permission);
    }
}

module.exports = UserRepository;
