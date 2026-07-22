<template>
  <div class="products-">
    
<div class="page-container" data-page="04-products-combos">
    <div class="page-header">
        <h1><i class="fas fa-object-group"></i> 组合产品</h1>
        <div class="page-actions">
            <button class="btn btn-primary" onclick="window.ComboModule.newCombo()">
                <i class="fas fa-plus"></i> 新建组合
            </button>
            <button class="btn btn-outline" onclick="location.reload()">
                <i class="fas fa-sync-alt"></i> 刷新
            </button>
        </div>
    </div>
    <div class="page-content">
        <div class="combo-container">
            
            <div class="combo-stats">
                <div class="stat-card">
                    <span class="stat-label">组合总数</span>
                    <span class="stat-number" id="totalCombos">0</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">活跃组合</span>
                    <span class="stat-number" id="activeCombos">0</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">节省最多</span>
                    <span class="stat-number" id="bestSaving">¥0</span>
                </div>
            </div>

            
            <div class="combo-grid" id="comboGrid">
                
            </div>
        </div>
    </div>
</div>

<style>
    .combo-container { max-width: 1200px; margin: 0 auto; }
    
    .combo-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
    .combo-stats .stat-card { background: white; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #e5e7eb; }
    .combo-stats .stat-card .stat-label { display: block; font-size: 13px; color: #6B7280; }
    .combo-stats .stat-card .stat-number { display: block; font-size: 28px; font-weight: 700; color: #1F2937; margin-top: 4px; }
    .combo-stats .stat-card:nth-child(1) .stat-number { color: #4F46E5; }
    .combo-stats .stat-card:nth-child(2) .stat-number { color: #10B981; }
    .combo-stats .stat-card:nth-child(3) .stat-number { color: #F59E0B; }
    
    .combo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .combo-card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; transition: all 0.3s; }
    .combo-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
    .combo-card .combo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .combo-card .combo-name { font-size: 18px; font-weight: 600; }
    .combo-card .combo-price { font-size: 20px; font-weight: 700; color: #4F46E5; }
    .combo-card .combo-original { font-size: 14px; color: #9CA3AF; text-decoration: line-through; }
    .combo-card .combo-items { margin: 8px 0; padding: 8px 0; border-top: 1px solid #F3F4F6; border-bottom: 1px solid #F3F4F6; }
    .combo-card .combo-item { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
    .combo-card .combo-saving { color: #10B981; font-weight: 600; }
    .combo-card .combo-actions { display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end; }
    
    .empty-combos { grid-column: 1 / -1; text-align: center; padding: 60px 0; color: #9CA3AF; }
    .empty-combos i { font-size: 48px; margin-bottom: 12px; }
    
    [data-theme="dark"] .combo-stats .stat-card,
    [data-theme="dark"] .combo-card { background: #2C2C2E; border-color: #48484A; }
    [data-theme="dark"] .combo-stats .stat-card .stat-number { color: #F5F5F7; }
    [data-theme="dark"] .combo-card .combo-item { border-color: #3A3A3C; }
    
    @media (max-width: 768px) { .combo-stats { grid-template-columns: 1fr; } }
</style>

<script>
    (function() {
        window.ComboModule = {
            combos: [],
            
            init: function() {
                this.loadCombos();
                this.render();
            },
            
            loadCombos: function() {
                const saved = localStorage.getItem('combo_data');
                if (saved) {
                    try {
                        this.combos = JSON.parse(saved);
                    } catch (e) {
                        this.combos = this.getMockCombos();
                    }
                } else {
                    this.combos = this.getMockCombos();
                    localStorage.setItem('combo_data', JSON.stringify(this.combos));
                }
            },
            
            getMockCombos: function() {
                return [
                    { id: 'CB-001', name: '洗车套餐A', price: 128, original: 168, status: 'active',
                      items: ['标准洗车 ¥68', '内饰清洁 ¥100'], saving: 40 },
                    { id: 'CB-002', name: '美容套餐', price: 388, original: 488, status: 'active',
                      items: ['抛光打蜡 ¥388', '玻璃镀膜 ¥100'], saving: 100 },
                    { id: 'CB-003', name: '保养套餐', price: 268, original: 348, status: 'inactive',
                      items: ['发动机清洗 ¥188', '空调清洗 ¥160'], saving: 80 }
                ];
            },
            
            render: function() {
                const grid = document.getElementById('comboGrid');
                
                if (this.combos.length === 0) {
                    grid.innerHTML = `
                        <div class="empty-combos">
                            <i class="fas fa-object-group"></i>
                            <p>暂无组合产品</p>
                        </div>
                    `;
                    return;
                }
                
                grid.innerHTML = this.combos.map(c => `
                    <div class="combo-card">
                        <div class="combo-header">
                            <span class="combo-name">${c.name}</span>
                            <div>
                                <span class="combo-price">¥${c.price}</span>
                                <span class="combo-original">¥${c.original}</span>
                            </div>
                        </div>
                        <div style="font-size:13px;color:#6B7280;margin-bottom:8px;">
                            <span class="combo-saving">节省 ¥${c.saving || (c.original - c.price)}</span>
                            <span class="badge ${c.status === 'active' ? 'badge-success' : 'badge-secondary'}" style="margin-left:8px;">
                                ${c.status === 'active' ? '上架' : '下架'}
                            </span>
                        </div>
                        <div class="combo-items">
                            ${c.items.map(item => `
                                <div class="combo-item">
                                    <span>${item}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="combo-actions">
                            <button class="btn-sm btn-primary" onclick="window.ComboModule.editCombo('${c.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-sm ${c.status === 'active' ? 'btn-warning' : 'btn-success'}" onclick="window.ComboModule.toggleCombo('${c.id}')">
                                <i class="fas ${c.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                            </button>
                            <button class="btn-sm btn-danger" onclick="window.ComboModule.deleteCombo('${c.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
                
                this.updateStats();
            },
            
            updateStats: function() {
                document.getElementById('totalCombos').textContent = this.combos.length;
                document.getElementById('activeCombos').textContent = this.combos.filter(c => c.status === 'active').length;
                const maxSaving = this.combos.reduce((max, c) => Math.max(max, c.saving || c.original - c.price), 0);
                document.getElementById('bestSaving').textContent = '¥' + maxSaving;
            },
            
            newCombo: function() {
                const name = prompt('输入组合名称：');
                if (!name) return;
                const price = parseFloat(prompt('输入组合价格：'));
                if (isNaN(price) || price <= 0) return;
                const original = parseFloat(prompt('输入原价（总价）：'));
                if (isNaN(original) || original <= 0) return;
                const items = prompt('输入包含商品（用逗号分隔）：') || '';
                const combo = {
                    id: 'CB-' + Date.now().toString().slice(-6),
                    name: name,
                    price: price,
                    original: original,
                    status: 'active',
                    items: items.split(',').map(i => i.trim()).filter(i => i),
                    saving: original - price
                };
                this.combos.push(combo);
                localStorage.setItem('combo_data', JSON.stringify(this.combos));
                this.render();
                alert('组合已创建: ' + name);
            },
            
            editCombo: function(id) {
                const combo = this.combos.find(c => c.id === id);
                if (combo) {
                    const newName = prompt('修改组合名称：', combo.name);
                    if (newName) {
                        combo.name = newName;
                        localStorage.setItem('combo_data', JSON.stringify(this.combos));
                        this.render();
                        alert('组合已更新');
                    }
                }
            },
            
            toggleCombo: function(id) {
                const combo = this.combos.find(c => c.id === id);
                if (combo) {
                    combo.status = combo.status === 'active' ? 'inactive' : 'active';
                    localStorage.setItem('combo_data', JSON.stringify(this.combos));
                    this.render();
                    alert('组合状态已切换');
                }
            },
            
            deleteCombo: function(id) {
                if (confirm('确认删除该组合？')) {
                    this.combos = this.combos.filter(c => c.id !== id);
                    localStorage.setItem('combo_data', JSON.stringify(this.combos));
                    this.render();
                    alert('组合已删除');
                }
            }
        };
        
        document.addEventListener('DOMContentLoaded', function() {
            window.ComboModule.init();
        });
    })();
</script>
  </div>
</template>

<script>
export default {
  name: 'Combos',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    /**
 * @file combos.js
 * @module combos
 * @description 组合产品管理 - 套餐组合的创建和管理
 * 
 * @example
 * import { init } from './combos.js';
 * await init();
 * 
 * @author Carwash Pro Team
 * @version 1.0.0
 */

//  (已注释);
import { showToast } from '../js/core/init.js';

/**
 * @typedef {Object} ComboItem
 * @property {string} productId - 商品ID
 * @property {string} productName - 商品名称
 * @property {number} qty - 数量
 * @property {number} price - 单价
 */

/**
 * @typedef {Object} Combo
 * @property {string} id - 组合ID
 * @property {string} name - 组合名称
 * @property {string} [description] - 组合描述
 * @property {ComboItem[]} items - 组合商品列表
 * @property {number} totalPrice - 原价合计
 * @property {number} comboPrice - 组合价格
 * @property {number} discount - 折扣金额
 * @property {string} status - 状态 (active/inactive)
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/** @type {{combos: Combo[], searchQuery: string, statusFilter: string}} 状态 */
const state = {
    combos: [],
    searchQuery: '',
    statusFilter: 'all'
};

/**
 * @private
 * @param {number} amount - 金额
 * @returns {string} 格式化后的货币字符串
 */
function formatCurrency(amount) {
    if (amount === undefined || amount === null) return '0.00';
    return amount.toFixed(2);
}

/**
 * @private
 * @param {string} date - 日期字符串
 * @returns {string} 格式化后的日期
 */
function formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * @private
 * @returns {Combo[]} 模拟组合数据
 */
function getMockCombos() {
    return [
        {
            id: 'COMBO001',
            name: '标准洗车套餐',
            description: '标准洗车 + 内饰吸尘',
            items: [
                { productId: 'P001', productName: '标准洗车', qty: 1, price: 68 },
                { productId: 'P005', productName: '内饰清洗', qty: 1, price: 328 }
            ],
            totalPrice: 396,
            comboPrice: 298,
            discount: 98,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'COMBO002',
            name: '精致养护套餐',
            description: '精致洗车 + 抛光打蜡',
            items: [
                { productId: 'P002', productName: '精致洗车', qty: 1, price: 128 },
                { productId: 'P004', productName: '抛光打蜡', qty: 1, price: 388 }
            ],
            totalPrice: 516,
            comboPrice: 398,
            discount: 118,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'COMBO003',
            name: '深度清洁套餐',
            description: '深度清洁 + 发动机清洗',
            items: [
                { productId: 'P003', productName: '深度清洁', qty: 1, price: 268 },
                { productId: 'P006', productName: '发动机清洗', qty: 1, price: 188 }
            ],
            totalPrice: 456,
            comboPrice: 358,
            discount: 98,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
}

/**
 * @private
 * @description 加载组合数据
 */
function loadCombos() {
    try {
        const saved = localStorage.getItem('combo_data');
        if (saved) {
            state.combos = JSON.parse(saved);
        } else {
            state.combos = getMockCombos();
            localStorage.setItem('combo_data', JSON.stringify(state.combos));
        }
    } catch (e) {
        console.warn('加载组合数据失败:', e);
        state.combos = getMockCombos();
    }
    renderCombos();
    updateStats();
}

/**
 * @private
 * @description 保存组合数据
 */
function saveCombos() {
    try {
        localStorage.setItem('combo_data', JSON.stringify(state.combos));
    } catch (e) {
        console.warn('保存组合数据失败:', e);
    }
}

/**
 * @private
 * @description 渲染组合列表
 */
function renderCombos() {
    const container = document.getElementById('comboListBody');
    if (!container) return;
    
    let filtered = state.combos;
    
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(query) ||
            (c.description && c.description.toLowerCase().includes(query))
        );
    }
    
    if (state.statusFilter !== 'all') {
        filtered = filtered.filter(c => c.status === state.statusFilter);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:40px;color:#9CA3AF;">
                    <i class="fas fa-object-group" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                    暂无组合数据
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(combo => `
        <tr style="border-bottom:1px solid #F3F4F6;transition:background 0.2s;"
            onmouseover="this.style.background='#F9FAFB'"
            onmouseout="this.style.background=''">
            <td style="padding:12px;font-weight:500;">${combo.name}</td>
            <td style="padding:12px;color:#6B7280;font-size:13px;">${combo.description || '-'}</td>
            <td style="padding:12px;font-size:13px;">
                ${combo.items.map(item => `${item.productName} ×${item.qty}`).join(' + ')}
            </td>
            <td style="padding:12px;text-align:right;font-size:13px;color:#6B7280;text-decoration:line-through;">
                ¥${formatCurrency(combo.totalPrice)}
            </td>
            <td style="padding:12px;text-align:right;font-weight:600;color:#4F46E5;">
                ¥${formatCurrency(combo.comboPrice)}
                <span style="font-size:11px;color:#10B981;display:block;">省 ¥${formatCurrency(combo.discount)}</span>
            </td>
            <td style="padding:12px;text-align:center;">
                <button class="btn btn-sm btn-outline" onclick="window.CombosModule.editCombo('${combo.id}')" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.CombosModule.deleteCombo('${combo.id}')" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * @private
 * @description 更新统计数据
 */
function updateStats() {
    const total = state.combos.length;
    const active = state.combos.filter(c => c.status === 'active').length;
    const inactive = state.combos.filter(c => c.status === 'inactive').length;
    const avgDiscount = total > 0 ? state.combos.reduce((sum, c) => sum + c.discount, 0) / total : 0;
    
    const elements = {
        'statTotal': total,
        'statActive': active,
        'statInactive': inactive,
        'statAvgDiscount': '¥' + formatCurrency(avgDiscount)
    };
    
    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    });
}

/**
 * @private
 * @param {string} id - 组合ID
 * @description 编辑组合
 */
function editCombo(id) {
    const combo = state.combos.find(c => c.id === id);
    if (!combo) {
        showToast('组合不存在', 'error');
        return;
    }
    
    const name = prompt('组合名称：', combo.name);
    if (name === null) return;
    if (!name.trim()) {
        showToast('组合名称不能为空', 'warning');
        return;
    }
    
    const description = prompt('组合描述：', combo.description || '') || '';
    const comboPrice = parseFloat(prompt('组合价格：', combo.comboPrice));
    if (isNaN(comboPrice) || comboPrice < 0) {
        showToast('请输入有效价格', 'error');
        return;
    }
    
    const status = confirm('是否启用？\n点击"确定"启用，点击"取消"禁用');
    
    combo.name = name.trim();
    combo.description = description;
    combo.comboPrice = comboPrice;
    combo.discount = combo.totalPrice - comboPrice;
    combo.status = status ? 'active' : 'inactive';
    combo.updatedAt = new Date().toISOString();
    
    saveCombos();
    renderCombos();
    updateStats();
    showToast('组合已更新: ' + combo.name, 'success');
}

/**
 * @private
 * @param {string} id - 组合ID
 * @description 删除组合
 */
function deleteCombo(id) {
    const combo = state.combos.find(c => c.id === id);
    if (!combo) {
        showToast('组合不存在', 'error');
        return;
    }
    
    if (!confirm(`确认删除组合 "${combo.name}"？`)) return;
    
    state.combos = state.combos.filter(c => c.id !== id);
    saveCombos();
    renderCombos();
    updateStats();
    showToast('组合已删除: ' + combo.name, 'success');
}

/**
 * @private
 * @description 新增组合
 */
function newCombo() {
    const name = prompt('组合名称：');
    if (name === null) return;
    if (!name.trim()) {
        showToast('组合名称不能为空', 'warning');
        return;
    }
    
    const description = prompt('组合描述：') || '';
    
    // 添加商品
    const items = [];
    let totalPrice = 0;
    
    while (true) {
        const productName = prompt('商品名称（输入空结束）：');
        if (!productName) break;
        const price = parseFloat(prompt('商品价格：', '68'));
        if (isNaN(price) || price < 0) {
            showToast('请输入有效价格', 'warning');
            continue;
        }
        const qty = parseInt(prompt('数量：', '1'));
        if (isNaN(qty) || qty < 1) {
            showToast('请输入有效数量', 'warning');
            continue;
        }
        
        items.push({
            productId: 'P' + String(Math.floor(Math.random() * 999) + 1).padStart(3, '0'),
            productName: productName,
            qty: qty,
            price: price
        });
        totalPrice += price * qty;
    }
    
    if (items.length === 0) {
        showToast('至少需要一个商品', 'error');
        return;
    }
    
    const comboPrice = parseFloat(prompt('组合价格：', totalPrice * 0.8));
    if (isNaN(comboPrice) || comboPrice < 0) {
        showToast('请输入有效组合价格', 'error');
        return;
    }
    
    const status = confirm('是否启用？\n点击"确定"启用，点击"取消"禁用');
    
    const combo = {
        id: 'COMBO' + String(state.combos.length + 1).padStart(3, '0'),
        name: name.trim(),
        description: description,
        items: items,
        totalPrice: totalPrice,
        comboPrice: comboPrice,
        discount: totalPrice - comboPrice,
        status: status ? 'active' : 'inactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    state.combos.push(combo);
    saveCombos();
    renderCombos();
    updateStats();
    showToast('组合已创建: ' + combo.name, 'success');
}

/**
 * @private
 * @description 搜索组合
 */
function searchCombos(query) {
    state.searchQuery = query;
    renderCombos();
}

/**
 * @private
 * @description 应用筛选
 */
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter');
    state.statusFilter = statusFilter ? statusFilter.value : 'all';
    renderCombos();
}

/**
 * @private
 * @description 重置筛选
 */
function resetFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (statusFilter) statusFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    
    state.statusFilter = 'all';
    state.searchQuery = '';
    renderCombos();
}

/**
 * @private
 * @description 刷新数据
 */
function refresh() {
    loadCombos();
    showToast('数据已刷新', 'success');
}

/**
 * @private
 * @description 绑定事件
 */
function bindEvents() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                searchCombos(this.value);
            }, 300);
        });
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    const refreshBtn = document.getElementById('refreshCombos');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refresh);
    }
    
    const newBtn = document.getElementById('newCombo');
    if (newBtn) {
        newBtn.addEventListener('click', newCombo);
    }
}

/**
 * @public
 * @param {Object} options - 初始化选项
 * @returns {Promise<void>}
 */
export async function init(options) {
    console.log('📦 组合产品 初始化...');
    
    if (options?.data) {
        state.combos = options.data;
        saveCombos();
    } else {
        loadCombos();
    }
    
    updateStats();
    bindEvents();
    
    window.CombosModule = {
        state,
        loadCombos,
        renderCombos,
        updateStats,
        editCombo,
        deleteCombo,
        newCombo,
        searchCombos,
        applyFilters,
        resetFilters,
        refresh,
        saveCombos
    };
    
    console.log('✅ 组合产品 初始化完成');
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export default {
    init,
    loadCombos,
    editCombo,
    deleteCombo,
    newCombo,
    searchCombos,
    refresh,
    saveCombos
};
  },
  methods: {}
}
</script>

<style scoped>

</style>

