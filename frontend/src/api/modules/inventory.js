/**
 * @file inventory.js
 * @description inventory 模块 API
 */

import request from '../request'

// ============================================================
// inventory 相关 API
// ============================================================

export function getinventoryList(params) {
  return request({ url: '/inventory', method: 'get', params })
}

export function getinventoryDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createinventory(data) {
  return request({ url: '/inventory', method: 'post', data })
}

export function updateinventory(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deleteinventory(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getinventoryStats() {
  return request({ url: '/inventory/stats', method: 'get' })
}
