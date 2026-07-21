// customers 模块状态类型定义

export interface customersState {
    loading: boolean
    error: string | null
    data: customersData[] | null
    currentItem: customersData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface customersData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface customersListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface customersCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface customersUpdateParams extends Partial<customersData> {
    id: number
}

export interface customersResponse {
    data: customersData
    message: string
    success: boolean
    code?: number
}

export interface customersListResponse {
    data: customersData[]
    total: number
    page: number
    pageSize: number
}

export type customersStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const customersMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type customersMutationTypes = typeof customersMutations[keyof typeof customersMutations]
