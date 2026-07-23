import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupGuards } from './guards'

// ===== 基础路由 =====
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/auth/pages/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/modules/system/pages/error/403.vue'),
    meta: { title: '403', hidden: true }
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

// ===== 自动导入所有模块路由 =====
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

// ===== 创建路由实例 =====
const router = createRouter({
  history: createWebHistory(),
  routes: [...baseRoutes, ...moduleRoutes],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// ===== 设置路由守卫 =====
setupGuards(router)

export default router
