/**
 * @module system/routes
 * @description System 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    component: () => import('./pages/SystemList.vue'),
    meta: { title: 'System管理', requiresAuth: true }
  },
  {
    path: '/system/create',
    name: 'SystemCreate',
    component: () => import('./pages/SystemCreate.vue'),
    meta: { title: '新建System', requiresAuth: true }
  },
  {
    path: '/system/:id',
    name: 'SystemDetail',
    component: () => import('./pages/SystemDetail.vue'),
    meta: { title: 'System详情', requiresAuth: true }
  },
  {
    path: '/system/:id/edit',
    name: 'SystemEdit',
    component: () => import('./pages/SystemEdit.vue'),
    meta: { title: '编辑System', requiresAuth: true }
  }
]

export default routes
