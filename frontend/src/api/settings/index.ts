// settings 模块 API 服务
import http from '../http'

export interface settingsData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface settingsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface settingsListResponse {
    data: settingsData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getsettingsList = (params?: settingsListParams) => {
    return http.get('/settings', { params })
}

// 获取详情
export const getsettingsDetail = (id: number) => {
    return http.get(/ settings/\)
}

// 创建
export const createsettings = (data: any) => {
    return http.post('/settings', data)
}

// 更新
export const updatesettings = (id: number, data: any) => {
    return http.put(/ settings/\, data)
}

// 删除
export const deletesettings = (id: number) => {
    return http.delete(/ settings/\)
}
