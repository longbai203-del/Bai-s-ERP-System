// settings API 服务
import http from '@/api/http'

export const getsettingsList = (params?: any) => {
    return http.get('/settings', { params })
}

export const getsettingsDetail = (id: number) => {
    return http.get("/settings")
}

export const createsettings = (data: any) => {
    return http.post('/settings', data)
}

export const updatesettings = (id: number, data: any) => {
    return http.put("/settings", data)
}

export const deletesettings = (id: number) => {
    return http.delete("/settings")
}



