// hr 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const hrRoutes: RouteRecordRaw[] = [
    {
        path: '/hr',
        name: 'hrIndex',
        component: () => import('@/modules/hr/pages/Index.vue'),
        meta: {
            title: 'hr 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/hr/create',
        name: 'hrCreate',
        component: () => import('@/modules/hr/pages/Create.vue'),
        meta: {
            title: '创建 hr',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/hr/:id',
        name: 'hrDetail',
        component: () => import('@/modules/hr/pages/Detail.vue'),
        meta: {
            title: 'hr 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/hr/edit/:id',
        name: 'hrEdit',
        component: () => import('@/modules/hr/pages/Detail.vue'),
        meta: {
            title: '编辑 hr',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default hrRoutes



