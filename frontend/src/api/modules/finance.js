/**
 * @file finance.js
 * @description finance 模块 API
 */

import request from '../request'

// ============================================================
// finance 相关 API
// ============================================================

export function getfinanceList(params) {
  return request({ url: '/finance', method: 'get', params })
}

export function getfinanceDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createfinance(data) {
  return request({ url: '/finance', method: 'post', data })
}

export function updatefinance(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletefinance(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getfinanceStats() {
  return request({ url: '/finance/stats', method: 'get' })
}
