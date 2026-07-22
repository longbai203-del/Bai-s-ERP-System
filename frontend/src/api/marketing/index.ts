// marketing API 服务
import http from '@/api/http'

export interface MarketingData {
    id: number
    name: string
    // 根据业务扩展
}

export const getMarketingList = (params?: any) => {
    return http.get('/marketing', { params })
}

export const getMarketingDetail = (id: number) => {
    return http.get(/marketing/\)
}

export const createMarketing = (data: any) => {
    return http.post('/marketing', data)
}

export const updateMarketing = (id: number, data: any) => {
    return http.put(/marketing/\, data)
}

export const deleteMarketing = (id: number) => {
    return http.delete(/marketing/\)
}
