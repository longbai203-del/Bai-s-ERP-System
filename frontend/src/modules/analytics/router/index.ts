// analytics 模块路由 (自动生成)
import type { RouteRecordRaw } from 'vue-router'

const analyticsRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/analytics/'
  },
  {
    path: '/analytics/AnalyticsCreate',
    name: 'analyticsAnalyticsCreate',
    component: () => import('../pages/AnalyticsCreate.vue'),
    meta: {
      title: 'AnalyticsCreate',
      requiresAuth: true
    }  },
  {
    path: '/analytics/AnalyticsDashboard',
    name: 'analyticsAnalyticsDashboard',
    component: () => import('../pages/AnalyticsDashboard.vue'),
    meta: {
      title: 'AnalyticsDashboard',
      requiresAuth: true
    }  },
  {
    path: '/analytics/ChannelAnalytics',
    name: 'analyticsChannelAnalytics',
    component: () => import('../pages/ChannelAnalytics.vue'),
    meta: {
      title: 'ChannelAnalytics',
      requiresAuth: true
    }  },
  {
    path: '/analytics/ChannelAnalyticsDetail',
    name: 'analyticsChannelAnalyticsDetail',
    component: () => import('../pages/ChannelAnalyticsDetail.vue'),
    meta: {
      title: 'ChannelAnalyticsDetail',
      requiresAuth: true
    }  },
  {
    path: '/analytics/ComparisonAnalysis',
    name: 'analyticsComparisonAnalysis',
    component: () => import('../pages/ComparisonAnalysis.vue'),
    meta: {
      title: 'ComparisonAnalysis',
      requiresAuth: true
    }  },
  {
    path: '/analytics/ComparisonAnalysisDetail',
    name: 'analyticsComparisonAnalysisDetail',
    component: () => import('../pages/ComparisonAnalysisDetail.vue'),
    meta: {
      title: 'ComparisonAnalysisDetail',
      requiresAuth: true
    }  },
  {
    path: '/analytics/Create',
    name: 'analyticsCreate',
    component: () => import('../pages/Create.vue'),
    meta: {
      title: 'Create',
      requiresAuth: true
    }  },
  {
    path: '/analytics/CustomerAnalytics',
    name: 'analyticsCustomerAnalytics',
    component: () => import('../pages/CustomerAnalytics.vue'),
    meta: {
      title: 'CustomerAnalytics',
      requiresAuth: true
    }  },
  {
    path: '/analytics/CustomerAnalyticsDetail',
    name: 'analyticsCustomerAnalyticsDetail',
    component: () => import('../pages/CustomerAnalyticsDetail.vue'),
    meta: {
      title: 'CustomerAnalyticsDetail',
      requiresAuth: true
    }  },
  {
    path: '/analytics/Detail',
    name: 'analyticsDetail',
    component: () => import('../pages/Detail.vue'),
    meta: {
      title: 'Detail',
      requiresAuth: true
    }  },
  {
    path: '/analytics/Edit',
    name: 'analyticsEdit',
    component: () => import('../pages/Edit.vue'),
    meta: {
      title: 'Edit',
      requiresAuth: true
    }  },
  {
    path: '/analytics/Index',
    name: 'analyticsIndex',
    component: () => import('../pages/Index.vue'),
    meta: {
      title: 'Index',
      requiresAuth: true
    }  },
  {
    path: '/analytics/ProductAnalytics',
    name: 'analyticsProductAnalytics',
    component: () => import('../pages/ProductAnalytics.vue'),
    meta: {
      title: 'ProductAnalytics',
      requiresAuth: true
    }  },
  {
    path: '/analytics/ProductAnalyticsDetail',
    name: 'analyticsProductAnalyticsDetail',
    component: () => import('../pages/ProductAnalyticsDetail.vue'),
    meta: {
      title: 'ProductAnalyticsDetail',
      requiresAuth: true
    }  },
  {
    path: '/analytics/SalesAnalytics',
    name: 'analyticsSalesAnalytics',
    component: () => import('../pages/SalesAnalytics.vue'),
    meta: {
      title: 'SalesAnalytics',
      requiresAuth: true
    }  },
  {
    path: '/analytics/SalesAnalyticsDetail',
    name: 'analyticsSalesAnalyticsDetail',
    component: () => import('../pages/SalesAnalyticsDetail.vue'),
    meta: {
      title: 'SalesAnalyticsDetail',
      requiresAuth: true
    }  },
  {
    path: '/analytics/TrendAnalysis',
    name: 'analyticsTrendAnalysis',
    component: () => import('../pages/TrendAnalysis.vue'),
    meta: {
      title: 'TrendAnalysis',
      requiresAuth: true
    }  },
  {
    path: '/analytics/TrendAnalysisDetail',
    name: 'analyticsTrendAnalysisDetail',
    component: () => import('../pages/TrendAnalysisDetail.vue'),
    meta: {
      title: 'TrendAnalysisDetail',
      requiresAuth: true
    }  }
]

export default analyticsRoutes

