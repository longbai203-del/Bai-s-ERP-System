/**
 * @module saas/routes
 * @description Saas 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/saas',
    name: 'Saas',
    component: () => import('./pages/SaasList.vue'),
    meta: { title: 'Saas管理', requiresAuth: true }
  },
  {
    path: '/saas/create',
    name: 'SaasCreate',
    component: () => import('./pages/SaasCreate.vue'),
    meta: { title: '新建Saas', requiresAuth: true }
  },
  {
    path: '/saas/:id',
    name: 'SaasDetail',
    component: () => import('./pages/SaasDetail.vue'),
    meta: { title: 'Saas详情', requiresAuth: true }
  },
  {
    path: '/saas/:id/edit',
    name: 'SaasEdit',
    component: () => import('./pages/SaasEdit.vue'),
    meta: { title: '编辑Saas', requiresAuth: true }
  }
]

export default routes
