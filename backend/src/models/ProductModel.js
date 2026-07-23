import BaseModel from './BaseModel.js'
import supabase from '../core/supabase.js'

/**
 * 项目模型
 * 负责项目相关的所有数据库操作
 */
export default class ProjectModel extends BaseModel {
  constructor() {
    super('projects')
    this.tableName = 'projects'
  }

  /**
   * 获取项目列表（带筛选和分页）
   */
  async getList(params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        keyword = '',
        status = '',
        priority = '',
        customer = '',
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = params

      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })

      // 关键词搜索
      if (keyword) {
        query = query.or(`name.ilike.%${keyword}%,customer.ilike.%${keyword}%,project_no.ilike.%${keyword}%`)
      }

      // 状态筛选
      if (status) {
        query = query.eq('status', status)
      }

      // 优先级筛选
      if (priority) {
        query = query.eq('priority', priority)
      }

      // 客户筛选
      if (customer) {
        query = query.ilike('customer', `%${customer}%`)
      }

      // 排序
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // 分页
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data || [],
        total: count || 0,
        page: Number(page),
        limit: Number(limit)
      }
    } catch (error) {
      console.error('ProjectModel.getList error:', error)
      throw error
    }
  }

  /**
   * 获取项目详情
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('ProjectModel.getById error:', error)
      throw error
    }
  }

  /**
   * 获取项目详情（包含关联数据）
   */
  async getDetail(id) {
    try {
      // 获取项目基本信息
      const project = await this.getById(id)
      if (!project) return null

      // 获取关联任务
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: true })

      // 获取关联里程碑
      const { data: milestones } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', id)
        .order('target_date', { ascending: true })

      // 获取团队成员
      const { data: team } = await supabase
        .from('team_members')
        .select('*, users(name, email, avatar)')
        .eq('project_id', id)

      // 获取文档
      const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })

      return {
        ...project,
        tasks: tasks || [],
        milestones: milestones || [],
        team: team || [],
        documents: documents || []
      }
    } catch (error) {
      console.error('ProjectModel.getDetail error:', error)
      throw error
    }
  }

  /**
   * 创建项目
   */
  async create(data) {
    try {
      // 生成项目编号
      const projectNo = await this.generateProjectNo()

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
      }

      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      return result
    } catch (error) {
      console.error('ProjectModel.create error:', error)
      throw error
    }
  }

  /**
   * 更新项目
   */
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
      }

      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return result
    } catch (error) {
      console.error('ProjectModel.update error:', error)
      throw error
    }
  }

  /**
   * 删除项目
   */
  async delete(id) {
    try {
      // 先检查是否有关联数据
      const { count: taskCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', id)

      if (taskCount > 0) {
        throw new Error(`项目下还有 ${taskCount} 个任务，请先删除关联任务`)
      }

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('ProjectModel.delete error:', error)
      throw error
    }
  }

  /**
   * 更新项目状态
   */
  async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('ProjectModel.updateStatus error:', error)
      throw error
    }
  }

  /**
   * 更新项目进度
   */
  async updateProgress(id, progress) {
    try {
      if (progress < 0 || progress > 100) {
        throw new Error('进度值必须在 0 到 100 之间')
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .update({
          progress: progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('ProjectModel.updateProgress error:', error)
      throw error
    }
  }

  /**
   * 获取项目统计
   */
  async getStats() {
    try {
      const { data: allProjects, error } = await supabase
        .from(this.tableName)
        .select('status, progress, budget, spent')

      if (error) throw error

      const projects = allProjects || []
      const total = projects.length

      const stats = {
        total: total,
        active: projects.filter(p => p.status === 'active').length,
        planning: projects.filter(p => p.status === 'planning').length,
        completed: projects.filter(p => p.status === 'completed').length,
        paused: projects.filter(p => p.status === 'paused').length,
        cancelled: projects.filter(p => p.status === 'cancelled').length,
        totalBudget: projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0),
        totalSpent: projects.reduce((sum, p) => sum + (Number(p.spent) || 0), 0),
        avgProgress: total > 0 
          ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / total)
          : 0,
        overdueProjects: projects.filter(p => {
          if (!p.deadline || p.status === 'completed' || p.status === 'cancelled') return false
          return new Date(p.deadline) < new Date()
        }).length
      }

      return stats
    } catch (error) {
      console.error('ProjectModel.getStats error:', error)
      throw error
    }
  }

  /**
   * 生成项目编号
   */
  async generateProjectNo() {
    try {
      const year = new Date().getFullYear()
      const { data, error } = await supabase
        .from(this.tableName)
        .select('project_no')
        .ilike('project_no', `PRJ-${year}-%`)
        .order('project_no', { ascending: false })
        .limit(1)

      if (error) throw error

      let lastNumber = 0
      if (data && data.length > 0) {
        const match = data[0].project_no.match(/PRJ-\d{4}-(\d{4})/)
        if (match) {
          lastNumber = parseInt(match[1])
        }
      }

      const nextNumber = String(lastNumber + 1).padStart(4, '0')
      return `PRJ-${year}-${nextNumber}`
    } catch (error) {
      console.error('ProjectModel.generateProjectNo error:', error)
      // 降级方案：使用时间戳
      return `PRJ-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`
    }
  }

  /**
   * 搜索项目
   */
  async search(keyword, limit = 20) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id, project_no, name, customer, status, progress')
        .or(`name.ilike.%${keyword}%,customer.ilike.%${keyword}%,project_no.ilike.%${keyword}%`)
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('ProjectModel.search error:', error)
      throw error
    }
  }

  /**
   * 获取即将到期的项目
   */
  async getUpcomingDeadlines(days = 7) {
    try {
      const today = new Date()
      const targetDate = new Date(today)
      targetDate.setDate(targetDate.getDate() + days)

      const dateStr = targetDate.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('status', 'active')
        .lte('deadline', dateStr)
        .gte('deadline', today.toISOString().split('T')[0])
        .order('deadline', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('ProjectModel.getUpcomingDeadlines error:', error)
      throw error
    }
  }
}