import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

class RequestClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const status = error?.response?.status
        if (status === 401) {
          localStorage.removeItem('token')
          window.location.assign('/login')
          ElMessage.error('登录已过期，请重新登录')
        } else if (status === 403) {
          ElMessage.error('没有访问权限')
        } else if (status === 404) {
          ElMessage.error('请求的资源不存在')
        } else if (status && status >= 500) {
          ElMessage.error('服务器内部错误')
        }
        return Promise.reject(error)
      }
    )
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config)
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config)
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config)
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.patch<T>(url, data, config)
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config)
  }
}

export const requestClient = new RequestClient()
export default requestClient
