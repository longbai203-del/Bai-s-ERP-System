// saas 模块路由 (自动生成)
import type { RouteRecordRaw } from 'vue-router'

const saasRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/saas/'
  },
  {
    path: '/saas/Create',
    name: 'saasCreate',
    component: () => import('../pages/Create.vue'),
    meta: {
      title: 'Create',
      requiresAuth: true
    }  },
  {
    path: '/saas/Detail',
    name: 'saasDetail',
    component: () => import('../pages/Detail.vue'),
    meta: {
      title: 'Detail',
      requiresAuth: true
    }  },
  {
    path: '/saas/Edit',
    name: 'saasEdit',
    component: () => import('../pages/Edit.vue'),
    meta: {
      title: 'Edit',
      requiresAuth: true
    }  },
  {
    path: '/saas/FinanceDashboard',
    name: 'saasFinanceDashboard',
    component: () => import('../pages/FinanceDashboard.vue'),
    meta: {
      title: 'FinanceDashboard',
      requiresAuth: true
    }  },
  {
    path: '/saas/Index',
    name: 'saasIndex',
    component: () => import('../pages/Index.vue'),
    meta: {
      title: 'Index',
      requiresAuth: true
    }  },
  {
    path: '/saas/PlanCreate',
    name: 'saasPlanCreate',
    component: () => import('../pages/PlanCreate.vue'),
    meta: {
      title: 'PlanCreate',
      requiresAuth: true
    }  },
  {
    path: '/saas/PlanDetail',
    name: 'saasPlanDetail',
    component: () => import('../pages/PlanDetail.vue'),
    meta: {
      title: 'PlanDetail',
      requiresAuth: true
    }  },
  {
    path: '/saas/PlanEdit',
    name: 'saasPlanEdit',
    component: () => import('../pages/PlanEdit.vue'),
    meta: {
      title: 'PlanEdit',
      requiresAuth: true
    }  },
  {
    path: '/saas/Plans',
    name: 'saasPlans',
    component: () => import('../pages/Plans.vue'),
    meta: {
      title: 'Plans',
      requiresAuth: true
    }  },
  {
    path: '/saas/SaasAnalytics',
    name: 'saasSaasAnalytics',
    component: () => import('../pages/SaasAnalytics.vue'),
    meta: {
      title: 'SaasAnalytics',
      requiresAuth: true
    }  },
  {
    path: '/saas/SaasCreate',
    name: 'saasSaasCreate',
    component: () => import('../pages/SaasCreate.vue'),
    meta: {
      title: 'SaasCreate',
      requiresAuth: true
    }  },
  {
    path: '/saas/SaasDashboard',
    name: 'saasSaasDashboard',
    component: () => import('../pages/SaasDashboard.vue'),
    meta: {
      title: 'SaasDashboard',
      requiresAuth: true
    }  },
  {
    path: '/saas/SaasDetail',
    name: 'saasSaasDetail',
    component: () => import('../pages/SaasDetail.vue'),
    meta: {
      title: 'SaasDetail',
      requiresAuth: true
    }  },
  {
    path: '/saas/SaasEdit',
    name: 'saasSaasEdit',
    component: () => import('../pages/SaasEdit.vue'),
    meta: {
      title: 'SaasEdit',
      requiresAuth: true
    }  },
  {
    path: '/saas/SaasList',
    name: 'saasSaasList',
    component: () => import('../pages/SaasList.vue'),
    meta: {
      title: 'SaasList',
      requiresAuth: true
    }  },
  {
    path: '/saas/SubscriptionCreate',
    name: 'saasSubscriptionCreate',
    component: () => import('../pages/SubscriptionCreate.vue'),
    meta: {
      title: 'SubscriptionCreate',
      requiresAuth: true
    }  },
  {
    path: '/saas/SubscriptionDetail',
    name: 'saasSubscriptionDetail',
    component: () => import('../pages/SubscriptionDetail.vue'),
    meta: {
      title: 'SubscriptionDetail',
      requiresAuth: true
    }  },
  {
    path: '/saas/SubscriptionEdit',
    name: 'saasSubscriptionEdit',
    component: () => import('../pages/SubscriptionEdit.vue'),
    meta: {
      title: 'SubscriptionEdit',
      requiresAuth: true
    }  },
  {
    path: '/saas/Subscriptions',
    name: 'saasSubscriptions',
    component: () => import('../pages/Subscriptions.vue'),
    meta: {
      title: 'Subscriptions',
      requiresAuth: true
    }  },
  {
    path: '/saas/TenantCreate',
    name: 'saasTenantCreate',
    component: () => import('../pages/TenantCreate.vue'),
    meta: {
      title: 'TenantCreate',
      requiresAuth: true
    }  },
  {
    path: '/saas/TenantDetail',
    name: 'saasTenantDetail',
    component: () => import('../pages/TenantDetail.vue'),
    meta: {
      title: 'TenantDetail',
      requiresAuth: true
    }  },
  {
    path: '/saas/TenantEdit',
    name: 'saasTenantEdit',
    component: () => import('../pages/TenantEdit.vue'),
    meta: {
      title: 'TenantEdit',
      requiresAuth: true
    }  },
  {
    path: '/saas/Tenants',
    name: 'saasTenants',
    component: () => import('../pages/Tenants.vue'),
    meta: {
      title: 'Tenants',
      requiresAuth: true
    }  }
]

export default saasRoutes

