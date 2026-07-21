// pos 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const posRoutes: RouteRecordRaw[] = [
    {
        path: '/pos',
        name: 'posIndex',
        component: () => import('@/modules/pos/pages/Index.vue'),
        meta: {
            title: 'pos 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/pos/create',
        name: 'posCreate',
        component: () => import('@/modules/pos/pages/Create.vue'),
        meta: {
            title: '创建 pos',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/pos/:id',
        name: 'posDetail',
        component: () => import('@/modules/pos/pages/Detail.vue'),
        meta: {
            title: 'pos 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/pos/edit/:id',
        name: 'posEdit',
        component: () => import('@/modules/pos/pages/Detail.vue'),
        meta: {
            title: '编辑 pos',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default posRoutes



