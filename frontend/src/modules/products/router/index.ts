// products 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const productsRoutes: RouteRecordRaw[] = [
    {
        path: '/products',
        name: 'productsIndex',
        component: () => import('@/modules/products/pages/Index.vue'),
        meta: {
            title: 'products 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/products/create',
        name: 'productsCreate',
        component: () => import('@/modules/products/pages/Create.vue'),
        meta: {
            title: '创建 products',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/products/:id',
        name: 'productsDetail',
        component: () => import('@/modules/products/pages/Detail.vue'),
        meta: {
            title: 'products 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/products/edit/:id',
        name: 'productsEdit',
        component: () => import('@/modules/products/pages/Detail.vue'),
        meta: {
            title: '编辑 products',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default productsRoutes



