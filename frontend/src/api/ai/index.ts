// ai API 服务
import http from '@/api/http'

export interface AiData {
    id: number
    name: string
    // 根据业务扩展
}

export const getAiList = (params?: any) => {
    return http.get('/ai', { params })
}

export const getAiDetail = (id: number) => {
    return http.get(`/ai/${id}`)
}

export const createAi = (data: any) => {
    return http.post('/ai', data)
}

export const updateAi = (id: number, data: any) => {
    return http.put(`/ai/${id}`, data)
}

export const deleteAi = (id: number) => {
    return http.delete(`/ai/${id}`)
}

export const aiApi = {
    generate: (data: any) => http.post('/ai/generate', data),
    getHistory: (params?: any) => http.get('/ai/history', { params }),
}

