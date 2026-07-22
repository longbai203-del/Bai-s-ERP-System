// saas 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const saasRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/saas/'
    },
    {
        path: '/saas/',
        name: 'saasCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasPlanCreate',
        component: () => import('../pages/PlanCreate.vue'),
        meta: {
            title: 'PlanCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasPlanDetail',
        component: () => import('../pages/PlanDetail.vue'),
        meta: {
            title: 'PlanDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasPlanEdit',
        component: () => import('../pages/PlanEdit.vue'),
        meta: {
            title: 'PlanEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasPlans',
        component: () => import('../pages/Plans.vue'),
        meta: {
            title: 'Plans',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSaasAnalytics',
        component: () => import('../pages/SaasAnalytics.vue'),
        meta: {
            title: 'SaasAnalytics',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSaasCreate',
        component: () => import('../pages/SaasCreate.vue'),
        meta: {
            title: 'SaasCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSaasDashboard',
        component: () => import('../pages/SaasDashboard.vue'),
        meta: {
            title: 'SaasDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSaasDetail',
        component: () => import('../pages/SaasDetail.vue'),
        meta: {
            title: 'SaasDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSaasEdit',
        component: () => import('../pages/SaasEdit.vue'),
        meta: {
            title: 'SaasEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSaasList',
        component: () => import('../pages/SaasList.vue'),
        meta: {
            title: 'SaasList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSubscriptionCreate',
        component: () => import('../pages/SubscriptionCreate.vue'),
        meta: {
            title: 'SubscriptionCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSubscriptionDetail',
        component: () => import('../pages/SubscriptionDetail.vue'),
        meta: {
            title: 'SubscriptionDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSubscriptionEdit',
        component: () => import('../pages/SubscriptionEdit.vue'),
        meta: {
            title: 'SubscriptionEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasSubscriptions',
        component: () => import('../pages/Subscriptions.vue'),
        meta: {
            title: 'Subscriptions',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasTenantCreate',
        component: () => import('../pages/TenantCreate.vue'),
        meta: {
            title: 'TenantCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasTenantDetail',
        component: () => import('../pages/TenantDetail.vue'),
        meta: {
            title: 'TenantDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasTenantEdit',
        component: () => import('../pages/TenantEdit.vue'),
        meta: {
            title: 'TenantEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/saas/',
        name: 'saasTenants',
        component: () => import('../pages/Tenants.vue'),
        meta: {
            title: 'Tenants',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default saasRoutes
