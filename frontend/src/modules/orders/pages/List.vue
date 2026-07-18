<template>
  <div class="orders-">
    



    <div class="orders-container">
        
        <div class="page-header">
            <div>
                <h1>
                    <i class="fas fa-clipboard-list" style="color:#4F46E5;"></i>
                    订单管理
                </h1>
                <div class="subtitle">查看、管理和跟踪所有订单</div>
            </div>
            <div class="header-actions">
                <button class="btn btn-success" onclick="alert('📝 创建新订单')">
                    <i class="fas fa-plus"></i> 新建订单
                </button>
                <button class="btn btn-outline" onclick="alert('📥 导出订单')">
                    <i class="fas fa-file-export"></i> 导出
                </button>
                <button class="btn btn-outline" id="refreshOrdersBtn">
                    <i class="fas fa-sync"></i>
                </button>
            </div>
        </div>

        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number primary">156</div>
                <div class="stat-label">📊 总订单</div>
            </div>
            <div class="stat-card">
                <div class="stat-number warning">23</div>
                <div class="stat-label">⏳ 待处理</div>
            </div>
            <div class="stat-card">
                <div class="stat-number info">45</div>
                <div class="stat-label">🔄 处理中</div>
            </div>
            <div class="stat-card">
                <div class="stat-number success">78</div>
                <div class="stat-label">✅ 已完成</div>
            </div>
            <div class="stat-card">
                <div class="stat-number danger">10</div>
                <div class="stat-label">❌ 已取消</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">¥128,500</div>
                <div class="stat-label">💰 总金额</div>
            </div>
        </div>

        
        <div class="toolbar">
            <input type="text" class="search-box" id="orderSearch" placeholder="🔍 搜索订单号、客户...">
            <select class="filter-select" id="orderStatusFilter">
                <option value="">全部状态</option>
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
            </select>
            <input type="date" class="date-input" id="orderDateFrom" placeholder="开始日期">
            <input type="date" class="date-input" id="orderDateTo" placeholder="结束日期">
            <button class="btn btn-primary" id="orderSearchBtn">
                <i class="fas fa-search"></i> 搜索
            </button>
            <button class="btn btn-outline" id="orderResetBtn">
                <i class="fas fa-undo"></i> 重置
            </button>
        </div>

        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>订单号</th>
                        <th>客户</th>
                        <th>金额</th>
                        <th>状态</th>
                        <th>支付方式</th>
                        <th>时间</th>
                        <th style="text-align:center;">操作</th>
                    </tr>
                </thead>
                <tbody id="orderTableBody">
                    <tr>
                        <td><strong>ORD-2024-001</strong></td>
                        <td>王小明</td>
                        <td style="font-weight:600;color:#4F46E5;">¥299.00</td>
                        <td><span class="badge badge-success">已完成</span></td>
                        <td>微信支付</td>
                        <td>2024-07-11 14:30</td>
                        <td style="text-align:center;">
                            <div class="order-actions">
                                <button class="btn btn-sm btn-outline" title="查看"><i class="fas fa-eye"></i></button>
                                <button class="btn btn-sm btn-outline" title="编辑"><i class="fas fa-edit"></i></button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>ORD-2024-002</strong></td>
                        <td>李小红</td>
                        <td style="font-weight:600;color:#4F46E5;">¥159.00</td>
                        <td><span class="badge badge-info">处理中</span></td>
                        <td>支付宝</td>
                        <td>2024-07-11 14:15</td>
                        <td style="text-align:center;">
                            <div class="order-actions">
                                <button class="btn btn-sm btn-outline" title="查看"><i class="fas fa-eye"></i></button>
                                <button class="btn btn-sm btn-outline" title="编辑"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-sm btn-success" title="完成"><i class="fas fa-check"></i></button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>ORD-2024-003</strong></td>
                        <td>张伟</td>
                        <td style="font-weight:600;color:#4F46E5;">¥459.00</td>
                        <td><span class="badge badge-warning">待处理</span></td>
                        <td>现金</td>
                        <td>2024-07-11 13:50</td>
                        <td style="text-align:center;">
                            <div class="order-actions">
                                <button class="btn btn-sm btn-outline" title="查看"><i class="fas fa-eye"></i></button>
                                <button class="btn btn-sm btn-primary" title="处理"><i class="fas fa-play"></i></button>
                                <button class="btn btn-sm btn-danger" title="取消"><i class="fas fa-times"></i></button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>ORD-2024-004</strong></td>
                        <td>刘洋</td>
                        <td style="font-weight:600;color:#4F46E5;">¥89.00</td>
                        <td><span class="badge badge-success">已完成</span></td>
                        <td>会员卡</td>
                        <td>2024-07-11 13:20</td>
                        <td style="text-align:center;">
                            <div class="order-actions">
                                <button class="btn btn-sm btn-outline" title="查看"><i class="fas fa-eye"></i></button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>ORD-2024-005</strong></td>
                        <td>陈静</td>
                        <td style="font-weight:600;color:#4F46E5;">¥329.00</td>
                        <td><span class="badge badge-danger">已取消</span></td>
                        <td>微信支付</td>
                        <td>2024-07-11 12:45</td>
                        <td style="text-align:center;">
                            <div class="order-actions">
                                <button class="btn btn-sm btn-outline" title="查看"><i class="fas fa-eye"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <span class="info">共 156 条，第 1/16 页</span>
                <div class="btn-group">
                    <button disabled><i class="fas fa-chevron-left"></i></button>
                    <button class="active">1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>...</button>
                    <button>16</button>
                    <button><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import { init } from './list.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('📋 订单列表页面加载');
            
            init().catch(err => console.warn('订单列表初始化失败:', err));

            document.getElementById('refreshOrdersBtn')?.addEventListener('click', function() {
                const icon = this.querySelector('i');
                icon.classList.add('fa-spin');
                setTimeout(() => icon.classList.remove('fa-spin'), 800);
            });

            document.getElementById('orderSearchBtn')?.addEventListener('click', function() {
                const keyword = document.getElementById('orderSearch').value;
                const status = document.getElementById('orderStatusFilter').value;
                alert('🔍 搜索条件:\n关键词: ' + (keyword || '全部') + '\n状态: ' + (status || '全部'));
            });

            document.getElementById('orderResetBtn')?.addEventListener('click', function() {
                document.getElementById('orderSearch').value = '';
                document.getElementById('orderStatusFilter').value = '';
                document.getElementById('orderDateFrom').value = '';
                document.getElementById('orderDateTo').value = '';
            });

            // 统计卡片点击筛选
            document.querySelectorAll('.stat-card').forEach((card, index) => {
                card.addEventListener('click', function() {
                    const statuses = ['全部', '待处理', '处理中', '已完成', '已取消', '全部'];
                    const filter = document.getElementById('orderStatusFilter');
                    if (filter) {
                        const statusMap = {
                            '待处理': 'pending',
                            '处理中': 'processing',
                            '已完成': 'completed',
                            '已取消': 'cancelled'
                        };
                        const label = statuses[index] || '全部';
                        if (label !== '全部' && statusMap[label]) {
                            filter.value = statusMap[label];
                        } else {
                            filter.value = '';
                        }
                        document.getElementById('orderSearchBtn')?.click();
                    }
                });
            });
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    /**
 * modules/03-orders/list/list.js - 订单列表
 * 使用 Supabase 服务
 */

// ============================================================
// 1. 导入服务
// ============================================================

import {
    orderService,
    formatCurrency,
    formatDateTime,
    showToast
} from '../../../src/core/supabase.js';

// ============================================================
// 2. 状态管理
// ============================================================

const state = {
    orders: [],
    loading: false,
    pagination: { page: 1, limit: 10, total: 0 },
    filters: { orderNo: '', customer: '', status: '' },
    _initialized: false
};

const STATUS_MAP = {
    pending: { label: '待处理', color: 'warning' },
    processing: { label: '处理中', color: 'info' },
    completed: { label: '已完成', color: 'success' },
    cancelled: { label: '已取消', color: 'danger' }
};

// ============================================================
// 3. 核心功能
// ============================================================

export async function init() {
    if (state._initialized) {
        console.log('📋 订单管理已初始化，跳过');
        return;
    }

    console.log('📋 订单管理初始化...');
    state._initialized = true;

    await loadOrders();
    bindEvents();

    console.log('✅ 订单管理初始化完成');
}

async function loadOrders() {
    state.loading = true;
    showLoading();

    try {
        const result = await orderService.getList({
            page: state.pagination.page,
            limit: state.pagination.limit,
            orderNo: state.filters.orderNo,
            customer: state.filters.customer,
            status: state.filters.status
        });

        console.log('📊 加载订单数据:', result);

        state.orders = result.list || [];
        state.pagination.total = result.total || 0;

        renderTable();
        renderPagination();
        renderSummary();

    } catch (error) {
        console.error('❌ 加载订单失败:', error);
        showToast('加载数据失败', 'error');
    } finally {
        state.loading = false;
        hideLoading();
    }
}

// ============================================================
// 4. 渲染函数
// ============================================================

function renderTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    if (!state.orders || state.orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:#6B7280;">暂无订单数据</td></tr>';
        return;
    }

    let html = '';
    for (let i = 0; i < state.orders.length; i++) {
        const o = state.orders[i];
        const status = STATUS_MAP[o.status] || { label: o.status || '未知', color: 'secondary' };

        html += `<tr>
            <td style="font-family:monospace;">${o.order_number || o.id}</td>
            <td>
                <div style="font-weight:500;">${o.customer_name || '散客'}</div>
                <div style="font-size:12px;color:#6B7280;">${o.customer_phone || ''}</div>
            </td>
            <td style="font-size:14px;">${o.items ? o.items.length : 0} 件商品</td>
            <td style="text-align:right;font-weight:600;">¥${formatCurrency(o.total_amount || 0)}</td>
            <td><span class="badge badge-${status.color}">${status.label}</span></td>
            <td style="font-size:14px;">${formatDateTime(o.created_at)}</td>
            <td>
                <div style="display:flex;gap:4px;">
                    <button class="btn-sm btn-primary" onclick="viewOrder('${o.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn-sm btn-danger" onclick="deleteOrder('${o.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }
    tbody.innerHTML = html;
}

function renderPagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    const page = state.pagination.page;
    const total = state.pagination.total;
    const limit = state.pagination.limit;
    const totalPages = Math.ceil(total / limit) || 1;

    let html = `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;">
        <div style="font-size:14px;color:#6B7280;">共 ${total} 条，第 ${page}/${totalPages} 页</div>
        <div style="display:flex;gap:4px;">
            <button class="btn-sm btn-secondary" onclick="changePage(${page - 1})" ${page <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;

    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
        html += `<button class="btn-sm ${i === page ? 'btn-primary' : 'btn-secondary'}" onclick="changePage(${i})">${i}</button>`;
    }

    html += `<button class="btn-sm btn-secondary" onclick="changePage(${page + 1})" ${page >= totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>
        </div>
    </div>`;
    container.innerHTML = html;
}

function renderSummary() {
    const container = document.getElementById('summaryContainer');
    if (!container) return;

    const total = state.orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const avg = state.orders.length > 0 ? total / state.orders.length : 0;

    container.innerHTML = `
        <div style="display:flex;gap:24px;font-size:14px;">
            <span>订单数: <strong>${state.orders.length}</strong></span>
            <span>总金额: <strong>¥${formatCurrency(total)}</strong></span>
            <span>平均单价: <strong>¥${formatCurrency(avg)}</strong></span>
        </div>
    `;
}

// ============================================================
// 5. 全局函数
// ============================================================

window.changePage = function(page) {
    const totalPages = Math.ceil(state.pagination.total / state.pagination.limit) || 1;
    if (page < 1 || page > totalPages) return;
    state.pagination.page = page;
    loadOrders();
};

window.viewOrder = function(id) {
    showToast('查看订单: ' + id, 'info');
};

window.deleteOrder = async function(id) {
    if (!confirm('确认删除该订单吗？')) return;
    try {
        await orderService.delete(id);
        showToast('删除成功', 'success');
        await loadOrders();
    } catch (error) {
        showToast('删除失败: ' + error.message, 'error');
    }
};

// ============================================================
// 6. 搜索/重置
// ============================================================

function handleSearch() {
    state.pagination.page = 1;
    state.filters.orderNo = document.getElementById('searchOrderNo')?.value || '';
    state.filters.customer = document.getElementById('searchCustomer')?.value || '';
    state.filters.status = document.getElementById('searchStatus')?.value || '';
    loadOrders();
}

function handleReset() {
    state.pagination.page = 1;
    state.filters = { orderNo: '', customer: '', status: '' };
    document.getElementById('searchOrderNo').value = '';
    document.getElementById('searchCustomer').value = '';
    document.getElementById('searchStatus').value = '';
    loadOrders();
}

// ============================================================
// 7. 事件绑定
// ============================================================

function bindEvents() {
    document.getElementById('searchBtn')?.addEventListener('click', handleSearch);
    document.getElementById('resetBtn')?.addEventListener('click', handleReset);
    document.querySelectorAll('.search-bar input').forEach(el => {
        el.addEventListener('keypress', e => { if (e.key === 'Enter') handleSearch(); });
    });
}

function showLoading() {
    document.getElementById('loadingSpinner')?.classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner')?.classList.add('hidden');
}

// ============================================================
// 8. 自动初始化
// ============================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    setTimeout(init, 100);
}

console.log('✅ 订单管理模块加载完成');
  },
  methods: {}
}
</script>

<style scoped>

</style>
