// system 模块 API 服务
import http from '../http'

export interface systemData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface systemListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface systemListResponse {
    data: systemData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getsystemList = (params?: systemListParams) => {
    return http.get('/system', { params })
}

// 获取详情
export const getsystemDetail = (id: number) => {
    return http.get(/ system/\)
}

// 创建
export const createsystem = (data: any) => {
    return http.post('/system', data)
}

// 更新
export const updatesystem = (id: number, data: any) => {
    return http.put(/ system/\, data)
}

// 删除
export const deletesystem = (id: number) => {
    return http.delete(/ system/\)
}
