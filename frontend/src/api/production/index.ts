// production 模块 API 服务
import http from '../http'

export interface productionData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface productionListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface productionListResponse {
    data: productionData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getproductionList = (params?: productionListParams) => {
    return http.get('/production', { params })
}

// 获取详情
export const getproductionDetail = (id: number) => {
    return http.get(/ production/\)
}

// 创建
export const createproduction = (data: any) => {
    return http.post('/production', data)
}

// 更新
export const updateproduction = (id: number, data: any) => {
    return http.put(/ production/\, data)
}

// 删除
export const deleteproduction = (id: number) => {
    return http.delete(/ production/\)
}
