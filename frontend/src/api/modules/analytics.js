/**
 * @file analytics.js
 * @description analytics 模块 API
 */

import request from '../request'

// ============================================================
// analytics 相关 API
// ============================================================

export function getanalyticsList(params) {
  return request({ url: '/analytics', method: 'get', params })
}

export function getanalyticsDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createanalytics(data) {
  return request({ url: '/analytics', method: 'post', data })
}

export function updateanalytics(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deleteanalytics(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getanalyticsStats() {
  return request({ url: '/analytics/stats', method: 'get' })
}
