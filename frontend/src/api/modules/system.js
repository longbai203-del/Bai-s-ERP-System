/**
 * @file system.js
 * @description system 模块 API
 */

import request from '../request'

// ============================================================
// system 相关 API
// ============================================================

export function getsystemList(params) {
  return request({ url: '/system', method: 'get', params })
}

export function getsystemDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createsystem(data) {
  return request({ url: '/system', method: 'post', data })
}

export function updatesystem(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletesystem(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getsystemStats() {
  return request({ url: '/system/stats', method: 'get' })
}
