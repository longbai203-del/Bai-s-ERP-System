<template>
  <div class="orders-">
    



    <div class="refunds-container">
        <div class="page-header">
            <div>
                <h1>
                    <i class="fas fa-money-bill-wave" style="color:#F59E0B;"></i>
                    退款管理
                </h1>
                <div class="subtitle">退款申请处理与资金追踪</div>
            </div>
            <div class="header-actions">
                <button class="btn btn-success" onclick="alert('📝 新建退款申请')">
                    <i class="fas fa-plus"></i> 新建退款
                </button>
                <button class="btn btn-outline" onclick="alert('📥 导出退款记录')">
                    <i class="fas fa-file-export"></i> 导出
                </button>
                <button class="btn btn-outline" id="refreshRefundsBtn">
                    <i class="fas fa-sync"></i>
                </button>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number warning">8</div>
                <div class="stat-label">⏳ 待处理</div>
            </div>
            <div class="stat-card">
                <div class="stat-number success">15</div>
                <div class="stat-label">✅ 已退款</div>
            </div>
            <div class="stat-card">
                <div class="stat-number danger">3</div>
                <div class="stat-label">❌ 已拒绝</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">¥8,920</div>
                <div class="stat-label">💰 退款总额</div>
            </div>
        </div>

        <div class="toolbar">
            <input type="text" class="search-box" id="refundSearch" placeholder="🔍 搜索订单号...">
            <select class="filter-select" id="refundStatusFilter">
                <option value="">全部状态</option>
                <option value="pending">待处理</option>
                <option value="approved">已批准</option>
                <option value="refunded">已退款</option>
                <option value="rejected">已拒绝</option>
            </select>
            <button class="btn btn-primary" id="refundSearchBtn">
                <i class="fas fa-search"></i> 搜索
            </button>
            <button class="btn btn-outline" id="refundResetBtn">
                <i class="fas fa-undo"></i> 重置
            </button>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-list" style="color:#4F46E5;"></i> 退款列表</h3>
                <span style="font-size:12px;color:#6B7280;">共 26 条</span>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>退款单号</th>
                            <th>原订单</th>
                            <th>客户</th>
                            <th>退款金额</th>
                            <th>原因</th>
                            <th>状态</th>
                            <th>申请时间</th>
                            <th style="text-align:center;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>REF-2024-001</strong></td>
                            <td>ORD-2024-003</td>
                            <td>张伟</td>
                            <td style="font-weight:600;color:#4F46E5;">¥459.00</td>
                            <td>服务不满意</td>
                            <td><span class="badge badge-warning">待处理</span></td>
                            <td>2024-07-11 14:30</td>
                            <td style="text-align:center;">
                                <button class="btn btn-sm btn-success"><i class="fas fa-check"></i></button>
                                <button class="btn btn-sm btn-danger"><i class="fas fa-times"></i></button>
                                <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>REF-2024-002</strong></td>
                            <td>ORD-2024-005</td>
                            <td>陈静</td>
                            <td style="font-weight:600;color:#4F46E5;">¥89.00</td>
                            <td>客户取消</td>
                            <td><span class="badge badge-success">已退款</span></td>
                            <td>2024-07-11 13:20</td>
                            <td style="text-align:center;">
                                <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>REF-2024-003</strong></td>
                            <td>ORD-2024-008</td>
                            <td>赵磊</td>
                            <td style="font-weight:600;color:#4F46E5;">¥399.00</td>
                            <td>产品质量问题</td>
                            <td><span class="badge badge-danger">已拒绝</span></td>
                            <td>2024-07-10 16:20</td>
                            <td style="text-align:center;">
                                <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <span class="info">共 26 条，第 1/3 页</span>
                <div class="btn-group">
                    <button disabled><i class="fas fa-chevron-left"></i></button>
                    <button class="active">1</button>
                    <button>2</button>
                    <button>3</button>
                    <button><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import { init } from './refunds.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('💰 退款管理页面加载');
            init().catch(err => console.warn('退款管理初始化失败:', err));

            document.getElementById('refreshRefundsBtn')?.addEventListener('click', function() {
                const icon = this.querySelector('i');
                icon.classList.add('fa-spin');
                setTimeout(() => icon.classList.remove('fa-spin'), 800);
            });

            document.getElementById('refundSearchBtn')?.addEventListener('click', function() {
                const keyword = document.getElementById('refundSearch').value;
                const status = document.getElementById('refundStatusFilter').value;
                alert('🔍 搜索条件:\n订单号: ' + (keyword || '全部') + '\n状态: ' + (status || '全部'));
            });

            document.getElementById('refundResetBtn')?.addEventListener('click', function() {
                document.getElementById('refundSearch').value = '';
                document.getElementById('refundStatusFilter').value = '';
            });
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'Refunds',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    /**
 * @file refunds.js
 * @module orders-refunds
 * @description 退款管理 - 退款申请、处理和记录
 * 
 * @example
 * import { init } from './refunds.js';
 * await init();
 * 
 * @author Carwash Pro Team
 * @version 1.0.0
 */

import { apiClient } from '../../../js/core/api/api-client.js';
import { store } from '../js/core/store.js';
import { showToast } from '../js/core/init.js';

/**
 * @typedef {Object} RefundItem
 * @property {string} name - 商品名称
 * @property {number} price - 单价
 * @property {number} qty - 数量
 * @property {number} subtotal - 小计
 */

/**
 * @typedef {Object} RefundRecord
 * @property {string} id - 退款单号
 * @property {string} orderId - 原订单号
 * @property {RefundItem[]} items - 退款商品列表
 * @property {number} amount - 退款金额
 * @property {string} reason - 退款原因
 * @property {string} method - 退款方式
 * @property {string} note - 备注
 * @property {string} date - 日期
 * @property {string} status - 状态 (pending/processing/completed/rejected)
 */

/**
 * @typedef {Object} RefundState
 * @property {RefundRecord[]} refunds - 退款记录
 * @property {Object|null} currentOrder - 当前订单
 * @property {RefundItem[]} refundItems - 当前退款商品
 * @property {string} searchQuery - 搜索关键词
 */

/** @type {RefundState} 状态 */
const state = {
    refunds: [],
    currentOrder: null,
    refundItems: [],
    searchQuery: ''
};

/**
 * 状态标签映射
 */
const STATUS_MAP = {
    'pending': { label: '待处理', color: '#F59E0B', bg: '#FEF3C7' },
    'processing': { label: '处理中', color: '#3B82F6', bg: '#DBEAFE' },
    'completed': { label: '已完成', color: '#10B981', bg: '#D1FAE5' },
    'rejected': { label: '已拒绝', color: '#EF4444', bg: '#FEE2E2' }
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
 * @returns {RefundRecord[]} 模拟退款数据
 * @description 获取模拟退款数据
 */
function getMockRefunds() {
    const customers = ['张伟', '李娜', '王强', '刘洋'];
    const reasons = ['质量问题', '发错商品', '客户不满意', '运输损坏'];
    const methods = ['原路返回', '现金退款', '银行转账'];
    const services = ['抛光打蜡', '内饰清洗', '深度清洁', '精致洗车'];
    const prices = [388, 328, 268, 128];
    
    const refunds = [];
    const now = Date.now();
    
    for (let i = 0; i < 8; i++) {
        const date = new Date(now - Math.random() * 14 * 24 * 60 * 60 * 1000);
        const itemCount = Math.floor(Math.random() * 2) + 1;
        const items = [];
        let total = 0;
        
        for (let j = 0; j < itemCount; j++) {
            const idx = Math.floor(Math.random() * services.length);
            const qty = 1;
            const subtotal = prices[idx] * qty;
            items.push({
                name: services[idx],
                price: prices[idx],
                qty: qty,
                subtotal: subtotal
            });
            total += subtotal;
        }
        
        const statuses = ['pending', 'processing', 'completed', 'completed', 'rejected'];
        
        refunds.push({
            id: 'REF-' + String(100 + i).padStart(4, '0'),
            orderId: 'ORD-' + String(1000 + i).padStart(4, '0'),
            items: items,
            amount: total,
            reason: reasons[Math.floor(Math.random() * reasons.length)],
            method: methods[Math.floor(Math.random() * methods.length)],
            note: Math.random() > 0.7 ? '客户急用' : '',
            date: date.toISOString(),
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }
    
    refunds.sort((a, b) => new Date(b.date) - new Date(a.date));
    return refunds;
}

/**
 * @private
 * @description 渲染退款列表
 */
function renderRefunds() {
    const container = document.getElementById('refundListBody');
    if (!container) return;
    
    const filtered = state.refunds.filter(r => 
        r.id.includes(state.searchQuery) || 
        r.orderId.includes(state.searchQuery)
    );
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:40px;color:#9CA3AF;">
                    <i class="fas fa-inbox" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                    暂无退款记录
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(refund => {
        const status = STATUS_MAP[refund.status] || STATUS_MAP.pending;
        
        return `
            <tr style="border-bottom:1px solid #F3F4F6;transition:background 0.2s;"
                onmouseover="this.style.background='#F9FAFB'"
                onmouseout="this.style.background=''">
                <td style="padding:12px;font-family:monospace;font-weight:500;">${refund.id}</td>
                <td style="padding:12px;font-family:monospace;">${refund.orderId}</td>
                <td style="padding:12px;text-align:right;font-weight:600;">¥${formatCurrency(refund.amount)}</td>
                <td style="padding:12px;">
                    <span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${status.bg};color:${status.color};">
                        ${status.label}
                    </span>
                </td>
                <td style="padding:12px;">${refund.reason}</td>
                <td style="padding:12px;font-size:13px;color:#6B7280;">${formatDate(refund.date)}</td>
                <td style="padding:12px;text-align:center;">
                    <button class="btn btn-sm btn-outline" onclick="window.RefundsModule.viewDetail('${refund.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${refund.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="window.RefundsModule.updateStatus('${refund.id}', 'processing')">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * @private
 * @param {string} id - 退款单号
 * @description 查看退款详情
 */
function viewDetail(id) {
    const refund = state.refunds.find(r => r.id === id);
    if (!refund) {
        showToast('退款记录不存在', 'error');
        return;
    }
    
    const statusLabels = {
        pending: '待处理',
        processing: '处理中',
        completed: '已完成',
        rejected: '已拒绝'
    };
    
    alert(`退款详情：
退款单号: ${refund.id}
原订单: ${refund.orderId}
日期: ${formatDate(refund.date)}
状态: ${statusLabels[refund.status] || refund.status}
退款金额: ¥${formatCurrency(refund.amount)}
原因: ${refund.reason}
方式: ${refund.method}
备注: ${refund.note || '无'}
商品: ${refund.items.map(i => i.name + ' × ' + i.qty + ' ¥' + formatCurrency(i.subtotal)).join(', ')}`);
}

/**
 * @private
 * @param {string} id - 退款单号
 * @param {string} status - 新状态
 * @description 更新退款状态
 */
async function updateStatus(id, status) {
    const refund = state.refunds.find(r => r.id === id);
    if (!refund) {
        showToast('退款记录不存在', 'error');
        return;
    }
    
    try {
        const response = await apiClient.put(`/refunds/${id}/status`, { status });
        if (response && response.success) {
            refund.status = status;
            localStorage.setItem('refund_history', JSON.stringify(state.refunds));
            renderRefunds();
            showToast('退款状态已更新: ' + (STATUS_MAP[status]?.label || status), 'success');
        } else {
            throw new Error(response.message || '更新失败');
        }
    } catch (error) {
        console.error('❌ 更新退款状态失败:', error);
        showToast('更新失败: ' + error.message, 'error');
    }
}

/**
 * @private
 * @description 创建新退款
 */
function newRefund() {
    const orderId = prompt('输入原订单号：', 'ORD-2024-001');
    if (!orderId) return;
    
    const reason = prompt('输入退款原因：', '客户要求退款');
    if (!reason) return;
    
    const amount = parseFloat(prompt('输入退款金额：', '100'));
    if (isNaN(amount) || amount <= 0) {
        showToast('请输入有效金额', 'error');
        return;
    }
    
    const refund = {
        id: 'REF-' + Date.now().toString().slice(-8),
        orderId: orderId,
        items: [{ name: '退款商品', price: amount, qty: 1, subtotal: amount }],
        amount: amount,
        reason: reason,
        method: '原路返回',
        note: '手动创建',
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    state.refunds.push(refund);
    localStorage.setItem('refund_history', JSON.stringify(state.refunds));
    renderRefunds();
    showToast('退款已创建: ' + refund.id, 'success');
}

/**
 * @private
 * @description 搜索退款
 */
function searchRefunds(query) {
    state.searchQuery = query;
    renderRefunds();
}

/**
 * @private
 * @description 加载退款数据
 */
function loadRefunds() {
    try {
        const saved = localStorage.getItem('refund_history');
        if (saved) {
            state.refunds = JSON.parse(saved);
        } else {
            state.refunds = getMockRefunds();
            localStorage.setItem('refund_history', JSON.stringify(state.refunds));
        }
    } catch (e) {
        console.warn('加载退款数据失败:', e);
        state.refunds = getMockRefunds();
    }
    renderRefunds();
}

/**
 * @private
 * @description 刷新退款数据
 */
function refresh() {
    loadRefunds();
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
                searchRefunds(this.value);
            }, 300);
        });
    }
    
    const refreshBtn = document.getElementById('refreshRefunds');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refresh);
    }
    
    const newBtn = document.getElementById('newRefund');
    if (newBtn) {
        newBtn.addEventListener('click', newRefund);
    }
}

/**
 * @public
 * @returns {Promise<void>}
 * @description 初始化退款管理
 */
export async function init() {
    console.log('💰 退款管理 初始化...');
    
    loadRefunds();
    bindEvents();
    
    // 暴露全局方法
    window.RefundsModule = {
        state,
        loadRefunds,
        renderRefunds,
        viewDetail,
        updateStatus,
        newRefund,
        searchRefunds,
        refresh
    };
    
    console.log('✅ 退款管理 初始化完成');
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export default {
    init,
    loadRefunds,
    viewDetail,
    updateStatus,
    newRefund,
    searchRefunds,
    refresh
};
  },
  methods: {}
}
</script>

<style scoped>

</style>
