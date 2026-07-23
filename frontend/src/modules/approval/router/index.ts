// approval 模块路由 (自动生成)
import type { RouteRecordRaw } from 'vue-router'

const approvalRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/approval/'
  },
  {
    path: '/approval/ApprovalCreate',
    name: 'approvalApprovalCreate',
    component: () => import('../pages/ApprovalCreate.vue'),
    meta: {
      title: 'ApprovalCreate',
      requiresAuth: true
    }  },
  {
    path: '/approval/ApprovalDashboard',
    name: 'approvalApprovalDashboard',
    component: () => import('../pages/ApprovalDashboard.vue'),
    meta: {
      title: 'ApprovalDashboard',
      requiresAuth: true
    }  },
  {
    path: '/approval/ApprovalDetail',
    name: 'approvalApprovalDetail',
    component: () => import('../pages/ApprovalDetail.vue'),
    meta: {
      title: 'ApprovalDetail',
      requiresAuth: true
    }  },
  {
    path: '/approval/approvalEdit',
    name: 'approvalapprovalEdit',
    component: () => import('../pages/approvalEdit.vue'),
    meta: {
      title: 'approvalEdit',
      requiresAuth: true
    }  },
  {
    path: '/approval/ApprovalSettings',
    name: 'approvalApprovalSettings',
    component: () => import('../pages/ApprovalSettings.vue'),
    meta: {
      title: 'ApprovalSettings',
      requiresAuth: true
    }  },
  {
    path: '/approval/ApprovalTemplateCreate',
    name: 'approvalApprovalTemplateCreate',
    component: () => import('../pages/ApprovalTemplateCreate.vue'),
    meta: {
      title: 'ApprovalTemplateCreate',
      requiresAuth: true
    }  },
  {
    path: '/approval/ApprovalTemplates',
    name: 'approvalApprovalTemplates',
    component: () => import('../pages/ApprovalTemplates.vue'),
    meta: {
      title: 'ApprovalTemplates',
      requiresAuth: true
    }  },
  {
    path: '/approval/ContractApproval',
    name: 'approvalContractApproval',
    component: () => import('../pages/ContractApproval.vue'),
    meta: {
      title: 'ContractApproval',
      requiresAuth: true
    }  },
  {
    path: '/approval/Create',
    name: 'approvalCreate',
    component: () => import('../pages/Create.vue'),
    meta: {
      title: 'Create',
      requiresAuth: true
    }  },
  {
    path: '/approval/Detail',
    name: 'approvalDetail',
    component: () => import('../pages/Detail.vue'),
    meta: {
      title: 'Detail',
      requiresAuth: true
    }  },
  {
    path: '/approval/Edit',
    name: 'approvalEdit',
    component: () => import('../pages/Edit.vue'),
    meta: {
      title: 'Edit',
      requiresAuth: true
    }  },
  {
    path: '/approval/ExpenseApproval',
    name: 'approvalExpenseApproval',
    component: () => import('../pages/ExpenseApproval.vue'),
    meta: {
      title: 'ExpenseApproval',
      requiresAuth: true
    }  },
  {
    path: '/approval/Index',
    name: 'approvalIndex',
    component: () => import('../pages/Index.vue'),
    meta: {
      title: 'Index',
      requiresAuth: true
    }  },
  {
    path: '/approval/LeaveApproval',
    name: 'approvalLeaveApproval',
    component: () => import('../pages/LeaveApproval.vue'),
    meta: {
      title: 'LeaveApproval',
      requiresAuth: true
    }  },
  {
    path: '/approval/MyApprovals',
    name: 'approvalMyApprovals',
    component: () => import('../pages/MyApprovals.vue'),
    meta: {
      title: 'MyApprovals',
      requiresAuth: true
    }  },
  {
    path: '/approval/PaymentApproval',
    name: 'approvalPaymentApproval',
    component: () => import('../pages/PaymentApproval.vue'),
    meta: {
      title: 'PaymentApproval',
      requiresAuth: true
    }  },
  {
    path: '/approval/PurchaseApproval',
    name: 'approvalPurchaseApproval',
    component: () => import('../pages/PurchaseApproval.vue'),
    meta: {
      title: 'PurchaseApproval',
      requiresAuth: true
    }  },
  {
    path: '/approval/VehicleApproval',
    name: 'approvalVehicleApproval',
    component: () => import('../pages/VehicleApproval.vue'),
    meta: {
      title: 'VehicleApproval',
      requiresAuth: true
    }  }
]

export default approvalRoutes

