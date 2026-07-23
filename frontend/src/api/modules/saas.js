/**
 * @file saas.js
 * @description saas 模块 API
 */

import request from '../request'

// ============================================================
// saas 相关 API
// ============================================================

export function getsaasList(params) {
  return request({ url: '/saas', method: 'get', params })
}

export function getsaasDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createsaas(data) {
  return request({ url: '/saas', method: 'post', data })
}

export function updatesaas(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletesaas(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getsaasStats() {
  return request({ url: '/saas/stats', method: 'get' })
}
