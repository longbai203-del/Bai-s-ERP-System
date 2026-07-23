/**
 * @file hr.js
 * @description hr 模块 API
 */

import request from '../request'

// ============================================================
// hr 相关 API
// ============================================================

export function gethrList(params) {
  return request({ url: '/hr', method: 'get', params })
}

export function gethrDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createhr(data) {
  return request({ url: '/hr', method: 'post', data })
}

export function updatehr(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletehr(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function gethrStats() {
  return request({ url: '/hr/stats', method: 'get' })
}
