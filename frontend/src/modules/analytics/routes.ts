/**
 * @module analytics/routes
 * @description Analytics 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('./pages/AnalyticsList.vue'),
    meta: { title: 'Analytics管理', requiresAuth: true }
  },
  {
    path: '/analytics/create',
    name: 'AnalyticsCreate',
    component: () => import('./pages/AnalyticsCreate.vue'),
    meta: { title: '新建Analytics', requiresAuth: true }
  },
  {
    path: '/analytics/:id',
    name: 'AnalyticsDetail',
    component: () => import('./pages/AnalyticsDetail.vue'),
    meta: { title: 'Analytics详情', requiresAuth: true }
  },
  {
    path: '/analytics/:id/edit',
    name: 'AnalyticsEdit',
    component: () => import('./pages/AnalyticsEdit.vue'),
    meta: { title: '编辑Analytics', requiresAuth: true }
  }
]

export default routes
