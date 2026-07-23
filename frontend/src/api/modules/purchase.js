/**
 * @file purchase.js
 * @description purchase 模块 API
 */

import request from '../request'

// ============================================================
// purchase 相关 API
// ============================================================

export function getpurchaseList(params) {
  return request({ url: '/purchase', method: 'get', params })
}

export function getpurchaseDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createpurchase(data) {
  return request({ url: '/purchase', method: 'post', data })
}

export function updatepurchase(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletepurchase(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getpurchaseStats() {
  return request({ url: '/purchase/stats', method: 'get' })
}
