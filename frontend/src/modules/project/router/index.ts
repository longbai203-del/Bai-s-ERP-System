// project 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const projectRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/project/'
    },
    {
        path: '/project/',
        name: 'projectCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectApproval',
        component: () => import('../pages/ProjectApproval.vue'),
        meta: {
            title: 'ProjectApproval',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectBudget',
        component: () => import('../pages/ProjectBudget.vue'),
        meta: {
            title: 'ProjectBudget',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectCreate',
        component: () => import('../pages/ProjectCreate.vue'),
        meta: {
            title: 'ProjectCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectDetail',
        component: () => import('../pages/ProjectDetail.vue'),
        meta: {
            title: 'ProjectDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectDocuments',
        component: () => import('../pages/ProjectDocuments.vue'),
        meta: {
            title: 'ProjectDocuments',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectprojectEdit',
        component: () => import('../pages/projectEdit.vue'),
        meta: {
            title: 'projectEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectGantt',
        component: () => import('../pages/ProjectGantt.vue'),
        meta: {
            title: 'ProjectGantt',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectprojectList',
        component: () => import('../pages/projectList.vue'),
        meta: {
            title: 'projectList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectMilestones',
        component: () => import('../pages/ProjectMilestones.vue'),
        meta: {
            title: 'ProjectMilestones',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectProgress',
        component: () => import('../pages/ProjectProgress.vue'),
        meta: {
            title: 'ProjectProgress',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectRisks',
        component: () => import('../pages/ProjectRisks.vue'),
        meta: {
            title: 'ProjectRisks',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjects',
        component: () => import('../pages/Projects.vue'),
        meta: {
            title: 'Projects',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectTasks',
        component: () => import('../pages/ProjectTasks.vue'),
        meta: {
            title: 'ProjectTasks',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectTeam',
        component: () => import('../pages/ProjectTeam.vue'),
        meta: {
            title: 'ProjectTeam',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectProjectTimeline',
        component: () => import('../pages/ProjectTimeline.vue'),
        meta: {
            title: 'ProjectTimeline',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/project/',
        name: 'projectSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default projectRoutes
