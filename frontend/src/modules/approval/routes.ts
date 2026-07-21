// 文件路径: frontend/src/modules/approval/routes.ts
// 功能: Approval模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'approval',
    name: 'Approval',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/approval/dashboard',
    children: [
      // 审批中心
      { path: 'dashboard', name: 'ApprovalDashboard', component: () => import('./pages/ApprovalDashboard.vue'), meta: { title: '审批中心', icon: 'DataLine' } },
      { path: 'my', name: 'MyApprovals', component: () => import('./pages/MyApprovals.vue'), meta: { title: '我的审批', icon: 'Document' } },
      { path: 'create', name: 'ApprovalCreate', component: () => import('./pages/ApprovalCreate.vue'), meta: { title: '新建审批', icon: 'Plus' } },
      { path: 'detail/:id', name: 'ApprovalDetail', component: () => import('./pages/ApprovalDetail.vue'), meta: { title: '审批详情', hidden: true } },
      
      // 审批模板
      { path: 'templates', name: 'ApprovalTemplates', component: () => import('./pages/ApprovalTemplates.vue'), meta: { title: '审批模板', icon: 'Files' } },
      { path: 'templates/create', name: 'ApprovalTemplateCreate', component: () => import('./pages/ApprovalTemplateCreate.vue'), meta: { title: '新建模板', hidden: true } },
      
      // 各类审批
      { path: 'purchase', name: 'PurchaseApproval', component: () => import('./pages/PurchaseApproval.vue'), meta: { title: '采购审批', icon: 'ShoppingCart' } },
      { path: 'payment', name: 'PaymentApproval', component: () => import('./pages/PaymentApproval.vue'), meta: { title: '付款审批', icon: 'Money' } },
      { path: 'expense', name: 'ExpenseApproval', component: () => import('./pages/ExpenseApproval.vue'), meta: { title: '费用审批', icon: 'Coin' } },
      { path: 'contract', name: 'ContractApproval', component: () => import('./pages/ContractApproval.vue'), meta: { title: '合同审批', icon: 'Document' } },
      { path: 'leave', name: 'LeaveApproval', component: () => import('./pages/LeaveApproval.vue'), meta: { title: '请假审批', icon: 'Calendar' } },
      { path: 'vehicle', name: 'VehicleApproval', component: () => import('./pages/VehicleApproval.vue'), meta: { title: '用车审批', icon: 'Van' } },
      
      // 审批设置
      { path: 'settings', name: 'ApprovalSettings', component: () => import('./pages/ApprovalSettings.vue'), meta: { title: '审批设置', icon: 'Setting' } },
    ],
  },
]

export default routes