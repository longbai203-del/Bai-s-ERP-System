// hr 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const hrRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/hr/'
    },
    {
        path: '/hr/',
        name: 'hrAttendance',
        component: () => import('../pages/Attendance.vue'),
        meta: {
            title: 'Attendance',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrCertificates',
        component: () => import('../pages/Certificates.vue'),
        meta: {
            title: 'Certificates',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrContracts',
        component: () => import('../pages/Contracts.vue'),
        meta: {
            title: 'Contracts',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrEmployeeCreate',
        component: () => import('../pages/EmployeeCreate.vue'),
        meta: {
            title: 'EmployeeCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrEmployeeDetail',
        component: () => import('../pages/EmployeeDetail.vue'),
        meta: {
            title: 'EmployeeDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrEmployeeFiles',
        component: () => import('../pages/EmployeeFiles.vue'),
        meta: {
            title: 'EmployeeFiles',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrEmployeeProfile',
        component: () => import('../pages/EmployeeProfile.vue'),
        meta: {
            title: 'EmployeeProfile',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrEmployees',
        component: () => import('../pages/Employees.vue'),
        meta: {
            title: 'Employees',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrHrCreate',
        component: () => import('../pages/HrCreate.vue'),
        meta: {
            title: 'HrCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrHrDetail',
        component: () => import('../pages/HrDetail.vue'),
        meta: {
            title: 'HrDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrHrEdit',
        component: () => import('../pages/HrEdit.vue'),
        meta: {
            title: 'HrEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrHrList',
        component: () => import('../pages/HrList.vue'),
        meta: {
            title: 'HrList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrInsurance',
        component: () => import('../pages/Insurance.vue'),
        meta: {
            title: 'Insurance',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrIqamaManagement',
        component: () => import('../pages/IqamaManagement.vue'),
        meta: {
            title: 'IqamaManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrLeaveManagement',
        component: () => import('../pages/LeaveManagement.vue'),
        meta: {
            title: 'LeaveManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrOnboarding',
        component: () => import('../pages/Onboarding.vue'),
        meta: {
            title: 'Onboarding',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrOrganization',
        component: () => import('../pages/Organization.vue'),
        meta: {
            title: 'Organization',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrOvertime',
        component: () => import('../pages/Overtime.vue'),
        meta: {
            title: 'Overtime',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrPayroll',
        component: () => import('../pages/Payroll.vue'),
        meta: {
            title: 'Payroll',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrPerformance',
        component: () => import('../pages/Performance.vue'),
        meta: {
            title: 'Performance',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrPositions',
        component: () => import('../pages/Positions.vue'),
        meta: {
            title: 'Positions',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrRecruitment',
        component: () => import('../pages/Recruitment.vue'),
        meta: {
            title: 'Recruitment',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrResignation',
        component: () => import('../pages/Resignation.vue'),
        meta: {
            title: 'Resignation',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrShiftManagement',
        component: () => import('../pages/ShiftManagement.vue'),
        meta: {
            title: 'ShiftManagement',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrTraining',
        component: () => import('../pages/Training.vue'),
        meta: {
            title: 'Training',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/hr/',
        name: 'hrVisaManagement',
        component: () => import('../pages/VisaManagement.vue'),
        meta: {
            title: 'VisaManagement',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default hrRoutes
