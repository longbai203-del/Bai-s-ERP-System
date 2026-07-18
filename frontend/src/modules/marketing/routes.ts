/**
 * @module marketing/routes
 * @description Marketing 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/marketing',
    name: 'Marketing',
    component: () => import('./pages/MarketingList.vue'),
    meta: { title: 'Marketing管理', requiresAuth: true }
  },
  {
    path: '/marketing/create',
    name: 'MarketingCreate',
    component: () => import('./pages/MarketingCreate.vue'),
    meta: { title: '新建Marketing', requiresAuth: true }
  },
  {
    path: '/marketing/:id',
    name: 'MarketingDetail',
    component: () => import('./pages/MarketingDetail.vue'),
    meta: { title: 'Marketing详情', requiresAuth: true }
  },
  {
    path: '/marketing/:id/edit',
    name: 'MarketingEdit',
    component: () => import('./pages/MarketingEdit.vue'),
    meta: { title: '编辑Marketing', requiresAuth: true }
  }
]

export default routes
