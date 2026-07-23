/**
 * @file orders.js
 * @description orders 模块 API
 */

import request from '../request'

// ============================================================
// orders 相关 API
// ============================================================

export function getordersList(params) {
  return request({ url: '/orders', method: 'get', params })
}

export function getordersDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createorders(data) {
  return request({ url: '/orders', method: 'post', data })
}

export function updateorders(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deleteorders(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getordersStats() {
  return request({ url: '/orders/stats', method: 'get' })
}
