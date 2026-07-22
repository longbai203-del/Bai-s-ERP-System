// settings 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const settingsRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/settings/'
    },
    {
        path: '/settings/',
        name: 'settingsBackupSettings',
        component: () => import('../pages/BackupSettings.vue'),
        meta: {
            title: 'BackupSettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsCompanyProfile',
        component: () => import('../pages/CompanyProfile.vue'),
        meta: {
            title: 'CompanyProfile',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsCurrencySettings',
        component: () => import('../pages/CurrencySettings.vue'),
        meta: {
            title: 'CurrencySettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsEmailSettings',
        component: () => import('../pages/EmailSettings.vue'),
        meta: {
            title: 'EmailSettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsExchangeRate',
        component: () => import('../pages/ExchangeRate.vue'),
        meta: {
            title: 'ExchangeRate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsLicenseSettings',
        component: () => import('../pages/LicenseSettings.vue'),
        meta: {
            title: 'LicenseSettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsLogoManagement',
        component: () => import('../pages/LogoManagement.vue'),
        meta: {
            title: 'LogoManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsPaymentSettings',
        component: () => import('../pages/PaymentSettings.vue'),
        meta: {
            title: 'PaymentSettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsPrintTemplate',
        component: () => import('../pages/PrintTemplate.vue'),
        meta: {
            title: 'PrintTemplate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsSaudiInvoiceSettings',
        component: () => import('../pages/SaudiInvoiceSettings.vue'),
        meta: {
            title: 'SaudiInvoiceSettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsSaudiVATSettings',
        component: () => import('../pages/SaudiVATSettings.vue'),
        meta: {
            title: 'SaudiVATSettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingssettingsCreate',
        component: () => import('../pages/settingsCreate.vue'),
        meta: {
            title: 'settingsCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingssettingsDetail',
        component: () => import('../pages/settingsDetail.vue'),
        meta: {
            title: 'settingsDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingssettingsEdit',
        component: () => import('../pages/settingsEdit.vue'),
        meta: {
            title: 'settingsEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingssettingsList',
        component: () => import('../pages/settingsList.vue'),
        meta: {
            title: 'settingsList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsSMSSettings',
        component: () => import('../pages/SMSSettings.vue'),
        meta: {
            title: 'SMSSettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsSystemParameters',
        component: () => import('../pages/SystemParameters.vue'),
        meta: {
            title: 'SystemParameters',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsTaxSettings',
        component: () => import('../pages/TaxSettings.vue'),
        meta: {
            title: 'TaxSettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsThemeSettings',
        component: () => import('../pages/ThemeSettings.vue'),
        meta: {
            title: 'ThemeSettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/settings/',
        name: 'settingsWhatsAppSettings',
        component: () => import('../pages/WhatsAppSettings.vue'),
        meta: {
            title: 'WhatsAppSettings',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default settingsRoutes
