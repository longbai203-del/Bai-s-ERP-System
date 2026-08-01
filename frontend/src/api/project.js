/**
 * @file project.js
 * @description 项目 API 调用
 */

import request from './request'

/**
 * 获取项目列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页条数
 * @param {string} params.keyword - 搜索关键词
 * @param {string} params.status - 状态筛选
 * @param {string} params.priority - 优先级筛选
 * @param {string} params.customer - 客户筛选
 * @param {string} params.sortBy - 排序字段
 * @param {string} params.sortOrder - 排序方向
 * @returns {Promise}
 */
export function getProjectList(params = {}) {
  return request({
    url: '/projects',
    method: 'get',
    params
  })
}

/**
 * 获取项目详情
 * @param {number|string} id - 项目ID
 * @returns {Promise}
 */
export function getProjectDetail(id) {
  return request({
    url: `/projects/${id}`,
    method: 'get'
  })
}

/**
 * 创建项目
 * @param {Object} data - 项目数据
 * @param {string} data.name - 项目名称
 * @param {string} data.customer - 客户名称
 * @param {number} data.budget - 预算
 * @param {number} data.spent - 已花费
 * @param {number} data.progress - 进度 (0-100)
 * @param {string} data.priority - 优先级 (high/medium/low)
 * @param {string} data.status - 状态 (planning/active/paused/completed/cancelled)
 * @param {string} data.startDate - 开始日期
 * @param {string} data.deadline - 截止日期
 * @param {string} data.projectManager - 项目经理
 * @param {string} data.description - 描述
 * @param {string} data.remark - 备注
 * @returns {Promise}
 */
export function createProject(data) {
  return request({
    url: '/projects',
    method: 'post',
    data
  })
}

/**
 * 更新项目
 * @param {number|string} id - 项目ID
 * @param {Object} data - 项目数据（同创建）
 * @returns {Promise}
 */
export function updateProject(id, data) {
  return request({
    url: `/projects/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除项目
 * @param {number|string} id - 项目ID
 * @returns {Promise}
 */
export function deleteProject(id) {
  return request({
    url: `/projects/${id}`,
    method: 'delete'
  })
}

/**
 * 启动项目
 * @param {number|string} id - 项目ID
 * @returns {Promise}
 */
export function startProject(id) {
  return request({
    url: `/projects/${id}/start`,
    method: 'post'
  })
}

/**
 * 暂停项目
 * @param {number|string} id - 项目ID
 * @returns {Promise}
 */
export function pauseProject(id) {
  return request({
    url: `/projects/${id}/pause`,
    method: 'post'
  })
}

/**
 * 完成项目
 * @param {number|string} id - 项目ID
 * @returns {Promise}
 */
export function completeProject(id) {
  return request({
    url: `/projects/${id}/complete`,
    method: 'post'
  })
}

/**
 * 获取项目统计
 * @returns {Promise}
 */
export function getProjectStats() {
  return request({
    url: '/projects/stats',
    method: 'get'
  })
}

/**
 * 搜索项目
 * @param {string} keyword - 搜索关键词
 * @param {number} limit - 返回条数
 * @returns {Promise}
 */
export function searchProjects(keyword, limit = 20) {
  return request({
    url: '/projects/search',
    method: 'get',
    params: { keyword, limit }
  })
}

/**
 * 获取即将到期的项目
 * @param {number} days - 天数
 * @returns {Promise}
 */
export function getUpcomingDeadlines(days = 7) {
  return request({
    url: '/projects/upcoming-deadlines',
    method: 'get',
    params: { days }
  })
}