/**
 * @file helpers.js
 * @description API 工具函数
 */

import { ElMessage } from 'element-plus'

/**
 * 统一错误处理
 */
export function handleApiError(error, defaultMessage = '操作失败') {
  console.error('API Error:', error)
  
  if (error.response?.data?.message) {
    ElMessage.error(error.response.data.message)
  } else if (error.message) {
    ElMessage.error(error.message)
  } else {
    ElMessage.error(defaultMessage)
  }
  
  return Promise.reject(error)
}

/**
 * 统一成功提示
 */
export function showSuccess(message = '操作成功') {
  ElMessage.success(message)
}

/**
 * 统一警告提示
 */
export function showWarning(message) {
  ElMessage.warning(message)
}

/**
 * 格式化日期
 */
export function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 格式化金额
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '¥0.00'
  return '¥' + Number(amount).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * 获取状态标签类型
 */
export function getStatusType(status) {
  const map = {
    'active': 'success',
    'inactive': 'danger',
    'pending': 'warning',
    'completed': 'success',
    'cancelled': 'danger',
    'draft': 'info',
    'approved': 'success',
    'rejected': 'danger',
    'processing': 'warning',
    'planning': 'info',
    'paused': 'warning'
  }
  return map[status] || 'info'
}

/**
 * 获取状态标签文本
 */
export function getStatusLabel(status) {
  const map = {
    'active': '启用',
    'inactive': '禁用',
    'pending': '待处理',
    'completed': '已完成',
    'cancelled': '已取消',
    'draft': '草稿',
    'approved': '已批准',
    'rejected': '已拒绝',
    'processing': '处理中',
    'planning': '规划中',
    'paused': '已暂停'
  }
  return map[status] || status
}
