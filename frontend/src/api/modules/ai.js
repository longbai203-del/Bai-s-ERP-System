/**
 * @file ai.js
 * @description ai 模块 API
 */

import request from '../request'

// ============================================================
// ai 相关 API
// ============================================================

export function getaiList(params) {
  return request({ url: '/ai', method: 'get', params })
}

export function getaiDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createai(data) {
  return request({ url: '/ai', method: 'post', data })
}

export function updateai(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deleteai(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getaiStats() {
  return request({ url: '/ai/stats', method: 'get' })
}
