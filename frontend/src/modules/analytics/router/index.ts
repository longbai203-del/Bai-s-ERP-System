// analytics 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const analyticsRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/analytics/'
    },
    {
        path: '/analytics/',
        name: 'analyticsAnalyticsCreate',
        component: () => import('../pages/AnalyticsCreate.vue'),
        meta: {
            title: 'AnalyticsCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsAnalyticsDashboard',
        component: () => import('../pages/AnalyticsDashboard.vue'),
        meta: {
            title: 'AnalyticsDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsAnalyticsDetail',
        component: () => import('../pages/AnalyticsDetail.vue'),
        meta: {
            title: 'AnalyticsDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsAnalyticsEdit',
        component: () => import('../pages/AnalyticsEdit.vue'),
        meta: {
            title: 'AnalyticsEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsAnalyticsList',
        component: () => import('../pages/AnalyticsList.vue'),
        meta: {
            title: 'AnalyticsList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsChannelAnalytics',
        component: () => import('../pages/ChannelAnalytics.vue'),
        meta: {
            title: 'ChannelAnalytics',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsChannelAnalyticsDetail',
        component: () => import('../pages/ChannelAnalyticsDetail.vue'),
        meta: {
            title: 'ChannelAnalyticsDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsComparisonAnalysis',
        component: () => import('../pages/ComparisonAnalysis.vue'),
        meta: {
            title: 'ComparisonAnalysis',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsComparisonAnalysisDetail',
        component: () => import('../pages/ComparisonAnalysisDetail.vue'),
        meta: {
            title: 'ComparisonAnalysisDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsCustomerAnalytics',
        component: () => import('../pages/CustomerAnalytics.vue'),
        meta: {
            title: 'CustomerAnalytics',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsCustomerAnalyticsDetail',
        component: () => import('../pages/CustomerAnalyticsDetail.vue'),
        meta: {
            title: 'CustomerAnalyticsDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsProductAnalytics',
        component: () => import('../pages/ProductAnalytics.vue'),
        meta: {
            title: 'ProductAnalytics',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsProductAnalyticsDetail',
        component: () => import('../pages/ProductAnalyticsDetail.vue'),
        meta: {
            title: 'ProductAnalyticsDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsSalesAnalytics',
        component: () => import('../pages/SalesAnalytics.vue'),
        meta: {
            title: 'SalesAnalytics',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsSalesAnalyticsDetail',
        component: () => import('../pages/SalesAnalyticsDetail.vue'),
        meta: {
            title: 'SalesAnalyticsDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsTrendAnalysis',
        component: () => import('../pages/TrendAnalysis.vue'),
        meta: {
            title: 'TrendAnalysis',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/analytics/',
        name: 'analyticsTrendAnalysisDetail',
        component: () => import('../pages/TrendAnalysisDetail.vue'),
        meta: {
            title: 'TrendAnalysisDetail',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default analyticsRoutes
