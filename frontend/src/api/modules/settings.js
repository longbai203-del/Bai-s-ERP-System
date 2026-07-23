/**
 * @file settings.js
 * @description settings 模块 API
 */

import request from '../request'

// ============================================================
// settings 相关 API
// ============================================================

export function getsettingsList(params) {
  return request({ url: '/settings', method: 'get', params })
}

export function getsettingsDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createsettings(data) {
  return request({ url: '/settings', method: 'post', data })
}

export function updatesettings(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deletesettings(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getsettingsStats() {
  return request({ url: '/settings/stats', method: 'get' })
}
