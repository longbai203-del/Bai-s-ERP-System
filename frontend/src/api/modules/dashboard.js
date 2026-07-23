/**
 * @file dashboard.js
 * @description dashboard 模块 API
 */

import request from '../request'

// ============================================================
// dashboard 相关 API
// ============================================================

export function getdashboardList(params) {
  return request({ url: '/dashboard', method: 'get', params })
}

export function getdashboardDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createdashboard(data) {
  return request({ url: '/dashboard', method: 'post', data })
}

export function updatedashboard(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletedashboard(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getdashboardStats() {
  return request({ url: '/dashboard/stats', method: 'get' })
}
