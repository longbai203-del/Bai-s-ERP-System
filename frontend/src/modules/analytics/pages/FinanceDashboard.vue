<template>
  <div class="products-">
    



    <div class="variant-container">
        
        <div class="page-header">
            <div>
                <h1>
                    <i class="fas fa-code-branch" style="color:#4F46E5;"></i>
                    产品变体
                    <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">规格管理</span>
                </h1>
                <div class="subtitle">管理商品的不同规格变体 · 如尺寸、颜色、容量等</div>
            </div>
            <div class="header-actions">
                <button class="btn btn-success" id="addVariantBtn">
                    <i class="fas fa-plus"></i> 新建变体
                </button>
                <button class="btn btn-outline" id="refreshVariantsBtn">
                    <i class="fas fa-sync"></i>
                </button>
            </div>
        </div>

        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number primary" id="totalVariants">0</div>
                <div class="stat-label">📊 变体总数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number success" id="activeVariants">0</div>
                <div class="stat-label">✅ 活跃变体</div>
            </div>
            <div class="stat-card">
                <div class="stat-number purple" id="variantProducts">0</div>
                <div class="stat-label">📦 关联商品</div>
            </div>
        </div>

        
        <div class="toolbar">
            <input type="text" class="search-box" id="variantSearch" placeholder="🔍 搜索商品名称、SKU...">
            <select class="filter-select" id="variantStatusFilter">
                <option value="">全部状态</option>
                <option value="active">活跃</option>
                <option value="inactive">停用</option>
            </select>
            <button class="btn btn-primary" id="variantSearchBtn">
                <i class="fas fa-search"></i> 搜索
            </button>
            <button class="btn btn-outline" id="variantResetBtn">
                <i class="fas fa-undo"></i> 重置
            </button>
        </div>

        
        <div class="variant-grid" id="variantGrid">
            
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>加载中...</p>
            </div>
        </div>

        
        <div class="pagination">
            <span class="info" id="variantPageInfo">共 0 条，第 1/1 页</span>
            <div class="btn-group">
                <button id="variantPrevPage" disabled><i class="fas fa-chevron-left"></i></button>
                <span id="variantPageNumbers" style="display:flex;gap:4px;align-items:center;">
                    <button class="active">1</button>
                </span>
                <button id="variantNextPage" disabled><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    </div>

    
    <div class="modal-overlay" id="variantModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="variantModalTitle">新建变体</h3>
                <button class="modal-close" id="variantModalClose">&times;</button>
            </div>
            <div class="modal-body">
                <form id="variantForm" autocomplete="off">
                    <div class="form-group">
                        <label>商品名称 <span class="required">*</span></label>
                        <input type="text" id="variantFormProduct" placeholder="如: 洗车液" required>
                    </div>
                    <div class="form-group">
                        <label>规格选项 <span class="required">*</span></label>
                        <input type="text" id="variantFormOption" placeholder="如: 500ml / 1L / 红色" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>价格 <span class="required">*</span></label>
                            <input type="number" id="variantFormPrice" placeholder="0.00" step="0.01" min="0" required>
                        </div>
                        <div class="form-group">
                            <label>库存</label>
                            <input type="number" id="variantFormStock" placeholder="0" min="0" value="0">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>SKU编码</label>
                            <input type="text" id="variantFormSku" placeholder="自动生成" readonly style="background:#F9FAFB;">
                        </div>
                        <div class="form-group">
                            <label>状态</label>
                            <select id="variantFormStatus">
                                <option value="active">活跃</option>
                                <option value="inactive">停用</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="variantModalCancel">取消</button>
                <button class="btn btn-primary" id="variantModalSave">
                    <i class="fas fa-save"></i> 保存
                </button>
            </div>
        </div>
    </div>

    <script type="module">
        // ============================================================
        // 产品变体模块
        // ============================================================
        window.VariantModule = {
            variants: [],
            filteredVariants: [],
            page: 1,
            pageSize: 9,
            editingId: null,

            init: function() {
                this.loadVariants();
                this.bindEvents();
                this.render();
                console.log('🔀 产品变体模块已初始化');
            },

            loadVariants: function() {
                try {
                    const saved = localStorage.getItem('variant_data');
                    if (saved) {
                        this.variants = JSON.parse(saved);
                    } else {
                        this.variants = this.getMockVariants();
                        localStorage.setItem('variant_data', JSON.stringify(this.variants));
                    }
                } catch (e) {
                    this.variants = this.getMockVariants();
                }
                this.filteredVariants = [...this.variants];
            },

            getMockVariants: function() {
                return [
                    { id: 'VR-001', product: '洗车液', option: '500ml', price: 68, stock: 45, status: 'active', sku: 'SKU-001', createdAt: new Date().toISOString() },
                    { id: 'VR-002', product: '洗车液', option: '1L', price: 128, stock: 30, status: 'active', sku: 'SKU-002', createdAt: new Date().toISOString() },
                    { id: 'VR-003', product: '洗车液', option: '5L', price: 388, stock: 12, status: 'active', sku: 'SKU-003', createdAt: new Date().toISOString() },
                    { id: 'VR-004', product: '抛光蜡', option: '200g', price: 88, stock: 20, status: 'active', sku: 'SKU-004', createdAt: new Date().toISOString() },
                    { id: 'VR-005', product: '抛光蜡', option: '500g', price: 168, stock: 15, status: 'inactive', sku: 'SKU-005', createdAt: new Date().toISOString() },
                    { id: 'VR-006', product: '内饰清洁剂', option: '500ml', price: 78, stock: 25, status: 'active', sku: 'SKU-006', createdAt: new Date().toISOString() },
                    { id: 'VR-007', product: '内饰清洁剂', option: '1L', price: 138, stock: 18, status: 'active', sku: 'SKU-007', createdAt: new Date().toISOString() },
                    { id: 'VR-008', product: '玻璃镀膜', option: '100ml', price: 228, stock: 12, status: 'active', sku: 'SKU-008', createdAt: new Date().toISOString() },
                    { id: 'VR-009', product: '玻璃镀膜', option: '250ml', price: 458, stock: 8, status: 'active', sku: 'SKU-009', createdAt: new Date().toISOString() },
                    { id: 'VR-010', product: '轮胎光亮剂', option: '500ml', price: 88, stock: 20, status: 'inactive', sku: 'SKU-010', createdAt: new Date().toISOString() }
                ];
            },

            saveVariants: function() {
                try {
                    localStorage.setItem('variant_data', JSON.stringify(this.variants));
                } catch (e) {}
            },

            render: function() {
                this.renderGrid();
                this.updateStats();
                this.renderPagination();
            },

            renderGrid: function() {
                const grid = document.getElementById('variantGrid');
                const start = (this.page - 1) * this.pageSize;
                const end = start + this.pageSize;
                const pageData = this.filteredVariants.slice(start, end);

                if (pageData.length === 0) {
                    grid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-code-branch"></i>
                            <p>暂无产品变体</p>
                            <span style="font-size:13px;">点击「新建变体」创建</span>
                        </div>
                    `;
                    return;
                }

                grid.innerHTML = pageData.map(v => {
                    const isLowStock = v.stock < 10 && v.stock > 0;
                    const isOutOfStock = v.stock === 0;
                    const statusClass = v.status === 'active' ? 'badge-success' : 'badge-secondary';
                    const statusLabel = v.status === 'active' ? '活跃' : '停用';

                    return `
                        <div class="variant-card">
                            <div class="variant-header">
                                <div>
                                    <div class="variant-product">${v.product}</div>
                                    <span class="variant-option">${v.option}</span>
                                    <div class="variant-sku">SKU: ${v.sku || 'N/A'}</div>
                                </div>
                                <span class="badge ${statusClass}">${statusLabel}</span>
                            </div>
                            <div class="variant-price">¥${v.price.toFixed(2)}</div>
                            <div class="variant-stock">
                                库存: <span class="${isLowStock || isOutOfStock ? 'low' : ''}">
                                    ${v.stock}
                                    ${isLowStock ? ' ⚠️' : ''}
                                    ${isOutOfStock ? ' 🚫 缺货' : ''}
                                </span>
                            </div>
                            <div class="variant-actions">
                                <button class="btn-sm btn-sm-primary" onclick="window.VariantModule.editVariant('${v.id}')">
                                    <i class="fas fa-edit"></i> 编辑
                                </button>
                                <button class="btn-sm ${v.status === 'active' ? 'btn-sm-warning' : 'btn-sm-success'}" 
                                        onclick="window.VariantModule.toggleVariant('${v.id}')">
                                    <i class="fas ${v.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                                </button>
                                <button class="btn-sm btn-sm-danger" onclick="window.VariantModule.deleteVariant('${v.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            },

            updateStats: function() {
                const total = this.variants.length;
                const active = this.variants.filter(v => v.status === 'active').length;
                const products = [...new Set(this.variants.map(v => v.product))];
                document.getElementById('totalVariants').textContent = total;
                document.getElementById('activeVariants').textContent = active;
                document.getElementById('variantProducts').textContent = products.length;
            },

            renderPagination: function() {
                const total = this.filteredVariants.length;
                const totalPages = Math.ceil(total / this.pageSize) || 1;
                document.getElementById('variantPageInfo').textContent = `共 ${total} 条，第 ${this.page}/${totalPages} 页`;

                const container = document.getElementById('variantPageNumbers');
                let html = '';
                for (let i = 1; i <= Math.min(totalPages, 5); i++) {
                    html += `<button class="${i === this.page ? 'active' : ''}" onclick="window.VariantModule.goToPage(${i})">${i}</button>`;
                }
                if (totalPages > 5) {
                    html += `<span style="color:#9CA3AF;padding:0 4px;">...</span>`;
                    html += `<button onclick="window.VariantModule.goToPage(${totalPages})">${totalPages}</button>`;
                }
                container.innerHTML = html;

                document.getElementById('variantPrevPage').disabled = this.page <= 1;
                document.getElementById('variantNextPage').disabled = this.page >= totalPages;
            },

            goToPage: function(page) {
                const totalPages = Math.ceil(this.filteredVariants.length / this.pageSize) || 1;
                if (page < 1 || page > totalPages) return;
                this.page = page;
                this.render();
            },

            prevPage: function() {
                if (this.page > 1) { this.page--; this.render(); }
            },

            nextPage: function() {
                const totalPages = Math.ceil(this.filteredVariants.length / this.pageSize) || 1;
                if (this.page < totalPages) { this.page++; this.render(); }
            },

            handleSearch: function() {
                const search = document.getElementById('variantSearch').value.toLowerCase();
                const status = document.getElementById('variantStatusFilter').value;

                this.filteredVariants = this.variants.filter(v => {
                    let match = true;
                    if (search && !v.product.toLowerCase().includes(search) && !(v.sku && v.sku.toLowerCase().includes(search))) {
                        match = false;
                    }
                    if (status && v.status !== status) match = false;
                    return match;
                });
                this.page = 1;
                this.render();
            },

            handleReset: function() {
                document.getElementById('variantSearch').value = '';
                document.getElementById('variantStatusFilter').value = '';
                this.filteredVariants = [...this.variants];
                this.page = 1;
                this.render();
            },

            showCreateModal: function() {
                this.editingId = null;
                document.getElementById('variantModalTitle').textContent = '新建变体';
                document.getElementById('variantForm').reset();
                document.getElementById('variantFormStatus').value = 'active';
                document.getElementById('variantFormSku').value = 'SKU-' + Date.now().toString().slice(-6);
                document.getElementById('variantModal').classList.add('active');
            },

            editVariant: function(id) {
                const variant = this.variants.find(v => v.id === id);
                if (!variant) return;
                this.editingId = id;
                document.getElementById('variantModalTitle').textContent = '编辑变体 - ' + variant.product;
                document.getElementById('variantFormProduct').value = variant.product;
                document.getElementById('variantFormOption').value = variant.option;
                document.getElementById('variantFormPrice').value = variant.price;
                document.getElementById('variantFormStock').value = variant.stock;
                document.getElementById('variantFormSku').value = variant.sku || '';
                document.getElementById('variantFormStatus').value = variant.status;
                document.getElementById('variantModal').classList.add('active');
            },

            closeModal: function() {
                document.getElementById('variantModal').classList.remove('active');
            },

            saveVariant: function() {
                const product = document.getElementById('variantFormProduct').value.trim();
                const option = document.getElementById('variantFormOption').value.trim();
                const price = parseFloat(document.getElementById('variantFormPrice').value);
                const stock = parseInt(document.getElementById('variantFormStock').value) || 0;
                const sku = document.getElementById('variantFormSku').value.trim() || 'SKU-' + Date.now().toString().slice(-6);
                const status = document.getElementById('variantFormStatus').value;

                if (!product) { alert('请输入商品名称'); return; }
                if (!option) { alert('请输入规格选项'); return; }
                if (isNaN(price) || price < 0) { alert('请输入有效的价格'); return; }

                if (this.editingId) {
                    const index = this.variants.findIndex(v => v.id === this.editingId);
                    if (index >= 0) {
                        this.variants[index] = { ...this.variants[index], product, option, price, stock, sku, status };
                    }
                    alert('✅ 变体已更新');
                } else {
                    const newVariant = {
                        id: 'VR-' + Date.now().toString().slice(-6),
                        product, option, price, stock, sku, status,
                        createdAt: new Date().toISOString()
                    };
                    this.variants.push(newVariant);
                    alert('✅ 变体已创建');
                }

                this.saveVariants();
                this.filteredVariants = [...this.variants];
                this.closeModal();
                this.render();
            },

            toggleVariant: function(id) {
                const variant = this.variants.find(v => v.id === id);
                if (variant) {
                    variant.status = variant.status === 'active' ? 'inactive' : 'active';
                    this.saveVariants();
                    this.filteredVariants = [...this.variants];
                    this.render();
                    alert(`✅ 变体 "${variant.product} - ${variant.option}" 已${variant.status === 'active' ? '启用' : '停用'}`);
                }
            },

            deleteVariant: function(id) {
                const variant = this.variants.find(v => v.id === id);
                if (!variant) return;
                if (!confirm(`确认删除变体 "${variant.product} - ${variant.option}"？`)) return;
                this.variants = this.variants.filter(v => v.id !== id);
                this.filteredVariants = [...this.variants];
                this.saveVariants();
                this.render();
                alert('🗑️ 变体已删除');
            },

            refresh: function() {
                this.loadVariants();
                this.filteredVariants = [...this.variants];
                this.page = 1;
                this.render();
                alert('✅ 数据已刷新');
            },

            bindEvents: function() {
                document.getElementById('variantSearchBtn')?.addEventListener('click', () => this.handleSearch());
                document.getElementById('variantResetBtn')?.addEventListener('click', () => this.handleReset());
                document.getElementById('addVariantBtn')?.addEventListener('click', () => this.showCreateModal());
                document.getElementById('refreshVariantsBtn')?.addEventListener('click', () => this.refresh());

                document.getElementById('variantPrevPage')?.addEventListener('click', () => this.prevPage());
                document.getElementById('variantNextPage')?.addEventListener('click', () => this.nextPage());

                document.querySelectorAll('#variantSearch, #variantStatusFilter').forEach(el => {
                    el.addEventListener('keypress', e => { if (e.key === 'Enter') this.handleSearch(); });
                });

                document.getElementById('variantModalClose')?.addEventListener('click', () => this.closeModal());
                document.getElementById('variantModalCancel')?.addEventListener('click', () => this.closeModal());
                document.getElementById('variantModal')?.addEventListener('click', (e) => {
                    if (e.target === e.currentTarget) this.closeModal();
                });
                document.getElementById('variantModalSave')?.addEventListener('click', () => this.saveVariant());

                // 自动生成SKU
                document.getElementById('variantFormProduct')?.addEventListener('input', function() {
                    const skuField = document.getElementById('variantFormSku');
                    if (!skuField.value || skuField.value.startsWith('SKU-')) {
                        skuField.value = 'SKU-' + this.value.substring(0, 3).toUpperCase() + Date.now().toString().slice(-4);
                    }
                });

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.closeModal();
                });
            }
        };

        document.addEventListener('DOMContentLoaded', function() {
            window.VariantModule.init();
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'Variants',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    /**
 * @file variants.js
 * @module variants
 * @description 产品变体管理 - 商品规格、SKU管理
 * 
 * @example
 * import { init } from './variants.js';
 * await init();
 * 
 * @author Carwash Pro Team
 * @version 1.0.0
 */

import { store } from '../js/core/store.js';
import { showToast } from '../js/core/init.js';

/**
 * @typedef {Object} Variant
 * @property {string} id - 变体ID
 * @property {string} productId - 商品ID
 * @property {string} productName - 商品名称
 * @property {string} sku - SKU编码
 * @property {Object} attributes - 属性 (如: {color: '红色', size: 'L'})
 * @property {number} price - 价格
 * @property {number} stock - 库存
 * @property {string} status - 状态 (active/inactive)
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/** @type {{variants: Variant[], searchQuery: string, statusFilter: string}} 状态 */
const state = {
    variants: [],
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
 * @returns {Variant[]} 模拟变体数据
 */
function getMockVariants() {
    const products = ['精致洗车', '深度清洁', '抛光打蜡'];
    const colors = ['红色', '蓝色', '黑色', '白色'];
    const sizes = ['S', 'M', 'L', 'XL'];
    
    const variants = [];
    for (let i = 0; i < 8; i++) {
        const idx = i % products.length;
        variants.push({
            id: 'VAR' + String(i + 1).padStart(4, '0'),
            productId: 'P' + String(idx + 1).padStart(3, '0'),
            productName: products[idx],
            sku: 'SKU-' + String(Math.floor(Math.random() * 10000)).padStart(6, '0'),
            attributes: {
                color: colors[Math.floor(Math.random() * colors.length)],
                size: sizes[Math.floor(Math.random() * sizes.length)]
            },
            price: 68 + Math.floor(Math.random() * 200),
            stock: Math.floor(Math.random() * 50) + 5,
            status: Math.random() > 0.2 ? 'active' : 'inactive',
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    return variants;
}

/**
 * @private
 * @description 加载变体数据
 */
function loadVariants() {
    try {
        const saved = localStorage.getItem('variant_data');
        if (saved) {
            state.variants = JSON.parse(saved);
        } else {
            state.variants = getMockVariants();
            localStorage.setItem('variant_data', JSON.stringify(state.variants));
        }
    } catch (e) {
        console.warn('加载变体数据失败:', e);
        state.variants = getMockVariants();
    }
    renderVariants();
    updateStats();
}

/**
 * @private
 * @description 保存变体数据
 */
function saveVariants() {
    try {
        localStorage.setItem('variant_data', JSON.stringify(state.variants));
    } catch (e) {
        console.warn('保存变体数据失败:', e);
    }
}

/**
 * @private
 * @description 渲染变体列表
 */
function renderVariants() {
    const container = document.getElementById('variantListBody');
    if (!container) return;
    
    let filtered = state.variants;
    
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(v => 
            v.productName.toLowerCase().includes(query) ||
            v.sku.toLowerCase().includes(query) ||
            Object.values(v.attributes).some(attr => String(attr).toLowerCase().includes(query))
        );
    }
    
    if (state.statusFilter !== 'all') {
        filtered = filtered.filter(v => v.status === state.statusFilter);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:40px;color:#9CA3AF;">
                    <i class="fas fa-code-branch" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                    暂无变体数据
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(variant => {
        const attrStr = Object.entries(variant.attributes)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' | ');
        
        return `
            <tr style="border-bottom:1px solid #F3F4F6;transition:background 0.2s;"
                onmouseover="this.style.background='#F9FAFB'"
                onmouseout="this.style.background=''">
                <td style="padding:12px;font-weight:500;">${variant.productName}</td>
                <td style="padding:12px;font-family:monospace;font-size:13px;">${variant.sku}</td>
                <td style="padding:12px;font-size:13px;color:#6B7280;">${attrStr}</td>
                <td style="padding:12px;text-align:right;font-weight:600;">¥${formatCurrency(variant.price)}</td>
                <td style="padding:12px;text-align:center;">${variant.stock}</td>
                <td style="padding:12px;">
                    <span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${variant.status === 'active' ? '#D1FAE5' : '#FEE2E2'};color:${variant.status === 'active' ? '#065F46' : '#991B1B'};">
                        ${variant.status === 'active' ? '启用' : '禁用'}
                    </span>
                </td>
                <td style="padding:12px;text-align:center;">
                    <button class="btn btn-sm btn-outline" onclick="window.VariantsModule.editVariant('${variant.id}')" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.VariantsModule.deleteVariant('${variant.id}')" title="删除">
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
    const total = state.variants.length;
    const active = state.variants.filter(v => v.status === 'active').length;
    const inactive = state.variants.filter(v => v.status === 'inactive').length;
    const totalStock = state.variants.reduce((sum, v) => sum + v.stock, 0);
    
    const elements = {
        'statTotal': total,
        'statActive': active,
        'statInactive': inactive,
        'statTotalStock': totalStock
    };
    
    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    });
}

/**
 * @private
 * @param {string} id - 变体ID
 * @description 编辑变体
 */
function editVariant(id) {
    const variant = state.variants.find(v => v.id === id);
    if (!variant) {
        showToast('变体不存在', 'error');
        return;
    }
    
    const price = parseFloat(prompt('价格：', variant.price));
    if (isNaN(price) || price < 0) {
        showToast('请输入有效价格', 'error');
        return;
    }
    
    const stock = parseInt(prompt('库存数量：', variant.stock));
    if (isNaN(stock) || stock < 0) {
        showToast('请输入有效库存', 'error');
        return;
    }
    
    const status = confirm('是否启用？\n点击"确定"启用，点击"取消"禁用');
    
    variant.price = price;
    variant.stock = stock;
    variant.status = status ? 'active' : 'inactive';
    variant.updatedAt = new Date().toISOString();
    
    saveVariants();
    renderVariants();
    updateStats();
    showToast('变体已更新', 'success');
}

/**
 * @private
 * @param {string} id - 变体ID
 * @description 删除变体
 */
function deleteVariant(id) {
    const variant = state.variants.find(v => v.id === id);
    if (!variant) {
        showToast('变体不存在', 'error');
        return;
    }
    
    if (!confirm(`确认删除变体 "${variant.productName} - ${variant.sku}"？`)) return;
    
    state.variants = state.variants.filter(v => v.id !== id);
    saveVariants();
    renderVariants();
    updateStats();
    showToast('变体已删除', 'success');
}

/**
 * @private
 * @description 新增变体
 */
function newVariant() {
    const productName = prompt('商品名称：');
    if (!productName) return;
    
    const sku = prompt('SKU编码：', 'SKU-' + String(Math.floor(Math.random() * 10000)).padStart(6, '0'));
    if (!sku) return;
    
    const price = parseFloat(prompt('价格：', '68'));
    if (isNaN(price) || price < 0) {
        showToast('请输入有效价格', 'error');
        return;
    }
    
    const stock = parseInt(prompt('库存数量：', '10'));
    if (isNaN(stock) || stock < 0) {
        showToast('请输入有效库存', 'error');
        return;
    }
    
    const attrKeys = prompt('属性名称（用逗号分隔，如：颜色,尺寸）：', '颜色,尺寸');
    const attrValues = prompt('属性值（用逗号分隔，如：红色,L）：', '红色,L');
    
    const attributes = {};
    if (attrKeys && attrValues) {
        const keys = attrKeys.split(',').map(k => k.trim());
        const values = attrValues.split(',').map(v => v.trim());
        keys.forEach((key, i) => {
            if (i < values.length) {
                attributes[key] = values[i];
            }
        });
    }
    
    const status = confirm('是否启用？\n点击"确定"启用，点击"取消"禁用');
    
    const variant = {
        id: 'VAR' + String(state.variants.length + 1).padStart(4, '0'),
        productId: 'P' + String(Math.floor(Math.random() * 999) + 1).padStart(3, '0'),
        productName: productName,
        sku: sku,
        attributes: attributes,
        price: price,
        stock: stock,
        status: status ? 'active' : 'inactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    state.variants.push(variant);
    saveVariants();
    renderVariants();
    updateStats();
    showToast('变体已创建', 'success');
}

/**
 * @private
 * @description 搜索变体
 */
function searchVariants(query) {
    state.searchQuery = query;
    renderVariants();
}

/**
 * @private
 * @description 应用筛选
 */
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter');
    state.statusFilter = statusFilter ? statusFilter.value : 'all';
    renderVariants();
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
    renderVariants();
}

/**
 * @private
 * @description 刷新数据
 */
function refresh() {
    loadVariants();
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
                searchVariants(this.value);
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
    
    const refreshBtn = document.getElementById('refreshVariants');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refresh);
    }
    
    const newBtn = document.getElementById('newVariant');
    if (newBtn) {
        newBtn.addEventListener('click', newVariant);
    }
}

/**
 * @public
 * @param {Object} options - 初始化选项
 * @returns {Promise<void>}
 */
export async function init(options) {
    console.log('🔀 产品变体 初始化...');
    
    if (options?.data) {
        state.variants = options.data;
        saveVariants();
    } else {
        loadVariants();
    }
    
    updateStats();
    bindEvents();
    
    window.VariantsModule = {
        state,
        loadVariants,
        renderVariants,
        updateStats,
        editVariant,
        deleteVariant,
        newVariant,
        searchVariants,
        applyFilters,
        resetFilters,
        refresh,
        saveVariants
    };
    
    console.log('✅ 产品变体 初始化完成');
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export default {
    init,
    loadVariants,
    editVariant,
    deleteVariant,
    newVariant,
    searchVariants,
    refresh,
    saveVariants
};
  },
  methods: {}
}
</script>

<style scoped>

</style>

