/**
 * @module products/routes
 * @description Products 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'Products',
    component: () => import('./pages/ProductsList.vue'),
    meta: { title: 'Products管理', requiresAuth: true }
  },
  {
    path: '/products/create',
    name: 'ProductsCreate',
    component: () => import('./pages/ProductsCreate.vue'),
    meta: { title: '新建Products', requiresAuth: true }
  },
  {
    path: '/products/:id',
    name: 'ProductsDetail',
    component: () => import('./pages/ProductsDetail.vue'),
    meta: { title: 'Products详情', requiresAuth: true }
  },
  {
    path: '/products/:id/edit',
    name: 'ProductsEdit',
    component: () => import('./pages/ProductsEdit.vue'),
    meta: { title: '编辑Products', requiresAuth: true }
  }
]

export default routes
