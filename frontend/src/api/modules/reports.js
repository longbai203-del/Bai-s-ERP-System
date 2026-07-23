/**
 * @file reports.js
 * @description reports 模块 API
 */

import request from '../request'

// ============================================================
// reports 相关 API
// ============================================================

export function getreportsList(params) {
  return request({ url: '/reports', method: 'get', params })
}

export function getreportsDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createreports(data) {
  return request({ url: '/reports', method: 'post', data })
}

export function updatereports(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletereports(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getreportsStats() {
  return request({ url: '/reports/stats', method: 'get' })
}
