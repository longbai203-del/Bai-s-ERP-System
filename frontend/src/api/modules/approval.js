/**
 * @file approval.js
 * @description approval 模块 API
 */

import request from '../request'

// ============================================================
// approval 相关 API
// ============================================================

export function getapprovalList(params) {
  return request({ url: '/approval', method: 'get', params })
}

export function getapprovalDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createapproval(data) {
  return request({ url: '/approval', method: 'post', data })
}

export function updateapproval(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deleteapproval(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getapprovalStats() {
  return request({ url: '/approval/stats', method: 'get' })
}
