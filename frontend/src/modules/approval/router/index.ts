// approval 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const approvalRoutes: RouteRecordRaw[] = [
    {
        path: '/approval',
        name: 'approvalIndex',
        component: () => import('@/modules/approval/pages/Index.vue'),
        meta: {
            title: 'approval 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/approval/create',
        name: 'approvalCreate',
        component: () => import('@/modules/approval/pages/Create.vue'),
        meta: {
            title: '创建 approval',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/approval/:id',
        name: 'approvalDetail',
        component: () => import('@/modules/approval/pages/Detail.vue'),
        meta: {
            title: 'approval 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/approval/edit/:id',
        name: 'approvalEdit',
        component: () => import('@/modules/approval/pages/Detail.vue'),
        meta: {
            title: '编辑 approval',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default approvalRoutes



