import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
]

export default routes
