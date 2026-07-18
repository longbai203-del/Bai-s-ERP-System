<template>
  <div class="products-">
    



    <div class="pricelist-container">
        
        <div class="page-header">
            <div>
                <h1>
                    <i class="fas fa-tags" style="color:#4F46E5;"></i>
                    价格表
                    <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">多套价格体系</span>
                </h1>
                <div class="subtitle">管理不同客户群体的价格策略</div>
            </div>
            <div class="header-actions">
                <button class="btn btn-success" id="addPricelistBtn">
                    <i class="fas fa-plus"></i> 新建价格表
                </button>
                <button class="btn btn-outline" id="refreshPricelistBtn">
                    <i class="fas fa-sync"></i>
                </button>
            </div>
        </div>

        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number primary" id="totalPricelists">0</div>
                <div class="stat-label">📊 价格表总数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number success" id="activePricelists">0</div>
                <div class="stat-label">✅ 活跃</div>
            </div>
            <div class="stat-card">
                <div class="stat-number purple" id="pricelistProducts">0</div>
                <div class="stat-label">📦 关联商品</div>
            </div>
        </div>

        
        <div class="toolbar">
            <input type="text" class="search-box" id="pricelistSearch" placeholder="🔍 搜索价格表名称...">
            <select class="filter-select" id="pricelistStatusFilter">
                <option value="">全部状态</option>
                <option value="active">活跃</option>
                <option value="inactive">停用</option>
            </select>
            <button class="btn btn-primary" id="pricelistSearchBtn">
                <i class="fas fa-search"></i> 搜索
            </button>
            <button class="btn btn-outline" id="pricelistResetBtn">
                <i class="fas fa-undo"></i> 重置
            </button>
        </div>

        
        <div class="pricelist-grid" id="pricelistGrid">
            
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>加载中...</p>
            </div>
        </div>

        
        <div class="pagination">
            <span class="info" id="pricelistPageInfo">共 0 条，第 1/1 页</span>
            <div class="btn-group">
                <button id="pricelistPrevPage" disabled><i class="fas fa-chevron-left"></i></button>
                <span id="pricelistPageNumbers" style="display:flex;gap:4px;align-items:center;">
                    <button class="active">1</button>
                </span>
                <button id="pricelistNextPage" disabled><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    </div>

    
    <div class="modal-overlay" id="pricelistModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="pricelistModalTitle">新建价格表</h3>
                <button class="modal-close" id="pricelistModalClose">&times;</button>
            </div>
            <div class="modal-body">
                <form id="pricelistForm" autocomplete="off">
                    <div class="form-group">
                        <label>价格表名称 <span class="required">*</span></label>
                        <input type="text" id="pricelistFormName" placeholder="如: 会员价目表" required>
                    </div>
                    <div class="form-group">
                        <label>类型</label>
                        <select id="pricelistFormType">
                            <option value="零售">零售</option>
                            <option value="会员">会员</option>
                            <option value="批发">批发</option>
                            <option value="促销">促销</option>
                            <option value="内部">内部</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>描述</label>
                        <textarea id="pricelistFormDesc" placeholder="价格表描述信息..." rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label>状态</label>
                        <select id="pricelistFormStatus">
                            <option value="active">活跃</option>
                            <option value="inactive">停用</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="pricelistModalCancel">取消</button>
                <button class="btn btn-primary" id="pricelistModalSave">
                    <i class="fas fa-save"></i> 保存
                </button>
            </div>
        </div>
    </div>

    <script type="module">
        // ============================================================
        // 价格表模块
        // ============================================================
        window.PriceListModule = {
            priceLists: [],
            filteredPriceLists: [],
            page: 1,
            pageSize: 8,
            editingId: null,

            init: function() {
                this.loadPriceLists();
                this.bindEvents();
                this.render();
                console.log('🏷️ 价格表模块已初始化');
            },

            loadPriceLists: function() {
                try {
                    const saved = localStorage.getItem('pricelist_data');
                    if (saved) {
                        this.priceLists = JSON.parse(saved);
                    } else {
                        this.priceLists = this.getMockPriceLists();
                        localStorage.setItem('pricelist_data', JSON.stringify(this.priceLists));
                    }
                } catch (e) {
                    this.priceLists = this.getMockPriceLists();
                }
                this.filteredPriceLists = [...this.priceLists];
            },

            getMockPriceLists: function() {
                return [
                    { id: 'PL-001', name: '标准价目表', type: '零售', desc: '标准零售价格', products: 12, status: 'active' },
                    { id: 'PL-002', name: '会员价目表', type: '会员', desc: '会员专享价格', products: 12, status: 'active' },
                    { id: 'PL-003', name: '批发价目表', type: '批发', desc: '批量采购价格', products: 8, status: 'inactive' },
                    { id: 'PL-004', name: '节日促销价', type: '促销', desc: '节假日促销价格', products: 6, status: 'active' },
                    { id: 'PL-005', name: '员工内部价', type: '内部', desc: '员工内部优惠价格', products: 10, status: 'active' },
                    { id: 'PL-006', name: 'VIP尊享价', type: '会员', desc: 'VIP客户专享价格', products: 15, status: 'active' }
                ];
            },

            savePriceLists: function() {
                try {
                    localStorage.setItem('pricelist_data', JSON.stringify(this.priceLists));
                } catch (e) {}
            },

            render: function() {
                this.renderGrid();
                this.updateStats();
                this.renderPagination();
            },

            renderGrid: function() {
                const grid = document.getElementById('pricelistGrid');
                const start = (this.page - 1) * this.pageSize;
                const end = start + this.pageSize;
                const pageData = this.filteredPriceLists.slice(start, end);

                if (pageData.length === 0) {
                    grid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-tags"></i>
                            <p>暂无价格表</p>
                            <span style="font-size:13px;">点击「新建价格表」创建</span>
                        </div>
                    `;
                    return;
                }

                const typeColors = {
                    '零售': '#3B82F6',
                    '会员': '#10B981',
                    '批发': '#F59E0B',
                    '促销': '#EF4444',
                    '内部': '#8B5CF6'
                };

                grid.innerHTML = pageData.map(p => {
                    const statusClass = p.status === 'active' ? 'badge-success' : 'badge-secondary';
                    const statusLabel = p.status === 'active' ? '活跃' : '停用';
                    const typeColor = typeColors[p.type] || '#6B7280';

                    return `
                        <div class="pricelist-card">
                            <div class="pricelist-badge">
                                <span class="badge ${statusClass}">${statusLabel}</span>
                            </div>
                            <div class="pricelist-header">
                                <div>
                                    <div class="pricelist-name">${p.name}</div>
                                    <span class="pricelist-type" style="background:${typeColor}20;color:${typeColor};">
                                        ${p.type || '通用'}
                                    </span>
                                </div>
                            </div>
                            <div class="pricelist-desc">${p.desc || '无描述'}</div>
                            <div class="pricelist-products">📦 ${p.products || 0} 个商品</div>
                            <div class="pricelist-actions">
                                <button class="btn-sm btn-sm-primary" onclick="window.PriceListModule.editPricelist('${p.id}')">
                                    <i class="fas fa-edit"></i> 编辑
                                </button>
                                <button class="btn-sm ${p.status === 'active' ? 'btn-sm-warning' : 'btn-sm-success'}" 
                                        onclick="window.PriceListModule.togglePricelist('${p.id}')">
                                    <i class="fas ${p.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                                </button>
                                <button class="btn-sm btn-sm-danger" onclick="window.PriceListModule.deletePricelist('${p.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            },

            updateStats: function() {
                const total = this.priceLists.length;
                const active = this.priceLists.filter(p => p.status === 'active').length;
                const products = this.priceLists.reduce((sum, p) => sum + (p.products || 0), 0);
                document.getElementById('totalPricelists').textContent = total;
                document.getElementById('activePricelists').textContent = active;
                document.getElementById('pricelistProducts').textContent = products;
            },

            renderPagination: function() {
                const total = this.filteredPriceLists.length;
                const totalPages = Math.ceil(total / this.pageSize) || 1;
                document.getElementById('pricelistPageInfo').textContent = `共 ${total} 条，第 ${this.page}/${totalPages} 页`;

                const container = document.getElementById('pricelistPageNumbers');
                let html = '';
                for (let i = 1; i <= Math.min(totalPages, 5); i++) {
                    html += `<button class="${i === this.page ? 'active' : ''}" onclick="window.PriceListModule.goToPage(${i})">${i}</button>`;
                }
                if (totalPages > 5) {
                    html += `<span style="color:#9CA3AF;padding:0 4px;">...</span>`;
                    html += `<button onclick="window.PriceListModule.goToPage(${totalPages})">${totalPages}</button>`;
                }
                container.innerHTML = html;

                document.getElementById('pricelistPrevPage').disabled = this.page <= 1;
                document.getElementById('pricelistNextPage').disabled = this.page >= totalPages;
            },

            goToPage: function(page) {
                const totalPages = Math.ceil(this.filteredPriceLists.length / this.pageSize) || 1;
                if (page < 1 || page > totalPages) return;
                this.page = page;
                this.render();
            },

            prevPage: function() {
                if (this.page > 1) { this.page--; this.render(); }
            },

            nextPage: function() {
                const totalPages = Math.ceil(this.filteredPriceLists.length / this.pageSize) || 1;
                if (this.page < totalPages) { this.page++; this.render(); }
            },

            handleSearch: function() {
                const search = document.getElementById('pricelistSearch').value.toLowerCase();
                const status = document.getElementById('pricelistStatusFilter').value;

                this.filteredPriceLists = this.priceLists.filter(p => {
                    let match = true;
                    if (search && !p.name.toLowerCase().includes(search)) match = false;
                    if (status && p.status !== status) match = false;
                    return match;
                });
                this.page = 1;
                this.render();
            },

            handleReset: function() {
                document.getElementById('pricelistSearch').value = '';
                document.getElementById('pricelistStatusFilter').value = '';
                this.filteredPriceLists = [...this.priceLists];
                this.page = 1;
                this.render();
            },

            showCreateModal: function() {
                this.editingId = null;
                document.getElementById('pricelistModalTitle').textContent = '新建价格表';
                document.getElementById('pricelistForm').reset();
                document.getElementById('pricelistFormStatus').value = 'active';
                document.getElementById('pricelistModal').classList.add('active');
            },

            editPricelist: function(id) {
                const pricelist = this.priceLists.find(p => p.id === id);
                if (!pricelist) return;
                this.editingId = id;
                document.getElementById('pricelistModalTitle').textContent = '编辑价格表 - ' + pricelist.name;
                document.getElementById('pricelistFormName').value = pricelist.name;
                document.getElementById('pricelistFormType').value = pricelist.type || '零售';
                document.getElementById('pricelistFormDesc').value = pricelist.desc || '';
                document.getElementById('pricelistFormStatus').value = pricelist.status;
                document.getElementById('pricelistModal').classList.add('active');
            },

            closeModal: function() {
                document.getElementById('pricelistModal').classList.remove('active');
            },

            savePricelist: function() {
                const name = document.getElementById('pricelistFormName').value.trim();
                const type = document.getElementById('pricelistFormType').value;
                const desc = document.getElementById('pricelistFormDesc').value.trim();
                const status = document.getElementById('pricelistFormStatus').value;

                if (!name) { alert('请输入价格表名称'); return; }

                if (this.editingId) {
                    const index = this.priceLists.findIndex(p => p.id === this.editingId);
                    if (index >= 0) {
                        this.priceLists[index] = { ...this.priceLists[index], name, type, desc, status };
                    }
                    alert('✅ 价格表已更新');
                } else {
                    const newPricelist = {
                        id: 'PL-' + Date.now().toString().slice(-6),
                        name, type, desc, status,
                        products: 0,
                        createdAt: new Date().toISOString()
                    };
                    this.priceLists.push(newPricelist);
                    alert('✅ 价格表已创建');
                }

                this.savePriceLists();
                this.filteredPriceLists = [...this.priceLists];
                this.closeModal();
                this.render();
            },

            togglePricelist: function(id) {
                const pricelist = this.priceLists.find(p => p.id === id);
                if (pricelist) {
                    pricelist.status = pricelist.status === 'active' ? 'inactive' : 'active';
                    this.savePriceLists();
                    this.filteredPriceLists = [...this.priceLists];
                    this.render();
                    alert(`✅ 价格表 "${pricelist.name}" 已${pricelist.status === 'active' ? '启用' : '停用'}`);
                }
            },

            deletePricelist: function(id) {
                const pricelist = this.priceLists.find(p => p.id === id);
                if (!pricelist) return;
                if (!confirm(`确认删除价格表 "${pricelist.name}"？`)) return;
                this.priceLists = this.priceLists.filter(p => p.id !== id);
                this.filteredPriceLists = [...this.priceLists];
                this.savePriceLists();
                this.render();
                alert('🗑️ 价格表已删除');
            },

            refresh: function() {
                this.loadPriceLists();
                this.filteredPriceLists = [...this.priceLists];
                this.page = 1;
                this.render();
                alert('✅ 数据已刷新');
            },

            bindEvents: function() {
                document.getElementById('pricelistSearchBtn')?.addEventListener('click', () => this.handleSearch());
                document.getElementById('pricelistResetBtn')?.addEventListener('click', () => this.handleReset());
                document.getElementById('addPricelistBtn')?.addEventListener('click', () => this.showCreateModal());
                document.getElementById('refreshPricelistBtn')?.addEventListener('click', () => this.refresh());

                document.getElementById('pricelistPrevPage')?.addEventListener('click', () => this.prevPage());
                document.getElementById('pricelistNextPage')?.addEventListener('click', () => this.nextPage());

                document.querySelectorAll('#pricelistSearch, #pricelistStatusFilter').forEach(el => {
                    el.addEventListener('keypress', e => { if (e.key === 'Enter') this.handleSearch(); });
                });

                document.getElementById('pricelistModalClose')?.addEventListener('click', () => this.closeModal());
                document.getElementById('pricelistModalCancel')?.addEventListener('click', () => this.closeModal());
                document.getElementById('pricelistModal')?.addEventListener('click', (e) => {
                    if (e.target === e.currentTarget) this.closeModal();
                });
                document.getElementById('pricelistModalSave')?.addEventListener('click', () => this.savePricelist());

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.closeModal();
                });
            }
        };

        document.addEventListener('DOMContentLoaded', function() {
            window.PriceListModule.init();
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'PriceLists',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    /**
 * @file price-lists.js
 * @module price-lists
 * @description 价格表管理 - 商品价格表、定价策略管理
 * 
 * @example
 * import { init } from './price-lists.js';
 * await init();
 * 
 * @author Carwash Pro Team
 * @version 1.0.0
 */

import { store } from '../js/core/store.js';
import { showToast } from '../js/core/init.js';

/**
 * @typedef {Object} PriceItem
 * @property {string} productId - 商品ID
 * @property {string} productName - 商品名称
 * @property {number} basePrice - 基础价格
 * @property {number} specialPrice - 特殊价格
 * @property {string} [note] - 备注
 */

/**
 * @typedef {Object} PriceList
 * @property {string} id - 价格表ID
 * @property {string} name - 价格表名称
 * @property {string} [description] - 价格表描述
 * @property {string} type - 类型 (standard/member/promotion)
 * @property {PriceItem[]} items - 价格项目
 * @property {string} status - 状态 (active/inactive)
 * @property {string} validFrom - 生效日期
 * @property {string} validTo - 失效日期
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * @typedef {Object} PriceListState
 * @property {PriceList[]} priceLists - 价格表列表
 * @property {string} searchQuery - 搜索关键词
 * @property {string} typeFilter - 类型筛选
 * @property {string} statusFilter - 状态筛选
 */

/** @type {PriceListState} 状态 */
const state = {
    priceLists: [],
    searchQuery: '',
    typeFilter: 'all',
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
    return d.toLocaleDateString('zh-CN');
}

/**
 * @private
 * @param {string} type - 类型代码
 * @returns {string} 类型标签
 */
function getTypeLabel(type) {
    const map = {
        'standard': '标准价格',
        'member': '会员价格',
        'promotion': '促销价格',
        'wholesale': '批发价格'
    };
    return map[type] || type;
}

/**
 * @private
 * @param {string} type - 类型代码
 * @returns {string} 类型颜色
 */
function getTypeColor(type) {
    const map = {
        'standard': '#6B7280',
        'member': '#8B5CF6',
        'promotion': '#EF4444',
        'wholesale': '#F59E0B'
    };
    return map[type] || '#6B7280';
}

/**
 * @private
 * @param {string} type - 类型代码
 * @returns {string} 类型背景色
 */
function getTypeBg(type) {
    const map = {
        'standard': '#F3F4F6',
        'member': '#EDE9FE',
        'promotion': '#FEE2E2',
        'wholesale': '#FEF3C7'
    };
    return map[type] || '#F3F4F6';
}

/**
 * @private
 * @returns {PriceList[]} 模拟价格表数据
 */
function getMockPriceLists() {
    const products = ['标准洗车', '精致洗车', '深度清洁', '抛光打蜡', '内饰清洗'];
    const prices = [68, 128, 268, 388, 328];
    
    return [
        {
            id: 'PL001',
            name: '标准价格表',
            description: '门店标准定价',
            type: 'standard',
            items: products.map((name, idx) => ({
                productId: 'P' + String(idx + 1).padStart(3, '0'),
                productName: name,
                basePrice: prices[idx],
                specialPrice: prices[idx],
                note: ''
            })),
            status: 'active',
            validFrom: '2024-01-01',
            validTo: '2099-12-31',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'PL002',
            name: '会员价格表',
            description: 'VIP会员专享价格',
            type: 'member',
            items: products.map((name, idx) => ({
                productId: 'P' + String(idx + 1).padStart(3, '0'),
                productName: name,
                basePrice: prices[idx],
                specialPrice: Math.round(prices[idx] * 0.85),
                note: '会员85折'
            })),
            status: 'active',
            validFrom: '2024-01-01',
            validTo: '2099-12-31',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'PL003',
            name: '夏季促销价格表',
            description: '夏季特惠活动价格',
            type: 'promotion',
            items: products.map((name, idx) => ({
                productId: 'P' + String(idx + 1).padStart(3, '0'),
                productName: name,
                basePrice: prices[idx],
                specialPrice: Math.round(prices[idx] * 0.7),
                note: '夏季特惠7折'
            })),
            status: 'inactive',
            validFrom: '2024-06-01',
            validTo: '2024-08-31',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
}

/**
 * @private
 * @description 加载价格表数据
 */
function loadPriceLists() {
    try {
        const saved = localStorage.getItem('pricelist_data');
        if (saved) {
            state.priceLists = JSON.parse(saved);
        } else {
            state.priceLists = getMockPriceLists();
            localStorage.setItem('pricelist_data', JSON.stringify(state.priceLists));
        }
    } catch (e) {
        console.warn('加载价格表数据失败:', e);
        state.priceLists = getMockPriceLists();
    }
    renderPriceLists();
    updateStats();
}

/**
 * @private
 * @description 保存价格表数据
 */
function savePriceLists() {
    try {
        localStorage.setItem('pricelist_data', JSON.stringify(state.priceLists));
    } catch (e) {
        console.warn('保存价格表数据失败:', e);
    }
}

/**
 * @private
 * @description 渲染价格表列表
 */
function renderPriceLists() {
    const container = document.getElementById('priceListBody');
    if (!container) return;
    
    let filtered = state.priceLists;
    
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query))
        );
    }
    
    if (state.typeFilter !== 'all') {
        filtered = filtered.filter(p => p.type === state.typeFilter);
    }
    
    if (state.statusFilter !== 'all') {
        filtered = filtered.filter(p => p.status === state.statusFilter);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:40px;color:#9CA3AF;">
                    <i class="fas fa-tags" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                    暂无价格表数据
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(priceList => {
        const typeLabel = getTypeLabel(priceList.type);
        const typeColor = getTypeColor(priceList.type);
        const typeBg = getTypeBg(priceList.type);
        const itemCount = priceList.items ? priceList.items.length : 0;
        const avgPrice = priceList.items && priceList.items.length > 0
            ? priceList.items.reduce((sum, item) => sum + item.specialPrice, 0) / priceList.items.length
            : 0;
        
        return `
            <tr style="border-bottom:1px solid #F3F4F6;transition:background 0.2s;"
                onmouseover="this.style.background='#F9FAFB'"
                onmouseout="this.style.background=''">
                <td style="padding:12px;">
                    <div style="font-weight:500;">${priceList.name}</div>
                    <div style="font-size:12px;color:#6B7280;margin-top:2px;">${priceList.description || '-'}</div>
                </td>
                <td style="padding:12px;">
                    <span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${typeBg};color:${typeColor};">
                        ${typeLabel}
                    </span>
                </td>
                <td style="padding:12px;text-align:center;font-size:13px;">${itemCount}</td>
                <td style="padding:12px;text-align:center;font-weight:600;color:#4F46E5;">
                    ¥${formatCurrency(avgPrice)}
                </td>
                <td style="padding:12px;font-size:13px;color:#6B7280;">
                    ${formatDate(priceList.validFrom)} ~ ${formatDate(priceList.validTo)}
                </td>
                <td style="padding:12px;">
                    <span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${priceList.status === 'active' ? '#D1FAE5' : '#FEE2E2'};color:${priceList.status === 'active' ? '#065F46' : '#991B1B'};">
                        ${priceList.status === 'active' ? '启用' : '禁用'}
                    </span>
                </td>
                <td style="padding:12px;text-align:center;">
                    <button class="btn btn-sm btn-outline" onclick="window.PriceListsModule.viewPriceList('${priceList.id}')" title="查看">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="window.PriceListsModule.editPriceList('${priceList.id}')" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.PriceListsModule.deletePriceList('${priceList.id}')" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * @private
 * @description 更新统计数据
 */
function updateStats() {
    const total = state.priceLists.length;
    const active = state.priceLists.filter(p => p.status === 'active').length;
    const inactive = state.priceLists.filter(p => p.status === 'inactive').length;
    const standard = state.priceLists.filter(p => p.type === 'standard').length;
    const member = state.priceLists.filter(p => p.type === 'member').length;
    const promotion = state.priceLists.filter(p => p.type === 'promotion').length;
    const totalItems = state.priceLists.reduce((sum, p) => sum + (p.items ? p.items.length : 0), 0);
    
    const elements = {
        'statTotal': total,
        'statActive': active,
        'statInactive': inactive,
        'statStandard': standard,
        'statMember': member,
        'statPromotion': promotion,
        'statTotalItems': totalItems
    };
    
    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    });
}

/**
 * @private
 * @param {string} id - 价格表ID
 * @description 查看价格表详情
 */
function viewPriceList(id) {
    const priceList = state.priceLists.find(p => p.id === id);
    if (!priceList) {
        showToast('价格表不存在', 'error');
        return;
    }
    
    const modal = document.getElementById('priceListDetailModal');
    if (modal) {
        const content = document.getElementById('priceListDetailContent');
        if (content) {
            const typeLabel = getTypeLabel(priceList.type);
            const itemsHtml = priceList.items && priceList.items.length > 0
                ? priceList.items.map(item => 
                    `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #F3F4F6;font-size:13px;">
                        <span>${item.productName}</span>
                        <span>
                            <span style="color:#6B7280;text-decoration:line-through;font-size:12px;">¥${formatCurrency(item.basePrice)}</span>
                            <span style="color:#4F46E5;font-weight:600;margin-left:8px;">¥${formatCurrency(item.specialPrice)}</span>
                            ${item.note ? `<span style="font-size:11px;color:#10B981;margin-left:8px;">${item.note}</span>` : ''}
                        </span>
                    </div>`
                ).join('')
                : '<div style="color:#9CA3AF;font-size:13px;">暂无商品</div>';
            
            content.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div style="grid-column:span 2;">
                        <h3 style="margin:0 0 4px 0;">${priceList.name}</h3>
                        <div style="color:#6B7280;font-size:14px;">${priceList.description || '无描述'}</div>
                    </div>
                    <div><span style="color:#6B7280;">价格表ID</span><br><strong>${priceList.id}</strong></div>
                    <div><span style="color:#6B7280;">类型</span><br><span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${getTypeBg(priceList.type)};color:${getTypeColor(priceList.type)};">${typeLabel}</span></div>
                    <div><span style="color:#6B7280;">生效日期</span><br><strong>${formatDate(priceList.validFrom)}</strong></div>
                    <div><span style="color:#6B7280;">失效日期</span><br><strong>${formatDate(priceList.validTo)}</strong></div>
                    <div><span style="color:#6B7280;">状态</span><br><span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${priceList.status === 'active' ? '#D1FAE5' : '#FEE2E2'};color:${priceList.status === 'active' ? '#065F46' : '#991B1B'};">${priceList.status === 'active' ? '启用' : '禁用'}</span></div>
                    <div style="grid-column:span 2;"><span style="color:#6B7280;">创建时间</span><br><strong>${formatDate(priceList.createdAt)}</strong></div>
                    <div style="grid-column:span 2;">
                        <span style="color:#6B7280;">商品价格列表</span>
                        <div style="margin-top:4px;background:#F9FAFB;border-radius:6px;padding:8px 12px;max-height:200px;overflow-y:auto;">
                            ${itemsHtml}
                        </div>
                    </div>
                </div>
            `;
        }
        modal.style.display = 'flex';
        return;
    }
    
    // 降级方案
    const typeLabel = getTypeLabel(priceList.type);
    const itemsStr = priceList.items && priceList.items.length > 0
        ? priceList.items.map(i => `${i.productName}: ¥${formatCurrency(i.specialPrice)} (原价¥${formatCurrency(i.basePrice)})`).join('\n')
        : '无商品';
    
    alert(`价格表详情：
名称: ${priceList.name}
ID: ${priceList.id}
类型: ${typeLabel}
状态: ${priceList.status === 'active' ? '启用' : '禁用'}
描述: ${priceList.description || '无'}
有效期: ${formatDate(priceList.validFrom)} ~ ${formatDate(priceList.validTo)}
商品列表:
${itemsStr}`);
}

/**
 * @private
 * @param {string} id - 价格表ID
 * @description 编辑价格表
 */
function editPriceList(id) {
    const priceList = state.priceLists.find(p => p.id === id);
    if (!priceList) {
        showToast('价格表不存在', 'error');
        return;
    }
    
    const name = prompt('价格表名称：', priceList.name);
    if (name === null) return;
    if (!name.trim()) {
        showToast('价格表名称不能为空', 'warning');
        return;
    }
    
    const description = prompt('价格表描述：', priceList.description || '') || '';
    const typeOptions = ['1. standard (标准)', '2. member (会员)', '3. promotion (促销)', '4. wholesale (批发)'];
    const typeIdx = parseInt(prompt(`选择类型：\n${typeOptions.join('\n')}`, 
        priceList.type === 'standard' ? '1' : priceList.type === 'member' ? '2' : priceList.type === 'promotion' ? '3' : '4'));
    const types = ['standard', 'member', 'promotion', 'wholesale'];
    const type = types[typeIdx - 1] || priceList.type;
    
    const validFrom = prompt('生效日期 (YYYY-MM-DD)：', priceList.validFrom) || priceList.validFrom;
    const validTo = prompt('失效日期 (YYYY-MM-DD)：', priceList.validTo) || priceList.validTo;
    const status = confirm('是否启用？\n点击"确定"启用，点击"取消"禁用');
    
    priceList.name = name.trim();
    priceList.description = description;
    priceList.type = type;
    priceList.validFrom = validFrom;
    priceList.validTo = validTo;
    priceList.status = status ? 'active' : 'inactive';
    priceList.updatedAt = new Date().toISOString();
    
    savePriceLists();
    renderPriceLists();
    updateStats();
    showToast('价格表已更新: ' + priceList.name, 'success');
}

/**
 * @private
 * @param {string} id - 价格表ID
 * @description 删除价格表
 */
function deletePriceList(id) {
    const priceList = state.priceLists.find(p => p.id === id);
    if (!priceList) {
        showToast('价格表不存在', 'error');
        return;
    }
    
    if (!confirm(`确认删除价格表 "${priceList.name}"？\n将同时删除 ${priceList.items ? priceList.items.length : 0} 个价格项。`)) return;
    
    state.priceLists = state.priceLists.filter(p => p.id !== id);
    savePriceLists();
    renderPriceLists();
    updateStats();
    showToast('价格表已删除: ' + priceList.name, 'success');
}

/**
 * @private
 * @description 新增价格表
 */
function newPriceList() {
    const name = prompt('价格表名称：');
    if (name === null) return;
    if (!name.trim()) {
        showToast('价格表名称不能为空', 'warning');
        return;
    }
    
    const description = prompt('价格表描述：') || '';
    const typeOptions = ['1. standard (标准)', '2. member (会员)', '3. promotion (促销)', '4. wholesale (批发)'];
    const typeIdx = parseInt(prompt(`选择类型：\n${typeOptions.join('\n')}`, '1'));
    const types = ['standard', 'member', 'promotion', 'wholesale'];
    const type = types[typeIdx - 1] || 'standard';
    
    const validFrom = prompt('生效日期 (YYYY-MM-DD)：', new Date().toISOString().split('T')[0]);
    const validTo = prompt('失效日期 (YYYY-MM-DD)：', '2099-12-31');
    
    // 添加商品价格
    const items = [];
    while (true) {
        const productName = prompt('商品名称（输入空结束）：');
        if (!productName) break;
        const basePrice = parseFloat(prompt('基础价格：', '68'));
        if (isNaN(basePrice) || basePrice < 0) {
            showToast('请输入有效价格', 'warning');
            continue;
        }
        const specialPrice = parseFloat(prompt('特殊价格：', basePrice));
        if (isNaN(specialPrice) || specialPrice < 0) {
            showToast('请输入有效价格', 'warning');
            continue;
        }
        const note = prompt('备注：', '') || '';
        
        items.push({
            productId: 'P' + String(Math.floor(Math.random() * 999) + 1).padStart(3, '0'),
            productName: productName,
            basePrice: basePrice,
            specialPrice: specialPrice,
            note: note
        });
    }
    
    if (items.length === 0) {
        showToast('至少需要一个商品', 'error');
        return;
    }
    
    const status = confirm('是否启用？\n点击"确定"启用，点击"取消"禁用');
    
    const priceList = {
        id: 'PL' + String(state.priceLists.length + 1).padStart(3, '0'),
        name: name.trim(),
        description: description,
        type: type,
        items: items,
        status: status ? 'active' : 'inactive',
        validFrom: validFrom || new Date().toISOString().split('T')[0],
        validTo: validTo || '2099-12-31',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    state.priceLists.push(priceList);
    savePriceLists();
    renderPriceLists();
    updateStats();
    showToast('价格表已创建: ' + priceList.name, 'success');
}

/**
 * @private
 * @description 搜索价格表
 */
function searchPriceLists(query) {
    state.searchQuery = query;
    renderPriceLists();
}

/**
 * @private
 * @description 应用筛选
 */
function applyFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    state.typeFilter = typeFilter ? typeFilter.value : 'all';
    state.statusFilter = statusFilter ? statusFilter.value : 'all';
    renderPriceLists();
}

/**
 * @private
 * @description 重置筛选
 */
function resetFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (typeFilter) typeFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    
    state.typeFilter = 'all';
    state.statusFilter = 'all';
    state.searchQuery = '';
    renderPriceLists();
}

/**
 * @private
 * @description 关闭详情弹窗
 */
function closeDetail() {
    const modal = document.getElementById('priceListDetailModal');
    if (modal) modal.style.display = 'none';
}

/**
 * @private
 * @description 刷新数据
 */
function refresh() {
    loadPriceLists();
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
                searchPriceLists(this.value);
            }, 300);
        });
    }
    
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    const refreshBtn = document.getElementById('refreshPriceLists');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refresh);
    }
    
    const newBtn = document.getElementById('newPriceList');
    if (newBtn) {
        newBtn.addEventListener('click', newPriceList);
    }
    
    const modal = document.getElementById('priceListDetailModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDetail();
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDetail();
        }
    });
}

/**
 * @public
 * @param {Object} options - 初始化选项
 * @param {PriceList[]} options.data - 初始数据
 * @returns {Promise<void>}
 */
export async function init(options) {
    console.log('📋 价格表管理 初始化...');
    
    if (options?.data) {
        state.priceLists = options.data;
        savePriceLists();
    } else {
        loadPriceLists();
    }
    
    updateStats();
    bindEvents();
    
    window.PriceListsModule = {
        state,
        loadPriceLists,
        renderPriceLists,
        updateStats,
        viewPriceList,
        editPriceList,
        deletePriceList,
        newPriceList,
        searchPriceLists,
        applyFilters,
        resetFilters,
        closeDetail,
        refresh,
        savePriceLists,
        getTypeLabel
    };
    
    console.log('✅ 价格表管理 初始化完成');
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export default {
    init,
    loadPriceLists,
    viewPriceList,
    editPriceList,
    deletePriceList,
    newPriceList,
    searchPriceLists,
    refresh,
    savePriceLists
};
  },
  methods: {}
}
</script>

<style scoped>

</style>
