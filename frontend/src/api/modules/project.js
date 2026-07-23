/**
 * @file project.js
 * @description project 模块 API
 */

import request from '../request'

// ============================================================
// project 相关 API
// ============================================================

export function getprojectList(params) {
  return request({ url: '/project', method: 'get', params })
}

export function getprojectDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createproject(data) {
  return request({ url: '/project', method: 'post', data })
}

export function updateproject(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deleteproject(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getprojectStats() {
  return request({ url: '/project/stats', method: 'get' })
}
