// orders 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const ordersRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/orders/'
    },
    {
        path: '/orders/',
        name: 'ordersCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersCustomerComplaint',
        component: () => import('../pages/CustomerComplaint.vue'),
        meta: {
            title: 'CustomerComplaint',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersCustomerCredit',
        component: () => import('../pages/CustomerCredit.vue'),
        meta: {
            title: 'CustomerCredit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersCustomerDebt',
        component: () => import('../pages/CustomerDebt.vue'),
        meta: {
            title: 'CustomerDebt',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersCustomerPayment',
        component: () => import('../pages/CustomerPayment.vue'),
        meta: {
            title: 'CustomerPayment',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersCustomerVisit',
        component: () => import('../pages/CustomerVisit.vue'),
        meta: {
            title: 'CustomerVisit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersList',
        component: () => import('../pages/List.vue'),
        meta: {
            title: 'List',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersOrderDetail',
        component: () => import('../pages/OrderDetail.vue'),
        meta: {
            title: 'OrderDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersOrderList',
        component: () => import('../pages/OrderList.vue'),
        meta: {
            title: 'OrderList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersOrders',
        component: () => import('../pages/Orders.vue'),
        meta: {
            title: 'Orders',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersOrdersCreate',
        component: () => import('../pages/OrdersCreate.vue'),
        meta: {
            title: 'OrdersCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersOrdersDetail',
        component: () => import('../pages/OrdersDetail.vue'),
        meta: {
            title: 'OrdersDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersOrdersEdit',
        component: () => import('../pages/OrdersEdit.vue'),
        meta: {
            title: 'OrdersEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersOrdersList',
        component: () => import('../pages/OrdersList.vue'),
        meta: {
            title: 'OrdersList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersPriceManagement',
        component: () => import('../pages/PriceManagement.vue'),
        meta: {
            title: 'PriceManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersQuotationCreate',
        component: () => import('../pages/QuotationCreate.vue'),
        meta: {
            title: 'QuotationCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersQuotationDetail',
        component: () => import('../pages/QuotationDetail.vue'),
        meta: {
            title: 'QuotationDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersQuotations',
        component: () => import('../pages/Quotations.vue'),
        meta: {
            title: 'Quotations',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersRefunds',
        component: () => import('../pages/Refunds.vue'),
        meta: {
            title: 'Refunds',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersReturns',
        component: () => import('../pages/Returns.vue'),
        meta: {
            title: 'Returns',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesAnalysis',
        component: () => import('../pages/SalesAnalysis.vue'),
        meta: {
            title: 'SalesAnalysis',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesContractCreate',
        component: () => import('../pages/SalesContractCreate.vue'),
        meta: {
            title: 'SalesContractCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesContractDetail',
        component: () => import('../pages/SalesContractDetail.vue'),
        meta: {
            title: 'SalesContractDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesContracts',
        component: () => import('../pages/SalesContracts.vue'),
        meta: {
            title: 'SalesContracts',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesForecast',
        component: () => import('../pages/SalesForecast.vue'),
        meta: {
            title: 'SalesForecast',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesOutbound',
        component: () => import('../pages/SalesOutbound.vue'),
        meta: {
            title: 'SalesOutbound',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesPerformance',
        component: () => import('../pages/SalesPerformance.vue'),
        meta: {
            title: 'SalesPerformance',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesRanking',
        component: () => import('../pages/SalesRanking.vue'),
        meta: {
            title: 'SalesRanking',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesReturns',
        component: () => import('../pages/SalesReturns.vue'),
        meta: {
            title: 'SalesReturns',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersSalesTarget',
        component: () => import('../pages/SalesTarget.vue'),
        meta: {
            title: 'SalesTarget',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/orders/',
        name: 'ordersServiceOrders',
        component: () => import('../pages/ServiceOrders.vue'),
        meta: {
            title: 'ServiceOrders',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default ordersRoutes
