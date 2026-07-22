// customers 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const customersRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/customers/'
    },
    {
        path: '/customers/',
        name: 'customersCoupons',
        component: () => import('../pages/Coupons.vue'),
        meta: {
            title: 'Coupons',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomerAfterSale',
        component: () => import('../pages/CustomerAfterSale.vue'),
        meta: {
            title: 'CustomerAfterSale',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomerAnalysis',
        component: () => import('../pages/CustomerAnalysis.vue'),
        meta: {
            title: 'CustomerAnalysis',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomerFollowup',
        component: () => import('../pages/CustomerFollowup.vue'),
        meta: {
            title: 'CustomerFollowup',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomerFollowupCreate',
        component: () => import('../pages/CustomerFollowupCreate.vue'),
        meta: {
            title: 'CustomerFollowupCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomerLevel',
        component: () => import('../pages/CustomerLevel.vue'),
        meta: {
            title: 'CustomerLevel',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomerLifecycle',
        component: () => import('../pages/CustomerLifecycle.vue'),
        meta: {
            title: 'CustomerLifecycle',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomerMap',
        component: () => import('../pages/CustomerMap.vue'),
        meta: {
            title: 'CustomerMap',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomerProfile',
        component: () => import('../pages/CustomerProfile.vue'),
        meta: {
            title: 'CustomerProfile',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomers',
        component: () => import('../pages/Customers.vue'),
        meta: {
            title: 'Customers',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomersCreate',
        component: () => import('../pages/CustomersCreate.vue'),
        meta: {
            title: 'CustomersCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomersDetail',
        component: () => import('../pages/CustomersDetail.vue'),
        meta: {
            title: 'CustomersDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomersEdit',
        component: () => import('../pages/CustomersEdit.vue'),
        meta: {
            title: 'CustomersEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomersList',
        component: () => import('../pages/CustomersList.vue'),
        meta: {
            title: 'CustomersList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomerSource',
        component: () => import('../pages/CustomerSource.vue'),
        meta: {
            title: 'CustomerSource',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersCustomerTags',
        component: () => import('../pages/CustomerTags.vue'),
        meta: {
            title: 'CustomerTags',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersFeedback',
        component: () => import('../pages/Feedback.vue'),
        meta: {
            title: 'Feedback',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersGiftCards',
        component: () => import('../pages/GiftCards.vue'),
        meta: {
            title: 'GiftCards',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersMembership',
        component: () => import('../pages/Membership.vue'),
        meta: {
            title: 'Membership',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersOpportunities',
        component: () => import('../pages/Opportunities.vue'),
        meta: {
            title: 'Opportunities',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersOpportunityCreate',
        component: () => import('../pages/OpportunityCreate.vue'),
        meta: {
            title: 'OpportunityCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersSalesFunnel',
        component: () => import('../pages/SalesFunnel.vue'),
        meta: {
            title: 'SalesFunnel',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersVehicles',
        component: () => import('../pages/Vehicles.vue'),
        meta: {
            title: 'Vehicles',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/customers/',
        name: 'customersWallet',
        component: () => import('../pages/Wallet.vue'),
        meta: {
            title: 'Wallet',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default customersRoutes
