// Inventory API 服务
import http from '@/api/http'

export const getInventoryList = (params?: any) => {
    return http.get('/Inventory', { params })
}

export const getInventoryDetail = (id: number) => {
    return http.get('/Inventory/' + id)
}

export const createInventory = (data: any) => {
    return http.post('/Inventory', data)
}

export const updateInventory = (id: number, data: any) => {
    return http.put('/Inventory/' + id, data)
}

export const deleteInventory = (id: number) => {
    return http.delete('/Inventory/' + id)
}

export const InventoryApi = {
    getList: getInventoryList,
    getDetail: getInventoryDetail,
    create: createInventory,
    update: updateInventory,
    delete: deleteInventory,
}
