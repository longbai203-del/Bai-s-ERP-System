// finance 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const financeRoutes: RouteRecordRaw[] = [
    {
        path: '/finance',
        name: 'financeIndex',
        component: () => import('@/modules/finance/pages/Index.vue'),
        meta: {
            title: 'finance 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/finance/create',
        name: 'financeCreate',
        component: () => import('@/modules/finance/pages/Create.vue'),
        meta: {
            title: '创建 finance',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/finance/:id',
        name: 'financeDetail',
        component: () => import('@/modules/finance/pages/Detail.vue'),
        meta: {
            title: 'finance 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/finance/edit/:id',
        name: 'financeEdit',
        component: () => import('@/modules/finance/pages/Detail.vue'),
        meta: {
            title: '编辑 finance',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default financeRoutes



