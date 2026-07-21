// project 模块 API 服务
import http from '../http'

export interface projectData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface projectListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface projectListResponse {
    data: projectData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getprojectList = (params?: projectListParams) => {
    return http.get('/project', { params })
}

// 获取详情
export const getprojectDetail = (id: number) => {
    return http.get(/ project/\)
}

// 创建
export const createproject = (data: any) => {
    return http.post('/project', data)
}

// 更新
export const updateproject = (id: number, data: any) => {
    return http.put(/ project/\, data)
}

// 删除
export const deleteproject = (id: number) => {
    return http.delete(/ project/\)
}
