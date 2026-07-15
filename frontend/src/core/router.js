/**
 * @file router.js
 * @description 客户端路由管理器
 * @module core/router
 */

import { store } from '@core/store.js';
import { auth } from '@core/auth.js';

/**
 * 路由配置项
 * @typedef {Object} RouteConfig
 * @property {string} path - 路由路径
 * @property {string} module - 模块名称
 * @property {string} title - 页面标题
 * @property {string} [icon] - 图标
 * @property {string[]} [permissions] - 所需权限
 * @property {boolean} [requiresAuth] - 是否需要认证
 */

/**
 * 路由配置
 * @type {RouteConfig[]}
 */
const routes = [
    { path: '/', module: 'dashboard', title: '仪表盘', icon: 'fa-chart-line', requiresAuth: true },
    { path: '/dashboard', module: 'dashboard', title: '仪表盘', icon: 'fa-chart-line', requiresAuth: true },
    { path: '/orders', module: 'orders', title: '订单管理', icon: 'fa-clipboard-list', requiresAuth: true },
    { path: '/products', module: 'products', title: '商品管理', icon: 'fa-box', requiresAuth: true },
    { path: '/customers', module: 'customers', title: '客户管理', icon: 'fa-users', requiresAuth: true },
    { path: '/inventory', module: 'inventory', title: '库存管理', icon: 'fa-warehouse', requiresAuth: true },
    { path: '/reports', module: 'reports', title: '报表管理', icon: 'fa-chart-bar', requiresAuth: true },
    { path: '/attendance', module: 'attendance', title: '考勤管理', icon: 'fa-clock', requiresAuth: true },
    { path: '/settings', module: 'settings', title: '系统设置', icon: 'fa-cog', requiresAuth: true },
    { path: '/login', module: 'login', title: '登录', requiresAuth: false },
    { path: '*', module: 'notfound', title: '页面未找到', requiresAuth: false }
];

/**
 * 模块路径映射
 */
const modulePathMap = {
    dashboard: '01-dashboard',
    orders: '03-orders',
    products: '04-products',
    customers: '05-customers',
    inventory: '07-inventory',
    reports: '09-finance',
    attendance: '10-hr',
    settings: '14-settings',
    login: 'login'
};

/**
 * 路由器对象
 * @typedef {Object} Router
 * @property {Function} init - 初始化路由器
 * @property {Function} navigate - 导航到指定路径
 * @property {Function} getCurrentRoute - 获取当前路由
 * @property {Function} getCurrentModule - 获取当前模块
 */

/** @type {Router} */
export const router = {
    /** @type {string} 当前路径 */
    _currentPath: '/',
    
    /** @type {string} 当前模块名 */
    _currentModule: 'dashboard',
    
    /** @type {string} 页面容器选择器 */
    _container: '#page-content',
    
    /** @type {Object} 模块缓存 */
    _moduleCache: new Map(),

    /**
     * 初始化路由器
     * @param {Object} options - 初始化选项
     * @param {string} options.container - 页面容器选择器
     */
    init(options = {}) {
        this._container = options.container || '#page-content';
        
        // 监听 hash 变化
        window.addEventListener('hashchange', () => {
            this._handleRoute();
        });
        
        // 监听 popstate
        window.addEventListener('popstate', () => {
            this._handleRoute();
        });
        
        // 初始路由
        this._handleRoute();
        
        console.log('✅ [Router] 已初始化');
    },

    /**
     * 处理路由
     * @private
     */
    async _handleRoute() {
        const hash = window.location.hash.replace('#', '') || '/';
        const path = hash.split('?')[0];
        
        // 查找匹配的路由
        let route = routes.find(r => r.path === path);
        if (!route) {
            // 尝试模糊匹配
            const matched = routes.find(r => path.startsWith(r.path));
            route = matched || routes.find(r => r.path === '*');
        }
        
        if (!route) {
            route = routes.find(r => r.path === '/');
        }
        
        await this._loadRoute(route);
    },

    /**
     * 加载路由
     * @private
     * @param {RouteConfig} route - 路由配置
     */
    async _loadRoute(route) {
        this._currentPath = route.path;
        this._currentModule = route.module;
        
        // 检查认证
        if (route.requiresAuth && !auth.isAuthenticated()) {
            this.navigate('/login');
            return;
        }
        
        // 更新页面标题
        document.title = `${route.title} - Bai's ERP`;
        
        // 更新面包屑
        this._updateBreadcrumb(route);
        
        // 加载模块
        await this._loadModule(route);
        
        // 更新导航状态
        this._updateNav(route.module);
    },

    /**
     * 加载模块
     * @private
     * @param {RouteConfig} route - 路由配置
     */
    async _loadModule(route) {
        const container = document.querySelector(this._container);
        if (!container) {
            console.error('[Router] 找不到页面容器');
            return;
        }
        
        // 显示加载状态
        container.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <div class="spinner" style="margin:0 auto;"></div>
                <p style="margin-top:16px;color:#6B7280;">加载中...</p>
            </div>
        `;
        
        try {
            const moduleName = route.module;
            const modulePath = this._getModulePath(moduleName);
            
            // 检查缓存
            let module = this._moduleCache.get(moduleName);
            if (!module) {
                module = await import(modulePath);
                this._moduleCache.set(moduleName, module);
            }
            
            // 执行模块渲染
            if (module.render) {
                await module.render(container);
            } else if (module.default && module.default.render) {
                await module.default.render(container);
            } else {
                // 尝试自动渲染
                await this._autoRender(container, moduleName);
            }
            
            // 执行初始化钩子
            if (module.init) {
                await module.init();
            }
            
            // 派发路由变化事件
            document.dispatchEvent(new CustomEvent('route:change', {
                detail: { route: route, module: moduleName }
            }));
            
            console.log(`✅ [Router] 加载模块: ${moduleName}`);
            
        } catch (error) {
            console.error(`❌ [Router] 加载模块失败:`, error);
            container.innerHTML = `
                <div style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
                    <h3 style="color:#374151;">模块加载失败</h3>
                    <p style="color:#6B7280;margin-top:8px;">${error.message || '请刷新页面重试'}</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top:16px;">
                        <i class="fas fa-sync"></i> 刷新
                    </button>
                </div>
            `;
        }
    },

    /**
     * 自动渲染（用于没有 render 函数的模块）
     * @private
     * @param {HTMLElement} container - 容器元素
     * @param {string} moduleName - 模块名称
     */
    async _autoRender(container, moduleName) {
        // 尝试加载模块的 HTML 模板
        try {
            const response = await fetch(`/src/modules/${modulePathMap[moduleName] || moduleName}/${moduleName}.html`);
            if (response.ok) {
                const html = await response.text();
                container.innerHTML = html;
                return;
            }
        } catch (e) {
            // 忽略
        }
        
        // 默认显示
        container.innerHTML = `
            <div style="padding:20px;">
                <h2>${moduleName}</h2>
                <p style="color:#6B7280;">模块内容加载中...</p>
            </div>
        `;
    },

    /**
     * 获取模块路径
     * @private
     * @param {string} moduleName - 模块名称
     * @returns {string}
     */
    _getModulePath(moduleName) {
        const folder = modulePathMap[moduleName] || moduleName;
        return `/src/modules/${folder}/index.js`;
    },

    /**
     * 更新面包屑
     * @private
     * @param {RouteConfig} route - 路由配置
     */
    _updateBreadcrumb(route) {
        const container = document.querySelector('.navbar-breadcrumb');
        if (!container) return;
        
        const parts = route.path.split('/').filter(Boolean);
        let html = `<span class="current">首页</span>`;
        
        if (parts.length > 0) {
            html += `<span class="separator">/</span>`;
            html += `<span class="current">${route.title}</span>`;
        }
        
        container.innerHTML = html;
    },

    /**
     * 更新导航状态
     * @private
     * @param {string} moduleName - 模块名称
     */
    _updateNav(moduleName) {
        // 移除所有活动状态
        document.querySelectorAll('.sidebar-link').forEach(el => {
            el.classList.remove('active');
        });
        
        // 添加活动状态
        const activeLink = document.querySelector(`.sidebar-link[data-module="${moduleName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    },

    /**
     * 导航到指定路径
     * @param {string} path - 路径
     * @param {Object} [params] - 查询参数
     */
    navigate(path, params = {}) {
        let url = path;
        if (Object.keys(params).length > 0) {
            const query = new URLSearchParams(params).toString();
            url += `?${query}`;
        }
        window.location.hash = url;
    },

    /**
     * 获取当前路径
     * @returns {string}
     */
    getCurrentPath() {
        return this._currentPath;
    },

    /**
     * 获取当前模块名
     * @returns {string}
     */
    getCurrentModule() {
        return this._currentModule;
    },

    /**
     * 获取路由配置
     * @returns {RouteConfig[]}
     */
    getRoutes() {
        return routes;
    }
};

export default router;