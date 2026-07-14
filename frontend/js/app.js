/**
 * @file app.js
 * @description 应用主入口文件
 */

import { init as initCore } from './core/init.js';
import { router } from './core/router.js';
import { store } from './core/store.js';

// 应用对象
const app = {
    /**
     * 初始化应用
     */
    init() {
        console.log('🚀 应用启动中...');
        
        // 初始化核心功能
        initCore();
        
        // 初始化路由
        if (router && router.init) {
            router.init();
        }
        
        // 初始化 store
        if (store && store.init) {
            store.init();
        }
        
        console.log('✅ 应用启动完成');
    }
};

// DOM加载完成后启动应用
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    app.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
}

export default app;