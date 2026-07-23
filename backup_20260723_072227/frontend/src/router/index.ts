import { createRouter, createWebHistory } from 'vue-router'

// 自动导入所有模块路由
const modules = import.meta.glob('../modules/*/router/*.ts', { eager: true })

const baseRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/auth/pages/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const moduleRoutes = []
Object.keys(modules).forEach((key) => {
  const module = modules[key]
  if (module?.default) {
    const routes = module.default
    if (Array.isArray(routes)) {
      moduleRoutes.push(...routes)
    } else {
      moduleRoutes.push(routes)
    }
  }
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes, ...moduleRoutes],
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    if (token) { next('/dashboard') } else { next() }
    return
  }
  if (!token && !to.meta?.hidden) {
    next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    return
  }
  next()
})

export default router
