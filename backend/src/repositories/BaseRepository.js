/**
 * 基础Repository - 数据库CRUD操作
 */
class BaseRepository {
    constructor(supabase, tableName) {
        this.supabase = supabase;
        this.tableName = tableName;
    }

    /**
     * 查询所有记录
     */
    async findAll(options = {}) {
        const { where, orderBy, limit, offset, select, include } = options;
        let query = this.supabase.from(this.tableName).select(select || '*');

        // 应用筛选条件
        if (where) {
            for (const [key, value] of Object.entries(where)) {
                if (Array.isArray(value)) {
                    query = query.in(key, value);
                } else if (typeof value === 'object' && value.operator) {
                    const { operator, compare } = value;
                    const opMap = {
                        'gt': 'gt', 'gte': 'gte', 'lt': 'lt', 'lte': 'lte',
                        'like': 'like', 'ilike': 'ilike', 'neq': 'neq'
                    };
                    query = query[opMap[operator] || 'eq'](key, compare);
                } else {
                    query = query.eq(key, value);
                }
            }
        }

        // 应用排序
        if (orderBy) {
            query = query.order(orderBy.column, { ascending: orderBy.ascending !== false });
        }

        // 应用分页
        if (limit) {
            query = query.limit(limit);
        }
        if (offset) {
            query = query.range(offset, offset + (limit || 10) - 1);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    /**
     * 根据ID查询
     */
    async findById(id, select = '*') {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select(select)
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    /**
     * 创建记录
     */
    async create(data) {
        const { data: result, error } = await this.supabase
            .from(this.tableName)
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return result;
    }

    /**
     * 更新记录
     */
    async update(id, data) {
        const { data: result, error } = await this.supabase
            .from(this.tableName)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return result;
    }

    /**
     * 删除记录
     */
    async delete(id) {
        const { error } = await this.supabase
            .from(this.tableName)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

    /**
     * 计数
     */
    async count(where = {}) {
        let query = this.supabase.from(this.tableName).select('*', { count: 'exact', head: true });
        
        for (const [key, value] of Object.entries(where)) {
            query = query.eq(key, value);
        }

        const { count, error } = await query;
        if (error) throw error;
        return count;
    }

    /**
     * 批量创建
     */
    async createMany(dataArray) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .insert(dataArray)
            .select();

        if (error) throw error;
        return data;
    }

    /**
     * 批量更新
     */
    async updateMany(updates) {
        const results = [];
        for (const { id, data } of updates) {
            const result = await this.update(id, data);
            results.push(result);
        }
        return results;
    }

    /**
     * 事务执行
     */
    async transaction(operations) {
        const results = [];
        for (const operation of operations) {
            const { type, ...params } = operation;
            switch (type) {
                case 'create':
                    results.push(await this.create(params.data));
                    break;
                case 'update':
                    results.push(await this.update(params.id, params.data));
                    break;
                case 'delete':
                    results.push(await this.delete(params.id));
                    break;
            }
        }
        return results;
    }
}

module.exports = BaseRepository;
