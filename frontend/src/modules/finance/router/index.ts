// finance 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const financeRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/finance/'
    },
    {
        path: '/finance/',
        name: 'financeAccountsPayable',
        component: () => import('../pages/AccountsPayable.vue'),
        meta: {
            title: 'AccountsPayable',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeAccountsReceivable',
        component: () => import('../pages/AccountsReceivable.vue'),
        meta: {
            title: 'AccountsReceivable',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeBankManagement',
        component: () => import('../pages/BankManagement.vue'),
        meta: {
            title: 'BankManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeBudgetManagement',
        component: () => import('../pages/BudgetManagement.vue'),
        meta: {
            title: 'BudgetManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeCashFlow',
        component: () => import('../pages/CashFlow.vue'),
        meta: {
            title: 'CashFlow',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeCashManagement',
        component: () => import('../pages/CashManagement.vue'),
        meta: {
            title: 'CashManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeCostCenter',
        component: () => import('../pages/CostCenter.vue'),
        meta: {
            title: 'CostCenter',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeDepreciation',
        component: () => import('../pages/Depreciation.vue'),
        meta: {
            title: 'Depreciation',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeElectronicInvoice',
        component: () => import('../pages/ElectronicInvoice.vue'),
        meta: {
            title: 'ElectronicInvoice',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeExpenseCreate',
        component: () => import('../pages/ExpenseCreate.vue'),
        meta: {
            title: 'ExpenseCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeExpenses',
        component: () => import('../pages/Expenses.vue'),
        meta: {
            title: 'Expenses',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeFinanceCreate',
        component: () => import('../pages/FinanceCreate.vue'),
        meta: {
            title: 'FinanceCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeFinanceDetail',
        component: () => import('../pages/FinanceDetail.vue'),
        meta: {
            title: 'FinanceDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeFinanceEdit',
        component: () => import('../pages/FinanceEdit.vue'),
        meta: {
            title: 'FinanceEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeFinanceList',
        component: () => import('../pages/FinanceList.vue'),
        meta: {
            title: 'FinanceList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeFinancialAnalysis',
        component: () => import('../pages/FinancialAnalysis.vue'),
        meta: {
            title: 'FinancialAnalysis',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeFixedAssets',
        component: () => import('../pages/FixedAssets.vue'),
        meta: {
            title: 'FixedAssets',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeGeneralLedger',
        component: () => import('../pages/GeneralLedger.vue'),
        meta: {
            title: 'GeneralLedger',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeJournalEntries',
        component: () => import('../pages/JournalEntries.vue'),
        meta: {
            title: 'JournalEntries',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeJournalEntryCreate',
        component: () => import('../pages/JournalEntryCreate.vue'),
        meta: {
            title: 'JournalEntryCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financePaymentCreate',
        component: () => import('../pages/PaymentCreate.vue'),
        meta: {
            title: 'PaymentCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financePayments',
        component: () => import('../pages/Payments.vue'),
        meta: {
            title: 'Payments',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeReceiptCreate',
        component: () => import('../pages/ReceiptCreate.vue'),
        meta: {
            title: 'ReceiptCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeReceipts',
        component: () => import('../pages/Receipts.vue'),
        meta: {
            title: 'Receipts',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeReimbursement',
        component: () => import('../pages/Reimbursement.vue'),
        meta: {
            title: 'Reimbursement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeSaudiVat',
        component: () => import('../pages/SaudiVat.vue'),
        meta: {
            title: 'SaudiVat',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeSaudiZatca',
        component: () => import('../pages/SaudiZatca.vue'),
        meta: {
            title: 'SaudiZatca',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/finance/',
        name: 'financeTaxManagement',
        component: () => import('../pages/TaxManagement.vue'),
        meta: {
            title: 'TaxManagement',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default financeRoutes
