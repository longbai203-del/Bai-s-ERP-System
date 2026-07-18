/**
 * @file router/index.ts
 * @description Vue Router 配置
 */

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 自动导入所有模块路由
const modules = import.meta.glob('../modules/*/routes.ts', { eager: true })

// 收集所有模块路由
const moduleRoutes: RouteRecordRaw[] = []
for (const path in modules) {
  const module = modules[path] as { default: RouteRecordRaw[] }
  if (module.default) {
    moduleRoutes.push(...module.default)
  }
}

// 定义路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  // 模块路由
  ...moduleRoutes,
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
