// Modules API 服务
import http from '@/api/http'

export const getModulesList = (params?: any) => {
    return http.get('/Modules', { params })
}

export const getModulesDetail = (id: number) => {
    return http.get('/Modules/' + id)
}

export const createModules = (data: any) => {
    return http.post('/Modules', data)
}

export const updateModules = (id: number, data: any) => {
    return http.put('/Modules/' + id, data)
}

export const deleteModules = (id: number) => {
    return http.delete('/Modules/' + id)
}

export const ModulesApi = {
    getList: getModulesList,
    getDetail: getModulesDetail,
    create: createModules,
    update: updateModules,
    delete: deleteModules,
}
