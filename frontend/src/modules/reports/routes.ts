/**
 * @module reports/routes
 * @description Reports 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('./pages/ReportsList.vue'),
    meta: { title: 'Reports管理', requiresAuth: true }
  },
  {
    path: '/reports/create',
    name: 'ReportsCreate',
    component: () => import('./pages/ReportsCreate.vue'),
    meta: { title: '新建Reports', requiresAuth: true }
  },
  {
    path: '/reports/:id',
    name: 'ReportsDetail',
    component: () => import('./pages/ReportsDetail.vue'),
    meta: { title: 'Reports详情', requiresAuth: true }
  },
  {
    path: '/reports/:id/edit',
    name: 'ReportsEdit',
    component: () => import('./pages/ReportsEdit.vue'),
    meta: { title: '编辑Reports', requiresAuth: true }
  }
]

export default routes
