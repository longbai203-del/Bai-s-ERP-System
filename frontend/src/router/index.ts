import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// 自动导入所有模块路由
const modules = import.meta.glob('../modules/*/router/index.ts', { eager: true })

// 收集所有模块路由
const moduleRoutes: RouteRecordRaw[] = []
Object.values(modules).forEach((module: any) => {
    if (module.default && Array.isArray(module.default)) {
        moduleRoutes.push(...module.default)
    }
})

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/modules/auth/pages/Login.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        component: DefaultLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/dashboard'
            },
            ...moduleRoutes
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/modules/auth/pages/NotFound.vue'),
        meta: { requiresAuth: false }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth && !token) {
        next('/login')
    } else if (to.path === '/login' && token) {
        next('/')
    } else {
        next()
    }
})

export default router
