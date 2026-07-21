// hr 模块类型定义

// ============ State 接口 ============
export interface hrState {
    /** 加载状态 */
    loading: boolean
    /** 错误信息 */
    error: string | null
    /** 数据列表 */
    data: hrData[] | null
    /** 当前选中的数据 */
    currentItem: hrData | null
    /** 总记录数 */
    total: number
    /** 当前页码 */
    currentPage: number
    /** 每页条数 */
    pageSize: number
}

// ============ Data 接口 ============
export interface hrData {
    /** 主键ID */
    id: number
    /** 名称 */
    name: string
    /** 编码 */
    code?: string
    /** 状态 */
    status?: string
    /** 创建时间 */
    createdAt?: string
    /** 更新时间 */
    updatedAt?: string
    /** 备注 */
    remark?: string
    // 根据业务需求添加更多字段
}

// ============ Params 接口 ============
export interface hrListParams {
    /** 页码 */
    page?: number
    /** 每页条数 */
    pageSize?: number
    /** 关键词搜索 */
    keyword?: string
    /** 状态筛选 */
    status?: string
    /** 开始时间 */
    startTime?: string
    /** 结束时间 */
    endTime?: string
    // 根据业务需求添加更多查询参数
}

export interface hrCreateParams {
    /** 名称 */
    name: string
    /** 编码 */
    code?: string
    /** 状态 */
    status?: string
    /** 备注 */
    remark?: string
    // 根据业务需求添加更多创建参数
}

export interface hrUpdateParams extends Partial<hrData> {
    /** 主键ID（必须） */
    id: number
}

// ============ Response 接口 ============
export interface hrResponse {
    /** 数据 */
    data: hrData
    /** 消息 */
    message: string
    /** 是否成功 */
    success: boolean
    /** 状态码 */
    code?: number
}

export interface hrListResponse {
    /** 数据列表 */
    data: hrData[]
    /** 总记录数 */
    total: number
    /** 当前页码 */
    page: number
    /** 每页条数 */
    pageSize: number
}

// ============ 枚举类型 ============
export type hrStatus = 'active' | 'inactive' | 'pending' | 'deleted'
