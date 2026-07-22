// system 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const systemRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/system/'
    },
    {
        path: '/system/',
        name: 'systemApiPermissions',
        component: () => import('../pages/ApiPermissions.vue'),
        meta: {
            title: 'ApiPermissions',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemBackupRestore',
        component: () => import('../pages/BackupRestore.vue'),
        meta: {
            title: 'BackupRestore',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemButtonPermissions',
        component: () => import('../pages/ButtonPermissions.vue'),
        meta: {
            title: 'ButtonPermissions',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemCurrency',
        component: () => import('../pages/Currency.vue'),
        meta: {
            title: 'Currency',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemDictionary',
        component: () => import('../pages/Dictionary.vue'),
        meta: {
            title: 'Dictionary',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemLanguage',
        component: () => import('../pages/Language.vue'),
        meta: {
            title: 'Language',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemLicenseManagement',
        component: () => import('../pages/LicenseManagement.vue'),
        meta: {
            title: 'LicenseManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemLoginLogs',
        component: () => import('../pages/LoginLogs.vue'),
        meta: {
            title: 'LoginLogs',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemMenuManagement',
        component: () => import('../pages/MenuManagement.vue'),
        meta: {
            title: 'MenuManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemNotification',
        component: () => import('../pages/Notification.vue'),
        meta: {
            title: 'Notification',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemOperationLogs',
        component: () => import('../pages/OperationLogs.vue'),
        meta: {
            title: 'OperationLogs',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemRegion',
        component: () => import('../pages/Region.vue'),
        meta: {
            title: 'Region',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemRolePermissions',
        component: () => import('../pages/RolePermissions.vue'),
        meta: {
            title: 'RolePermissions',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemRoles',
        component: () => import('../pages/Roles.vue'),
        meta: {
            title: 'Roles',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemSystemCreate',
        component: () => import('../pages/SystemCreate.vue'),
        meta: {
            title: 'SystemCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemSystemDetail',
        component: () => import('../pages/SystemDetail.vue'),
        meta: {
            title: 'SystemDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemSystemEdit',
        component: () => import('../pages/SystemEdit.vue'),
        meta: {
            title: 'SystemEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemSystemList',
        component: () => import('../pages/SystemList.vue'),
        meta: {
            title: 'SystemList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemSystemParameters',
        component: () => import('../pages/SystemParameters.vue'),
        meta: {
            title: 'SystemParameters',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemThemeManagement',
        component: () => import('../pages/ThemeManagement.vue'),
        meta: {
            title: 'ThemeManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/system/',
        name: 'systemWebhookManagement',
        component: () => import('../pages/WebhookManagement.vue'),
        meta: {
            title: 'WebhookManagement',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default systemRoutes
