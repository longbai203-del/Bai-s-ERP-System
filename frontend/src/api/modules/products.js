/**
 * @file products.js
 * @description products 模块 API
 */

import request from '../request'

// ============================================================
// products 相关 API
// ============================================================

export function getproductsList(params) {
  return request({ url: '/products', method: 'get', params })
}

export function getproductsDetail(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'get' })
}

export function createproducts(data) {
  return request({ url: '/products', method: 'post', data })
}

export function updateproducts(id, data) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'put', data })
}

export function deleteproducts(id) {
  return request({ url: /Microsoft.PowerShell.Management Microsoft.PowerShell.Utility PSReadLine/, method: 'delete' })
}

export function getproductsStats() {
  return request({ url: '/products/stats', method: 'get' })
}
