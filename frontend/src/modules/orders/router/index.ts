// orders 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const ordersRoutes: RouteRecordRaw[] = [
    {
        path: '/orders',
        name: 'ordersIndex',
        component: () => import('@/modules/orders/pages/Index.vue'),
        meta: {
            title: 'orders 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/orders/create',
        name: 'ordersCreate',
        component: () => import('@/modules/orders/pages/Create.vue'),
        meta: {
            title: '创建 orders',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/orders/:id',
        name: 'ordersDetail',
        component: () => import('@/modules/orders/pages/Detail.vue'),
        meta: {
            title: 'orders 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/orders/edit/:id',
        name: 'ordersEdit',
        component: () => import('@/modules/orders/pages/Detail.vue'),
        meta: {
            title: '编辑 orders',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default ordersRoutes



