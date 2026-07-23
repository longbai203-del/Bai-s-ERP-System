/**
 * @file pos.js
 * @description pos 模块 API
 */

import request from '../request'

// ============================================================
// pos 相关 API
// ============================================================

export function getposList(params) {
  return request({ url: '/pos', method: 'get', params })
}

export function getposDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createpos(data) {
  return request({ url: '/pos', method: 'post', data })
}

export function updatepos(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletepos(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getposStats() {
  return request({ url: '/pos/stats', method: 'get' })
}
