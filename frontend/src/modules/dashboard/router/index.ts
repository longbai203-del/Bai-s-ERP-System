// dashboard 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const dashboardRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/dashboard/'
    },
    {
        path: '/dashboard/',
        name: 'dashboardBusinessAnalysis',
        component: () => import('../pages/BusinessAnalysis.vue'),
        meta: {
            title: 'BusinessAnalysis',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardDashboard',
        component: () => import('../pages/Dashboard.vue'),
        meta: {
            title: 'Dashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardDashboardCreate',
        component: () => import('../pages/DashboardCreate.vue'),
        meta: {
            title: 'DashboardCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardDashboardDetail',
        component: () => import('../pages/DashboardDetail.vue'),
        meta: {
            title: 'DashboardDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardDashboardEdit',
        component: () => import('../pages/DashboardEdit.vue'),
        meta: {
            title: 'DashboardEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardDashboardList',
        component: () => import('../pages/DashboardList.vue'),
        meta: {
            title: 'DashboardList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardExecutiveDashboard',
        component: () => import('../pages/ExecutiveDashboard.vue'),
        meta: {
            title: 'ExecutiveDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardPerformanceDashboard',
        component: () => import('../pages/PerformanceDashboard.vue'),
        meta: {
            title: 'PerformanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardProfitAnalysis',
        component: () => import('../pages/ProfitAnalysis.vue'),
        meta: {
            title: 'ProfitAnalysis',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardPurchaseDashboard',
        component: () => import('../pages/PurchaseDashboard.vue'),
        meta: {
            title: 'PurchaseDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard/',
        name: 'dashboardSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default dashboardRoutes
