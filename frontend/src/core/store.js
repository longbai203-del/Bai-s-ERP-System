/**
 * @file store.js
 * @description 全局状态管理
 * @module core/store
 */

/**
 * 状态管理器
 * @typedef {Object} Store
 * @property {Function} init - 初始化存储
 * @property {Function} get - 获取状态
 * @property {Function} set - 设置状态
 * @property {Function} subscribe - 订阅状态变化
 * @property {Function} refresh - 刷新所有数据
 * @property {Function} clear - 清空状态
 */

/** @type {Store} */
export const store = {
    /** @type {Object} 状态数据 */
    _state: {},
    
    /** @type {Object} 状态监听器 */
    _listeners: {},
    
    /** @type {string} 存储前缀 */
    _prefix: 'app_store_',

    /**
     * 初始化存储
     */
    init() {
        // 从 localStorage 恢复状态
        try {
            const saved = localStorage.getItem(`${this._prefix}state`);
            if (saved) {
                this._state = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('[Store] 恢复状态失败:', e);
        }
        
        console.log('✅ [Store] 已初始化');
    },

    /**
     * 获取状态值
     * @param {string} key - 键名
     * @param {*} defaultValue - 默认值
     * @returns {*}
     */
    get(key, defaultValue = null) {
        return this._state[key] !== undefined ? this._state[key] : defaultValue;
    },

    /**
     * 设置状态值
     * @param {string} key - 键名
     * @param {*} value - 值
     * @param {boolean} persist - 是否持久化
     */
    set(key, value, persist = true) {
        const oldValue = this._state[key];
        this._state[key] = value;
        
        // 触发监听器
        if (this._listeners[key]) {
            this._listeners[key].forEach(callback => {
                try {
                    callback(value, oldValue);
                } catch (e) {
                    console.error('[Store] 监听器执行失败:', e);
                }
            });
        }
        
        // 持久化
        if (persist) {
            this._persist();
        }
    },

    /**
     * 批量设置状态
     * @param {Object} updates - 更新对象
     * @param {boolean} persist - 是否持久化
     */
    setMultiple(updates, persist = true) {
        Object.entries(updates).forEach(([key, value]) => {
            const oldValue = this._state[key];
            this._state[key] = value;
            
            if (this._listeners[key]) {
                this._listeners[key].forEach(callback => {
                    try {
                        callback(value, oldValue);
                    } catch (e) {
                        console.error('[Store] 监听器执行失败:', e);
                    }
                });
            }
        });
        
        if (persist) {
            this._persist();
        }
    },

    /**
     * 订阅状态变化
     * @param {string} key - 键名
     * @param {Function} callback - 回调函数
     * @returns {Function} 取消订阅函数
     */
    subscribe(key, callback) {
        if (!this._listeners[key]) {
            this._listeners[key] = [];
        }
        this._listeners[key].push(callback);
        
        // 返回取消订阅函数
        return () => {
            this._listeners[key] = this._listeners[key].filter(cb => cb !== callback);
        };
    },

    /**
     * 持久化状态
     * @private
     */
    _persist() {
        try {
            localStorage.setItem(`${this._prefix}state`, JSON.stringify(this._state));
        } catch (e) {
            console.warn('[Store] 持久化失败:', e);
        }
    },

    /**
     * 刷新所有数据
     * 触发所有模块的数据刷新
     */
    async refresh() {
        console.log('[Store] 刷新数据...');
        document.dispatchEvent(new CustomEvent('store:refresh'));
    },

    /**
     * 清空状态
     * @param {boolean} clearStorage - 是否清除 localStorage
     */
    clear(clearStorage = true) {
        this._state = {};
        this._listeners = {};
        
        if (clearStorage) {
            try {
                localStorage.removeItem(`${this._prefix}state`);
            } catch (e) {
                console.warn('[Store] 清除存储失败:', e);
            }
        }
        
        console.log('✅ [Store] 已清空');
    },

    /**
     * 获取所有状态
     * @returns {Object}
     */
    getAll() {
        return { ...this._state };
    },

    /**
     * 检查状态是否存在
     * @param {string} key - 键名
     * @returns {boolean}
     */
    has(key) {
        return this._state[key] !== undefined;
    }
};

export default store;