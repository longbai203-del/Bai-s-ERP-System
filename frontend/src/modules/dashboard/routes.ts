/**
 * @module dashboard/routes
 * @description Dashboard 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./pages/DashboardList.vue'),
    meta: { title: 'Dashboard管理', requiresAuth: true }
  },
  {
    path: '/dashboard/create',
    name: 'DashboardCreate',
    component: () => import('./pages/DashboardCreate.vue'),
    meta: { title: '新建Dashboard', requiresAuth: true }
  },
  {
    path: '/dashboard/:id',
    name: 'DashboardDetail',
    component: () => import('./pages/DashboardDetail.vue'),
    meta: { title: 'Dashboard详情', requiresAuth: true }
  },
  {
    path: '/dashboard/:id/edit',
    name: 'DashboardEdit',
    component: () => import('./pages/DashboardEdit.vue'),
    meta: { title: '编辑Dashboard', requiresAuth: true }
  }
]

export default routes
