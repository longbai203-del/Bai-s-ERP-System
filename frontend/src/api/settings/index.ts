// Settings API 服务
import http from '@/api/http'

export const getSettingsList = (params?: any) => {
    return http.get('/Settings', { params })
}

export const getSettingsDetail = (id: number) => {
    return http.get('/Settings/' + id)
}

export const createSettings = (data: any) => {
    return http.post('/Settings', data)
}

export const updateSettings = (id: number, data: any) => {
    return http.put('/Settings/' + id, data)
}

export const deleteSettings = (id: number) => {
    return http.delete('/Settings/' + id)
}

export const SettingsApi = {
    getList: getSettingsList,
    getDetail: getSettingsDetail,
    create: createSettings,
    update: updateSettings,
    delete: deleteSettings,
}
