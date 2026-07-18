/**
 * Repository层 - 统一导出
 */

const { createClient } = require('@supabase/supabase-js');
const UserRepository = require('./UserRepository');
const OrderRepository = require('./OrderRepository');
const ProductRepository = require('./ProductRepository');

// 初始化Supabase客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase 配置未设置');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

const repositories = {
    User: new UserRepository(supabase),
    Order: new OrderRepository(supabase),
    Product: new ProductRepository(supabase)
};

module.exports = repositories;
