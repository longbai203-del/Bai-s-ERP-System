/**
 * @file ProjectController.js
 * @description 项目控制器
 */

const ProjectModel = require('../models/ProjectModel');

const projectModel = new ProjectModel();

// 获取列表
async function list(req, res) {
    try {
        const result = await projectModel.getList(req.query);
        res.json({
            code: 0,
            message: 'success',
            data: {
                list: result.data,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// 获取详情
async function detail(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ code: 400, message: '无效的项目ID' });
        }
        const data = await projectModel.getDetail(id);
        if (!data) {
            return res.status(404).json({ code: 404, message: '项目不存在' });
        }
        res.json({ code: 0, message: 'success', data: data });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// 创建
async function create(req, res) {
    try {
        const data = {
            name: req.body.name ? req.body.name.trim() : null,
            customer: req.body.customer ? req.body.customer.trim() : null,
            budget: parseFloat(req.body.budget) || 0,
            spent: parseFloat(req.body.spent) || 0,
            progress: parseInt(req.body.progress) || 0,
            priority: req.body.priority || 'medium',
            status: req.body.status || 'planning',
            startDate: req.body.startDate || null,
            deadline: req.body.deadline || null,
            projectManager: req.body.projectManager ? req.body.projectManager.trim() : null,
            description: req.body.description ? req.body.description.trim() : '',
            remark: req.body.remark ? req.body.remark.trim() : '',
            createdBy: req.user ? req.user.id : null
        };

        if (!data.name) {
            return res.status(400).json({ code: 400, message: '项目名称不能为空' });
        }
        if (!data.customer) {
            return res.status(400).json({ code: 400, message: '客户名称不能为空' });
        }

        const result = await projectModel.create(data);
        res.status(201).json({ code: 0, message: '项目创建成功', data: result });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// 更新
async function update(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ code: 400, message: '无效的项目ID' });
        }

        const existing = await projectModel.getById(id);
        if (!existing) {
            return res.status(404).json({ code: 404, message: '项目不存在' });
        }

        const data = {
            name: req.body.name ? req.body.name.trim() : existing.name,
            customer: req.body.customer ? req.body.customer.trim() : existing.customer,
            budget: req.body.budget !== undefined ? parseFloat(req.body.budget) : existing.budget,
            spent: req.body.spent !== undefined ? parseFloat(req.body.spent) : existing.spent,
            progress: req.body.progress !== undefined ? parseInt(req.body.progress) : existing.progress,
            priority: req.body.priority || existing.priority,
            status: req.body.status || existing.status,
            startDate: req.body.startDate || existing.start_date,
            deadline: req.body.deadline || existing.deadline,
            projectManager: req.body.projectManager ? req.body.projectManager.trim() : existing.project_manager,
            description: req.body.description ? req.body.description.trim() : existing.description,
            remark: req.body.remark ? req.body.remark.trim() : existing.remark,
            updatedBy: req.user ? req.user.id : null
        };

        const result = await projectModel.update(id, data);
        res.json({ code: 0, message: '项目更新成功', data: result });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// 删除
async function del(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ code: 400, message: '无效的项目ID' });
        }

        const existing = await projectModel.getById(id);
        if (!existing) {
            return res.status(404).json({ code: 404, message: '项目不存在' });
        }

        await projectModel.delete(id);
        res.json({ code: 0, message: '项目删除成功' });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// 启动
async function start(req, res) {
    try {
        const id = parseInt(req.params.id);
        const existing = await projectModel.getById(id);
        if (!existing) {
            return res.status(404).json({ code: 404, message: '项目不存在' });
        }
        if (existing.status === 'active') {
            return res.status(400).json({ code: 400, message: '项目已经在进行中' });
        }

        const result = await projectModel.updateStatus(id, 'active');
        res.json({ code: 0, message: '项目已启动', data: result });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// 暂停
async function pause(req, res) {
    try {
        const id = parseInt(req.params.id);
        const existing = await projectModel.getById(id);
        if (!existing) {
            return res.status(404).json({ code: 404, message: '项目不存在' });
        }
        if (existing.status === 'paused') {
            return res.status(400).json({ code: 400, message: '项目已暂停' });
        }

        const result = await projectModel.updateStatus(id, 'paused');
        res.json({ code: 0, message: '项目已暂停', data: result });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// 完成
async function complete(req, res) {
    try {
        const id = parseInt(req.params.id);
        const existing = await projectModel.getById(id);
        if (!existing) {
            return res.status(404).json({ code: 404, message: '项目不存在' });
        }
        if (existing.status === 'completed') {
            return res.status(400).json({ code: 400, message: '项目已完成' });
        }

        const result = await projectModel.update(id, { ...existing, status: 'completed', progress: 100 });
        res.json({ code: 0, message: '项目已完成', data: result });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// 统计
async function stats(req, res) {
    try {
        const statsData = await projectModel.getStats();
        res.json({ code: 0, message: 'success', data: statsData });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// 搜索
async function search(req, res) {
    try {
        const keyword = req.query.keyword ? req.query.keyword.trim() : null;
        if (!keyword) {
            return res.status(400).json({ code: 400, message: '请输入搜索关键词' });
        }

        const limit = parseInt(req.query.limit) || 20;
        const data = await projectModel.search(keyword, limit);
        res.json({ code: 0, message: 'success', data: data });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

// 即将到期
async function upcomingDeadlines(req, res) {
    try {
        const days = parseInt(req.query.days) || 7;
        const data = await projectModel.getUpcomingDeadlines(days);
        res.json({ code: 0, message: 'success', data: data });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
}

module.exports = {
    list,
    detail,
    create,
    update,
    delete: del,
    start,
    pause,
    complete,
    stats,
    search,
    upcomingDeadlines
};