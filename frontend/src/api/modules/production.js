/**
 * @file production.js
 * @description production 模块 API
 */

import request from '../request'

// ============================================================
// production 相关 API
// ============================================================

export function getproductionList(params) {
  return request({ url: '/production', method: 'get', params })
}

export function getproductionDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createproduction(data) {
  return request({ url: '/production', method: 'post', data })
}

export function updateproduction(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deleteproduction(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getproductionStats() {
  return request({ url: '/production/stats', method: 'get' })
}
