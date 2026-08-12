/**
 * @file supabase.js
 * @description Supabase 客户端配置 - 增强版
 */

import { createClient } from '@supabase/supabase-js'

// ============================================================
// 1. 环境变量检查
// ============================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 验证环境变量是否存在
if (!supabaseUrl) {
    console.error('❌ [Supabase] 缺少 VITE_SUPABASE_URL 环境变量')
}

if (!supabaseAnonKey) {
    console.error('❌ [Supabase] 缺少 VITE_SUPABASE_ANON_KEY 环境变量')
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ [Supabase] 客户端将在缺少配置的情况下初始化，部分功能可能无法使用')
}

// ============================================================
// 2. 创建 Supabase 客户端
// ============================================================

const supabaseOptions = {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: localStorage,
        storageKey: 'sb-auth-token',
    },
    db: {
        schema: 'public',
    },
    global: {
        headers: {
            'X-Client-Info': 'bai-erp-frontend',
        },
    },
    // 实时订阅配置
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions)

// ============================================================
// 3. 连接测试函数
// ============================================================

/**
 * 测试 Supabase 连接
 * @returns {Promise<{success: boolean, error?: Error, data?: any}>}
 */
export const testSupabaseConnection = async () => {
    try {
        // 尝试获取系统表（轻量级查询）
        const { data, error } = await supabase
            .from('_schema')
            .select('*')
            .limit(1)
            .maybeSingle()

        if (error) {
            // 如果 _schema 不存在，尝试查询一个已知存在的表
            const { data: healthData, error: healthError } = await supabase
                .from('users')
                .select('count', { count: 'exact', head: true })

            if (healthError) {
                console.warn('⚠️ [Supabase] 连接测试失败:', healthError.message)
                return { success: false, error: healthError }
            }

            console.log('✅ [Supabase] 连接成功 (users 表存在)')
            return { success: true, data: healthData }
        }

        console.log('✅ [Supabase] 连接成功 (schema 表存在)')
        return { success: true, data }
    } catch (error) {
        console.error('❌ [Supabase] 连接测试异常:', error.message)
        return { success: false, error }
    }
}

// ============================================================
// 4. 数据库操作辅助函数
// ============================================================

/**
 * 安全执行 Supabase 查询，带错误处理
 * @param {Function} queryFn - 查询函数
 * @param {string} fallbackData - 查询失败时的默认返回值
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const safeQuery = async (queryFn, fallbackData = null) => {
    try {
        const result = await queryFn(supabase)
        
        if (result.error) {
            console.warn('⚠️ [Supabase] 查询警告:', result.error.message)
            return { data: fallbackData, error: result.error }
        }

        return { data: result.data, error: null }
    } catch (error) {
        console.error('❌ [Supabase] 查询异常:', error.message)
        return { data: fallbackData, error }
    }
}

/**
 * 批量执行 Supabase 查询
 * @param {Array<Function>} queryFns - 查询函数数组
 * @returns {Promise<Array<{data: any, error: Error|null}>>}
 */
export const batchQuery = async (queryFns) => {
    const results = await Promise.allSettled(
        queryFns.map(fn => safeQuery(fn))
    )

    return results.map((result, index) => {
        if (result.status === 'rejected') {
            return { data: null, error: result.reason }
        }
        return result.value
    })
}

// ============================================================
// 5. 实时订阅辅助
// ============================================================

/**
 * 订阅 Supabase 表变化
 * @param {string} tableName - 表名
 * @param {Function} onInsert - 插入回调
 * @param {Function} onUpdate - 更新回调
 * @param {Function} onDelete - 删除回调
 * @param {string} [filter] - 过滤条件
 * @returns {Object} 订阅对象
 */
export const subscribeToTable = (
    tableName,
    onInsert = () => {},
    onUpdate = () => {},
    onDelete = () => {},
    filter = '*'
) => {
    const channel = supabase
        .channel(`table-changes-${tableName}`)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: tableName, filter },
            (payload) => {
                console.log(`📥 [Supabase] ${tableName} 新增:`, payload.new)
                onInsert(payload.new)
            }
        )
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: tableName, filter },
            (payload) => {
                console.log(`🔄 [Supabase] ${tableName} 更新:`, payload.new)
                onUpdate(payload.new, payload.old)
            }
        )
        .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: tableName, filter },
            (payload) => {
                console.log(`🗑️ [Supabase] ${tableName} 删除:`, payload.old)
                onDelete(payload.old)
            }
        )
        .subscribe((status) => {
            console.log(`📡 [Supabase] ${tableName} 订阅状态:`, status)
        })

    return channel
}

/**
 * 取消订阅
 * @param {Object} channel - 订阅对象
 */
export const unsubscribeFromTable = async (channel) => {
    if (channel) {
        await channel.unsubscribe()
        console.log('📡 [Supabase] 已取消订阅')
    }
}

// ============================================================
// 6. 导出默认客户端
// ============================================================

// 默认导出 supabase 客户端实例
export default supabase