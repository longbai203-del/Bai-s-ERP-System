import ProjectModel from '../models/ProjectModel.js'
import { AppError } from '../errors/AppError.js'

const projectModel = new ProjectModel()

/**
 * 项目控制器
 * 处理所有项目相关的 HTTP 请求
 */
export default {
  /**
   * 获取项目列表
   * GET /api/projects
   */
  async list(req, res, next) {
    try {
      const params = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        keyword: req.query.keyword || '',
        status: req.query.status || '',
        priority: req.query.priority || '',
        customer: req.query.customer || '',
        sortBy: req.query.sortBy || 'created_at',
        sortOrder: req.query.sortOrder || 'desc'
      }

      const result = await projectModel.getList(params)

      res.json({
        code: 0,
        message: 'success',
        data: {
          list: result.data,
          total: result.total,
          page: result.page,
          limit: result.limit
        }
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * 获取项目详情
   * GET /api/projects/:id
   */
  async detail(req, res, next) {
    try {
      const { id } = req.params
      const data = await projectModel.getDetail(Number(id))

      if (!data) {
        return res.status(404).json({
          code: 404,
          message: '项目不存在'
        })
      }

      res.json({
        code: 0,
        message: 'success',
        data
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * 创建项目
   * POST /api/projects
   */
  async create(req, res, next) {
    try {
      const data = {
        name: req.body.name,
        customer: req.body.customer,
        budget: req.body.budget,
        spent: req.body.spent || 0,
        progress: req.body.progress || 0,
        priority: req.body.priority || 'medium',
        status: req.body.status || 'planning',
        startDate: req.body.startDate,
        deadline: req.body.deadline,
        projectManager: req.body.projectManager,
        description: req.body.description || '',
        remark: req.body.remark || '',
        createdBy: req.user?.id || null
      }

      // 基本验证
      if (!data.name) {
        return res.status(400).json({
          code: 400,
          message: '项目名称不能为空'
        })
      }

      if (!data.customer) {
        return res.status(400).json({
          code: 400,
          message: '客户名称不能为空'
        })
      }

      const result = await projectModel.create(data)

      res.status(201).json({
        code: 0,
        message: '项目创建成功',
        data: result
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * 更新项目
   * PUT /api/projects/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params

      // 检查项目是否存在
      const existing = await projectModel.getById(Number(id))
      if (!existing) {
        return res.status(404).json({
          code: 404,
          message: '项目不存在'
        })
      }

      const data = {
        name: req.body.name,
        customer: req.body.customer,
        budget: req.body.budget,
        spent: req.body.spent,
        progress: req.body.progress,
        priority: req.body.priority,
        status: req.body.status,
        startDate: req.body.startDate,
        deadline: req.body.deadline,
        projectManager: req.body.projectManager,
        description: req.body.description || '',
        remark: req.body.remark || '',
        updatedBy: req.user?.id || null
      }

      const result = await projectModel.update(Number(id), data)

      res.json({
        code: 0,
        message: '项目更新成功',
        data: result
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * 删除项目
   * DELETE /api/projects/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params

      const existing = await projectModel.getById(Number(id))
      if (!existing) {
        return res.status(404).json({
          code: 404,
          message: '项目不存在'
        })
      }

      await projectModel.delete(Number(id))

      res.json({
        code: 0,
        message: '项目删除成功'
      })
    } catch (error) {
      if (error.message.includes('关联任务')) {
        return res.status(400).json({
          code: 400,
          message: error.message
        })
      }
      next(error)
    }
  },

  /**
   * 启动项目
   * POST /api/projects/:id/start
   */
  async start(req, res, next) {
    try {
      const { id } = req.params

      const existing = await projectModel.getById(Number(id))
      if (!existing) {
        return res.status(404).json({
          code: 404,
          message: '项目不存在'
        })
      }

      if (existing.status === 'active') {
        return res.status(400).json({
          code: 400,
          message: '项目已经在进行中'
        })
      }

      const result = await projectModel.updateStatus(Number(id), 'active')

      res.json({
        code: 0,
        message: '项目已启动',
        data: result
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * 暂停项目
   * POST /api/projects/:id/pause
   */
  async pause(req, res, next) {
    try {
      const { id } = req.params

      const existing = await projectModel.getById(Number(id))
      if (!existing) {
        return res.status(404).json({
          code: 404,
          message: '项目不存在'
        })
      }

      if (existing.status === 'paused') {
        return res.status(400).json({
          code: 400,
          message: '项目已暂停'
        })
      }

      if (existing.status === 'completed') {
        return res.status(400).json({
          code: 400,
          message: '已完成的项目不能暂停'
        })
      }

      const result = await projectModel.updateStatus(Number(id), 'paused')

      res.json({
        code: 0,
        message: '项目已暂停',
        data: result
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * 完成项目
   * POST /api/projects/:id/complete
   */
  async complete(req, res, next) {
    try {
      const { id } = req.params

      const existing = await projectModel.getById(Number(id))
      if (!existing) {
        return res.status(404).json({
          code: 404,
          message: '项目不存在'
        })
      }

      if (existing.status === 'completed') {
        return res.status(400).json({
          code: 400,
          message: '项目已完成'
        })
      }

      // 更新状态为已完成，进度设为100%
      const result = await projectModel.update(Number(id), {
        ...existing,
        status: 'completed',
        progress: 100
      })

      res.json({
        code: 0,
        message: '项目已完成',
        data: result
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * 获取项目统计
   * GET /api/projects/stats
   */
  async stats(req, res, next) {
    try {
      const stats = await projectModel.getStats()

      res.json({
        code: 0,
        message: 'success',
        data: stats
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * 搜索项目
   * GET /api/projects/search
   */
  async search(req, res, next) {
    try {
      const { keyword, limit = 20 } = req.query

      if (!keyword) {
        return res.status(400).json({
          code: 400,
          message: '请输入搜索关键词'
        })
      }

      const data = await projectModel.search(keyword, parseInt(limit))

      res.json({
        code: 0,
        message: 'success',
        data
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * 获取即将到期的项目
   * GET /api/projects/upcoming-deadlines
   */
  async upcomingDeadlines(req, res, next) {
    try {
      const { days = 7 } = req.query
      const data = await projectModel.getUpcomingDeadlines(parseInt(days))

      res.json({
        code: 0,
        message: 'success',
        data
      })
    } catch (error) {
      next(error)
    }
  }
}