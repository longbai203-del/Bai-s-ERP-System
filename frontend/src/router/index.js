import { createRouter, createWebHistory } from 'vue-router'
import HtmlPage from '../components/HtmlPage.vue'
import { modules } from '../modules.config.js'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '仪表盘', requiresAuth: true }
  },
  // 自动加载所有模块，用 HtmlPage 桥接
  ...modules
    .filter(m => m.id !== '01-dashboard')
    .map(module => ({
      path: module.path,
      name: module.id,
      component: HtmlPage,
      meta: {
        title: module.title,
        icon: module.icon,
        requiresAuth: true,
        moduleId: module.id
      }
    })),
  // 404 重定向回首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router