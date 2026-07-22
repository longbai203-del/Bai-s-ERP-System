// inventory API 服务
import http from '@/api/http'

export interface InventoryData {
    id: number
    name: string
    // 根据业务扩展
}

export const getInventoryList = (params?: any) => {
    return http.get('/inventory', { params })
}

export const getInventoryDetail = (id: number) => {
    return http.get(/inventory/\)
}

export const createInventory = (data: any) => {
    return http.post('/inventory', data)
}

export const updateInventory = (id: number, data: any) => {
    return http.put(/inventory/\, data)
}

export const deleteInventory = (id: number) => {
    return http.delete(/inventory/\)
}
