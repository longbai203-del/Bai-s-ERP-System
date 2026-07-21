// customers 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const customersRoutes: RouteRecordRaw[] = [
    {
        path: '/customers',
        name: 'customersIndex',
        component: () => import('@/modules/customers/pages/Index.vue'),
        meta: {
            title: 'customers 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/customers/create',
        name: 'customersCreate',
        component: () => import('@/modules/customers/pages/Create.vue'),
        meta: {
            title: '创建 customers',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/customers/:id',
        name: 'customersDetail',
        component: () => import('@/modules/customers/pages/Detail.vue'),
        meta: {
            title: 'customers 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/customers/edit/:id',
        name: 'customersEdit',
        component: () => import('@/modules/customers/pages/Detail.vue'),
        meta: {
            title: '编辑 customers',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default customersRoutes



