/**
 * @file project.routes.js
 * @description 项目路由
 * @module routes/project
 */

const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/ProjectController');
const { authenticate } = require('../middleware/auth');
const { validateProject } = require('../middleware/validation');

// ============================================================
// 所有项目路由需要认证
// ============================================================
router.use(authenticate);

// ============================================================
// 统计和搜索（放在 :id 之前避免冲突）
// ============================================================

/**
 * GET /api/projects/stats
 * @description 获取项目统计
 */
router.get('/stats', ProjectController.stats);

/**
 * GET /api/projects/search
 * @description 搜索项目
 */
router.get('/search', ProjectController.search);

/**
 * GET /api/projects/upcoming-deadlines
 * @description 获取即将到期的项目
 */
router.get('/upcoming-deadlines', ProjectController.upcomingDeadlines);

// ============================================================
// CRUD 操作
// ============================================================

/**
 * GET /api/projects
 * @description 获取项目列表
 * @query {number} page - 页码
 * @query {number} limit - 每页条数
 * @query {string} keyword - 搜索关键词
 * @query {string} status - 状态筛选
 * @query {string} priority - 优先级筛选
 * @query {string} customer - 客户筛选
 * @query {string} sortBy - 排序字段
 * @query {string} sortOrder - 排序方向
 */
router.get('/', ProjectController.list);

/**
 * GET /api/projects/:id
 * @description 获取项目详情
 * @param {number} id - 项目ID
 */
router.get('/:id', ProjectController.detail);

/**
 * POST /api/projects
 * @description 创建项目
 * @body {object} projectData - 项目数据
 */
router.post('/', validateProject, ProjectController.create);

/**
 * PUT /api/projects/:id
 * @description 更新项目
 * @param {number} id - 项目ID
 * @body {object} projectData - 项目数据
 */
router.put('/:id', validateProject, ProjectController.update);

/**
 * DELETE /api/projects/:id
 * @description 删除项目
 * @param {number} id - 项目ID
 */
router.delete('/:id', ProjectController.delete);

// ============================================================
// 状态变更操作
// ============================================================

/**
 * POST /api/projects/:id/start
 * @description 启动项目
 * @param {number} id - 项目ID
 */
router.post('/:id/start', ProjectController.start);

/**
 * POST /api/projects/:id/pause
 * @description 暂停项目
 * @param {number} id - 项目ID
 */
router.post('/:id/pause', ProjectController.pause);

/**
 * POST /api/projects/:id/complete
 * @description 完成项目
 * @param {number} id - 项目ID
 */
router.post('/:id/complete', ProjectController.complete);

module.exports = router;