/**
 * @file app.js
 * @description 应用核心入口 - 负责初始化所有模块
 * @module core/app
 */

import { router } from '@core/router.js';
import { store } from '@core/store.js';
import { auth } from '@core/auth.js';
import { config } from '@core/config.js';
import { mountLegacyGlobals } from '@compatibility/legacy-globals.js';

/**
 * 应用对象
 * @typedef {Object} App
 * @property {Function} init - 初始化应用
 * @property {Function} start - 启动应用
 * @property {Function} onReady - 就绪回调
 */

/** @type {App} */
export const app = {
    /** @type {boolean} 是否已初始化 */
    _initialized: false,
    
    /** @type {Function[]} 就绪回调列表 */
    _readyCallbacks: [],

    /**
     * 初始化应用
     * @param {Object} options - 初始化选项
     * @param {string} options.container - 页面容器选择器
     * @param {Function} options.onReady - 就绪回调
     * @returns {Promise<void>}
     */
    async init(options = {}) {
        if (this._initialized) {
            console.warn('[App] 应用已初始化，跳过重复初始化');
            return;
        }

        console.log('🚀 [App] 应用启动中...');
        console.log(`   📦 版本: ${config.version}`);
        console.log(`   🌍 环境: ${config.debug ? '开发' : '生产'}`);

        try {
            // 1. 挂载旧版全局兼容对象
            mountLegacyGlobals();
            
            // 2. 初始化状态管理
            store.init();
            
            // 3. 初始化认证
            await auth.init();
            
            // 4. 初始化路由
            router.init({
                container: options.container || '#page-content'
            });
            
            // 5. 绑定全局事件
            this._bindGlobalEvents();
            
            // 6. 处理加载进度
            this._handleLoadingComplete();
            
            this._initialized = true;
            
            // 7. 执行就绪回调
            this._readyCallbacks.forEach(cb => cb());
            if (options.onReady) options.onReady();
            
            console.log('✅ [App] 应用启动完成');
            
            // 触发自定义事件
            document.dispatchEvent(new CustomEvent('app:ready'));
            
        } catch (error) {
            console.error('❌ [App] 应用启动失败:', error);
            this._showError('应用启动失败，请刷新页面重试');
            throw error;
        }
    },

    /**
     * 绑定全局事件
     * @private
     */
    _bindGlobalEvents() {
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Ctrl+K 聚焦搜索
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.navbar-search input');
                if (searchInput) searchInput.focus();
            }
            // ESC 关闭模态框
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay.active');
                if (modal) {
                    const closeBtn = modal.querySelector('.modal-close');
                    if (closeBtn) closeBtn.click();
                }
            }
        });

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // 页面重新可见时刷新数据
                store.refresh();
            }
        });

        // 网络状态变化
        window.addEventListener('online', () => {
            console.log('[App] 网络已恢复');
            store.refresh();
        });

        window.addEventListener('offline', () => {
            console.warn('[App] 网络已断开');
        });
    },

    /**
     * 处理加载完成
     * @private
     */
    _handleLoadingComplete() {
        const loading = document.getElementById('app-loading');
        const appContainer = document.getElementById('app');
        
        if (loading) {
            loading.classList.add('fade-out');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }
        
        if (appContainer) {
            appContainer.style.display = 'flex';
        }
    },

    /**
     * 显示错误
     * @private
     * @param {string} message - 错误信息
     */
    _showError(message) {
        const container = document.getElementById('page-content');
        if (container) {
            container.innerHTML = `
                <div class="error-container" style="text-align:center;padding:60px 20px;">
                    <div style="font-size:64px;margin-bottom:20px;">⚠️</div>
                    <h2 style="font-size:24px;color:#374151;margin-bottom:12px;">加载失败</h2>
                    <p style="color:#6B7280;margin-bottom:24px;">${message}</p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        <i class="fas fa-sync"></i> 刷新页面
                    </button>
                </div>
            `;
        }
    },

    /**
     * 注册就绪回调
     * @param {Function} callback - 回调函数
     */
    onReady(callback) {
        if (this._initialized) {
            callback();
        } else {
            this._readyCallbacks.push(callback);
        }
    },

    /**
     * 获取应用状态
     * @returns {Object}
     */
    getState() {
        return {
            initialized: this._initialized,
            version: config.version,
            environment: config.debug ? 'development' : 'production'
        };
    }
};

export default app;