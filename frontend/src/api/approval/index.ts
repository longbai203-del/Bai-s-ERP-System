// approval 模块 API 服务
import http from '../http'

export interface approvalData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface approvalListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface approvalListResponse {
    data: approvalData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getapprovalList = (params?: approvalListParams) => {
    return http.get('/approval', { params })
}

// 获取详情
export const getapprovalDetail = (id: number) => {
    return http.get(/ approval/\)
}

// 创建
export const createapproval = (data: any) => {
    return http.post('/approval', data)
}

// 更新
export const updateapproval = (id: number, data: any) => {
    return http.put(/ approval/\, data)
}

// 删除
export const deleteapproval = (id: number) => {
    return http.delete(/ approval/\)
}
