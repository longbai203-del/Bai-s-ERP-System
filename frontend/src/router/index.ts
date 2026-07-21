import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 自动导入所有模块路由
const modules = import.meta.glob('../modules/*/router/index.ts', { eager: true })

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/404.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    }
]

// 加载模块路由
Object.values(modules).forEach((module: any) => {
    if (module.default && Array.isArray(module.default)) {
        routes.push(...module.default)
    }
})

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
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
