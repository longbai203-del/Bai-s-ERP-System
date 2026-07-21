import http from '@/api/http'

// ============ 类型定义 ============
export interface AiData {
    id: number
    name: string
    type?: string
    status?: string
    createdAt?: string
    updatedAt?: string
}

export interface AiListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface AiResponse {
    data: AiData
    message: string
    success: boolean
    code?: number
}

export interface AiListResponse {
    data: AiData[]
    total: number
    page: number
    pageSize: number
}

// ============ API 函数 ============
export const getAiList = (params?: AiListParams): Promise<AiListResponse> => {
    return http.get('/ai', { params })
}

export const getAiDetail = (id: number): Promise<AiResponse> => {
    return http.get(`/ai/${id}`)
}

export const createAi = (data: Partial<AiData>): Promise<AiResponse> => {
    return http.post('/ai', data)
}

export const updateAi = (id: number, data: Partial<AiData>): Promise<AiResponse> => {
    return http.put(`/ai/${id}`, data)
}

export const deleteAi = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(`/ai/${id}`)
}

export const batchDeleteAi = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/ai/batch-delete', { ids })
}
