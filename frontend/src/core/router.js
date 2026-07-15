/**
 * @file router.js
 * @description Vue Router 配置
 * @module core/router
 */

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { 
        path: '/', 
        redirect: '/dashboard'
    },
    { 
        path: '/login', 
        component: () => import('../views/Login.vue'),
        meta: { title: '登录', requiresAuth: false }
    },
    { 
        path: '/dashboard', 
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '仪表盘', requiresAuth: true }
    },
    { 
        path: '/new-module', 
        component: () => import('../views/new-module/Index.vue'),
        meta: { title: '新模块', requiresAuth: true }
    },
    { 
        path: '/:pathMatch(.*)*', 
        redirect: '/dashboard'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} | Bai's ERP` : 'Bai\'s ERP';
    
    const token = localStorage.getItem('accessToken');
    const requiresAuth = to.meta.requiresAuth !== false;

    if (requiresAuth && !token) {
        next('/login');
    } else if (to.path === '/login' && token) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;