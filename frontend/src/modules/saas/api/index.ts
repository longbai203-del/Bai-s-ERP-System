/**
 * @module saas/api
 * @description saas API 服务
 */

import api from '@/services/api'

export const saasApi = {
  list: (params?: any) => api.get('/saas', { params }),
  detail: (id: string) => api.get(/ + 'saas' + / + id),
  create: (data: any) => api.post('/saas', data),
  update: (id: string, data: any) => api.put(/ + 'saas' + / + id, data),
  delete: (id: string) => api.delete(/ + 'saas' + / + id),
}
