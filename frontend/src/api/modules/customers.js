/**
 * @file customers.js
 * @description customers 模块 API
 */

import request from '../request'

// ============================================================
// customers 相关 API
// ============================================================

export function getcustomersList(params) {
  return request({ url: '/customers', method: 'get', params })
}

export function getcustomersDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createcustomers(data) {
  return request({ url: '/customers', method: 'post', data })
}

export function updatecustomers(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletecustomers(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getcustomersStats() {
  return request({ url: '/customers/stats', method: 'get' })
}
