// 文件路径: frontend/src/modules/hr/routes.ts
// 功能: HR模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'hr',
    name: 'HR',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/hr/employees',
    children: [
      // 员工管理
      { path: 'employees', name: 'Employees', component: () => import('./pages/Employees.vue'), meta: { title: '员工管理', icon: 'User' } },
      { path: 'employees/create', name: 'EmployeeCreate', component: () => import('./pages/EmployeeCreate.vue'), meta: { title: '新增员工', hidden: true } },
      { path: 'employees/detail/:id', name: 'EmployeeDetail', component: () => import('./pages/EmployeeDetail.vue'), meta: { title: '员工详情', hidden: true } },
      { path: 'employees/profile/:id', name: 'EmployeeProfile', component: () => import('./pages/EmployeeProfile.vue'), meta: { title: '员工档案', hidden: true } },
      
      // 组织管理
      { path: 'organization', name: 'Organization', component: () => import('./pages/Organization.vue'), meta: { title: '组织架构', icon: 'Share' } },
      { path: 'positions', name: 'Positions', component: () => import('./pages/Positions.vue'), meta: { title: '岗位管理', icon: 'Office' } },
      
      // 招聘入职
      { path: 'recruitment', name: 'Recruitment', component: () => import('./pages/Recruitment.vue'), meta: { title: '招聘管理', icon: 'Search' } },
      { path: 'onboarding', name: 'Onboarding', component: () => import('./pages/Onboarding.vue'), meta: { title: '入职管理', icon: 'UserFilled' } },
      
      // 合同管理
      { path: 'contracts', name: 'Contracts', component: () => import('./pages/Contracts.vue'), meta: { title: '合同管理', icon: 'Document' } },
      
      // 考勤排班
      { path: 'attendance', name: 'Attendance', component: () => import('./pages/Attendance.vue'), meta: { title: '考勤管理', icon: 'Clock' } },
      { path: 'shift', name: 'ShiftManagement', component: () => import('./pages/ShiftManagement.vue'), meta: { title: '排班管理', icon: 'Calendar' } },
      
      // 请假加班
      { path: 'leave', name: 'LeaveManagement', component: () => import('./pages/LeaveManagement.vue'), meta: { title: '请假管理', icon: 'Bell' } },
      { path: 'overtime', name: 'Overtime', component: () => import('./pages/Overtime.vue'), meta: { title: '加班管理', icon: 'Clock' } },
      
      // 薪酬绩效
      { path: 'payroll', name: 'Payroll', component: () => import('./pages/Payroll.vue'), meta: { title: '工资管理', icon: 'Money' } },
      { path: 'performance', name: 'Performance', component: () => import('./pages/Performance.vue'), meta: { title: '绩效管理', icon: 'Trophy' } },
      
      // 培训发展
      { path: 'training', name: 'Training', component: () => import('./pages/Training.vue'), meta: { title: '培训管理', icon: 'Reading' } },
      
      // 证件签证
      { path: 'certificates', name: 'Certificates', component: () => import('./pages/Certificates.vue'), meta: { title: '证件管理', icon: 'Document' } },
      { path: 'visa', name: 'VisaManagement', component: () => import('./pages/VisaManagement.vue'), meta: { title: '签证管理', icon: 'Passport' } },
      { path: 'iqama', name: 'IqamaManagement', component: () => import('./pages/IqamaManagement.vue'), meta: { title: 'Iqama管理', icon: 'Document' } },
      
      // 保险
      { path: 'insurance', name: 'Insurance', component: () => import('./pages/Insurance.vue'), meta: { title: '保险管理', icon: 'Shield' } },
      
      // 离职管理
      { path: 'resignation', name: 'Resignation', component: () => import('./pages/Resignation.vue'), meta: { title: '离职管理', icon: 'Remove' } },
      
      // 员工档案
      { path: 'files', name: 'EmployeeFiles', component: () => import('./pages/EmployeeFiles.vue'), meta: { title: '员工档案', icon: 'Folder' } },
    ],
  },
]

export default routes