// settings API 服务
import http from '@/api/http'

export const getSettingsList = (params?: any) => {
    return http.get('/settings', { params })
}

export const getSettingsDetail = (id: number) => {
    return http.get(`/settings/${id}`)
}

export const createSettings = (data: any) => {
    return http.post('/settings', data)
}

export const updateSettings = (id: number, data: any) => {
    return http.put(`/settings/${id}`, data)
}

export const deleteSettings = (id: number) => {
    return http.delete(`/settings/${id}`)
}

export const settingsApi = {
    getList: getSettingsList,
    getDetail: getSettingsDetail,
    create: createSettings,
    update: updateSettings,
    delete: deleteSettings,
}

export const settingApi = settingsApi
