/**
 * @module orders/routes
 * @description Orders 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('./pages/OrdersList.vue'),
    meta: { title: 'Orders管理', requiresAuth: true }
  },
  {
    path: '/orders/create',
    name: 'OrdersCreate',
    component: () => import('./pages/OrdersCreate.vue'),
    meta: { title: '新建Orders', requiresAuth: true }
  },
  {
    path: '/orders/:id',
    name: 'OrdersDetail',
    component: () => import('./pages/OrdersDetail.vue'),
    meta: { title: 'Orders详情', requiresAuth: true }
  },
  {
    path: '/orders/:id/edit',
    name: 'OrdersEdit',
    component: () => import('./pages/OrdersEdit.vue'),
    meta: { title: '编辑Orders', requiresAuth: true }
  }
]

export default routes
