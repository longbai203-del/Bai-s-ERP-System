/**
 * @file router/index.js
 * @description Vue Router 配置 - 薄入口层架构
 */

import { createRouter, createWebHistory } from 'vue-router'

// 自动加载所有模块路由
const modules = import.meta.glob('../modules/*/routes.ts', { eager: true })

// 收集所有模块路由
const moduleRoutes = []
for (const path in modules) {
  const module = modules[path]
  if (module.default) {
    if (Array.isArray(module.default)) {
      moduleRoutes.push(...module.default)
    } else {
      moduleRoutes.push(module.default)
    }
  }
}

console.log(`✅ 已加载 ${moduleRoutes.length} 个模块路由`)

const routes = [
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
  // 所有模块路由
  ...moduleRoutes,
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
