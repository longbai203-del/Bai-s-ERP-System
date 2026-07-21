// system 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const systemRoutes: RouteRecordRaw[] = [
    {
        path: '/system',
        name: 'systemIndex',
        component: () => import('@/modules/system/pages/Index.vue'),
        meta: {
            title: 'system 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/system/create',
        name: 'systemCreate',
        component: () => import('@/modules/system/pages/Create.vue'),
        meta: {
            title: '创建 system',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/system/:id',
        name: 'systemDetail',
        component: () => import('@/modules/system/pages/Detail.vue'),
        meta: {
            title: 'system 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/system/edit/:id',
        name: 'systemEdit',
        component: () => import('@/modules/system/pages/Detail.vue'),
        meta: {
            title: '编辑 system',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default systemRoutes



