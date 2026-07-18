/**
 * @module customers/routes
 * @description Customers 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('./pages/CustomersList.vue'),
    meta: { title: 'Customers管理', requiresAuth: true }
  },
  {
    path: '/customers/create',
    name: 'CustomersCreate',
    component: () => import('./pages/CustomersCreate.vue'),
    meta: { title: '新建Customers', requiresAuth: true }
  },
  {
    path: '/customers/:id',
    name: 'CustomersDetail',
    component: () => import('./pages/CustomersDetail.vue'),
    meta: { title: 'Customers详情', requiresAuth: true }
  },
  {
    path: '/customers/:id/edit',
    name: 'CustomersEdit',
    component: () => import('./pages/CustomersEdit.vue'),
    meta: { title: '编辑Customers', requiresAuth: true }
  }
]

export default routes
