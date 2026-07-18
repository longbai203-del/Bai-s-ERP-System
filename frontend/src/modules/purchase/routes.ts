/**
 * @module purchase/routes
 * @description Purchase 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/purchase',
    name: 'Purchase',
    component: () => import('./pages/PurchaseList.vue'),
    meta: { title: 'Purchase管理', requiresAuth: true }
  },
  {
    path: '/purchase/create',
    name: 'PurchaseCreate',
    component: () => import('./pages/PurchaseCreate.vue'),
    meta: { title: '新建Purchase', requiresAuth: true }
  },
  {
    path: '/purchase/:id',
    name: 'PurchaseDetail',
    component: () => import('./pages/PurchaseDetail.vue'),
    meta: { title: 'Purchase详情', requiresAuth: true }
  },
  {
    path: '/purchase/:id/edit',
    name: 'PurchaseEdit',
    component: () => import('./pages/PurchaseEdit.vue'),
    meta: { title: '编辑Purchase', requiresAuth: true }
  }
]

export default routes
