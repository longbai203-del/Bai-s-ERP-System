import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'

let loadingInstance = null
let requestCount = 0

class ApiClient {
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    })
    this.setupInterceptors()
  }

  setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        if (config.showLoading !== false) {
          if (requestCount === 0) {
            loadingInstance = ElLoading.service({
              fullscreen: true,
              text: '加载中...',
              background: 'rgba(0,0,0,0.7)'
            })
          }
          requestCount++
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => {
        this.closeLoading(response.config)
        const { data } = response
        if (data.code === 200 || data.code === 0) {
          return data.data || data
        } else if (data.code === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
          ElMessage.error('登录已过期，请重新登录')
          return Promise.reject(new Error('未授权'))
        } else {
          const message = data.message || '请求失败'
          if (response.config.showError !== false) {
            ElMessage.error(message)
          }
          return Promise.reject(new Error(message))
        }
      },
      (error) => {
        this.closeLoading(error.config)
        if (!error.response) {
          ElMessage.error('网络连接失败')
          return Promise.reject(error)
        }
        const status = error.response.status
        let message = ''
        switch (status) {
          case 400: message = '请求参数错误'; break
          case 401: 
            message = '登录已过期，请重新登录'
            localStorage.removeItem('token')
            window.location.href = '/login'
            break
          case 403: message = '没有权限访问'; break
          case 404: message = '请求资源不存在'; break
          case 500: message = '服务器内部错误'; break
          default: message = `请求失败 (${status})`
        }
        if (error.config?.showError !== false) {
          ElMessage.error(message)
        }
        return Promise.reject(error)
      }
    )
  }

  closeLoading(config) {
    if (config?.showLoading !== false) {
      requestCount--
      if (requestCount === 0 && loadingInstance) {
        loadingInstance.close()
      }
    }
  }

  get(url, config) { return this.instance.get(url, config) }
  post(url, data, config) { return this.instance.post(url, data, config) }
  put(url, data, config) { return this.instance.put(url, data, config) }
  delete(url, config) { return this.instance.delete(url, config) }
  patch(url, data, config) { return this.instance.patch(url, data, config) }
  
  upload(url, file, data) {
    const formData = new FormData()
    formData.append('file', file)
    if (data) {
      Object.keys(data).forEach(key => formData.append(key, data[key]))
    }
    return this.instance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export const apiClient = new ApiClient()
