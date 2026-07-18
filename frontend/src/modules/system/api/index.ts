/**
 * @module system/api
 * @description system API 服务
 */

import api from '@/services/api'

export const systemApi = {
  list: (params?: any) => api.get('/system', { params }),
  detail: (id: string) => api.get(/ + 'system' + / + id),
  create: (data: any) => api.post('/system', data),
  update: (id: string, data: any) => api.put(/ + 'system' + / + id, data),
  delete: (id: string) => api.delete(/ + 'system' + / + id),
}
