// ai API 服务
import http from '@/api/http'

export const getAiList = (params?: any) => {
    return http.get('/ai', { params })
}

export const getAiDetail = (id: number) => {
    return http.get('/ai/' + id)
}

export const createAi = (data: any) => {
    return http.post('/ai', data)
}

export const updateAi = (id: number, data: any) => {
    return http.put('/ai/' + id, data)
}

export const deleteAi = (id: number) => {
    return http.delete('/ai/' + id)
}

export const aiApi = {
    getList: getAiList,
    getDetail: getAiDetail,
    create: createAi,
    update: updateAi,
    delete: deleteAi,
    // AI 特有的方法
    chat: (message: string) => {
        return http.post('/ai/chat', { message })
    },
    generate: (data: any) => {
        return http.post('/ai/generate', data)
    },
}
