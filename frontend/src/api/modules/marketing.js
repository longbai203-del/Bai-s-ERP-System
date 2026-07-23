/**
 * @file marketing.js
 * @description marketing 模块 API
 */

import request from '../request'

// ============================================================
// marketing 相关 API
// ============================================================

export function getmarketingList(params) {
  return request({ url: '/marketing', method: 'get', params })
}

export function getmarketingDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createmarketing(data) {
  return request({ url: '/marketing', method: 'post', data })
}

export function updatemarketing(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletemarketing(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getmarketingStats() {
  return request({ url: '/marketing/stats', method: 'get' })
}
