/**
 * @file navbar.js
 * @description 顶部导航栏组件
 * @module components/navbar
 */

import { auth } from '@core/auth.js';
import { store } from '@core/store.js';
import { router } from '@core/router.js';

/**
 * 导航栏组件
 */
export const navbar = {
    /** @type {HTMLElement} 容器元素 */
    _container: null,

    /** @type {boolean} 是否已初始化 */
    _initialized: false,

    /**
     * 渲染导航栏
     * @param {HTMLElement} container - 容器元素
     * @param {Object} options - 渲染选项
     * @param {string} options.breadcrumb - 当前页面标题
     * @param {number} options.notificationCount - 通知数量
     */
    render(container, options = {}) {
        this._container = container;
        const user = auth.getCurrentUser();
        const notificationCount = options.notificationCount || 0;
        const breadcrumb = options.breadcrumb || '首页';

        container.innerHTML = `
            <nav class="navbar" role="navigation" aria-label="主导航">
                <!-- 左侧 -->
                <div class="navbar-left">
                    <button class="navbar-btn mobile-menu-toggle" id="mobileMenuToggle" aria-label="切换菜单">
                        <i class="fas fa-bars"></i>
                    </button>
                    <div class="navbar-breadcrumb">
                        <span class="current">${breadcrumb}</span>
                    </div>
                </div>

                <!-- 右侧 -->
                <div class="navbar-right">
                    <!-- 搜索 -->
                    <div class="navbar-search">
                        <i class="fas fa-search icon"></i>
                        <input 
                            type="text" 
                            placeholder="搜索..." 
                            id="globalSearch"
                            aria-label="全局搜索"
                            title="快捷键: Ctrl+K"
                        >
                        <kbd class="search-shortcut">Ctrl+K</kbd>
                    </div>

                    <!-- 通知 -->
                    <button class="navbar-btn" id="notificationBtn" aria-label="通知">
                        <i class="fas fa-bell"></i>
                        ${notificationCount > 0 ? `<span class="badge">${notificationCount > 99 ? '99+' : notificationCount}</span>` : ''}
                    </button>

                    <!-- 用户信息 -->
                    <div class="navbar-user" id="userMenu">
                        <button class="navbar-btn user-avatar" id="userMenuBtn" aria-label="用户菜单">
                            <div class="avatar-circle" style="width:32px;height:32px;border-radius:50%;background:var(--color-primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">
                                ${user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </button>
                        <div class="user-dropdown" id="userDropdown" style="display:none;">
                            <div class="dropdown-header">
                                <div class="dropdown-user-name">${user?.name || '用户'}</div>
                                <div class="dropdown-user-role">${user?.role || '未认证'}</div>
                            </div>
                            <div class="dropdown-divider"></div>
                            <a href="#/profile" class="dropdown-item" data-nav="profile">
                                <i class="fas fa-user"></i> 个人信息
                            </a>
                            <a href="#/settings" class="dropdown-item" data-nav="settings">
                                <i class="fas fa-cog"></i> 系统设置
                            </a>
                            <div class="dropdown-divider"></div>
                            <button class="dropdown-item dropdown-danger" id="logoutBtn">
                                <i class="fas fa-sign-out-alt"></i> 退出登录
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- 通知下拉 -->
            <div class="notification-dropdown" id="notificationDropdown" style="display:none;">
                <div class="dropdown-header">
                    <span>通知</span>
                    <button class="mark-all-read" id="markAllRead">全部已读</button>
                </div>
                <div class="notification-list" id="notificationList">
                    <div class="notification-empty">暂无通知</div>
                </div>
            </div>
        `;

        this._initialized = true;
        this._bindEvents();

        console.log('✅ [Navbar] 已渲染');
    },

    /**
     * 绑定事件
     * @private
     */
    _bindEvents() {
        // 用户菜单下拉
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = userDropdown.style.display === 'block';
                userDropdown.style.display = isOpen ? 'none' : 'block';
            });
        }

        // 点击外部关闭下拉
        document.addEventListener('click', (e) => {
            const userMenu = document.getElementById('userMenu');
            if (userMenu && !userMenu.contains(e.target)) {
                const dropdown = document.getElementById('userDropdown');
                if (dropdown) dropdown.style.display = 'none';
            }
            const notificationBtn = document.getElementById('notificationBtn');
            const notificationDropdown = document.getElementById('notificationDropdown');
            if (notificationBtn && notificationDropdown && !notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.style.display = 'none';
            }
        });

        // 退出登录
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await auth.logout();
                router.navigate('/login');
                // 重新加载页面以重置状态
                window.location.reload();
            });
        }

        // 通知按钮
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationDropdown = document.getElementById('notificationDropdown');
        if (notificationBtn && notificationDropdown) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = notificationDropdown.style.display === 'block';
                notificationDropdown.style.display = isOpen ? 'none' : 'block';
                if (!isOpen) {
                    this._loadNotifications();
                }
            });
        }

        // 全部已读
        const markAllRead = document.getElementById('markAllRead');
        if (markAllRead) {
            markAllRead.addEventListener('click', () => {
                this._markAllRead();
            });
        }

        // 全局搜索
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        router.navigate('/search', { q: query });
                        searchInput.blur();
                    }
                }
            });
        }

        // 移动端菜单切换
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('sidebar:toggle'));
            });
        }

        // 键盘快捷键 Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('globalSearch');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });

        // 导航项点击
        document.querySelectorAll('.dropdown-item[data-nav]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                if (href) {
                    router.navigate(href.replace('#', ''));
                }
                const dropdown = document.getElementById('userDropdown');
                if (dropdown) dropdown.style.display = 'none';
            });
        });
    },

    /**
     * 加载通知
     * @private
     */
    async _loadNotifications() {
        const list = document.getElementById('notificationList');
        if (!list) return;

        try {
            // 模拟加载通知
            const notifications = [
                { id: 1, title: '新订单', message: '订单 #ORD-2026-0001 已创建', time: '5分钟前', read: false },
                { id: 2, title: '库存预警', message: '商品 "泡沫洗车液" 库存不足 10', time: '15分钟前', read: false },
                { id: 3, title: '客户反馈', message: '客户 张伟 提交了评价', time: '1小时前', read: true }
            ];

            if (notifications.length === 0) {
                list.innerHTML = '<div class="notification-empty">暂无通知</div>';
                return;
            }

            list.innerHTML = notifications.map(n => `
                <div class="notification-item ${n.read ? 'read' : 'unread'}">
                    <div class="notification-content">
                        <div class="notification-title">${n.title}</div>
                        <div class="notification-message">${n.message}</div>
                        <div class="notification-time">${n.time}</div>
                    </div>
                    ${!n.read ? '<span class="notification-dot"></span>' : ''}
                </div>
            `).join('');

        } catch (error) {
            console.error('[Navbar] 加载通知失败:', error);
            list.innerHTML = '<div class="notification-empty">加载失败</div>';
        }
    },

    /**
     * 标记全部已读
     * @private
     */
    _markAllRead() {
        const items = document.querySelectorAll('.notification-item.unread');
        items.forEach(item => {
            item.classList.remove('unread');
            item.classList.add('read');
            const dot = item.querySelector('.notification-dot');
            if (dot) dot.remove();
        });

        const badge = document.querySelector('.notification-btn .badge');
        if (badge) badge.remove();

        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 500);
        }
    },

    /**
     * 更新面包屑
     * @param {string} title - 页面标题
     */
    updateBreadcrumb(title) {
        const breadcrumb = this._container?.querySelector('.navbar-breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `<span class="current">${title}</span>`;
        }
    },

    /**
     * 更新通知数量
     * @param {number} count - 通知数量
     */
    updateNotificationCount(count) {
        const btn = this._container?.querySelector('#notificationBtn');
        if (!btn) return;

        const existingBadge = btn.querySelector('.badge');
        if (existingBadge) existingBadge.remove();

        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = count > 99 ? '99+' : String(count);
            btn.appendChild(badge);
        }
    },

    /**
     * 更新用户信息
     */
    updateUserInfo() {
        const user = auth.getCurrentUser();
        const avatar = this._container?.querySelector('.avatar-circle');
        const userName = this._container?.querySelector('.dropdown-user-name');
        const userRole = this._container?.querySelector('.dropdown-user-role');

        if (avatar) {
            avatar.textContent = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
        }
        if (userName) {
            userName.textContent = user?.name || '用户';
        }
        if (userRole) {
            userRole.textContent = user?.role || '未认证';
        }
    },

    /**
     * 销毁组件
     */
    destroy() {
        this._container = null;
        this._initialized = false;
        console.log('✅ [Navbar] 已销毁');
    }
};

export default navbar;