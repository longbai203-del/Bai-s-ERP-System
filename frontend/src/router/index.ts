import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 基础路由
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/auth/pages/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/modules/dashboard/pages/Index.vue'),
    meta: { title: '仪表盘' }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/modules/system/pages/error/404.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

// 自动导入所有模块路由
const modules = import.meta.glob('../modules/*/router/*.ts', { eager: true })
const moduleRoutes: RouteRecordRaw[] = []

Object.keys(modules).forEach((key) => {
  const module = modules[key] as any
  if (module.default) {
    const routes = module.default
    if (Array.isArray(routes)) {
      moduleRoutes.push(...routes)
    } else {
      moduleRoutes.push(routes)
    }
  }
})

const router = createRouter({
  history: createWebHistory(),
  routes: [...baseRoutes, ...moduleRoutes],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path === '/login') {
    if (token) {
      next('/dashboard')
    } else {
      next()
    }
    return
  }
  
  if (to.path === '/dashboard' && !token) {
    next('/login')
    return
  }
  
  if (to.path === '/404') {
    next()
    return
  }
  
  if (!token && !to.meta?.hidden) {
    next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    return
  }
  
  next()
})

export default router
