<template>
  <div class="products-">
    



    <div class="products-container">
        
        <div class="page-header">
            <div>
                <h1>
                    <i class="fas fa-box" style="color:#4F46E5;"></i>
                    商品管理
                    <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">产品中心</span>
                </h1>
                <div class="subtitle">商品信息管理与库存监控 · 支持分类/品牌/变体管理</div>
            </div>
            <div class="header-actions">
                <button class="btn btn-success" id="addProductBtn">
                    <i class="fas fa-plus"></i> 添加商品
                </button>
                <button class="btn btn-outline" id="importProductsBtn">
                    <i class="fas fa-file-import"></i> 导入
                </button>
                <button class="btn btn-outline" id="exportProductsBtn">
                    <i class="fas fa-file-export"></i> 导出
                </button>
                <button class="btn btn-outline" id="refreshProductsBtn">
                    <i class="fas fa-sync"></i>
                </button>
            </div>
        </div>

        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number primary" id="totalProducts">0</div>
                <div class="stat-label">📦 总商品</div>
            </div>
            <div class="stat-card">
                <div class="stat-number success" id="activeProducts">0</div>
                <div class="stat-label">✅ 上架</div>
            </div>
            <div class="stat-card">
                <div class="stat-number danger" id="inactiveProducts">0</div>
                <div class="stat-label">⛔ 下架</div>
            </div>
            <div class="stat-card">
                <div class="stat-number warning" id="lowStockProducts">0</div>
                <div class="stat-label">⚠️ 低库存</div>
            </div>
            <div class="stat-card">
                <div class="stat-number purple" id="totalCategories">0</div>
                <div class="stat-label">📊 分类数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">¥<span id="totalValue">0</span></div>
                <div class="stat-label">💰 库存价值</div>
            </div>
        </div>

        
        <div class="filter-tags">
            <button class="filter-tag active" data-filter="all">全部</button>
            <button class="filter-tag" data-filter="active">✅ 上架</button>
            <button class="filter-tag" data-filter="inactive">⛔ 下架</button>
            <button class="filter-tag" data-filter="low-stock">⚠️ 低库存</button>
            <button class="filter-tag" data-filter="out-of-stock">🚫 缺货</button>
        </div>

        
        <div class="toolbar">
            <input type="text" class="search-box" id="productSearch" placeholder="🔍 搜索商品名称、编码...">
            <select class="filter-select" id="productCategoryFilter">
                <option value="">全部分类</option>
                <option value="洗车">🚗 洗车</option>
                <option value="美容">✨ 美容</option>
                <option value="保养">🔧 保养</option>
                <option value="配件">🧩 配件</option>
                <option value="套餐">📦 套餐</option>
                <option value="会员">💳 会员</option>
            </select>
            <select class="filter-select" id="productStatusFilter">
                <option value="">全部状态</option>
                <option value="active">上架</option>
                <option value="inactive">下架</option>
            </select>
            <button class="btn btn-primary" id="productSearchBtn">
                <i class="fas fa-search"></i> 搜索
            </button>
            <button class="btn btn-outline" id="productResetBtn">
                <i class="fas fa-undo"></i> 重置
            </button>
        </div>

        
        <div class="table-container">
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th style="min-width:200px;">商品信息</th>
                            <th>分类</th>
                            <th style="text-align:right;min-width:80px;">售价</th>
                            <th style="text-align:right;min-width:80px;">成本</th>
                            <th style="text-align:right;min-width:80px;">库存</th>
                            <th style="min-width:80px;">状态</th>
                            <th style="text-align:center;min-width:120px;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="productsTableBody">
                        <tr>
                            <td colspan="7" style="text-align:center;padding:40px;color:#9CA3AF;">
                                <i class="fas fa-spinner fa-spin" style="font-size:24px;display:block;margin-bottom:8px;"></i>
                                加载中...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <span class="info" id="pageInfo">共 0 条，第 1/1 页</span>
                <div class="btn-group">
                    <button id="prevPage" disabled><i class="fas fa-chevron-left"></i></button>
                    <span id="pageNumbers" style="display:flex;gap:4px;align-items:center;">
                        <button class="active">1</button>
                    </span>
                    <button id="nextPage" disabled><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    </div>

    
    <div class="modal-overlay" id="productModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">新建商品</h3>
                <button class="modal-close" id="modalCloseBtn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="productForm" autocomplete="off">
                    <div class="form-group">
                        <label>商品名称 <span class="required">*</span></label>
                        <input type="text" id="formName" placeholder="输入商品名称" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>分类 <span class="required">*</span></label>
                            <select id="formCategory">
                                <option value="洗车">🚗 洗车</option>
                                <option value="美容">✨ 美容</option>
                                <option value="保养">🔧 保养</option>
                                <option value="配件">🧩 配件</option>
                                <option value="套餐">📦 套餐</option>
                                <option value="会员">💳 会员</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>单位</label>
                            <input type="text" id="formUnit" placeholder="个/件/瓶" value="个">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>售价 <span class="required">*</span></label>
                            <input type="number" id="formPrice" placeholder="0.00" step="0.01" min="0">
                        </div>
                        <div class="form-group">
                            <label>成本</label>
                            <input type="number" id="formCost" placeholder="0.00" step="0.01" min="0">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>库存 <span class="required">*</span></label>
                            <input type="number" id="formStock" placeholder="0" min="0">
                        </div>
                        <div class="form-group">
                            <label>状态</label>
                            <select id="formStatus">
                                <option value="active">上架</option>
                                <option value="inactive">下架</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>描述</label>
                        <textarea id="formDescription" placeholder="商品描述信息..." rows="2"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="modalCancelBtn">取消</button>
                <button class="btn btn-primary" id="modalSaveBtn">
                    <i class="fas fa-save"></i> 保存
                </button>
            </div>
        </div>
    </div>

    <script type="module">
        // ============================================================
        // 商品管理模块 - 完整功能
        // ============================================================
        window.ProductModule = {
            products: [],
            filteredProducts: [],
            page: 1,
            pageSize: 10,
            editingId: null,

            // ---------- 初始化 ----------
            init: function() {
                this.loadProducts();
                this.bindEvents();
                this.render();
                console.log('📦 商品管理模块已初始化');
            },

            // ---------- 数据加载 ----------
            loadProducts: function() {
                try {
                    const saved = localStorage.getItem('product_data');
                    if (saved) {
                        this.products = JSON.parse(saved);
                    } else {
                        this.products = this.getMockProducts();
                        localStorage.setItem('product_data', JSON.stringify(this.products));
                    }
                } catch (e) {
                    this.products = this.getMockProducts();
                }
                this.filteredProducts = [...this.products];
            },

            getMockProducts: function() {
                const now = new Date().toISOString();
                return [
                    { id: 'P001', name: '泡沫洗车液', category: '洗车', price: 68, cost: 35, stock: 45, unit: '瓶', status: 'active', description: '高浓度泡沫洗车液', createdAt: now, updatedAt: now },
                    { id: 'P002', name: '水蜡', category: '洗车', price: 128, cost: 65, stock: 30, unit: '瓶', status: 'active', description: '快速上光水蜡', createdAt: now, updatedAt: now },
                    { id: 'P003', name: '轮胎光亮剂', category: '美容', price: 88, cost: 40, stock: 20, unit: '瓶', status: 'active', description: '轮胎增黑光亮', createdAt: now, updatedAt: now },
                    { id: 'P004', name: '抛光蜡', category: '美容', price: 388, cost: 200, stock: 15, unit: '盒', status: 'active', description: '镜面抛光蜡', createdAt: now, updatedAt: now },
                    { id: 'P005', name: '内饰清洁剂', category: '保养', price: 78, cost: 35, stock: 25, unit: '瓶', status: 'inactive', description: '中性内饰清洁', createdAt: now, updatedAt: now },
                    { id: 'P006', name: '发动机清洗剂', category: '保养', price: 188, cost: 90, stock: 10, unit: '瓶', status: 'active', description: '发动机舱清洗', createdAt: now, updatedAt: now },
                    { id: 'P007', name: '空调清洗剂', category: '保养', price: 158, cost: 75, stock: 8, unit: '瓶', status: 'active', description: '空调系统清洗', createdAt: now, updatedAt: now },
                    { id: 'P008', name: '玻璃镀膜', category: '美容', price: 228, cost: 120, stock: 12, unit: '瓶', status: 'active', description: '玻璃防水镀膜', createdAt: now, updatedAt: now },
                    { id: 'P009', name: '漆面镀晶', category: '美容', price: 688, cost: 350, stock: 5, unit: '套', status: 'active', description: '纳米镀晶保护', createdAt: now, updatedAt: now },
                    { id: 'P010', name: '洗车月卡', category: '会员', price: 398, cost: 200, stock: 50, unit: '张', status: 'active', description: '月度洗车卡', createdAt: now, updatedAt: now },
                    { id: 'P011', name: '洗车季卡', category: '会员', price: 998, cost: 500, stock: 30, unit: '张', status: 'active', description: '季度洗车卡', createdAt: now, updatedAt: now },
                    { id: 'P012', name: 'VIP年卡', category: '会员', price: 2998, cost: 1500, stock: 20, unit: '张', status: 'active', description: 'VIP年度会员卡', createdAt: now, updatedAt: now }
                ];
            },

            saveProducts: function() {
                try {
                    localStorage.setItem('product_data', JSON.stringify(this.products));
                } catch (e) {}
            },

            // ---------- 渲染 ----------
            render: function() {
                this.renderTable();
                this.updateStats();
                this.renderPagination();
            },

            renderTable: function() {
                const tbody = document.getElementById('productsTableBody');
                const start = (this.page - 1) * this.pageSize;
                const end = start + this.pageSize;
                const pageData = this.filteredProducts.slice(start, end);

                if (pageData.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="7" style="text-align:center;padding:40px;color:#9CA3AF;">
                                <i class="fas fa-box" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                                暂无商品数据
                            </td>
                        </tr>
                    `;
                    return;
                }

                const statusMap = { active: '上架', inactive: '下架' };
                const statusClass = { active: 'badge-success', inactive: 'badge-danger' };
                const iconMap = {
                    '洗车': '🚗',
                    '美容': '✨',
                    '保养': '🔧',
                    '配件': '🧩',
                    '套餐': '📦',
                    '会员': '💳'
                };

                tbody.innerHTML = pageData.map(p => {
                    const isLowStock = p.stock < 10 && p.status === 'active';
                    const isOutOfStock = p.stock === 0;
                    const statusLabel = isOutOfStock ? '缺货' : statusMap[p.status] || p.status;
                    const statusCls = isOutOfStock ? 'badge-danger' : (statusClass[p.status] || 'badge-secondary');

                    return `
                        <tr>
                            <td>
                                <div class="product-info-cell">
                                    <div class="product-icon">${iconMap[p.category] || '📦'}</div>
                                    <div>
                                        <div class="product-name">${p.name}</div>
                                        <div class="product-id">${p.id} · ${p.unit || '个'}</div>
                                    </div>
                                </div>
                            </td>
                            <td>${p.category}</td>
                            <td style="text-align:right;font-weight:600;color:#4F46E5;">¥${p.price.toFixed(2)}</td>
                            <td style="text-align:right;color:#6B7280;">¥${(p.cost || 0).toFixed(2)}</td>
                            <td style="text-align:right;">
                                <span class="${isLowStock || isOutOfStock ? 'stock-warning' : ''}">
                                    ${p.stock}
                                    ${isLowStock ? '<span class="icon">⚠️</span>' : ''}
                                    ${isOutOfStock ? '<span class="icon">🚫</span>' : ''}
                                </span>
                            </td>
                            <td>
                                <span class="badge ${statusCls}">
                                    ${isOutOfStock ? '🚫 缺货' : statusLabel}
                                </span>
                            </td>
                            <td style="text-align:center;">
                                <div class="product-actions">
                                    <button class="btn-icon btn-icon-primary" onclick="window.ProductModule.editProduct('${p.id}')" title="编辑">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon ${p.status === 'active' ? 'btn-icon-warning' : 'btn-icon-success'}" 
                                            onclick="window.ProductModule.toggleProduct('${p.id}')" 
                                            title="${p.status === 'active' ? '下架' : '上架'}">
                                        <i class="fas ${p.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                                    </button>
                                    <button class="btn-icon btn-icon-danger" onclick="window.ProductModule.deleteProduct('${p.id}')" title="删除">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            },

            updateStats: function() {
                const total = this.products.length;
                const active = this.products.filter(p => p.status === 'active').length;
                const inactive = this.products.filter(p => p.status === 'inactive').length;
                const lowStock = this.products.filter(p => p.stock < 10 && p.status === 'active').length;
                const categories = [...new Set(this.products.map(p => p.category))];
                const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.stock), 0);

                document.getElementById('totalProducts').textContent = total;
                document.getElementById('activeProducts').textContent = active;
                document.getElementById('inactiveProducts').textContent = inactive;
                document.getElementById('lowStockProducts').textContent = lowStock;
                document.getElementById('totalCategories').textContent = categories.length;
                document.getElementById('totalValue').textContent = totalValue.toLocaleString();
            },

            renderPagination: function() {
                const total = this.filteredProducts.length;
                const totalPages = Math.ceil(total / this.pageSize) || 1;
                document.getElementById('pageInfo').textContent = `共 ${total} 条，第 ${this.page}/${totalPages} 页`;

                const container = document.getElementById('pageNumbers');
                let html = '';
                const maxShow = 7;

                if (totalPages <= maxShow) {
                    for (let i = 1; i <= totalPages; i++) {
                        html += `<button class="${i === this.page ? 'active' : ''}" onclick="window.ProductModule.goToPage(${i})">${i}</button>`;
                    }
                } else {
                    html += `<button class="${1 === this.page ? 'active' : ''}" onclick="window.ProductModule.goToPage(1)">1</button>`;
                    if (this.page > 3) html += `<span style="color:#9CA3AF;padding:0 4px;">...</span>`;
                    
                    const startPage = Math.max(2, this.page - 2);
                    const endPage = Math.min(totalPages - 1, this.page + 2);
                    for (let i = startPage; i <= endPage; i++) {
                        html += `<button class="${i === this.page ? 'active' : ''}" onclick="window.ProductModule.goToPage(${i})">${i}</button>`;
                    }
                    
                    if (this.page < totalPages - 2) html += `<span style="color:#9CA3AF;padding:0 4px;">...</span>`;
                    html += `<button class="${totalPages === this.page ? 'active' : ''}" onclick="window.ProductModule.goToPage(${totalPages})">${totalPages}</button>`;
                }

                container.innerHTML = html;

                document.getElementById('prevPage').disabled = this.page <= 1;
                document.getElementById('nextPage').disabled = this.page >= totalPages;
            },

            goToPage: function(page) {
                const totalPages = Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
                if (page < 1 || page > totalPages) return;
                this.page = page;
                this.render();
            },

            prevPage: function() {
                if (this.page > 1) { this.page--; this.render(); }
            },

            nextPage: function() {
                const totalPages = Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
                if (this.page < totalPages) { this.page++; this.render(); }
            },

            // ---------- 搜索筛选 ----------
            handleSearch: function() {
                const name = document.getElementById('productSearch').value.toLowerCase();
                const category = document.getElementById('productCategoryFilter').value;
                const status = document.getElementById('productStatusFilter').value;

                this.filteredProducts = this.products.filter(p => {
                    let match = true;
                    if (name && !p.name.toLowerCase().includes(name) && !p.id.toLowerCase().includes(name)) match = false;
                    if (category && p.category !== category) match = false;
                    if (status && p.status !== status) match = false;
                    return match;
                });
                this.page = 1;
                this.render();
            },

            handleReset: function() {
                document.getElementById('productSearch').value = '';
                document.getElementById('productCategoryFilter').value = '';
                document.getElementById('productStatusFilter').value = '';
                this.filteredProducts = [...this.products];
                this.page = 1;
                this.render();
            },

            // ---------- 快速筛选 ----------
            quickFilter: function(filter) {
                const tags = document.querySelectorAll('.filter-tag');
                tags.forEach(t => t.classList.toggle('active', t.dataset.filter === filter));

                switch (filter) {
                    case 'all':
                        this.filteredProducts = [...this.products];
                        break;
                    case 'active':
                        this.filteredProducts = this.products.filter(p => p.status === 'active');
                        break;
                    case 'inactive':
                        this.filteredProducts = this.products.filter(p => p.status === 'inactive');
                        break;
                    case 'low-stock':
                        this.filteredProducts = this.products.filter(p => p.stock < 10 && p.stock > 0 && p.status === 'active');
                        break;
                    case 'out-of-stock':
                        this.filteredProducts = this.products.filter(p => p.stock === 0);
                        break;
                    default:
                        this.filteredProducts = [...this.products];
                }
                this.page = 1;
                this.render();
            },

            // ---------- CRUD操作 ----------
            showCreateModal: function() {
                this.editingId = null;
                document.getElementById('modalTitle').textContent = '新建商品';
                document.getElementById('productForm').reset();
                document.getElementById('formStatus').value = 'active';
                document.getElementById('formUnit').value = '个';
                document.getElementById('productModal').classList.add('active');
            },

            editProduct: function(id) {
                const product = this.products.find(p => p.id === id);
                if (!product) return;
                this.editingId = id;
                document.getElementById('modalTitle').textContent = '编辑商品 - ' + product.name;
                document.getElementById('formName').value = product.name;
                document.getElementById('formCategory').value = product.category;
                document.getElementById('formPrice').value = product.price;
                document.getElementById('formCost').value = product.cost || '';
                document.getElementById('formStock').value = product.stock;
                document.getElementById('formUnit').value = product.unit || '个';
                document.getElementById('formStatus').value = product.status;
                document.getElementById('formDescription').value = product.description || '';
                document.getElementById('productModal').classList.add('active');
            },

            closeModal: function() {
                document.getElementById('productModal').classList.remove('active');
            },

            saveProduct: function() {
                const name = document.getElementById('formName').value.trim();
                const category = document.getElementById('formCategory').value;
                const price = parseFloat(document.getElementById('formPrice').value);
                const cost = parseFloat(document.getElementById('formCost').value) || 0;
                const stock = parseInt(document.getElementById('formStock').value) || 0;
                const unit = document.getElementById('formUnit').value.trim() || '个';
                const status = document.getElementById('formStatus').value;
                const description = document.getElementById('formDescription').value.trim();

                if (!name) { alert('请输入商品名称'); return; }
                if (isNaN(price) || price < 0) { alert('请输入有效的价格'); return; }
                if (isNaN(stock) || stock < 0) { alert('请输入有效的库存数量'); return; }

                if (this.editingId) {
                    const index = this.products.findIndex(p => p.id === this.editingId);
                    if (index >= 0) {
                        this.products[index] = {
                            ...this.products[index],
                            name, category, price, cost, stock, unit, status, description,
                            updatedAt: new Date().toISOString()
                        };
                    }
                    alert('✅ 商品已更新');
                } else {
                    const newProduct = {
                        id: 'P' + Date.now().toString().slice(-6),
                        name, category, price, cost, stock, unit, status, description,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    this.products.push(newProduct);
                    alert('✅ 商品已创建');
                }

                this.saveProducts();
                this.filteredProducts = [...this.products];
                this.closeModal();
                this.render();
            },

            toggleProduct: function(id) {
                const product = this.products.find(p => p.id === id);
                if (product) {
                    product.status = product.status === 'active' ? 'inactive' : 'active';
                    product.updatedAt = new Date().toISOString();
                    this.saveProducts();
                    this.filteredProducts = [...this.products];
                    this.render();
                    alert(`✅ 商品 "${product.name}" 已${product.status === 'active' ? '上架' : '下架'}`);
                }
            },

            deleteProduct: function(id) {
                const product = this.products.find(p => p.id === id);
                if (!product) return;
                if (!confirm(`确认删除商品 "${product.name}"？此操作不可恢复！`)) return;
                this.products = this.products.filter(p => p.id !== id);
                this.filteredProducts = [...this.products];
                this.saveProducts();
                this.render();
                alert('🗑️ 商品已删除');
            },

            // ---------- 导入导出 ----------
            exportProducts: function() {
                const data = JSON.stringify(this.products, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `products_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                alert('✅ 商品数据已导出');
            },

            importProducts: function() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        try {
                            const data = JSON.parse(ev.target.result);
                            if (Array.isArray(data) && data.length > 0 && data[0].name) {
                                this.products = data;
                                this.saveProducts();
                                this.filteredProducts = [...this.products];
                                this.render();
                                alert('✅ 商品数据已导入，共 ' + data.length + ' 条');
                            } else {
                                alert('❌ 无效的数据格式');
                            }
                        } catch (err) {
                            alert('❌ 解析文件失败: ' + err.message);
                        }
                    };
                    reader.readAsText(file);
                };
                input.click();
            },

            // ---------- 刷新 ----------
            refresh: function() {
                this.loadProducts();
                this.filteredProducts = [...this.products];
                this.page = 1;
                this.render();
                alert('✅ 数据已刷新');
            },

            // ---------- 事件绑定 ----------
            bindEvents: function() {
                // 搜索
                document.getElementById('productSearchBtn')?.addEventListener('click', () => this.handleSearch());
                document.getElementById('productResetBtn')?.addEventListener('click', () => this.handleReset());
                document.querySelectorAll('#productSearch, #productCategoryFilter, #productStatusFilter').forEach(el => {
                    el.addEventListener('keypress', e => { if (e.key === 'Enter') this.handleSearch(); });
                });

                // 分页
                document.getElementById('prevPage')?.addEventListener('click', () => this.prevPage());
                document.getElementById('nextPage')?.addEventListener('click', () => this.nextPage());

                // 快速筛选
                document.querySelectorAll('.filter-tag').forEach(el => {
                    el.addEventListener('click', () => this.quickFilter(el.dataset.filter));
                });

                // 模态框
                document.getElementById('addProductBtn')?.addEventListener('click', () => this.showCreateModal());
                document.getElementById('modalCloseBtn')?.addEventListener('click', () => this.closeModal());
                document.getElementById('modalCancelBtn')?.addEventListener('click', () => this.closeModal());
                document.getElementById('productModal')?.addEventListener('click', (e) => {
                    if (e.target === e.currentTarget) this.closeModal();
                });
                document.getElementById('modalSaveBtn')?.addEventListener('click', () => this.saveProduct());

                // 导入导出
                document.getElementById('exportProductsBtn')?.addEventListener('click', () => this.exportProducts());
                document.getElementById('importProductsBtn')?.addEventListener('click', () => this.importProducts());
                document.getElementById('refreshProductsBtn')?.addEventListener('click', () => this.refresh());

                // 键盘快捷键
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.closeModal();
                    if (e.key === 'Enter' && document.getElementById('productModal').classList.contains('active')) {
                        this.saveProduct();
                    }
                });
            }
        };

        // ---------- 自动初始化 ----------
        document.addEventListener('DOMContentLoaded', function() {
            window.ProductModule.init();
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'Products',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    /**
 * @file products.js
 * @module products
 * @description 商品管理 - 商品列表、新增、编辑、删除
 * 
 * @example
 * import { init } from './products.js';
 * await init();
 * 
 * @author Carwash Pro Team
 * @version 1.0.0
 */

//  (已注释);
//  (已注释);
import { showToast } from '../js/core/init.js';

/**
 * @typedef {Object} Product
 * @property {string} id - 商品ID
 * @property {string} name - 商品名称
 * @property {number} price - 商品价格
 * @property {string} category - 分类
 * @property {number} stock - 库存数量
 * @property {string} status - 状态 (active/inactive)
 * @property {string} [description] - 商品描述
 * @property {string} [icon] - 图标
 * @property {string} [color] - 颜色
 * @property {string} [brand] - 品牌
 * @property {string} [sku] - SKU编码
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * @typedef {Object} ProductState
 * @property {Product[]} products - 商品列表
 * @property {string} searchQuery - 搜索关键词
 * @property {string} categoryFilter - 分类筛选
 * @property {string} statusFilter - 状态筛选
 * @property {number} page - 页码
 * @property {number} limit - 每页数量
 * @property {number} total - 总数
 * @property {boolean} loading - 加载状态
 */

/** @type {ProductState} 状态 */
const state = {
    products: [],
    searchQuery: '',
    categoryFilter: 'all',
    statusFilter: 'all',
    page: 1,
    limit: 20,
    total: 0,
    loading: false
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
 * @returns {Product[]} 模拟商品数据
 * @description 获取模拟商品数据
 */
function getMockProducts() {
    const categories = ['洗车', '美容', '保养', '会员'];
    const statuses = ['active', 'active', 'active', 'active', 'inactive'];
    const icons = ['fa-car', 'fa-spray-can', 'fa-wax', 'fa-couch', 'fa-engine', 'fa-snowflake', 'fa-circle', 'fa-gem', 'fa-id-card'];
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#3B82F6', '#6B7280', '#EC4899', '#14B8A6'];
    const brands = ['3M', 'Turtle Wax', 'Meguiars', 'SONAX', 'CarPro'];
    
    const names = ['标准洗车', '精致洗车', '深度清洁', '抛光打蜡', '内饰清洗', '发动机清洗', '空调清洗', '轮胎养护', '玻璃镀膜', '漆面镀晶', '洗车月卡', '洗车季卡'];
    const prices = [68, 128, 268, 388, 328, 188, 158, 88, 228, 688, 398, 998];
    const stocks = [50, 30, 20, 15, 25, 40, 35, 60, 10, 5, 100, 80];
    
    const products = [];
    for (let i = 0; i < names.length; i++) {
        const catIdx = Math.floor(Math.random() * categories.length);
        const statusIdx = Math.floor(Math.random() * statuses.length);
        const brandIdx = Math.floor(Math.random() * brands.length);
        products.push({
            id: 'P' + String(i + 1).padStart(3, '0'),
            name: names[i],
            price: prices[i],
            category: categories[catIdx],
            stock: stocks[i % stocks.length],
            status: statuses[statusIdx],
            description: names[i] + '服务，专业技师操作',
            icon: icons[i % icons.length],
            color: colors[i % colors.length],
            brand: brands[brandIdx],
            sku: 'SKU-' + String(1000 + i),
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    return products;
}

/**
 * @private
 * @description 从API加载商品数据
 */
async function loadFromAPI() {
    try {
        const params = {
            search: state.searchQuery,
            category: state.categoryFilter !== 'all' ? state.categoryFilter : '',
            status: state.statusFilter !== 'all' ? state.statusFilter : '',
            page: state.page,
            limit: state.limit
        };
        const response = await apiClient.get('/products', params);
        if (response && response.success) {
            state.products = response.data || [];
            state.total = response.total || 0;
            return true;
        }
        return false;
    } catch (error) {
        console.warn('API加载失败:', error);
        return false;
    }
}

/**
 * @private
 * @description 加载商品数据
 */
function loadProducts() {
    state.loading = true;
    
    // 尝试从API加载
    loadFromAPI().then(success => {
        if (!success) {
            // 降级到本地存储
            try {
                const saved = localStorage.getItem('product_data');
                if (saved) {
                    state.products = JSON.parse(saved);
                } else {
                    state.products = getMockProducts();
                    localStorage.setItem('product_data', JSON.stringify(state.products));
                }
                state.total = state.products.length;
            } catch (e) {
                console.warn('加载商品数据失败:', e);
                state.products = getMockProducts();
                state.total = state.products.length;
            }
        }
        state.loading = false;
        renderProducts();
        updateStats();
    });
}

/**
 * @private
 * @description 保存商品数据到本地
 */
function saveProducts() {
    try {
        localStorage.setItem('product_data', JSON.stringify(state.products));
    } catch (e) {
        console.warn('保存商品数据失败:', e);
    }
}

/**
 * @private
 * @description 渲染商品列表
 */
function renderProducts() {
    const container = document.getElementById('productListBody');
    if (!container) return;
    
    let filtered = state.products;
    
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query)) ||
            (p.sku && p.sku.toLowerCase().includes(query))
        );
    }
    
    if (state.categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === state.categoryFilter);
    }
    
    if (state.statusFilter !== 'all') {
        filtered = filtered.filter(p => p.status === state.statusFilter);
    }
    
    // 分页
    const start = (state.page - 1) * state.limit;
    const end = start + state.limit;
    const paginated = filtered.slice(start, end);
    state.total = filtered.length;
    state.totalPages = Math.ceil(state.total / state.limit);
    
    if (paginated.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;padding:40px;color:#9CA3AF;">
                    <i class="fas fa-box-open" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                    ${state.loading ? '加载中...' : '暂无商品数据'}
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = paginated.map(product => `
        <tr style="border-bottom:1px solid #F3F4F6;transition:background 0.2s;"
            onmouseover="this.style.background='#F9FAFB'"
            onmouseout="this.style.background=''">
            <td style="padding:12px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:36px;height:36px;border-radius:50%;background:${product.color}20;color:${product.color};display:flex;align-items:center;justify-content:center;font-size:16px;">
                        <i class="fas ${product.icon || 'fa-box'}"></i>
                    </div>
                    <div>
                        <div style="font-weight:500;">${product.name}</div>
                        <div style="font-size:11px;color:#9CA3AF;">${product.sku || ''}</div>
                    </div>
                </div>
            </td>
            <td style="padding:12px;">
                <span style="display:inline-block;padding:2px 10px;border-radius:9999px;font-size:12px;background:#F3F4F6;color:#4B5563;">
                    ${product.category}
                </span>
            </td>
            <td style="padding:12px;font-size:12px;color:#6B7280;">${product.brand || '-'}</td>
            <td style="padding:12px;text-align:right;font-weight:600;color:#4F46E5;">¥${formatCurrency(product.price)}</td>
            <td style="padding:12px;text-align:center;">
                <span style="display:inline-block;padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:500;background:${product.stock > 20 ? '#D1FAE5' : product.stock > 5 ? '#FEF3C7' : '#FEE2E2'};color:${product.stock > 20 ? '#065F46' : product.stock > 5 ? '#92400E' : '#991B1B'};">
                    ${product.stock}
                </span>
            </td>
            <td style="padding:12px;">
                <span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${product.status === 'active' ? '#D1FAE5' : '#FEE2E2'};color:${product.status === 'active' ? '#065F46' : '#991B1B'};">
                    ${product.status === 'active' ? '上架' : '下架'}
                </span>
            </td>
            <td style="padding:12px;font-size:12px;color:#6B7280;">${formatDate(product.createdAt)}</td>
            <td style="padding:12px;text-align:center;">
                <button class="btn btn-sm btn-outline" onclick="window.ProductsModule.editProduct('${product.id}')" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="window.ProductsModule.viewProduct('${product.id}')" title="查看">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.ProductsModule.deleteProduct('${product.id}')" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * @private
 * @description 渲染分页
 */
function renderPagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;
    
    const totalPages = Math.ceil(state.total / state.limit);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div style="display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap;">';
    
    html += `
        <button class="btn btn-sm btn-outline" onclick="window.ProductsModule.goToPage(${state.page - 1})" 
                ${state.page <= 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    const startPage = Math.max(1, state.page - 2);
    const endPage = Math.min(totalPages, state.page + 2);
    
    if (startPage > 1) {
        html += `<button class="btn btn-sm btn-outline" onclick="window.ProductsModule.goToPage(1)">1</button>`;
        if (startPage > 2) html += '<span style="color:#9CA3AF;">...</span>';
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === state.page;
        html += `
            <button class="btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}" 
                    onclick="window.ProductsModule.goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += '<span style="color:#9CA3AF;">...</span>';
        html += `<button class="btn btn-sm btn-outline" onclick="window.ProductsModule.goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    html += `
        <button class="btn btn-sm btn-outline" onclick="window.ProductsModule.goToPage(${state.page + 1})" 
                ${state.page >= totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    html += `<span style="font-size:12px;color:#6B7280;margin-left:8px;">共 ${state.total} 条</span>`;
    html += '</div>';
    container.innerHTML = html;
}

/**
 * @private
 * @description 更新统计数据
 */
function updateStats() {
    const total = state.products.length;
    const active = state.products.filter(p => p.status === 'active').length;
    const inactive = state.products.filter(p => p.status === 'inactive').length;
    const lowStock = state.products.filter(p => p.stock < 10 && p.status === 'active').length;
    const totalValue = state.products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const avgPrice = total > 0 ? state.products.reduce((sum, p) => sum + p.price, 0) / total : 0;
    
    const elements = {
        'statTotal': total,
        'statActive': active,
        'statInactive': inactive,
        'statLowStock': lowStock,
        'statTotalValue': '¥' + formatCurrency(totalValue),
        'statAvgPrice': '¥' + formatCurrency(avgPrice)
    };
    
    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    });
}

/**
 * @private
 * @param {string} id - 商品ID
 * @description 查看商品详情
 */
function viewProduct(id) {
    const product = state.products.find(p => p.id === id);
    if (!product) {
        showToast('商品不存在', 'error');
        return;
    }
    
    const modal = document.getElementById('productDetailModal');
    if (modal) {
        const content = document.getElementById('productDetailContent');
        if (content) {
            content.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div style="grid-column:span 2;text-align:center;padding:16px 0;">
                        <div style="width:64px;height:64px;border-radius:50%;background:${product.color}20;color:${product.color};display:inline-flex;align-items:center;justify-content:center;font-size:28px;">
                            <i class="fas ${product.icon || 'fa-box'}"></i>
                        </div>
                        <h3 style="margin:8px 0 0 0;">${product.name}</h3>
                        <div style="font-size:13px;color:#6B7280;">${product.sku || ''}</div>
                    </div>
                    <div><span style="color:#6B7280;">商品ID</span><br><strong>${product.id}</strong></div>
                    <div><span style="color:#6B7280;">分类</span><br><strong>${product.category}</strong></div>
                    <div><span style="color:#6B7280;">品牌</span><br><strong>${product.brand || '-'}</strong></div>
                    <div><span style="color:#6B7280;">价格</span><br><strong style="color:#4F46E5;">¥${formatCurrency(product.price)}</strong></div>
                    <div><span style="color:#6B7280;">库存</span><br><strong>${product.stock}</strong></div>
                    <div><span style="color:#6B7280;">状态</span><br><span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${product.status === 'active' ? '#D1FAE5' : '#FEE2E2'};color:${product.status === 'active' ? '#065F46' : '#991B1B'};">${product.status === 'active' ? '上架' : '下架'}</span></div>
                    <div style="grid-column:span 2;"><span style="color:#6B7280;">描述</span><br><strong>${product.description || '无'}</strong></div>
                    <div style="grid-column:span 2;"><span style="color:#6B7280;">创建时间</span><br><strong>${formatDate(product.createdAt)}</strong></div>
                    <div style="grid-column:span 2;"><span style="color:#6B7280;">更新时间</span><br><strong>${formatDate(product.updatedAt)}</strong></div>
                </div>
            `;
        }
        modal.style.display = 'flex';
        return;
    }
    
    alert(`商品详情：
名称: ${product.name}
ID: ${product.id}
分类: ${product.category}
品牌: ${product.brand || '-'}
SKU: ${product.sku || '-'}
价格: ¥${formatCurrency(product.price)}
库存: ${product.stock}
状态: ${product.status === 'active' ? '上架' : '下架'}
描述: ${product.description || '无'}`);
}

/**
 * @private
 * @param {string} id - 商品ID
 * @description 编辑商品
 */
function editProduct(id) {
    const product = state.products.find(p => p.id === id);
    if (!product) {
        showToast('商品不存在', 'error');
        return;
    }
    
    const name = prompt('商品名称：', product.name);
    if (name === null) return;
    if (!name.trim()) {
        showToast('商品名称不能为空', 'warning');
        return;
    }
    
    const price = parseFloat(prompt('商品价格：', product.price));
    if (isNaN(price) || price < 0) {
        showToast('请输入有效价格', 'error');
        return;
    }
    
    const stock = parseInt(prompt('库存数量：', product.stock));
    if (isNaN(stock) || stock < 0) {
        showToast('请输入有效库存', 'error');
        return;
    }
    
    const category = prompt('分类（洗车/美容/保养/会员）：', product.category) || product.category;
    const brand = prompt('品牌：', product.brand || '') || '';
    const description = prompt('描述：', product.description || '') || '';
    const status = confirm('是否上架？\n点击"确定"上架，点击"取消"下架');
    
    product.name = name.trim();
    product.price = price;
    product.stock = stock;
    product.category = category;
    product.brand = brand;
    product.description = description;
    product.status = status ? 'active' : 'inactive';
    product.updatedAt = new Date().toISOString();
    
    saveProducts();
    renderProducts();
    updateStats();
    showToast('商品已更新: ' + product.name, 'success');
}

/**
 * @private
 * @param {string} id - 商品ID
 * @description 删除商品
 */
function deleteProduct(id) {
    const product = state.products.find(p => p.id === id);
    if (!product) {
        showToast('商品不存在', 'error');
        return;
    }
    
    if (!confirm(`确认删除商品 "${product.name}"？`)) return;
    
    state.products = state.products.filter(p => p.id !== id);
    saveProducts();
    renderProducts();
    updateStats();
    showToast('商品已删除: ' + product.name, 'success');
}

/**
 * @private
 * @description 新增商品
 */
function newProduct() {
    const name = prompt('商品名称：');
    if (name === null) return;
    if (!name.trim()) {
        showToast('商品名称不能为空', 'warning');
        return;
    }
    
    const price = parseFloat(prompt('商品价格：', '68'));
    if (isNaN(price) || price < 0) {
        showToast('请输入有效价格', 'error');
        return;
    }
    
    const stock = parseInt(prompt('库存数量：', '10'));
    if (isNaN(stock) || stock < 0) {
        showToast('请输入有效库存', 'error');
        return;
    }
    
    const categories = ['洗车', '美容', '保养', '会员'];
    const categoryOptions = categories.map((c, i) => `${i+1}. ${c}`).join('\n');
    const categoryIdx = parseInt(prompt(`选择分类：\n${categoryOptions}`, '1'));
    const category = categories[categoryIdx - 1] || '洗车';
    
    const brand = prompt('品牌：', '') || '';
    const description = prompt('描述：', '') || '';
    const sku = prompt('SKU编码：', 'SKU-' + String(Math.floor(Math.random() * 10000)).padStart(6, '0'));
    const status = confirm('是否上架？\n点击"确定"上架，点击"取消"下架');
    
    const newId = 'P' + String(state.products.length + 1).padStart(3, '0');
    const product = {
        id: newId,
        name: name.trim(),
        price: price,
        stock: stock,
        category: category,
        brand: brand,
        sku: sku || 'SKU-' + String(1000 + state.products.length + 1),
        status: status ? 'active' : 'inactive',
        description: description,
        icon: 'fa-box',
        color: '#4F46E5',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    state.products.push(product);
    saveProducts();
    renderProducts();
    updateStats();
    renderPagination();
    showToast('商品已创建: ' + product.name, 'success');
}

/**
 * @private
 * @param {number} page - 页码
 * @description 跳转到指定页
 */
function goToPage(page) {
    const totalPages = Math.ceil(state.total / state.limit);
    if (page < 1 || page > totalPages) return;
    state.page = page;
    renderProducts();
    renderPagination();
}

/**
 * @private
 * @description 搜索商品
 */
function searchProducts(query) {
    state.searchQuery = query;
    state.page = 1;
    loadProducts();
}

/**
 * @private
 * @description 应用筛选
 */
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    state.categoryFilter = categoryFilter ? categoryFilter.value : 'all';
    state.statusFilter = statusFilter ? statusFilter.value : 'all';
    state.page = 1;
    loadProducts();
}

/**
 * @private
 * @description 重置筛选
 */
function resetFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    
    state.categoryFilter = 'all';
    state.statusFilter = 'all';
    state.searchQuery = '';
    state.page = 1;
    loadProducts();
}

/**
 * @private
 * @description 关闭详情弹窗
 */
function closeDetail() {
    const modal = document.getElementById('productDetailModal');
    if (modal) modal.style.display = 'none';
}

/**
 * @private
 * @description 刷新数据
 */
function refresh() {
    loadProducts();
    showToast('数据已刷新', 'success');
}

/**
 * @private
 * @description 导出商品数据
 */
function exportData() {
    if (state.products.length === 0) {
        showToast('暂无数据可导出', 'warning');
        return;
    }
    
    const headers = ['商品ID', '名称', '分类', '品牌', 'SKU', '价格', '库存', '状态', '创建时间'];
    const rows = state.products.map(p => [
        p.id,
        p.name,
        p.category,
        p.brand || '',
        p.sku || '',
        p.price.toFixed(2),
        p.stock,
        p.status === 'active' ? '上架' : '下架',
        formatDate(p.createdAt)
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '商品数据_' + new Date().toISOString().split('T')[0] + '.csv';
    link.click();
    showToast('数据已导出', 'success');
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
                searchProducts(this.value);
            }, 300);
        });
    }
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    const refreshBtn = document.getElementById('refreshProducts');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refresh);
    }
    
    const newBtn = document.getElementById('newProduct');
    if (newBtn) {
        newBtn.addEventListener('click', newProduct);
    }
    
    const exportBtn = document.getElementById('exportProducts');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    const modal = document.getElementById('productDetailModal');
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
 * @param {Product[]} options.data - 初始数据
 * @returns {Promise<void>}
 * @description 初始化商品管理
 */
export async function init(options) {
    console.log('📦 商品管理 初始化...');
    
    if (options?.data) {
        state.products = options.data;
        state.total = state.products.length;
        saveProducts();
    } else {
        loadProducts();
    }
    
    updateStats();
    bindEvents();
    renderPagination();
    
    window.ProductsModule = {
        state,
        loadProducts,
        renderProducts,
        renderPagination,
        updateStats,
        viewProduct,
        editProduct,
        deleteProduct,
        newProduct,
        goToPage,
        searchProducts,
        applyFilters,
        resetFilters,
        closeDetail,
        refresh,
        exportData,
        saveProducts
    };
    
    console.log('✅ 商品管理 初始化完成');
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export default {
    init,
    loadProducts,
    viewProduct,
    editProduct,
    deleteProduct,
    newProduct,
    searchProducts,
    refresh,
    exportData,
    saveProducts
};
  },
  methods: {}
}
</script>

<style scoped>
/**
 * products.css - 商品模块统一样式
 * @module products.css
 * @description 商品管理、分类、品牌、变体等模块的共享样式
 * 
 * @author Carwash Pro Team
 * @version 1.0.0
 */

/* ============================================================
   基础重置
   ============================================================ */
   .products-container *,
   .categories-container *,
   .brands-container *,
   .barcode-container *,
   .variant-container *,
   .pricelist-container *,
   .modifier-container *,
   .combo-container * {
       box-sizing: border-box;
   }
   
   /* ============================================================
      页面容器
      ============================================================ */
   .products-container,
   .categories-container,
   .brands-container,
   .barcode-container,
   .variant-container,
   .pricelist-container,
   .modifier-container,
   .combo-container {
       padding: 20px;
       max-width: 1400px;
       margin: 0 auto;
   }
   
   /* ============================================================
      页面头部
      ============================================================ */
   .page-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       flex-wrap: wrap;
       gap: 12px;
       margin-bottom: 24px;
   }
   
   .page-header h1 {
       font-size: 24px;
       font-weight: 700;
       color: #1F2937;
       margin: 0;
       display: flex;
       align-items: center;
       gap: 10px;
   }
   
   .page-header .subtitle {
       font-size: 14px;
       color: #6B7280;
       margin-top: 4px;
   }
   
   .header-actions {
       display: flex;
       gap: 8px;
       flex-wrap: wrap;
   }
   
   /* ============================================================
      统计卡片
      ============================================================ */
   .stats-grid {
       display: grid;
       gap: 12px;
       margin-bottom: 20px;
   }
   
   .stats-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
   .stats-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
   .stats-grid.cols-4 { grid-template-columns: repeat(4, 1fr); }
   .stats-grid.cols-5 { grid-template-columns: repeat(5, 1fr); }
   .stats-grid.cols-6 { grid-template-columns: repeat(6, 1fr); }
   
   .stat-card {
       background: white;
       border-radius: 10px;
       padding: 14px 16px;
       border: 1px solid #E5E7EB;
       text-align: center;
       transition: all 0.3s ease;
   }
   
   .stat-card:hover {
       transform: translateY(-2px);
       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
   }
   
   .stat-card .stat-number {
       font-size: 24px;
       font-weight: 700;
       color: #1F2937;
   }
   
   .stat-card .stat-number.primary { color: #4F46E5; }
   .stat-card .stat-number.success { color: #10B981; }
   .stat-card .stat-number.warning { color: #F59E0B; }
   .stat-card .stat-number.danger { color: #EF4444; }
   .stat-card .stat-number.info { color: #3B82F6; }
   .stat-card .stat-number.purple { color: #8B5CF6; }
   
   .stat-card .stat-label {
       font-size: 12px;
       color: #6B7280;
       margin-top: 2px;
   }
   
   /* ============================================================
      工具栏
      ============================================================ */
   .toolbar {
       display: flex;
       gap: 10px;
       flex-wrap: wrap;
       margin-bottom: 16px;
       align-items: center;
       background: white;
       padding: 12px 16px;
       border-radius: 12px;
       border: 1px solid #E5E7EB;
   }
   
   .toolbar .search-box {
       flex: 1;
       min-width: 160px;
       padding: 8px 14px;
       border: 1px solid #D1D5DB;
       border-radius: 8px;
       font-size: 14px;
       transition: border-color 0.2s;
   }
   
   .toolbar .search-box:focus {
       border-color: #4F46E5;
       outline: none;
       box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
   }
   
   .toolbar .filter-select {
       padding: 8px 12px;
       border: 1px solid #D1D5DB;
       border-radius: 8px;
       font-size: 14px;
       background: white;
       cursor: pointer;
       min-width: 120px;
   }
   
   .toolbar .filter-select:focus {
       border-color: #4F46E5;
       outline: none;
   }
   
   /* ============================================================
      表格样式
      ============================================================ */
   .table-container {
       background: white;
       border-radius: 12px;
       border: 1px solid #E5E7EB;
       overflow: hidden;
   }
   
   .table-container .table-scroll {
       overflow-x: auto;
   }
   
   .table-container table {
       width: 100%;
       border-collapse: collapse;
       font-size: 13px;
   }
   
   .table-container thead {
       background: #F9FAFB;
   }
   
   .table-container th {
       padding: 10px 14px;
       text-align: left;
       font-weight: 600;
       color: #6B7280;
       font-size: 11px;
       text-transform: uppercase;
       letter-spacing: 0.5px;
       border-bottom: 2px solid #E5E7EB;
   }
   
   .table-container td {
       padding: 10px 14px;
       border-bottom: 1px solid #F3F4F6;
   }
   
   .table-container tr:last-child td {
       border-bottom: none;
   }
   
   .table-container tr:hover td {
       background: #F9FAFB;
   }
   
   /* ============================================================
      卡片网格
      ============================================================ */
   .card-grid {
       display: grid;
       gap: 16px;
   }
   
   .card-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
   .card-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
   .card-grid.cols-4 { grid-template-columns: repeat(4, 1fr); }
   
   .grid-card {
       background: white;
       border-radius: 12px;
       padding: 16px;
       border: 1px solid #E5E7EB;
       transition: all 0.3s ease;
   }
   
   .grid-card:hover {
       transform: translateY(-3px);
       box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
       border-color: #4F46E5;
   }
   
   /* ============================================================
      徽章样式
      ============================================================ */
   .badge {
       display: inline-block;
       padding: 2px 10px;
       border-radius: 9999px;
       font-size: 11px;
       font-weight: 500;
   }
   
   .badge-success { background: #D1FAE5; color: #065F46; }
   .badge-warning { background: #FEF3C7; color: #92400E; }
   .badge-danger { background: #FEE2E2; color: #991B1B; }
   .badge-info { background: #DBEAFE; color: #1E40AF; }
   .badge-secondary { background: #F3F4F6; color: #6B7280; }
   .badge-primary { background: #EEF2FF; color: #4F46E5; }
   .badge-purple { background: #F0E7FF; color: #7C3AED; }
   
   /* ============================================================
      按钮样式
      ============================================================ */
   .btn-sm {
       padding: 4px 10px;
       font-size: 12px;
       border-radius: 6px;
       cursor: pointer;
       border: none;
       transition: all 0.2s;
       display: inline-flex;
       align-items: center;
       gap: 4px;
   }
   
   .btn-sm-primary {
       background: #4F46E5;
       color: white;
   }
   .btn-sm-primary:hover { background: #4338CA; }
   
   .btn-sm-success {
       background: #10B981;
       color: white;
   }
   .btn-sm-success:hover { background: #059669; }
   
   .btn-sm-danger {
       background: #EF4444;
       color: white;
   }
   .btn-sm-danger:hover { background: #DC2626; }
   
   .btn-sm-warning {
       background: #F59E0B;
       color: white;
   }
   .btn-sm-warning:hover { background: #D97706; }
   
   .btn-sm-outline {
       background: white;
       color: #1F2937;
       border: 1px solid #D1D5DB;
   }
   .btn-sm-outline:hover { background: #F9FAFB; }
   
   /* ============================================================
      分页样式
      ============================================================ */
   .pagination {
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding: 10px 14px;
       border-top: 1px solid #F3F4F6;
       flex-wrap: wrap;
       gap: 8px;
   }
   
   .pagination .info {
       font-size: 13px;
       color: #6B7280;
   }
   
   .pagination .btn-group {
       display: flex;
       gap: 4px;
   }
   
   .pagination .btn-group button {
       padding: 4px 12px;
       border: 1px solid #D1D5DB;
       border-radius: 6px;
       background: white;
       cursor: pointer;
       font-size: 13px;
       transition: all 0.2s;
   }
   
   .pagination .btn-group button:hover:not(:disabled) {
       background: #F3F4F6;
   }
   
   .pagination .btn-group button.active {
       background: #4F46E5;
       color: white;
       border-color: #4F46E5;
   }
   
   .pagination .btn-group button:disabled {
       opacity: 0.4;
       cursor: not-allowed;
   }
   
   /* ============================================================
      表单样式
      ============================================================ */
   .form-group {
       margin-bottom: 12px;
   }
   
   .form-group label {
       display: block;
       font-size: 13px;
       font-weight: 500;
       color: #4B5563;
       margin-bottom: 4px;
   }
   
   .form-group .required {
       color: #EF4444;
   }
   
   .form-group input,
   .form-group select,
   .form-group textarea {
       width: 100%;
       padding: 8px 12px;
       border: 1px solid #D1D5DB;
       border-radius: 6px;
       font-size: 14px;
       transition: border-color 0.2s;
   }
   
   .form-group input:focus,
   .form-group select:focus,
   .form-group textarea:focus {
       border-color: #4F46E5;
       outline: none;
       box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
   }
   
   .form-group textarea {
       resize: vertical;
       min-height: 60px;
   }
   
   .form-row {
       display: grid;
       grid-template-columns: 1fr 1fr;
       gap: 12px;
   }
   
   /* ============================================================
      模态框样式
      ============================================================ */
   .modal-overlay {
       position: fixed;
       top: 0;
       left: 0;
       right: 0;
       bottom: 0;
       background: rgba(0, 0, 0, 0.5);
       z-index: 9999;
       display: none;
       align-items: center;
       justify-content: center;
       backdrop-filter: blur(4px);
   }
   
   .modal-overlay.active {
       display: flex;
   }
   
   .modal-content {
       background: white;
       border-radius: 16px;
       max-width: 520px;
       width: 95%;
       max-height: 90vh;
       overflow-y: auto;
       box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
       animation: modalSlideIn 0.3s ease;
   }
   
   @keyframes modalSlideIn {
       from {
           transform: translateY(30px) scale(0.96);
           opacity: 0;
       }
       to {
           transform: translateY(0) scale(1);
           opacity: 1;
       }
   }
   
   .modal-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding: 16px 24px;
       border-bottom: 1px solid #E5E7EB;
   }
   
   .modal-header h3 {
       margin: 0;
       font-size: 18px;
       font-weight: 600;
       color: #1F2937;
   }
   
   .modal-close {
       background: none;
       border: none;
       font-size: 24px;
       cursor: pointer;
       color: #9CA3AF;
       padding: 0 4px;
       transition: color 0.2s;
   }
   
   .modal-close:hover {
       color: #374151;
   }
   
   .modal-body {
       padding: 20px 24px;
   }
   
   .modal-footer {
       display: flex;
       justify-content: flex-end;
       gap: 8px;
       padding: 16px 24px;
       border-top: 1px solid #E5E7EB;
   }
   
   /* ============================================================
      空状态
      ============================================================ */
   .empty-state {
       grid-column: 1 / -1;
       text-align: center;
       padding: 60px 20px;
       color: #9CA3AF;
   }
   
   .empty-state i {
       font-size: 48px;
       display: block;
       margin-bottom: 12px;
       color: #D1D5DB;
   }
   
   .empty-state p {
       font-size: 16px;
       margin: 0;
   }
   
   .empty-state .hint {
       font-size: 13px;
       margin-top: 4px;
   }
   
   /* ============================================================
      条码样式
      ============================================================ */
   .barcode-display {
       font-family: 'Courier New', monospace;
       font-size: 28px;
       letter-spacing: 2px;
       padding: 12px 16px;
       background: white;
       border-radius: 4px;
       text-align: center;
   }
   
   /* ============================================================
      暗色模式
      ============================================================ */
   [data-theme="dark"] .stat-card,
   [data-theme="dark"] .toolbar,
   [data-theme="dark"] .table-container,
   [data-theme="dark"] .grid-card,
   [data-theme="dark"] .modal-content {
       background: #2C2C2E;
       border-color: #48484A;
   }
   
   [data-theme="dark"] .stat-card .stat-number,
   [data-theme="dark"] .page-header h1 {
       color: #F5F5F7;
   }
   
   [data-theme="dark"] .table-container thead {
       background: #3A3A3C;
   }
   
   [data-theme="dark"] .table-container th {
       color: #9CA3AF;
       border-color: #48484A;
   }
   
   [data-theme="dark"] .table-container td {
       border-color: #3A3A3C;
       color: #F5F5F7;
   }
   
   [data-theme="dark"] .table-container tr:hover td {
       background: #3A3A3C;
   }
   
   [data-theme="dark"] .toolbar .search-box,
   [data-theme="dark"] .toolbar .filter-select,
   [data-theme="dark"] .form-group input,
   [data-theme="dark"] .form-group select,
   [data-theme="dark"] .form-group textarea {
       background: #3A3A3C;
       border-color: #48484A;
       color: #F5F5F7;
   }
   
   [data-theme="dark"] .toolbar .search-box::placeholder {
       color: #6B7280;
   }
   
   [data-theme="dark"] .modal-overlay {
       background: rgba(0, 0, 0, 0.7);
   }
   
   [data-theme="dark"] .modal-header {
       border-color: #48484A;
   }
   
   [data-theme="dark"] .modal-footer {
       border-color: #48484A;
   }
   
   [data-theme="dark"] .pagination .btn-group button {
       background: #3A3A3C;
       border-color: #48484A;
       color: #F5F5F7;
   }
   
   [data-theme="dark"] .pagination .btn-group button:hover:not(:disabled) {
       background: #4A4A4C;
   }
   
   [data-theme="dark"] .pagination .btn-group button.active {
       background: #4F46E5;
       color: white;
       border-color: #4F46E5;
   }
   
   [data-theme="dark"] .badge-secondary {
       background: #3A3A3C;
       color: #9CA3AF;
   }
   
   /* ============================================================
      响应式
      ============================================================ */
   @media (max-width: 768px) {
       .stats-grid.cols-2,
       .stats-grid.cols-3,
       .stats-grid.cols-4,
       .stats-grid.cols-5,
       .stats-grid.cols-6 {
           grid-template-columns: repeat(2, 1fr);
       }
       
       .card-grid.cols-2,
       .card-grid.cols-3,
       .card-grid.cols-4 {
           grid-template-columns: repeat(2, 1fr);
       }
       
       .form-row {
           grid-template-columns: 1fr;
       }
       
       .toolbar {
           flex-direction: column;
           align-items: stretch;
       }
       
       .toolbar .search-box {
           width: 100%;
       }
       
       .header-actions {
           width: 100%;
       }
       
       .header-actions button {
           flex: 1;
       }
   }
   
   @media (max-width: 480px) {
       .stats-grid.cols-2,
       .stats-grid.cols-3,
       .stats-grid.cols-4,
       .stats-grid.cols-5,
       .stats-grid.cols-6 {
           grid-template-columns: 1fr 1fr;
       }
       
       .card-grid.cols-2,
       .card-grid.cols-3,
       .card-grid.cols-4 {
           grid-template-columns: 1fr;
       }
       
       .products-container,
       .categories-container,
       .brands-container,
       .barcode-container,
       .variant-container,
       .pricelist-container,
       .modifier-container,
       .combo-container {
           padding: 12px;
       }
       
       .page-header h1 {
           font-size: 20px;
       }
       
       .modal-content {
           width: 98%;
           margin: 8px;
       }
       
       .modal-body {
           padding: 16px;
       }
       
       .modal-header {
           padding: 12px 16px;
       }
       
       .modal-footer {
           padding: 12px 16px;
           flex-direction: column;
       }
       
       .modal-footer button {
           width: 100%;
       }
       
       .pagination {
           flex-direction: column;
           align-items: stretch;
           text-align: center;
       }
       
       .pagination .btn-group {
           justify-content: center;
       }
   }
   
   /* ============================================================
      工具类
      ============================================================ */
   .text-center { text-align: center; }
   .text-right { text-align: right; }
   .text-left { text-align: left; }
   
   .text-sm { font-size: 12px; }
   .text-muted { color: #6B7280; }
   .text-success { color: #10B981; }
   .text-danger { color: #EF4444; }
   .text-warning { color: #F59E0B; }
   .text-primary { color: #4F46E5; }
   
   .fw-500 { font-weight: 500; }
   .fw-600 { font-weight: 600; }
   .fw-700 { font-weight: 700; }
   
   .mt-8 { margin-top: 8px; }
   .mt-12 { margin-top: 12px; }
   .mt-16 { margin-top: 16px; }
   .mb-8 { margin-bottom: 8px; }
   .mb-12 { margin-bottom: 12px; }
   .mb-16 { margin-bottom: 16px; }
   
   .gap-4 { gap: 4px; }
   .gap-8 { gap: 8px; }
   .gap-12 { gap: 12px; }
   
   .flex { display: flex; }
   .flex-center { display: flex; align-items: center; justify-content: center; }
   .flex-between { display: flex; justify-content: space-between; align-items: center; }
   .flex-wrap { flex-wrap: wrap; }
   .flex-1 { flex: 1; }
   
   /* ============================================================
      打印样式
      ============================================================ */
   @media print {
       .no-print {
           display: none !important;
       }
       
       .print-only {
           display: block !important;
       }
       
       .stat-card,
       .grid-card,
       .table-container {
           border: 1px solid #ddd !important;
           box-shadow: none !important;
           page-break-inside: avoid;
       }
       
       .page-header h1 {
           font-size: 18px !important;
       }
   }
</style>

