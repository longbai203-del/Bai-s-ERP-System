/**
 * @file user.controller.js
 * @description 用户控制器
 * @module controllers/user.controller
 */

import { supabaseService } from '../services/supabase.service.js';
import { success, error, paginate } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { validate, required, email, length, oneOf } from '../utils/validator.js';
import bcrypt from 'bcryptjs';

/**
 * 用户控制器
 */
export const userController = {
    /**
     * 获取用户列表
     */
    getList: async (req, res) => {
        try {
            const { page = 1, pageSize = 10, keyword = '', role = '', status = '' } = req.query;

            const result = await supabaseService.getUsers({
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                keyword,
                role,
                status
            });

            if (result.success) {
                return paginate(
                    res,
                    result.data.list,
                    result.data.total,
                    page,
                    pageSize,
                    '获取用户列表成功'
                );
            }
            return error(res, result.error || '获取用户列表失败', 500);
        } catch (err) {
            logger.error('[UserController] getList error:', err);
            return error(res, '获取用户列表失败', 500);
        }
    },

    /**
     * 获取用户统计
     */
    getStats: async (req, res) => {
        try {
            const result = await supabaseService.getUserStats();
            if (result.success) {
                return success(res, result.data, '获取用户统计成功');
            }
            return error(res, result.error || '获取用户统计失败', 500);
        } catch (err) {
            logger.error('[UserController] getStats error:', err);
            return error(res, '获取用户统计失败', 500);
        }
    },

    /**
     * 搜索用户
     */
    search: async (req, res) => {
        try {
            const { keyword, limit = 10 } = req.query;
            if (!keyword || keyword.trim().length < 2) {
                return error(res, '搜索关键词至少2个字符', 400);
            }

            const result = await supabaseService.searchUsers(keyword, parseInt(limit));
            if (result.success) {
                return success(res, result.data, '搜索成功');
            }
            return error(res, result.error || '搜索失败', 500);
        } catch (err) {
            logger.error('[UserController] search error:', err);
            return error(res, '搜索失败', 500);
        }
    },

    /**
     * 获取用户详情
     */
    getDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const userRole = req.user?.role;

            // 检查权限：管理员或本人
            if (userRole !== 'admin' && userRole !== 'owner' && id !== userId) {
                return error(res, '权限不足', 403, 'FORBIDDEN');
            }

            const result = await supabaseService.getUserById(id);
            if (result.success && result.data) {
                // 移除敏感信息
                const { password_hash, ...userData } = result.data;
                return success(res, userData, '获取用户详情成功');
            }
            return error(res, result.error || '用户不存在', 404);
        } catch (err) {
            logger.error('[UserController] getDetail error:', err);
            return error(res, '获取用户详情失败', 500);
        }
    },

    /**
     * 获取用户权限
     */
    getPermissions: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await supabaseService.getUserPermissions(id);
            if (result.success) {
                return success(res, result.data || [], '获取用户权限成功');
            }
            return error(res, result.error || '获取用户权限失败', 500);
        } catch (err) {
            logger.error('[UserController] getPermissions error:', err);
            return error(res, '获取用户权限失败', 500);
        }
    },

    /**
     * 创建用户
     */
    create: async (req, res) => {
        try {
            const data = req.body;

            // 验证数据
            const validation = validate(data, {
                username: [required, (v) => length(v, { min: 3, max: 50 }, '用户名')],
                email: [required, email],
                password: [required, (v) => length(v, { min: 6 }, '密码')],
                role: [(v) => oneOf(v, ['user', 'admin', 'manager'], '角色')]
            });

            if (!validation.valid) {
                return error(res, validation.message, 400, 'VALIDATION_ERROR');
            }

            // 检查用户名是否已存在
            const existingUser = await supabaseService.getUserByUsername(data.username);
            if (existingUser.success && existingUser.data) {
                return error(res, '用户名已存在', 400, 'USERNAME_EXISTS');
            }

            // 检查邮箱是否已存在
            const existingEmail = await supabaseService.getUserByEmail(data.email);
            if (existingEmail.success && existingEmail.data) {
                return error(res, '邮箱已被使用', 400, 'EMAIL_EXISTS');
            }

            // 加密密码
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(data.password, salt);

            // 创建用户
            const userData = {
                username: data.username,
                email: data.email,
                password_hash: passwordHash,
                role: data.role || 'user',
                full_name: data.full_name || '',
                phone: data.phone || '',
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const result = await supabaseService.createUser(userData);
            if (result.success) {
                const { password_hash, ...newUser } = result.data[0];
                return success(res, newUser, '用户创建成功', 201);
            }
            return error(res, result.error || '创建用户失败', 500);
        } catch (err) {
            logger.error('[UserController] create error:', err);
            return error(res, '创建用户失败', 500);
        }
    },

    /**
     * 更新用户
     */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const userRole = req.user?.role;
            const data = req.body;

            // 检查权限：管理员或本人
            if (userRole !== 'admin' && userRole !== 'owner' && id !== userId) {
                return error(res, '权限不足', 403, 'FORBIDDEN');
            }

            // 非管理员不能修改角色
            if (data.role && userRole !== 'admin' && userRole !== 'owner') {
                return error(res, '无权修改用户角色', 403, 'FORBIDDEN');
            }

            // 验证数据
            const validation = validate(data, {
                username: [(v) => !v || length(v, { min: 3, max: 50 }, '用户名')],
                email: [(v) => !v || email(v)],
                role: [(v) => !v || oneOf(v, ['user', 'admin', 'manager'], '角色')],
                status: [(v) => !v || oneOf(v, ['active', 'inactive', 'suspended'], '状态')]
            });

            if (!validation.valid) {
                return error(res, validation.message, 400, 'VALIDATION_ERROR');
            }

            // 如果更新密码
            if (data.password) {
                const salt = await bcrypt.genSalt(10);
                data.password_hash = await bcrypt.hash(data.password, salt);
                delete data.password;
            }

            data.updated_at = new Date().toISOString();

            const result = await supabaseService.updateUser(id, data);
            if (result.success) {
                const { password_hash, ...updatedUser } = result.data[0];
                return success(res, updatedUser, '用户更新成功');
            }
            return error(res, result.error || '更新用户失败', 500);
        } catch (err) {
            logger.error('[UserController] update error:', err);
            return error(res, '更新用户失败', 500);
        }
    },

    /**
     * 更新用户权限
     */
    updatePermissions: async (req, res) => {
        try {
            const { id } = req.params;
            const { permissions } = req.body;

            if (!Array.isArray(permissions)) {
                return error(res, '权限必须是数组', 400, 'VALIDATION_ERROR');
            }

            const result = await supabaseService.updateUserPermissions(id, permissions);
            if (result.success) {
                return success(res, { permissions }, '更新权限成功');
            }
            return error(res, result.error || '更新权限失败', 500);
        } catch (err) {
            logger.error('[UserController] updatePermissions error:', err);
            return error(res, '更新权限失败', 500);
        }
    },

    /**
     * 删除用户
     */
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            // 不能删除自己
            if (id === req.userId) {
                return error(res, '不能删除自己的账号', 400, 'SELF_DELETE');
            }

            const result = await supabaseService.deleteUser(id);
            if (result.success) {
                return success(res, null, '用户删除成功');
            }
            return error(res, result.error || '删除用户失败', 500);
        } catch (err) {
            logger.error('[UserController] delete error:', err);
            return error(res, '删除用户失败', 500);
        }
    },

    /**
     * 激活用户
     */
    activate: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await supabaseService.updateUser(id, {
                status: 'active',
                updated_at: new Date().toISOString()
            });
            if (result.success) {
                return success(res, null, '用户已激活');
            }
            return error(res, result.error || '激活用户失败', 500);
        } catch (err) {
            logger.error('[UserController] activate error:', err);
            return error(res, '激活用户失败', 500);
        }
    },

    /**
     * 禁用用户
     */
    deactivate: async (req, res) => {
        try {
            const { id } = req.params;

            if (id === req.userId) {
                return error(res, '不能禁用自己', 400, 'SELF_DEACTIVATE');
            }

            const result = await supabaseService.updateUser(id, {
                status: 'inactive',
                updated_at: new Date().toISOString()
            });
            if (result.success) {
                return success(res, null, '用户已禁用');
            }
            return error(res, result.error || '禁用用户失败', 500);
        } catch (err) {
            logger.error('[UserController] deactivate error:', err);
            return error(res, '禁用用户失败', 500);
        }
    }
};

export default userController;