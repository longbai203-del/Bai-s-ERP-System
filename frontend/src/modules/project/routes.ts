// 文件路径: frontend/src/modules/project/routes.ts
// 功能: Project模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'project',
    name: 'Project',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/project/list',
    children: [
      // 项目列表
      { path: 'list', name: 'Projects', component: () => import('./pages/Projects.vue'), meta: { title: '项目列表', icon: 'List' } },
      { path: 'create', name: 'ProjectCreate', component: () => import('./pages/ProjectCreate.vue'), meta: { title: '新建项目', hidden: true } },
      { path: 'detail/:id', name: 'ProjectDetail', component: () => import('./pages/ProjectDetail.vue'), meta: { title: '项目详情', hidden: true } },
      
      // 项目视图
      { path: 'gantt', name: 'ProjectGantt', component: () => import('./pages/ProjectGantt.vue'), meta: { title: '甘特图', icon: 'Histogram' } },
      { path: 'tasks', name: 'ProjectTasks', component: () => import('./pages/ProjectTasks.vue'), meta: { title: '任务管理', icon: 'Edit' } },
      { path: 'budget', name: 'ProjectBudget', component: () => import('./pages/ProjectBudget.vue'), meta: { title: '项目预算', icon: 'Money' } },
      { path: 'progress', name: 'ProjectProgress', component: () => import('./pages/ProjectProgress.vue'), meta: { title: '项目进度', icon: 'TrendCharts' } },
      { path: 'timeline', name: 'ProjectTimeline', component: () => import('./pages/ProjectTimeline.vue'), meta: { title: '项目时间线', icon: 'Clock' } },
      
      // 团队与里程碑
      { path: 'team', name: 'ProjectTeam', component: () => import('./pages/ProjectTeam.vue'), meta: { title: '团队管理', icon: 'User' } },
      { path: 'milestones', name: 'ProjectMilestones', component: () => import('./pages/ProjectMilestones.vue'), meta: { title: '里程碑', icon: 'Flag' } },
      
      // 风险与文档
      { path: 'risks', name: 'ProjectRisks', component: () => import('./pages/ProjectRisks.vue'), meta: { title: '风险管理', icon: 'Warning' } },
      { path: 'documents', name: 'ProjectDocuments', component: () => import('./pages/ProjectDocuments.vue'), meta: { title: '文档管理', icon: 'Document' } },
      
      // 审批
      { path: 'approval', name: 'ProjectApproval', component: () => import('./pages/ProjectApproval.vue'), meta: { title: '项目审批', icon: 'Check' } },
    ],
  },
]

export default routes