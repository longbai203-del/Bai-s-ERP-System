/**
 * @file api.js
 * @description API 客户端 - 统一请求封装
 */

import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加 Token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        case 404:
          console.error('API 端点不存在:', error.config?.url)
          break
        case 500:
          console.error('服务器错误:', error.response?.data)
          break
      }
    }
    return Promise.reject(error)
  }
)

// 默认导出
export default api
