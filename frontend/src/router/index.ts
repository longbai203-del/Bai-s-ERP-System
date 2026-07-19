/**
 * @file router/index.ts
 * @description Vue Router 配置 - 使用布局
 */

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

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

console.log(`✅ 已加载 ${moduleRoutes.length} 个模块路由`)

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  // 所有模块路由都使用 DefaultLayout 包裹
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      ...moduleRoutes.map(route => ({
        ...route,
        path: route.path.replace('/', '')
      }))
    ]
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { requiresAuth: false }
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
