// project 模块路由 (自动生成)
import type { RouteRecordRaw } from 'vue-router'

const projectRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/project/'
  },
  {
    path: '/project/Create',
    name: 'projectCreate',
    component: () => import('../pages/Create.vue'),
    meta: {
      title: 'Create',
      requiresAuth: true
    }  },
  {
    path: '/project/Detail',
    name: 'projectDetail',
    component: () => import('../pages/Detail.vue'),
    meta: {
      title: 'Detail',
      requiresAuth: true
    }  },
  {
    path: '/project/Edit',
    name: 'projectEdit',
    component: () => import('../pages/Edit.vue'),
    meta: {
      title: 'Edit',
      requiresAuth: true
    }  },
  {
    path: '/project/FinanceDashboard',
    name: 'projectFinanceDashboard',
    component: () => import('../pages/FinanceDashboard.vue'),
    meta: {
      title: 'FinanceDashboard',
      requiresAuth: true
    }  },
  {
    path: '/project/Index',
    name: 'projectIndex',
    component: () => import('../pages/Index.vue'),
    meta: {
      title: 'Index',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectApproval',
    name: 'projectProjectApproval',
    component: () => import('../pages/ProjectApproval.vue'),
    meta: {
      title: 'ProjectApproval',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectBudget',
    name: 'projectProjectBudget',
    component: () => import('../pages/ProjectBudget.vue'),
    meta: {
      title: 'ProjectBudget',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectCreate',
    name: 'projectProjectCreate',
    component: () => import('../pages/ProjectCreate.vue'),
    meta: {
      title: 'ProjectCreate',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectDashboard',
    name: 'projectProjectDashboard',
    component: () => import('../pages/ProjectDashboard.vue'),
    meta: {
      title: 'ProjectDashboard',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectDetail',
    name: 'projectProjectDetail',
    component: () => import('../pages/ProjectDetail.vue'),
    meta: {
      title: 'ProjectDetail',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectDocuments',
    name: 'projectProjectDocuments',
    component: () => import('../pages/ProjectDocuments.vue'),
    meta: {
      title: 'ProjectDocuments',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectGantt',
    name: 'projectProjectGantt',
    component: () => import('../pages/ProjectGantt.vue'),
    meta: {
      title: 'ProjectGantt',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectMilestones',
    name: 'projectProjectMilestones',
    component: () => import('../pages/ProjectMilestones.vue'),
    meta: {
      title: 'ProjectMilestones',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectProgress',
    name: 'projectProjectProgress',
    component: () => import('../pages/ProjectProgress.vue'),
    meta: {
      title: 'ProjectProgress',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectRisks',
    name: 'projectProjectRisks',
    component: () => import('../pages/ProjectRisks.vue'),
    meta: {
      title: 'ProjectRisks',
      requiresAuth: true
    }  },
  {
    path: '/project/Projects',
    name: 'projectProjects',
    component: () => import('../pages/Projects.vue'),
    meta: {
      title: 'Projects',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectTasks',
    name: 'projectProjectTasks',
    component: () => import('../pages/ProjectTasks.vue'),
    meta: {
      title: 'ProjectTasks',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectTeam',
    name: 'projectProjectTeam',
    component: () => import('../pages/ProjectTeam.vue'),
    meta: {
      title: 'ProjectTeam',
      requiresAuth: true
    }  },
  {
    path: '/project/ProjectTimeline',
    name: 'projectProjectTimeline',
    component: () => import('../pages/ProjectTimeline.vue'),
    meta: {
      title: 'ProjectTimeline',
      requiresAuth: true
    }  }
]

export default projectRoutes

