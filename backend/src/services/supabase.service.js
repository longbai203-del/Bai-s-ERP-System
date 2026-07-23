/**
 * @file supabase.service.js
 * @description Supabase 客户端 - 直接导出
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('../config.js');

// 获取配置
const supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL;
const supabaseKey = config.supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ SUPABASE_URL 或 SUPABASE_KEY 未配置，请检查 .env 文件');
}

// 创建并直接导出 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 测试连接
supabase.from('projects').select('count', { count: 'exact', head: true })
    .then(() => console.log('✅ Supabase 连接成功'))
    .catch((err) => console.warn('⚠️ Supabase 连接失败:', err.message));

module.exports = supabase;
