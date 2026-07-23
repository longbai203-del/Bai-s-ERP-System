import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElLoading } from 'element-plus';

let loadingInstance: any = null;
let requestCount = 0;

export class BaseService {
  protected instance: AxiosInstance;
  
  constructor(baseURL?: string) {
    this.instance = axios.create({
      baseURL: baseURL || import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // 显示加载
        if ((config as any).showLoading !== false) {
          if (requestCount === 0) {
            loadingInstance = ElLoading.service({
              fullscreen: true,
              text: '加载中...',
              background: 'rgba(0,0,0,0.7)'
            });
          }
          requestCount++;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        this.closeLoading(response.config);
        
        const { data } = response;
        
        if (data.code === 200 || data.code === 0) {
          return data.data || data;
        } else if (data.code === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          ElMessage.error('登录已过期，请重新登录');
          return Promise.reject(new Error('未授权'));
        } else {
          const message = data.message || '请求失败';
          if ((response.config as any).showError !== false) {
            ElMessage.error(message);
          }
          return Promise.reject(new Error(message));
        }
      },
      (error) => {
        this.closeLoading(error.config);
        
        if (!error.response) {
          ElMessage.error('网络连接失败，请检查网络');
          return Promise.reject(error);
        }
        
        const { status } = error.response;
        let message = '';
        
        switch (status) {
          case 400: message = '请求参数错误'; break;
          case 401:
            message = '登录已过期，请重新登录';
            localStorage.removeItem('token');
            window.location.href = '/login';
            break;
          case 403: message = '没有权限访问'; break;
          case 404: message = '请求资源不存在'; break;
          case 500: message = '服务器内部错误'; break;
          default: message = `请求失败 (${status})`;
        }
        
        if ((error.config as any)?.showError !== false) {
          ElMessage.error(message);
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  private closeLoading(config: any) {
    if (config?.showLoading !== false) {
      requestCount--;
      if (requestCount === 0 && loadingInstance) {
        loadingInstance.close();
      }
    }
  }
  
  // HTTP 方法
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }
  
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }
  
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }
  
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }
  
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
  
  // 文件上传
  async upload<T = any>(url: string, file: File, data?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
    }
    return this.instance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
}
