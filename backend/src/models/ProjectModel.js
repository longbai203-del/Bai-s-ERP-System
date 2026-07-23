/**
 * @file ProjectModel.js
 * @description 项目模型
 */

const supabase = require('../services/supabase.service');

class ProjectModel {
    constructor() {
        this.tableName = 'projects';
    }

    async getList(params = {}) {
        try {
            const page = parseInt(params.page) || 1;
            const limit = parseInt(params.limit) || 10;
            const keyword = params.keyword || '';
            const status = params.status || '';
            const priority = params.priority || '';
            const customer = params.customer || '';

            let query = supabase.from(this.tableName).select('*', { count: 'exact' });

            if (keyword) {
                const kw = '%' + keyword + '%';
                query = query.or('name.ilike.' + kw + ',customer.ilike.' + kw + ',project_no.ilike.' + kw);
            }
            if (status) query = query.eq('status', status);
            if (priority) query = query.eq('priority', priority);
            if (customer) query = query.ilike('customer', '%' + customer + '%');

            query = query.order('created_at', { ascending: false });

            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);

            const result = await query;
            if (result.error) throw result.error;

            return {
                data: result.data || [],
                total: result.count || 0,
                page: page,
                limit: limit
            };
        } catch (error) {
            console.error('[ProjectModel] getList error:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            const result = await supabase.from(this.tableName).select('*').eq('id', id).single();
            if (result.error) throw result.error;
            return result.data;
        } catch (error) {
            console.error('[ProjectModel] getById error:', error);
            return null;
        }
    }

    async getDetail(id) {
        try {
            const project = await this.getById(id);
            if (!project) return null;

            const tasksResult = await supabase.from('tasks').select('*').eq('project_id', id).order('created_at', { ascending: true });
            const milestonesResult = await supabase.from('milestones').select('*').eq('project_id', id).order('target_date', { ascending: true });

            return {
                ...project,
                tasks: tasksResult.data || [],
                milestones: milestonesResult.data || []
            };
        } catch (error) {
            console.error('[ProjectModel] getDetail error:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const projectNo = await this.generateProjectNo();

            const insertData = {
                project_no: projectNo,
                name: data.name,
                customer: data.customer,
                budget: data.budget || 0,
                spent: data.spent || 0,
                progress: data.progress || 0,
                priority: data.priority || 'medium',
                status: data.status || 'planning',
                start_date: data.startDate || null,
                deadline: data.deadline || null,
                project_manager: data.projectManager || null,
                description: data.description || '',
                remark: data.remark || '',
                created_by: data.createdBy || null
            };

            const result = await supabase.from(this.tableName).insert(insertData).select().single();
            if (result.error) throw result.error;
            return result.data;
        } catch (error) {
            console.error('[ProjectModel] create error:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const updateData = {
                name: data.name,
                customer: data.customer,
                budget: data.budget,
                spent: data.spent,
                progress: data.progress,
                priority: data.priority,
                status: data.status,
                start_date: data.startDate || null,
                deadline: data.deadline || null,
                project_manager: data.projectManager || null,
                description: data.description || '',
                remark: data.remark || '',
                updated_at: new Date().toISOString(),
                updated_by: data.updatedBy || null
            };

            const result = await supabase.from(this.tableName).update(updateData).eq('id', id).select().single();
            if (result.error) throw result.error;
            return result.data;
        } catch (error) {
            console.error('[ProjectModel] update error:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const result = await supabase.from(this.tableName).delete().eq('id', id);
            if (result.error) throw result.error;
            return true;
        } catch (error) {
            console.error('[ProjectModel] delete error:', error);
            throw error;
        }
    }

    async updateStatus(id, status) {
        try {
            const result = await supabase.from(this.tableName).update({ status: status, updated_at: new Date().toISOString() }).eq('id', id).select().single();
            if (result.error) throw result.error;
            return result.data;
        } catch (error) {
            console.error('[ProjectModel] updateStatus error:', error);
            throw error;
        }
    }

    async getStats() {
        try {
            const result = await supabase.from(this.tableName).select('status, progress, budget, spent');
            if (result.error) throw result.error;

            const projects = result.data || [];
            const total = projects.length;

            return {
                total: total,
                active: projects.filter(p => p.status === 'active').length,
                planning: projects.filter(p => p.status === 'planning').length,
                completed: projects.filter(p => p.status === 'completed').length,
                paused: projects.filter(p => p.status === 'paused').length,
                cancelled: projects.filter(p => p.status === 'cancelled').length,
                totalBudget: projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0),
                totalSpent: projects.reduce((sum, p) => sum + (Number(p.spent) || 0), 0),
                avgProgress: total > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / total) : 0
            };
        } catch (error) {
            console.error('[ProjectModel] getStats error:', error);
            throw error;
        }
    }

    async generateProjectNo() {
        try {
            const year = new Date().getFullYear();
            const result = await supabase.from(this.tableName).select('project_no').ilike('project_no', 'PRJ-' + year + '-%').order('project_no', { ascending: false }).limit(1);

            let lastNumber = 0;
            if (result.data && result.data.length > 0) {
                const match = result.data[0].project_no.match(/PRJ-\d{4}-(\d{4})/);
                if (match) lastNumber = parseInt(match[1]);
            }

            return 'PRJ-' + year + '-' + String(lastNumber + 1).padStart(4, '0');
        } catch (error) {
            console.error('[ProjectModel] generateProjectNo error:', error);
            return 'PRJ-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-4);
        }
    }

    async search(keyword, limit) {
        limit = limit || 20;
        try {
            const kw = '%' + keyword + '%';
            const result = await supabase.from(this.tableName).select('id, project_no, name, customer, status, progress').or('name.ilike.' + kw + ',customer.ilike.' + kw + ',project_no.ilike.' + kw).limit(limit);
            if (result.error) throw result.error;
            return result.data || [];
        } catch (error) {
            console.error('[ProjectModel] search error:', error);
            throw error;
        }
    }

    async getUpcomingDeadlines(days) {
        days = days || 7;
        try {
            const today = new Date();
            const targetDate = new Date(today);
            targetDate.setDate(targetDate.getDate() + days);

            const result = await supabase.from(this.tableName).select('*').eq('status', 'active').lte('deadline', targetDate.toISOString().split('T')[0]).gte('deadline', today.toISOString().split('T')[0]).order('deadline', { ascending: true });
            if (result.error) throw result.error;
            return result.data || [];
        } catch (error) {
            console.error('[ProjectModel] getUpcomingDeadlines error:', error);
            throw error;
        }
    }
}

module.exports = ProjectModel;
