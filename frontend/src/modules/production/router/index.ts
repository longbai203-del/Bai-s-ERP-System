// production 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const productionRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/production/'
    },
    {
        path: '/production/',
        name: 'productionBOM',
        component: () => import('../pages/BOM.vue'),
        meta: {
            title: 'BOM',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionBOMCreate',
        component: () => import('../pages/BOMCreate.vue'),
        meta: {
            title: 'BOMCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionBOMDetail',
        component: () => import('../pages/BOMDetail.vue'),
        meta: {
            title: 'BOMDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionEquipmentMaintenance',
        component: () => import('../pages/EquipmentMaintenance.vue'),
        meta: {
            title: 'EquipmentMaintenance',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionEquipmentManagement',
        component: () => import('../pages/EquipmentManagement.vue'),
        meta: {
            title: 'EquipmentManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionMaterialIssue',
        component: () => import('../pages/MaterialIssue.vue'),
        meta: {
            title: 'MaterialIssue',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionMRP',
        component: () => import('../pages/MRP.vue'),
        meta: {
            title: 'MRP',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionProductionComplete',
        component: () => import('../pages/ProductionComplete.vue'),
        meta: {
            title: 'ProductionComplete',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionProductionCost',
        component: () => import('../pages/ProductionCost.vue'),
        meta: {
            title: 'ProductionCost',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionproductionCreate',
        component: () => import('../pages/productionCreate.vue'),
        meta: {
            title: 'productionCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionproductionDetail',
        component: () => import('../pages/productionDetail.vue'),
        meta: {
            title: 'productionDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionproductionEdit',
        component: () => import('../pages/productionEdit.vue'),
        meta: {
            title: 'productionEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionproductionList',
        component: () => import('../pages/productionList.vue'),
        meta: {
            title: 'productionList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionProductionPlan',
        component: () => import('../pages/ProductionPlan.vue'),
        meta: {
            title: 'ProductionPlan',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionProductionPlanCreate',
        component: () => import('../pages/ProductionPlanCreate.vue'),
        meta: {
            title: 'ProductionPlanCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionQualityControl',
        component: () => import('../pages/QualityControl.vue'),
        meta: {
            title: 'QualityControl',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionWorkOrderCreate',
        component: () => import('../pages/WorkOrderCreate.vue'),
        meta: {
            title: 'WorkOrderCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/production/',
        name: 'productionWorkOrders',
        component: () => import('../pages/WorkOrders.vue'),
        meta: {
            title: 'WorkOrders',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default productionRoutes
