// inventory 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const inventoryRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/inventory/'
    },
    {
        path: '/inventory/',
        name: 'inventoryAbcAnalysis',
        component: () => import('../pages/AbcAnalysis.vue'),
        meta: {
            title: 'AbcAnalysis',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryBatchManagement',
        component: () => import('../pages/BatchManagement.vue'),
        meta: {
            title: 'BatchManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryDeadStock',
        component: () => import('../pages/DeadStock.vue'),
        meta: {
            title: 'DeadStock',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryInventoryCreate',
        component: () => import('../pages/InventoryCreate.vue'),
        meta: {
            title: 'InventoryCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryInventoryDetail',
        component: () => import('../pages/InventoryDetail.vue'),
        meta: {
            title: 'InventoryDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryInventoryEdit',
        component: () => import('../pages/InventoryEdit.vue'),
        meta: {
            title: 'InventoryEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryInventoryList',
        component: () => import('../pages/InventoryList.vue'),
        meta: {
            title: 'InventoryList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryLocationManagement',
        component: () => import('../pages/LocationManagement.vue'),
        meta: {
            title: 'LocationManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventorySafetyStock',
        component: () => import('../pages/SafetyStock.vue'),
        meta: {
            title: 'SafetyStock',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventorySalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventorySerialNumber',
        component: () => import('../pages/SerialNumber.vue'),
        meta: {
            title: 'SerialNumber',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryShelfLife',
        component: () => import('../pages/ShelfLife.vue'),
        meta: {
            title: 'ShelfLife',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryStockAdjustment',
        component: () => import('../pages/StockAdjustment.vue'),
        meta: {
            title: 'StockAdjustment',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryStockAlert',
        component: () => import('../pages/StockAlert.vue'),
        meta: {
            title: 'StockAlert',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryStockCount',
        component: () => import('../pages/StockCount.vue'),
        meta: {
            title: 'StockCount',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryStockCountCreate',
        component: () => import('../pages/StockCountCreate.vue'),
        meta: {
            title: 'StockCountCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryStockFlow',
        component: () => import('../pages/StockFlow.vue'),
        meta: {
            title: 'StockFlow',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryStockForecast',
        component: () => import('../pages/StockForecast.vue'),
        meta: {
            title: 'StockForecast',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryStockFreeze',
        component: () => import('../pages/StockFreeze.vue'),
        meta: {
            title: 'StockFreeze',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryStockQuery',
        component: () => import('../pages/StockQuery.vue'),
        meta: {
            title: 'StockQuery',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryStockTransfer',
        component: () => import('../pages/StockTransfer.vue'),
        meta: {
            title: 'StockTransfer',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryStockTransferCreate',
        component: () => import('../pages/StockTransferCreate.vue'),
        meta: {
            title: 'StockTransferCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/',
        name: 'inventoryWarehouseMap',
        component: () => import('../pages/WarehouseMap.vue'),
        meta: {
            title: 'WarehouseMap',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default inventoryRoutes
