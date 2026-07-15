/**
 * @file auth.js
 * @description 认证与权限管理
 * @module core/auth
 */

import { store } from '@core/store.js';
import { apiClient } from '@services/api-client.js';
import { ROLE_PERMISSIONS, USER_ROLES } from '@utils/constants.js';

/**
 * 认证管理器
 * @typedef {Object} Auth
 * @property {Function} init - 初始化认证
 * @property {Function} login - 登录
 * @property {Function} logout - 退出登录
 * @property {Function} register - 注册
 * @property {Function} isAuthenticated - 是否已认证
 * @property {Function} hasPermission - 是否有权限
 * @property {Function} getCurrentUser - 获取当前用户
 */

/** @type {Auth} */
export const auth = {
    /** @type {Object|null} 当前用户 */
    _currentUser: null,
    
    /** @type {string|null} 认证令牌 */
    _token: null,

    /**
     * 初始化认证
     */
    init() {
        // 从存储中恢复会话
        const session = store.get('session');
        if (session) {
            this._token = session.token;
            this._currentUser = session.user;
        }
        
        console.log('✅ [Auth] 已初始化');
    },

    /**
     * 登录
     * @param {string} username - 用户名
     * @param {string} password - 密码
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async login(username, password) {
        try {
            const response = await apiClient.post('/auth/login', {
                username,
                password
            });
            
            if (response.success) {
                this._token = response.data.token;
                this._currentUser = response.data.user;
                
                // 保存会话
                store.set('session', {
                    token: this._token,
                    user: this._currentUser
                });
                
                // 设置 API 客户端认证头
                apiClient.setAuthToken(this._token);
                
                return { success: true, data: response.data };
            }
            
            return { success: false, error: response.message || '登录失败' };
            
        } catch (error) {
            console.error('[Auth] 登录失败:', error);
            return { success: false, error: error.message || '网络错误' };
        }
    },

    /**
     * 退出登录
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async logout() {
        try {
            await apiClient.post('/auth/logout');
        } catch (e) {
            // 忽略后端错误，仍然清理本地状态
        }
        
        this._token = null;
        this._currentUser = null;
        
        // 清除会话
        store.set('session', null);
        apiClient.setAuthToken(null);
        
        console.log('✅ [Auth] 已退出');
        
        return { success: true };
    },

    /**
     * 注册新用户
     * @param {Object} data - 注册数据
     * @param {string} data.username - 用户名
     * @param {string} data.password - 密码
     * @param {string} data.email - 邮箱
     * @param {string} data.name - 姓名
     * @param {string} data.role - 角色
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    async register(data) {
        try {
            const response = await apiClient.post('/auth/register', data);
            
            if (response.success) {
                return { success: true, data: response.data };
            }
            
            return { success: false, error: response.message || '注册失败' };
            
        } catch (error) {
            console.error('[Auth] 注册失败:', error);
            return { success: false, error: error.message || '网络错误' };
        }
    },

    /**
     * 获取当前用户
     * @returns {Object|null}
     */
    getCurrentUser() {
        return this._currentUser;
    },

    /**
     * 是否已认证
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this._token && !!this._currentUser;
    },

    /**
     * 获取认证令牌
     * @returns {string|null}
     */
    getToken() {
        return this._token;
    },

    /**
     * 检查是否有权限
     * @param {string} permission - 权限名
     * @returns {boolean}
     */
    hasPermission(permission) {
        if (!this._currentUser) return false;
        
        const role = this._currentUser.role || USER_ROLES.EMPLOYEE;
        const permissions = ROLE_PERMISSIONS[role] || [];
        
        // 如果是 owner 或 admin，拥有所有权限
        if (role === USER_ROLES.OWNER || role === USER_ROLES.ADMIN) {
            return true;
        }
        
        return permissions.includes(permission);
    },

    /**
     * 检查是否有任一权限
     * @param {string[]} permissions - 权限列表
     * @returns {boolean}
     */
    hasAnyPermission(permissions) {
        return permissions.some(p => this.hasPermission(p));
    },

    /**
     * 检查是否有所有权限
     * @param {string[]} permissions - 权限列表
     * @returns {boolean}
     */
    hasAllPermissions(permissions) {
        return permissions.every(p => this.hasPermission(p));
    },

    /**
     * 获取用户角色
     * @returns {string|null}
     */
    getRole() {
        return this._currentUser?.role || null;
    },

    /**
     * 检查是否为指定角色
     * @param {string|string[]} roles - 角色或角色列表
     * @returns {boolean}
     */
    hasRole(roles) {
        if (!this._currentUser) return false;
        const role = this._currentUser.role;
        if (Array.isArray(roles)) {
            return roles.includes(role);
        }
        return role === roles;
    },

    /**
     * 刷新用户信息
     * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
     */
    async refreshUser() {
        if (!this._token) {
            return { success: false, error: '未认证' };
        }
        
        try {
            const response = await apiClient.get('/auth/me');
            if (response.success) {
                this._currentUser = response.data;
                store.set('session', {
                    token: this._token,
                    user: this._currentUser
                });
                return { success: true, user: this._currentUser };
            }
            return { success: false, error: response.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export default auth;