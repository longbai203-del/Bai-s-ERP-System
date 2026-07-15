/**
 * @file auth.controller.js
 * @description 认证控制器
 * @module controllers/auth.controller
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { supabaseService } from '../services/supabase.service.js';
import { success, error } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { validate, required, email, length } from '../utils/validator.js';

export const authController = {
    /**
     * 用户注册
     */
    register: async (req, res) => {
        try {
            const { username, email, password, full_name } = req.body;

            // 验证数据
            const validation = validate(req.body, {
                username: [required, (v) => length(v, { min: 3, max: 50 }, '用户名')],
                email: [required, email],
                password: [required, (v) => length(v, { min: 6 }, '密码')]
            });

            if (!validation.valid) {
                return error(res, validation.message, 400, 'VALIDATION_ERROR');
            }

            // 检查用户名是否已存在
            const existingUser = await supabaseService.getUserByUsername(username);
            if (existingUser.success && existingUser.data) {
                return error(res, '用户名已存在', 400, 'USERNAME_EXISTS');
            }

            // 检查邮箱是否已存在
            const existingEmail = await supabaseService.getUserByEmail(email);
            if (existingEmail.success && existingEmail.data) {
                return error(res, '邮箱已被使用', 400, 'EMAIL_EXISTS');
            }

            // 加密密码
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // 创建用户
            const userData = {
                username,
                email,
                password_hash: passwordHash,
                full_name: full_name || username,
                role: 'user',
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const result = await supabaseService.createUser(userData);
            if (result.success) {
                const { password_hash, ...newUser } = result.data;
                return success(res, newUser, '注册成功', 201);
            }
            return error(res, result.error || '注册失败', 500);
        } catch (err) {
            logger.error('[AuthController] register error:', err);
            return error(res, '注册失败', 500);
        }
    },

    /**
     * 用户登录
     */
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return error(res, '用户名和密码不能为空', 400, 'MISSING_CREDENTIALS');
            }

            // 查找用户
            let userResult = await supabaseService.getUserByUsername(username);
            if (!userResult.success || !userResult.data) {
                userResult = await supabaseService.getUserByEmail(username);
            }

            if (!userResult.success || !userResult.data) {
                return error(res, '用户名或密码错误', 401, 'INVALID_CREDENTIALS');
            }

            const user = userResult.data;

            // 检查用户状态
            if (user.status !== 'active') {
                return error(res, '账户已被禁用', 403, 'ACCOUNT_DISABLED');
            }

            // 验证密码
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return error(res, '用户名或密码错误', 401, 'INVALID_CREDENTIALS');
            }

            // 生成 JWT
            const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            // 生成刷新令牌
            const refreshToken = jwt.sign(
                { userId: user.id },
                config.jwtSecret + '-refresh',
                { expiresIn: '30d' }
            );

            const { password_hash, ...userData } = user;

            return success(res, {
                user: userData,
                token,
                refreshToken
            }, '登录成功');
        } catch (err) {
            logger.error('[AuthController] login error:', err);
            return error(res, '登录失败', 500);
        }
    },

    /**
     * 用户登出
     */
    logout: async (req, res) => {
        try {
            // TODO: 将 token 加入黑名单
            return success(res, null, '登出成功');
        } catch (err) {
            logger.error('[AuthController] logout error:', err);
            return error(res, '登出失败', 500);
        }
    },

    /**
     * 获取当前用户信息
     */
    getMe: async (req, res) => {
        try {
            const userId = req.userId;
            const result = await supabaseService.getUserById(userId);
            if (result.success && result.data) {
                const { password_hash, ...userData } = result.data;
                return success(res, userData, '获取用户信息成功');
            }
            return error(res, '用户不存在', 404, 'USER_NOT_FOUND');
        } catch (err) {
            logger.error('[AuthController] getMe error:', err);
            return error(res, '获取用户信息失败', 500);
        }
    },

    /**
     * 刷新令牌
     */
    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return error(res, '缺少刷新令牌', 400, 'MISSING_REFRESH_TOKEN');
            }

            const decoded = jwt.verify(refreshToken, config.jwtSecret + '-refresh');
            const result = await supabaseService.getUserById(decoded.userId);

            if (!result.success || !result.data) {
                return error(res, '用户不存在', 404, 'USER_NOT_FOUND');
            }

            const token = jwt.sign(
                { userId: result.data.id, username: result.data.username, role: result.data.role },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            return success(res, { token }, '刷新成功');
        } catch (err) {
            logger.error('[AuthController] refreshToken error:', err);
            return error(res, '刷新令牌失败', 401, 'INVALID_REFRESH_TOKEN');
        }
    },

    /**
     * 修改密码
     */
    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.userId;

            if (!oldPassword || !newPassword) {
                return error(res, '请提供旧密码和新密码', 400, 'MISSING_PASSWORD');
            }

            if (newPassword.length < 6) {
                return error(res, '新密码至少6个字符', 400, 'PASSWORD_TOO_SHORT');
            }

            const result = await supabaseService.getUserById(userId);
            if (!result.success || !result.data) {
                return error(res, '用户不存在', 404, 'USER_NOT_FOUND');
            }

            const user = result.data;
            const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);
            if (!isValidPassword) {
                return error(res, '原密码错误', 401, 'INVALID_PASSWORD');
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(newPassword, salt);

            const updateResult = await supabaseService.updateUser(userId, {
                password_hash: passwordHash,
                updated_at: new Date().toISOString()
            });

            if (updateResult.success) {
                return success(res, null, '密码修改成功');
            }
            return error(res, updateResult.error || '修改密码失败', 500);
        } catch (err) {
            logger.error('[AuthController] changePassword error:', err);
            return error(res, '修改密码失败', 500);
        }
    },

    /**
     * 重置密码
     */
    resetPassword: async (req, res) => {
        try {
            const { email, token, newPassword } = req.body;
            // TODO: 实现密码重置逻辑（发送邮件等）
            return success(res, null, '密码重置成功');
        } catch (err) {
            logger.error('[AuthController] resetPassword error:', err);
            return error(res, '重置密码失败', 500);
        }
    }
};

export default authController;