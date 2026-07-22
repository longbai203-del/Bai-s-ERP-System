// pos 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const posRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/pos/'
    },
    {
        path: '/pos/',
        name: 'posCashier',
        component: () => import('../pages/Cashier.vue'),
        meta: {
            title: 'Cashier',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posCashRegister',
        component: () => import('../pages/CashRegister.vue'),
        meta: {
            title: 'CashRegister',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posCouponManagement',
        component: () => import('../pages/CouponManagement.vue'),
        meta: {
            title: 'CouponManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posCustomerDisplay',
        component: () => import('../pages/CustomerDisplay.vue'),
        meta: {
            title: 'CustomerDisplay',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posDailyClose',
        component: () => import('../pages/DailyClose.vue'),
        meta: {
            title: 'DailyClose',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posExchange',
        component: () => import('../pages/Exchange.vue'),
        meta: {
            title: 'Exchange',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posKitchenDisplay',
        component: () => import('../pages/KitchenDisplay.vue'),
        meta: {
            title: 'KitchenDisplay',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posMemberPoints',
        component: () => import('../pages/MemberPoints.vue'),
        meta: {
            title: 'MemberPoints',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posOfflinePOS',
        component: () => import('../pages/OfflinePOS.vue'),
        meta: {
            title: 'OfflinePOS',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posPosCreate',
        component: () => import('../pages/PosCreate.vue'),
        meta: {
            title: 'PosCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posPosDetail',
        component: () => import('../pages/PosDetail.vue'),
        meta: {
            title: 'PosDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posPosEdit',
        component: () => import('../pages/PosEdit.vue'),
        meta: {
            title: 'PosEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posPosList',
        component: () => import('../pages/PosList.vue'),
        meta: {
            title: 'PosList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posQuickSale',
        component: () => import('../pages/QuickSale.vue'),
        meta: {
            title: 'QuickSale',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posReceipt',
        component: () => import('../pages/Receipt.vue'),
        meta: {
            title: 'Receipt',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posReturns',
        component: () => import('../pages/Returns.vue'),
        meta: {
            title: 'Returns',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posScanPayment',
        component: () => import('../pages/ScanPayment.vue'),
        meta: {
            title: 'ScanPayment',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/pos/',
        name: 'posTouchPOS',
        component: () => import('../pages/TouchPOS.vue'),
        meta: {
            title: 'TouchPOS',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default posRoutes
