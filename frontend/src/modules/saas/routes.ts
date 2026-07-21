// 文件路径: frontend/src/modules/saas/routes.ts
// 功能: SaaS模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'saas',
    name: 'SaaS',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/saas/dashboard',
    children: [
      // SaaS中心
      { path: 'dashboard', name: 'SaasDashboard', component: () => import('./pages/SaasDashboard.vue'), meta: { title: 'SaaS中心', icon: 'DataLine' } },
      
      // 租户管理
      { path: 'tenants', name: 'Tenants', component: () => import('./pages/Tenants.vue'), meta: { title: '租户管理', icon: 'User' } },
      { path: 'tenants/create', name: 'TenantCreate', component: () => import('./pages/TenantCreate.vue'), meta: { title: '新建租户', hidden: true } },
      { path: 'tenants/detail/:id', name: 'TenantDetail', component: () => import('./pages/TenantDetail.vue'), meta: { title: '租户详情', hidden: true } },
      { path: 'tenants/edit/:id', name: 'TenantEdit', component: () => import('./pages/TenantEdit.vue'), meta: { title: '编辑租户', hidden: true } },
      
      // 订阅管理
      { path: 'subscriptions', name: 'Subscriptions', component: () => import('./pages/Subscriptions.vue'), meta: { title: '订阅管理', icon: 'Money' } },
      { path: 'subscriptions/create', name: 'SubscriptionCreate', component: () => import('./pages/SubscriptionCreate.vue'), meta: { title: '创建订阅', hidden: true } },
      { path: 'subscriptions/detail/:id', name: 'SubscriptionDetail', component: () => import('./pages/SubscriptionDetail.vue'), meta: { title: '订阅详情', hidden: true } },
      { path: 'subscriptions/edit/:id', name: 'SubscriptionEdit', component: () => import('./pages/SubscriptionEdit.vue'), meta: { title: '编辑订阅', hidden: true } },
      
      // 套餐管理
      { path: 'plans', name: 'Plans', component: () => import('./pages/Plans.vue'), meta: { title: '套餐管理', icon: 'Box' } },
      { path: 'plans/create', name: 'PlanCreate', component: () => import('./pages/PlanCreate.vue'), meta: { title: '创建套餐', hidden: true } },
      { path: 'plans/detail/:id', name: 'PlanDetail', component: () => import('./pages/PlanDetail.vue'), meta: { title: '套餐详情', hidden: true } },
      { path: 'plans/edit/:id', name: 'PlanEdit', component: () => import('./pages/PlanEdit.vue'), meta: { title: '编辑套餐', hidden: true } },
      
      // SaaS分析
      { path: 'analytics', name: 'SaasAnalytics', component: () => import('./pages/SaasAnalytics.vue'), meta: { title: 'SaaS分析', icon: 'TrendCharts' } },
    ],
  },
]

export default routes