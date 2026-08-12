/**
 * @file supabase.service.js
 * @description Supabase 数据服务层
 * @module services/supabase.service
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

/**
 * Supabase 服务类
 */
class SupabaseService {
    constructor() {
        /** @type {import('@supabase/supabase-js').SupabaseClient} */
        this._client = null;
        this._initialized = false;
    }

    /**
     * 初始化 Supabase 客户端
     * @returns {import('@supabase/supabase-js').SupabaseClient}
     */
    getClient() {
        if (!this._initialized) {
            if (!config.supabaseUrl || !config.supabaseServiceKey) {
                logger.warn('[Supabase] 环境变量未设置，使用模拟模式');
                this._client = this._createMockClient();
            } else {
                this._client = createClient(config.supabaseUrl, config.supabaseServiceKey);
                logger.info('[Supabase] 客户端已初始化');
            }
            this._initialized = true;
        }
        return this._client;
    }

    /**
     * 创建模拟客户端（开发环境降级）
     * @private
     */
    _createMockClient() {
        const mockData = {
            users: [],
            orders: [],
            products: [],
            customers: [],
            permissions: [],
            new_modules: []
        };

        return {
            from: (table) => ({
                select: (columns) => ({
                    eq: (field, value) => ({
                        single: async () => {
                            const data = mockData[table]?.find(item => item[field] === value);
                            return { data, error: null };
                        },
                        limit: (n) => ({
                            order: (field, opts) => ({
                                then: (callback) => {
                                    const result = mockData[table]?.filter(item => item[field] === value) || [];
                                    return callback({ data: result.slice(0, n), error: null });
                                }
                            })
                        })
                    }),
                    order: (field, opts) => ({
                        then: (callback) => {
                            const data = mockData[table] || [];
                            return callback({ data, error: null });
                        }
                    }),
                    limit: (n) => ({
                        order: (field, opts) => ({
                            then: (callback) => {
                                const data = (mockData[table] || []).slice(0, n);
                                return callback({ data, error: null });
                            }
                        })
                    }),
                    then: (callback) => {
                        const data = mockData[table] || [];
                        return callback({ data, error: null });
                    }
                }),
                insert: (data) => ({
                    select: () => ({
                        then: (callback) => {
                            const items = Array.isArray(data) ? data : [data];
                            const results = items.map(item => {
                                const newItem = { ...item, id: `mock-${Date.now()}-${Math.random()}` };
                                if (!mockData[table]) mockData[table] = [];
                                mockData[table].push(newItem);
                                return newItem;
                            });
                            return callback({ data: results, error: null });
                        }
                    })
                }),
                update: (data) => ({
                    eq: (field, value) => ({
                        select: () => ({
                            then: (callback) => {
                                const items = mockData[table]?.filter(item => item[field] === value) || [];
                                items.forEach(item => Object.assign(item, data));
                                return callback({ data: items, error: null });
                            }
                        })
                    })
                }),
                delete: () => ({
                    eq: (field, value) => ({
                        then: (callback) => {
                            if (mockData[table]) {
                                mockData[table] = mockData[table].filter(item => item[field] !== value);
                            }
                            return callback({ data: null, error: null });
                        }
                    })
                })
            }),
            auth: {
                getUser: async (token) => ({ data: { user: null }, error: null }),
                getSession: async () => ({ data: { session: null }, error: null })
            }
        };
    }

    /**
     * 安全执行查询
     * @private
     * @param {Function} fn - 查询函数
     * @param {*} defaultValue - 默认返回值
     * @returns {Promise<{success: boolean, data: any, error: string|null}>}
     */
    async _safeQuery(fn, defaultValue = null) {
        try {
            const result = await fn();
            if (result.error) {
                logger.error('[Supabase] 查询错误:', result.error);
                return { success: false, data: defaultValue, error: result.error.message };
            }
            return { success: true, data: result.data, error: null };
        } catch (error) {
            logger.error('[Supabase] 查询异常:', error);
            return { success: false, data: defaultValue, error: error.message };
        }
    }

    // ============================================================
    // 用户相关
    // ============================================================

    async getUserById(id) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('users').select('*').eq('id', id).single();
        });
    }

    async getUserByUsername(username) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('users').select('*').eq('username', username).single();
        });
    }

    async getUserByEmail(email) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('users').select('*').eq('email', email).single();
        });
    }

    async createUser(data) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('users').insert(data).select();
        });
    }

    async updateUser(id, data) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('users').update(data).eq('id', id).select();
        });
    }

    async getUserPermissions(userId) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('user_permissions').select('permission').eq('user_id', userId);
        }, []);
    }

    // ============================================================
    // 用户管理（扩展）
    // ============================================================

    async getUsers(params = {}) {
        const { page = 1, pageSize = 20, keyword = '', role = '', status = '' } = params;
        const client = this.getClient();

        try {
            let query = client.from('users').select('*', { count: 'exact' });

            if (keyword) {
                query = query.or(`username.ilike.%${keyword}%,email.ilike.%${keyword}%,full_name.ilike.%${keyword}%`);
            }
            if (role && role !== 'all') {
                query = query.eq('role', role);
            }
            if (status && status !== 'all') {
                query = query.eq('status', status);
            }

            const { count, error: countError } = await query;
            if (countError) throw countError;

            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            const { data, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            return {
                success: true,
                data: {
                    list: data || [],
                    total: count || 0,
                    page,
                    pageSize
                },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getUsers 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async getUserStats() {
        try {
            const client = this.getClient();
            const { data, error } = await client.from('users').select('*');
            if (error) throw error;

            const users = data || [];
            const roles = {};
            users.forEach(u => {
                roles[u.role] = (roles[u.role] || 0) + 1;
            });

            return {
                success: true,
                data: {
                    total: users.length,
                    active: users.filter(u => u.status === 'active').length,
                    inactive: users.filter(u => u.status === 'inactive').length,
                    suspended: users.filter(u => u.status === 'suspended').length,
                    roles
                },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getUserStats 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async searchUsers(keyword, limit = 10) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('users')
                .select('*')
                .or(`username.ilike.%${keyword}%,email.ilike.%${keyword}%,full_name.ilike.%${keyword}%`)
                .limit(limit);
        });
    }

    async updateUserPermissions(userId, permissions) {
        const client = this.getClient();

        try {
            await client.from('user_permissions').delete().eq('user_id', userId);

            if (!permissions || permissions.length === 0) {
                return { success: true, data: [], error: null };
            }

            const permissionData = permissions.map(p => ({
                user_id: userId,
                permission: p,
                created_at: new Date().toISOString()
            }));

            const { data, error } = await client
                .from('user_permissions')
                .insert(permissionData)
                .select();

            if (error) throw error;

            return { success: true, data, error: null };
        } catch (error) {
            logger.error('[Supabase] updateUserPermissions 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async deleteUser(id) {
        const client = this.getClient();

        try {
            await client.from('user_permissions').delete().eq('user_id', id);
            const { error } = await client.from('users').delete().eq('id', id);
            if (error) throw error;

            return { success: true, data: null, error: null };
        } catch (error) {
            logger.error('[Supabase] deleteUser 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    // ============================================================
    // 订单相关
    // ============================================================

    async getOrders(params = {}) {
        const { page = 1, pageSize = 20, status, keyword, startDate, endDate, userId } = params;
        const client = this.getClient();

        try {
            let query = client.from('orders').select('*', { count: 'exact' });

            if (status && status !== 'all') {
                query = query.eq('status', status);
            }

            if (keyword) {
                query = query.or(`order_number.ilike.%${keyword}%,customer_name.ilike.%${keyword}%`);
            }

            if (startDate) {
                query = query.gte('created_at', startDate);
            }

            if (endDate) {
                query = query.lte('created_at', endDate);
            }

            const { count, error: countError } = await query;
            if (countError) throw countError;

            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            const { data, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            return {
                success: true,
                data: {
                    list: data || [],
                    total: count || 0,
                    page,
                    pageSize
                },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getOrders 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async getOrderById(id, userId) {
        const client = this.getClient();
        const result = await this._safeQuery(async () => {
            return await client.from('orders').select('*').eq('id', id).single();
        });

        if (!result.success || !result.data) {
            return { success: false, data: null, error: 'ORDER_NOT_FOUND' };
        }

        if (result.data.items && typeof result.data.items === 'string') {
            try {
                result.data.items = JSON.parse(result.data.items);
            } catch (e) {
                result.data.items = [];
            }
        }

        return result;
    }

    async createOrder(data) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('orders').insert(data).select();
        });
    }

    async updateOrder(id, data) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('orders').update(data).eq('id', id).select();
        });
    }

    async updateOrderStatus(id, status, note) {
        const client = this.getClient();
        const updateData = {
            status,
            updated_at: new Date().toISOString()
        };
        if (note) updateData.status_note = note;

        return this._safeQuery(async () => {
            return await client.from('orders').update(updateData).eq('id', id).select();
        });
    }

    async deleteOrder(id) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('orders').delete().eq('id', id);
        });
    }

    async getOrderStats(params = {}) {
        try {
            const { startDate, endDate, userId } = params;
            const client = this.getClient();

            let query = client.from('orders').select('*', { count: 'exact' });

            if (startDate) query = query.gte('created_at', startDate);
            if (endDate) query = query.lte('created_at', endDate);

            const { data, error } = await query;
            if (error) throw error;

            const orders = data || [];
            const total = orders.length;
            const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

            const today = new Date().toISOString().split('T')[0];
            const todayOrders = orders.filter(o => o.created_at?.startsWith(today));
            const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

            const statusCount = {};
            orders.forEach(o => {
                statusCount[o.status] = (statusCount[o.status] || 0) + 1;
            });

            return {
                success: true,
                data: {
                    total,
                    totalRevenue,
                    todayOrders: todayOrders.length,
                    todayRevenue,
                    statusCount,
                    averageOrder: total > 0 ? totalRevenue / total : 0
                },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getOrderStats 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    // ============================================================
    // 商品相关
    // ============================================================

    async getProducts(params = {}) {
        const { page = 1, pageSize = 20, name, category, status, sku } = params;
        const client = this.getClient();

        try {
            let query = client.from('products').select('*', { count: 'exact' });

            if (name) query = query.ilike('name', `%${name}%`);
            if (category && category !== 'all') query = query.eq('category', category);
            if (status && status !== 'all') query = query.eq('status', status);
            if (sku) query = query.ilike('sku', `%${sku}%`);

            const { count, error: countError } = await query;
            if (countError) throw countError;

            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            const { data, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            return {
                success: true,
                data: {
                    list: data || [],
                    total: count || 0,
                    page,
                    pageSize
                },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getProducts 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async getAllProducts() {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('products').select('*').order('created_at', { ascending: false });
        });
    }

    async getProductById(id) {
        const client = this.getClient();
        const result = await this._safeQuery(async () => {
            return await client.from('products').select('*').eq('id', id).single();
        });

        if (!result.success || !result.data) {
            return { success: false, data: null, error: 'PRODUCT_NOT_FOUND' };
        }
        return result;
    }

    async createProduct(data) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('products').insert(data).select();
        });
    }

    async updateProduct(id, data) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('products').update(data).eq('id', id).select();
        });
    }

    async deleteProduct(id) {
        const client = this.getClient();
        const result = await this._safeQuery(async () => {
            return await client.from('products').delete().eq('id', id);
        });
        if (!result.success) {
            return { success: false, error: 'PRODUCT_NOT_FOUND' };
        }
        return result;
    }

    async searchProducts(keyword, limit = 10) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('products')
                .select('*')
                .ilike('name', `%${keyword}%`)
                .limit(limit);
        });
    }

    async getProductCategories() {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('products').select('category').order('category');
        });
    }

    async getProductStats() {
        try {
            const client = this.getClient();
            const { data, error } = await client.from('products').select('*');
            if (error) throw error;

            const products = data || [];
            const total = products.length;
            const active = products.filter(p => p.status === 'active').length;
            const lowStock = products.filter(p => p.stock < 10).length;

            return {
                success: true,
                data: { total, active, inactive: total - active, lowStock },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getProductStats 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async createStockLog(data) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('stock_logs').insert(data);
        });
    }

    // ============================================================
    // 客户相关
    // ============================================================

    async getCustomers(params = {}) {
        const { page = 1, pageSize = 20, name, phone, level } = params;
        const client = this.getClient();

        try {
            let query = client.from('customers').select('*', { count: 'exact' });

            if (name) query = query.ilike('name', `%${name}%`);
            if (phone) query = query.ilike('phone', `%${phone}%`);
            if (level && level !== 'all') query = query.eq('level', level);

            const { count, error: countError } = await query;
            if (countError) throw countError;

            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            const { data, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            return {
                success: true,
                data: {
                    list: data || [],
                    total: count || 0,
                    page,
                    pageSize
                },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getCustomers 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async getCustomerById(id) {
        const client = this.getClient();
        const result = await this._safeQuery(async () => {
            return await client.from('customers').select('*').eq('id', id).single();
        });

        if (!result.success || !result.data) {
            return { success: false, data: null, error: 'CUSTOMER_NOT_FOUND' };
        }
        return result;
    }

    async getCustomerByPhone(phone) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('customers').select('*').eq('phone', phone).single();
        });
    }

    async createCustomer(data) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('customers').insert(data).select();
        });
    }

    async updateCustomer(id, data) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('customers').update(data).eq('id', id).select();
        });
    }

    async deleteCustomer(id) {
        const client = this.getClient();
        const result = await this._safeQuery(async () => {
            return await client.from('customers').delete().eq('id', id);
        });
        if (!result.success) {
            return { success: false, error: 'CUSTOMER_NOT_FOUND' };
        }
        return result;
    }

    async searchCustomers(keyword, limit = 10) {
        const client = this.getClient();
        return this._safeQuery(async () => {
            return await client.from('customers')
                .select('*')
                .or(`name.ilike.%${keyword}%,phone.ilike.%${keyword}%`)
                .limit(limit);
        });
    }

    async getCustomerStats() {
        try {
            const client = this.getClient();
            const { data, error } = await client.from('customers').select('*');
            if (error) throw error;

            const customers = data || [];
            const total = customers.length;
            const levels = {};
            customers.forEach(c => {
                levels[c.level] = (levels[c.level] || 0) + 1;
            });

            return {
                success: true,
                data: { total, levels },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getCustomerStats 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    // ============================================================
    // 新模块（New Module）
    // ============================================================

    async getNewModuleList(params = {}) {
        const { page = 1, pageSize = 10, keyword = '', status = '' } = params;
        const client = this.getClient();

        try {
            let query = client.from('new_modules').select('*', { count: 'exact' });

            if (keyword) {
                query = query.or(`name.ilike.%${keyword}%,code.ilike.%${keyword}%,description.ilike.%${keyword}%`);
            }
            if (status && status !== 'all') {
                query = query.eq('status', status);
            }

            const { count, error: countError } = await query;
            if (countError) throw countError;

            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            const { data, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            return {
                success: true,
                data: {
                    list: data || [],
                    total: count || 0,
                    page,
                    pageSize,
                    stats: {
                        total: count || 0,
                        active: data?.filter(d => d.status === 'active').length || 0,
                        completed: data?.filter(d => d.status === 'completed').length || 0,
                        archived: data?.filter(d => d.status === 'archived').length || 0
                    }
                },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getNewModuleList 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async getNewModuleById(id) {
        const client = this.getClient();
        const result = await this._safeQuery(async () => {
            return await client.from('new_modules').select('*').eq('id', id).single();
        });

        if (!result.success || !result.data) {
            return { success: false, data: null, error: 'MODULE_NOT_FOUND' };
        }

        if (result.data.tags && typeof result.data.tags === 'string') {
            try {
                result.data.tags = JSON.parse(result.data.tags);
            } catch (e) {
                result.data.tags = [];
            }
        }

        if (result.data.attachments && typeof result.data.attachments === 'string') {
            try {
                result.data.attachments = JSON.parse(result.data.attachments);
            } catch (e) {
                result.data.attachments = [];
            }
        }

        return result;
    }

    async createNewModule(data) {
        const client = this.getClient();

        if (data.tags && Array.isArray(data.tags)) {
            data.tags = JSON.stringify(data.tags);
        }
        if (data.attachments && Array.isArray(data.attachments)) {
            data.attachments = JSON.stringify(data.attachments);
        }

        return this._safeQuery(async () => {
            return await client.from('new_modules').insert(data).select();
        });
    }

    async updateNewModule(id, data) {
        const client = this.getClient();

        if (data.tags && Array.isArray(data.tags)) {
            data.tags = JSON.stringify(data.tags);
        }
        if (data.attachments && Array.isArray(data.attachments)) {
            data.attachments = JSON.stringify(data.attachments);
        }

        return this._safeQuery(async () => {
            return await client.from('new_modules').update(data).eq('id', id).select();
        });
    }

    async deleteNewModule(id) {
        const client = this.getClient();
        const result = await this._safeQuery(async () => {
            return await client.from('new_modules').delete().eq('id', id);
        });
        if (!result.success) {
            return { success: false, error: 'MODULE_NOT_FOUND' };
        }
        return result;
    }

    // ============================================================
    // 仪表盘相关
    // ============================================================

    async getDashboardStats(params = {}) {
        try {
            const { startDate, endDate, userId } = params;

            const orderStats = await this.getOrderStats({ startDate, endDate, userId });
            const productStats = await this.getProductStats();
            const customerStats = await this.getCustomerStats();

            const conversionRate = orderStats.data?.total > 0 && customerStats.data?.total > 0
                ? Math.round((orderStats.data.total / (customerStats.data.total + orderStats.data.total)) * 100)
                : 0;

            return {
                success: true,
                data: {
                    todayRevenue: orderStats.data?.todayRevenue || 0,
                    todayOrders: orderStats.data?.todayOrders || 0,
                    activeCustomers: customerStats.data?.total || 0,
                    totalProducts: productStats.data?.total || 0,
                    lowStockProducts: productStats.data?.lowStock || 0,
                    conversionRate: Math.min(conversionRate, 100),
                    totalOrders: orderStats.data?.total || 0,
                    totalRevenue: orderStats.data?.totalRevenue || 0,
                    orderStats: orderStats.data,
                    productStats: productStats.data,
                    customerStats: customerStats.data
                },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getDashboardStats 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async getChartData(params = {}) {
        try {
            const { type = 'revenue', period = 'month', startDate, endDate, userId } = params;
            const client = this.getClient();

            const now = new Date();
            let start = startDate ? new Date(startDate) : new Date(now);
            let end = endDate ? new Date(endDate) : new Date(now);

            if (period === 'week') {
                start.setDate(now.getDate() - 7);
            } else if (period === 'month') {
                start.setMonth(now.getMonth() - 1);
            } else if (period === 'quarter') {
                start.setMonth(now.getMonth() - 3);
            } else if (period === 'year') {
                start.setFullYear(now.getFullYear() - 1);
            }

            const { data: orders, error } = await client
                .from('orders')
                .select('*')
                .gte('created_at', start.toISOString())
                .lte('created_at', end.toISOString());

            if (error) throw error;

            const groups = {};
            (orders || []).forEach(order => {
                const date = order.created_at?.split('T')[0] || 'unknown';
                if (!groups[date]) {
                    groups[date] = { revenue: 0, orders: 0, customers: new Set() };
                }
                groups[date].revenue += order.total_amount || 0;
                groups[date].orders += 1;
                if (order.customer_id) groups[date].customers.add(order.customer_id);
            });

            const sortedDates = Object.keys(groups).sort();
            const labels = sortedDates.map(d => d.substring(5));
            let data;

            switch (type) {
                case 'orders':
                    data = sortedDates.map(d => groups[d].orders);
                    break;
                case 'customers':
                    data = sortedDates.map(d => groups[d].customers.size);
                    break;
                case 'revenue':
                default:
                    data = sortedDates.map(d => Math.round(groups[d].revenue));
                    break;
            }

            return {
                success: true,
                data: { labels, data },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getChartData 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async getTodayOverview(params = {}) {
        try {
            const { date, userId } = params;
            const today = date || new Date().toISOString().split('T')[0];
            const client = this.getClient();

            const { data, error } = await client
                .from('orders')
                .select('*')
                .gte('created_at', `${today}T00:00:00`)
                .lte('created_at', `${today}T23:59:59`);

            if (error) throw error;

            const orders = data || [];
            const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
            const completed = orders.filter(o => o.status === 'completed').length;
            const pending = orders.filter(o => o.status === 'pending').length;

            return {
                success: true,
                data: {
                    date: today,
                    totalOrders: orders.length,
                    totalRevenue,
                    completed,
                    pending,
                    averageOrder: orders.length > 0 ? totalRevenue / orders.length : 0
                },
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getTodayOverview 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }

    async getRecentActivities(params = {}) {
        try {
            const { limit = 10, userId } = params;
            const client = this.getClient();

            const { data: orders, error } = await client
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            const activities = (orders || []).map(order => ({
                id: order.id,
                type: 'order',
                message: `新订单 #${order.order_number || order.id}`,
                time: order.created_at,
                data: order
            }));

            return {
                success: true,
                data: activities,
                error: null
            };
        } catch (error) {
            logger.error('[Supabase] getRecentActivities 错误:', error);
            return { success: false, data: null, error: error.message };
        }
    }
}

// 单例导出
export const supabaseService = new SupabaseService();
export default supabaseService;