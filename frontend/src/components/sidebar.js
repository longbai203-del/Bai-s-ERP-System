/**
 * @file sidebar.js
 * @description 侧边栏组件
 * @module components/sidebar
 */

import { auth } from '@core/auth.js';
import { router } from '@core/router.js';
import { store } from '@core/store.js';

/**
 * 侧边栏配置
 */
const MENU_ITEMS = [
    { module: 'dashboard', label: '仪表盘', icon: 'fa-chart-line', path: '/dashboard' },
    { module: 'orders', label: '订单管理', icon: 'fa-clipboard-list', path: '/orders' },
    { module: 'products', label: '商品管理', icon: 'fa-box', path: '/products' },
    { module: 'customers', label: '客户管理', icon: 'fa-users', path: '/customers' },
    { module: 'inventory', label: '库存管理', icon: 'fa-warehouse', path: '/inventory' },
    { module: 'reports', label: '报表管理', icon: 'fa-chart-bar', path: '/reports' },
    { module: 'attendance', label: '考勤管理', icon: 'fa-clock', path: '/attendance' },
    { module: 'settings', label: '系统设置', icon: 'fa-cog', path: '/settings' }
];

/**
 * 侧边栏组件
 */
export const sidebar = {
    /** @type {HTMLElement} 容器元素 */
    _container: null,

    /** @type {boolean} 是否已折叠 */
    _collapsed: false,

    /** @type {boolean} 是否已初始化 */
    _initialized: false,

    /**
     * 渲染侧边栏
     * @param {HTMLElement} container - 容器元素
     * @param {Object} options - 渲染选项
     * @param {string} options.activeModule - 当前激活的模块
     * @param {boolean} options.collapsed - 是否折叠
     */
    render(container, options = {}) {
        this._container = container;
        this._collapsed = options.collapsed || false;

        const user = auth.getCurrentUser();
        const activeModule = options.activeModule || router.getCurrentModule() || 'dashboard';
        const isMobile = window.innerWidth <= 768;

        // 移动端默认折叠
        if (isMobile) {
            this._collapsed = true;
        }

        let html = `
            <div class="sidebar-header">
                <a href="#/" class="sidebar-logo">
                    <div class="logo-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div>
                        <span class="logo-text">Bai's ERP</span>
                        <span class="logo-version">v2.0</span>
                    </div>
                </a>
                <button class="sidebar-toggle-btn" id="sidebarCollapseBtn" aria-label="折叠侧边栏">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>

            <nav class="sidebar-nav" role="navigation" aria-label="主导航">
        `;

        // 获取用户权限
        const userPermissions = user?.permissions || [];

        MENU_ITEMS.forEach(item => {
            // 检查权限
            if (user && !userPermissions.includes(item.module) && user.role !== 'owner' && user.role !== 'admin') {
                return;
            }

            const isActive = activeModule === item.module;
            html += `
                <a href="#${item.path}" 
                   class="sidebar-link ${isActive ? 'active' : ''}" 
                   data-module="${item.module}"
                   data-path="${item.path}"
                   aria-current="${isActive ? 'page' : 'false'}">
                    <span class="icon"><i class="fas ${item.icon}"></i></span>
                    <span>${item.label}</span>
                </a>
            `;
        });

        html += `
            </nav>

            <div class="sidebar-footer">
                <div class="sidebar-user">
                    <div class="user-avatar">
                        ${user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div class="user-info">
                        <div class="user-name">${user?.name || '访客'}</div>
                        <div class="user-role">${user?.role || '未登录'}</div>
                    </div>
                </div>
                <button class="sidebar-logout" id="sidebarLogout" aria-label="退出登录">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;

        container.innerHTML = html;
        this._initialized = true;

        // 应用折叠状态
        this.setCollapsed(this._collapsed);

        this._bindEvents();

        console.log('✅ [Sidebar] 已渲染');
    },

    /**
     * 绑定事件
     * @private
     */
    _bindEvents() {
        // 折叠切换
        const collapseBtn = document.getElementById('sidebarCollapseBtn');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => {
                this.toggleCollapse();
            });
        }

        // 侧边栏链接点击
        this._container?.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.dataset.path || link.getAttribute('href');
                if (path) {
                    router.navigate(path);
                }
                
                // 移动端点击后自动关闭
                if (window.innerWidth <= 768) {
                    this._container.classList.remove('mobile-open');
                    document.getElementById('sidebarOverlay')?.remove();
                }
            });
        });

        // 退出登录
        const logoutBtn = document.getElementById('sidebarLogout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await auth.logout();
                router.navigate('/login');
                window.location.reload();
            });
        }

        // 移动端侧边栏切换
        document.addEventListener('sidebar:toggle', () => {
            this._toggleMobile();
        });

        // 窗口大小变化
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const isMobile = window.innerWidth <= 768;
                if (!isMobile) {
                    // 桌面端关闭移动端覆盖层
                    this._container?.classList.remove('mobile-open');
                    document.getElementById('sidebarOverlay')?.remove();
                }
            }, 200);
        });

        // 点击外部关闭移动端侧边栏
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const sidebar = this._container;
                const toggleBtn = document.querySelector('.mobile-menu-toggle');
                if (sidebar?.classList.contains('mobile-open') && 
                    !sidebar.contains(e.target) && 
                    !toggleBtn?.contains(e.target)) {
                    this._container.classList.remove('mobile-open');
                    document.getElementById('sidebarOverlay')?.remove();
                }
            }
        });
    },

    /**
     * 切换折叠状态
     */
    toggleCollapse() {
        this._collapsed = !this._collapsed;
        this.setCollapsed(this._collapsed);
        store.set('sidebarCollapsed', this._collapsed);
    },

    /**
     * 设置折叠状态
     * @param {boolean} collapsed - 是否折叠
     */
    setCollapsed(collapsed) {
        this._collapsed = collapsed;
        if (this._container) {
            if (collapsed) {
                this._container.classList.add('collapsed');
                const btn = document.getElementById('sidebarCollapseBtn');
                if (btn) {
                    btn.querySelector('i').className = 'fas fa-chevron-right';
                }
            } else {
                this._container.classList.remove('collapsed');
                const btn = document.getElementById('sidebarCollapseBtn');
                if (btn) {
                    btn.querySelector('i').className = 'fas fa-chevron-left';
                }
            }
        }
    },

    /**
     * 切换移动端显示
     * @private
     */
    _toggleMobile() {
        if (window.innerWidth > 768) return;

        const isOpen = this._container?.classList.contains('mobile-open');
        if (isOpen) {
            this._container.classList.remove('mobile-open');
            document.getElementById('sidebarOverlay')?.remove();
        } else {
            this._container.classList.add('mobile-open');
            // 添加遮罩
            const overlay = document.createElement('div');
            overlay.id = 'sidebarOverlay';
            overlay.className = 'sidebar-overlay active';
            overlay.addEventListener('click', () => {
                this._container.classList.remove('mobile-open');
                overlay.remove();
            });
            document.body.appendChild(overlay);
        }
    },

    /**
     * 设置当前激活的模块
     * @param {string} moduleName - 模块名称
     */
    setActive(moduleName) {
        this._container?.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.toggle('active', link.dataset.module === moduleName);
        });
    },

    /**
     * 更新用户信息
     */
    updateUserInfo() {
        const user = auth.getCurrentUser();
        const avatar = this._container?.querySelector('.user-avatar');
        const userName = this._container?.querySelector('.user-name');
        const userRole = this._container?.querySelector('.user-role');

        if (avatar) {
            avatar.textContent = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
        }
        if (userName) {
            userName.textContent = user?.name || '访客';
        }
        if (userRole) {
            userRole.textContent = user?.role || '未登录';
        }
    },

    /**
     * 销毁组件
     */
    destroy() {
        this._container = null;
        this._initialized = false;
        console.log('✅ [Sidebar] 已销毁');
    }
};

export default sidebar;