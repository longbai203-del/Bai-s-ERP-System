// system API 服务
import http from '@/api/http'

export interface SystemData {
    id: number
    name: string
    // 根据业务扩展
}

export const getSystemList = (params?: any) => {
    return http.get('/system', { params })
}

export const getSystemDetail = (id: number) => {
    return http.get(/system/\)
}

export const createSystem = (data: any) => {
    return http.post('/system', data)
}

export const updateSystem = (id: number, data: any) => {
    return http.put(/system/\, data)
}

export const deleteSystem = (id: number) => {
    return http.delete(/system/\)
}
