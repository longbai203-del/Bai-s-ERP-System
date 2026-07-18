<template>
  <div class="orders-">
    
<div class="page-container" data-page="03-orders-returns">
    <div class="page-header">
        <h1><i class="fas fa-undo"></i> 退货管理</h1>
        <div class="page-actions">
            <button class="btn btn-primary" onclick="window.ReturnOrderModule.newReturn()">
                <i class="fas fa-plus"></i> 新建退货
            </button>
            <button class="btn btn-success" onclick="window.ReturnOrderModule.processReturns()">
                <i class="fas fa-check"></i> 批量处理
            </button>
            <button class="btn btn-outline" onclick="location.reload()">
                <i class="fas fa-sync-alt"></i> 刷新
            </button>
        </div>
    </div>
    <div class="page-content">
        <div class="return-container">
            
            <div class="return-stats">
                <div class="stat-card">
                    <span class="stat-label">待审核</span>
                    <span class="stat-number" id="pendingReturns">0</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">审核通过</span>
                    <span class="stat-number" id="approvedReturns">0</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">退货中</span>
                    <span class="stat-number" id="shippingReturns">0</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">已完成</span>
                    <span class="stat-number" id="completedReturns">0</span>
                </div>
            </div>

            
            <div class="return-search">
                <input type="text" id="returnSearch" placeholder="搜索退货单号或订单号..." 
                       oninput="window.ReturnOrderModule.search(this.value)" />
                <select id="returnStatusFilter" onchange="window.ReturnOrderModule.filterByStatus(this.value)">
                    <option value="">全部状态</option>
                    <option value="pending">待审核</option>
                    <option value="approved">审核通过</option>
                    <option value="shipping">退货中</option>
                    <option value="completed">已完成</option>
                    <option value="rejected">已拒绝</option>
                </select>
                <button class="btn btn-primary" onclick="window.ReturnOrderModule.searchReturns()">
                    <i class="fas fa-search"></i> 搜索
                </button>
            </div>

            
            <div class="return-list">
                <table class="return-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="selectAll" onchange="window.ReturnOrderModule.toggleAll(this.checked)" /></th>
                            <th>退货单号</th>
                            <th>原订单</th>
                            <th>客户</th>
                            <th>退货商品</th>
                            <th>退款金额</th>
                            <th>状态</th>
                            <th>申请时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="returnTableBody">
                        <tr>
                            <td colspan="9" style="text-align:center;padding:40px;color:#9CA3AF;">
                                <i class="fas fa-inbox" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                                暂无退货记录
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            
            <div class="return-pagination" id="returnPagination">
                <span id="returnTotal">共 0 条记录</span>
                <div class="pagination-btns">
                    <button onclick="window.ReturnOrderModule.prevPage()"><i class="fas fa-chevron-left"></i></button>
                    <span id="returnPageInfo">1/1</span>
                    <button onclick="window.ReturnOrderModule.nextPage()"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .return-container { max-width: 1200px; margin: 0 auto; }
    
    .return-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
    .return-stats .stat-card { background: white; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #e5e7eb; }
    .return-stats .stat-card .stat-label { display: block; font-size: 13px; color: #6B7280; }
    .return-stats .stat-card .stat-number { display: block; font-size: 28px; font-weight: 700; color: #1F2937; margin-top: 4px; }
    .return-stats .stat-card:nth-child(1) .stat-number { color: #F59E0B; }
    .return-stats .stat-card:nth-child(2) .stat-number { color: #3B82F6; }
    .return-stats .stat-card:nth-child(3) .stat-number { color: #8B5CF6; }
    .return-stats .stat-card:nth-child(4) .stat-number { color: #10B981; }
    
    .return-search { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .return-search input { flex: 1; padding: 8px 14px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px; min-width: 200px; }
    .return-search input:focus { outline: none; border-color: #4F46E5; }
    .return-search select { padding: 8px 14px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px; background: white; }
    
    .return-list { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
    .return-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .return-table th { background: #F9FAFB; padding: 10px 14px; text-align: left; font-weight: 600; color: #6B7280; border-bottom: 1px solid #E5E7EB; }
    .return-table td { padding: 10px 14px; border-bottom: 1px solid #F3F4F6; }
    .return-table tr:hover { background: #F9FAFB; }
    
    .badge-return-pending { background: #FEF3C7; color: #92400E; }
    .badge-return-approved { background: #DBEAFE; color: #1E40AF; }
    .badge-return-shipping { background: #EDE9FE; color: #6D28D9; }
    .badge-return-completed { background: #D1FAE5; color: #065F46; }
    .badge-return-rejected { background: #FEE2E2; color: #991B1B; }
    
    .return-pagination { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: white; border-radius: 12px; margin-top: 16px; border: 1px solid #e5e7eb; }
    .return-pagination .pagination-btns { display: flex; gap: 4px; align-items: center; }
    .return-pagination button { padding: 4px 12px; border: 1px solid #D1D5DB; border-radius: 4px; background: white; cursor: pointer; }
    .return-pagination button:hover { background: #F3F4F6; }
    
    .btn-sm-return { padding: 4px 10px; border-radius: 4px; border: none; cursor: pointer; font-size: 12px; }
    .btn-sm-return-primary { background: #4F46E5; color: white; }
    .btn-sm-return-primary:hover { background: #4338CA; }
    .btn-sm-return-success { background: #10B981; color: white; }
    .btn-sm-return-success:hover { background: #059669; }
    .btn-sm-return-danger { background: #EF4444; color: white; }
    .btn-sm-return-danger:hover { background: #DC2626; }
    .btn-sm-return-warning { background: #F59E0B; color: white; }
    .btn-sm-return-warning:hover { background: #D97706; }
    
    [data-theme="dark"] .return-stats .stat-card,
    [data-theme="dark"] .return-list,
    [data-theme="dark"] .return-pagination { background: #2C2C2E; border-color: #48484A; }
    [data-theme="dark"] .return-stats .stat-card .stat-number { color: #F5F5F7; }
    [data-theme="dark"] .return-table th { background: #3A3A3C; color: #9CA3AF; }
    [data-theme="dark"] .return-table td { border-color: #3A3A3C; }
    [data-theme="dark"] .return-table tr:hover { background: #3A3A3C; }
    [data-theme="dark"] .return-search input,
    [data-theme="dark"] .return-search select { background: #3A3A3C; border-color: #48484A; color: #F5F5F7; }
    
    @media (max-width: 768px) { .return-stats { grid-template-columns: repeat(2, 1fr); } .return-table { font-size: 12px; } }
</style>

<script>
    (function() {
        window.ReturnOrderModule = {
            returns: [],
            filteredReturns: [],
            page: 1,
            pageSize: 10,
            selected: [],
            
            init: function() {
                this.loadReturns();
                this.render();
            },
            
            loadReturns: function() {
                const saved = localStorage.getItem('return_order_data');
                if (saved) {
                    try {
                        this.returns = JSON.parse(saved);
                    } catch (e) {
                        this.returns = this.getMockReturns();
                    }
                } else {
                    this.returns = this.getMockReturns();
                    localStorage.setItem('return_order_data', JSON.stringify(this.returns));
                }
                this.filteredReturns = [...this.returns];
            },
            
            getMockReturns: function() {
                return [
                    { id: 'RT-001', orderId: 'ORD-001', customer: '张伟', product: '标准洗车', amount: 68, status: 'pending', time: '2024-01-15 14:30' },
                    { id: 'RT-002', orderId: 'ORD-003', customer: '李娜', product: '抛光打蜡', amount: 388, status: 'approved', time: '2024-01-16 09:20' },
                    { id: 'RT-003', orderId: 'ORD-005', customer: '王强', product: '内饰清洗', amount: 328, status: 'shipping', time: '2024-01-17 16:45' },
                    { id: 'RT-004', orderId: 'ORD-002', customer: '刘洋', product: '精致洗车', amount: 128, status: 'completed', time: '2024-01-18 11:00' },
                    { id: 'RT-005', orderId: 'ORD-007', customer: '陈静', product: '漆面镀晶', amount: 688, status: 'rejected', time: '2024-01-19 13:15' }
                ];
            },
            
            render: function() {
                const tbody = document.getElementById('returnTableBody');
                const start = (this.page - 1) * this.pageSize;
                const end = start + this.pageSize;
                const pageData = this.filteredReturns.slice(start, end);
                
                if (pageData.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="9" style="text-align:center;padding:40px;color:#9CA3AF;">
                                <i class="fas fa-inbox" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                                暂无退货记录
                            </td>
                        </tr>
                    `;
                } else {
                    const statusMap = {
                        pending: '待审核',
                        approved: '审核通过',
                        shipping: '退货中',
                        completed: '已完成',
                        rejected: '已拒绝'
                    };
                    const statusClass = {
                        pending: 'badge-return-pending',
                        approved: 'badge-return-approved',
                        shipping: 'badge-return-shipping',
                        completed: 'badge-return-completed',
                        rejected: 'badge-return-rejected'
                    };
                    
                    tbody.innerHTML = pageData.map(r => `
                        <tr>
                            <td><input type="checkbox" class="return-checkbox" data-id="${r.id}" onchange="window.ReturnOrderModule.toggleSelect(this)" /></td>
                            <td><strong>${r.id}</strong></td>
                            <td>${r.orderId}</td>
                            <td>${r.customer}</td>
                            <td>${r.product}</td>
                            <td><strong>¥${r.amount.toFixed(2)}</strong></td>
                            <td><span class="badge ${statusClass[r.status] || 'badge-return-pending'}">${statusMap[r.status] || r.status}</span></td>
                            <td style="font-size:13px;color:#6B7280;">${r.time}</td>
                            <td>
                                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                                    <button class="btn-sm-return btn-sm-return-primary" onclick="window.ReturnOrderModule.viewReturn('${r.id}')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    ${r.status === 'pending' ? `
                                        <button class="btn-sm-return btn-sm-return-success" onclick="window.ReturnOrderModule.approveReturn('${r.id}')">
                                            <i class="fas fa-check"></i>
                                        </button>
                                        <button class="btn-sm-return btn-sm-return-danger" onclick="window.ReturnOrderModule.rejectReturn('${r.id}')">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    ` : ''}
                                    ${r.status === 'approved' ? `
                                        <button class="btn-sm-return btn-sm-return-warning" onclick="window.ReturnOrderModule.startShipping('${r.id}')">
                                            <i class="fas fa-truck"></i>
                                        </button>
                                    ` : ''}
                                    ${r.status === 'shipping' ? `
                                        <button class="btn-sm-return btn-sm-return-success" onclick="window.ReturnOrderModule.completeReturn('${r.id}')">
                                            <i class="fas fa-check-circle"></i>
                                        </button>
                                    ` : ''}
                                </div>
                            </td>
                        </tr>
                    `).join('');
                }
                
                this.updateStats();
                this.renderPagination();
            },
            
            updateStats: function() {
                document.getElementById('pendingReturns').textContent = this.returns.filter(r => r.status === 'pending').length;
                document.getElementById('approvedReturns').textContent = this.returns.filter(r => r.status === 'approved').length;
                document.getElementById('shippingReturns').textContent = this.returns.filter(r => r.status === 'shipping').length;
                document.getElementById('completedReturns').textContent = this.returns.filter(r => r.status === 'completed').length;
            },
            
            renderPagination: function() {
                const total = this.filteredReturns.length;
                const totalPages = Math.ceil(total / this.pageSize) || 1;
                document.getElementById('returnTotal').textContent = '共 ' + total + ' 条记录';
                document.getElementById('returnPageInfo').textContent = this.page + '/' + totalPages;
            },
            
            newReturn: function() {
                const orderId = prompt('输入原订单号：');
                if (!orderId) return;
                const product = prompt('输入退货商品名称：');
                if (!product) return;
                const amount = parseFloat(prompt('输入退款金额：'));
                if (isNaN(amount) || amount <= 0) return;
                
                const returnRecord = {
                    id: 'RT-' + Date.now().toString().slice(-6),
                    orderId: orderId,
                    customer: '客户',
                    product: product,
                    amount: amount,
                    status: 'pending',
                    time: new Date().toLocaleString()
                };
                this.returns.push(returnRecord);
                this.filteredReturns = [...this.returns];
                localStorage.setItem('return_order_data', JSON.stringify(this.returns));
                this.render();
                alert('退货申请已创建: ' + returnRecord.id);
            },
            
            processReturns: function() {
                const pending = this.returns.filter(r => r.status === 'pending');
                if (pending.length === 0) {
                    alert('没有待处理的退货');
                    return;
                }
                const confirm = confirm('批量审核通过 ' + pending.length + ' 条退货申请？');
                if (confirm) {
                    pending.forEach(r => r.status = 'approved');
                    localStorage.setItem('return_order_data', JSON.stringify(this.returns));
                    this.render();
                    alert('已审核 ' + pending.length + ' 条退货申请');
                }
            },
            
            search: function(query) {
                if (!query || query.length < 2) {
                    this.filteredReturns = [...this.returns];
                } else {
                    this.filteredReturns = this.returns.filter(r => 
                        r.id.includes(query) || 
                        r.orderId.includes(query) || 
                        r.customer.includes(query) ||
                        r.product.includes(query)
                    );
                }
                this.page = 1;
                this.render();
            },
            
            filterByStatus: function(status) {
                if (!status) {
                    this.filteredReturns = [...this.returns];
                } else {
                    this.filteredReturns = this.returns.filter(r => r.status === status);
                }
                this.page = 1;
                this.render();
            },
            
            searchReturns: function() {
                const query = document.getElementById('returnSearch').value;
                this.search(query);
            },
            
            toggleSelect: function(checkbox) {
                if (checkbox.checked) {
                    this.selected.push(checkbox.dataset.id);
                } else {
                    this.selected = this.selected.filter(id => id !== checkbox.dataset.id);
                }
            },
            
            toggleAll: function(checked) {
                document.querySelectorAll('.return-checkbox').forEach(cb => {
                    cb.checked = checked;
                    if (checked) {
                        this.selected.push(cb.dataset.id);
                    }
                });
                if (!checked) this.selected = [];
            },
            
            viewReturn: function(id) {
                const record = this.returns.find(r => r.id === id);
                if (record) {
                    alert('退货详情:\n' +
                          '单号: ' + record.id + '\n' +
                          '订单: ' + record.orderId + '\n' +
                          '客户: ' + record.customer + '\n' +
                          '商品: ' + record.product + '\n' +
                          '金额: ¥' + record.amount.toFixed(2) + '\n' +
                          '状态: ' + record.status + '\n' +
                          '时间: ' + record.time);
                }
            },
            
            approveReturn: function(id) {
                if (confirm('确认审核通过该退货？')) {
                    const record = this.returns.find(r => r.id === id);
                    if (record) {
                        record.status = 'approved';
                        localStorage.setItem('return_order_data', JSON.stringify(this.returns));
                        this.render();
                        alert('退货已审核通过');
                    }
                }
            },
            
            rejectReturn: function(id) {
                if (confirm('确认拒绝该退货？')) {
                    const record = this.returns.find(r => r.id === id);
                    if (record) {
                        record.status = 'rejected';
                        localStorage.setItem('return_order_data', JSON.stringify(this.returns));
                        this.render();
                        alert('退货已拒绝');
                    }
                }
            },
            
            startShipping: function(id) {
                const record = this.returns.find(r => r.id === id);
                if (record) {
                    record.status = 'shipping';
                    localStorage.setItem('return_order_data', JSON.stringify(this.returns));
                    this.render();
                    alert('退货已进入物流环节');
                }
            },
            
            completeReturn: function(id) {
                if (confirm('确认该退货已完成？')) {
                    const record = this.returns.find(r => r.id === id);
                    if (record) {
                        record.status = 'completed';
                        localStorage.setItem('return_order_data', JSON.stringify(this.returns));
                        this.render();
                        alert('退货已完成');
                    }
                }
            },
            
            prevPage: function() {
                if (this.page > 1) {
                    this.page--;
                    this.render();
                }
            },
            
            nextPage: function() {
                const totalPages = Math.ceil(this.filteredReturns.length / this.pageSize);
                if (this.page < totalPages) {
                    this.page++;
                    this.render();
                }
            }
        };
        
        document.addEventListener('DOMContentLoaded', function() {
            window.ReturnOrderModule.init();
        });
    })();
</script>
  </div>
</template>

<script>
export default {
  name: 'Returns',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    /**
 * @file returns.js
 * @module returns
 * @description 退货管理 - 退货申请、处理和记录
 * 
 * @example
 * import { init } from './returns.js';
 * await init();
 * 
 * @author Carwash Pro Team
 * @version 1.0.0
 */

import { apiClient } from '../../../js/core/api/api-client.js';
import { store } from '../js/core/store.js';
import { showToast } from '../js/core/init.js';

/**
 * @typedef {Object} ReturnItem
 * @property {string} name - 商品名称
 * @property {number} price - 单价
 * @property {number} qty - 数量
 * @property {number} [subtotal] - 小计
 */

/**
 * @typedef {Object} ReturnRecord
 * @property {string} id - 退货单号
 * @property {string} orderId - 原订单号
 * @property {ReturnItem[]} items - 退货商品列表
 * @property {number} amount - 退货金额
 * @property {string} reason - 退货原因
 * @property {string} method - 退款方式
 * @property {string} note - 备注
 * @property {string} date - 日期
 * @property {string} status - 状态 (pending/processing/completed/rejected)
 * @property {string} [customer] - 客户名称
 * @property {string} [customerPhone] - 客户电话
 */

/**
 * @typedef {Object} ReturnState
 * @property {ReturnRecord[]} returns - 退货记录
 * @property {Object|null} currentOrder - 当前订单
 * @property {ReturnItem[]} returnItems - 当前退货商品
 * @property {string} searchQuery - 搜索关键词
 * @property {Object} filters - 筛选条件
 * @property {boolean} loading - 加载状态
 */

/** @type {ReturnState} 状态 */
const state = {
    returns: [],
    currentOrder: null,
    returnItems: [],
    searchQuery: '',
    filters: {
        status: 'all',
        startDate: '',
        endDate: ''
    },
    loading: false
};

/**
 * 状态标签和样式映射
 */
const STATUS_MAP = {
    'pending': { label: '待处理', color: '#F59E0B', bg: '#FEF3C7', icon: 'fa-clock' },
    'processing': { label: '处理中', color: '#3B82F6', bg: '#DBEAFE', icon: 'fa-spinner' },
    'completed': { label: '已完成', color: '#10B981', bg: '#D1FAE5', icon: 'fa-check-circle' },
    'rejected': { label: '已拒绝', color: '#EF4444', bg: '#FEE2E2', icon: 'fa-times-circle' }
};

/**
 * 退货原因选项
 */
const REASON_OPTIONS = [
    { value: 'quality', label: '商品质量问题' },
    { value: 'wrong', label: '发错商品' },
    { value: 'damaged', label: '运输损坏' },
    { value: 'dissatisfied', label: '客户不满意' },
    { value: 'other', label: '其他原因' }
];

/**
 * 退款方式选项
 */
const METHOD_OPTIONS = [
    { value: 'original', label: '原路返回' },
    { value: 'cash', label: '现金退款' },
    { value: 'bank', label: '银行转账' },
    { value: 'credit', label: '余额抵扣' }
];

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
 * @param {string} id - 退货单号
 * @returns {ReturnRecord|null} 退货记录
 * @description 根据ID获取退货记录
 */
function getReturnById(id) {
    return state.returns.find(r => r.id === id) || null;
}

/**
 * @private
 * @returns {ReturnRecord[]} 待处理退货列表
 * @description 获取待处理退货
 */
function getPendingReturns() {
    return state.returns.filter(r => r.status === 'pending' || r.status === 'processing');
}

/**
 * @private
 * @returns {ReturnRecord[]} 模拟退货数据
 * @description 获取模拟退货数据
 */
function getMockReturns() {
    const customers = ['张伟', '李娜', '王强', '刘洋', '陈静'];
    const reasons = ['质量问题', '发错商品', '客户不满意', '运输损坏', '其他原因'];
    const methods = ['原路返回', '现金退款', '银行转账', '余额抵扣'];
    const services = ['抛光打蜡', '内饰清洗', '深度清洁', '精致洗车', '标准洗车'];
    const prices = [388, 328, 268, 128, 68];
    
    const returns = [];
    const now = Date.now();
    
    for (let i = 0; i < 10; i++) {
        const date = new Date(now - Math.random() * 20 * 24 * 60 * 60 * 1000);
        const itemCount = Math.floor(Math.random() * 2) + 1;
        const items = [];
        let total = 0;
        
        for (let j = 0; j < itemCount; j++) {
            const idx = Math.floor(Math.random() * services.length);
            const qty = Math.floor(Math.random() * 2) + 1;
            const subtotal = prices[idx] * qty;
            items.push({
                name: services[idx],
                price: prices[idx],
                qty: qty,
                subtotal: subtotal
            });
            total += subtotal;
        }
        
        const statuses = ['pending', 'processing', 'completed', 'completed', 'completed', 'rejected'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const customer = customers[Math.floor(Math.random() * customers.length)];
        
        returns.push({
            id: 'RTN-' + String(100 + i).padStart(4, '0'),
            orderId: 'ORD-' + String(1000 + i).padStart(4, '0'),
            customer: customer,
            customerPhone: '1380000' + String(Math.floor(Math.random() * 9000) + 1000),
            items: items,
            amount: total,
            reason: reasons[Math.floor(Math.random() * reasons.length)],
            method: methods[Math.floor(Math.random() * methods.length)],
            note: Math.random() > 0.7 ? '客户急用，请尽快处理' : '',
            date: date.toISOString(),
            status: status
        });
    }
    
    returns.sort((a, b) => new Date(b.date) - new Date(a.date));
    return returns;
}

/**
 * @private
 * @description 加载退货数据
 */
function loadReturns() {
    try {
        const saved = localStorage.getItem('return_history');
        if (saved) {
            state.returns = JSON.parse(saved);
        } else {
            state.returns = getMockReturns();
            localStorage.setItem('return_history', JSON.stringify(state.returns));
        }
    } catch (e) {
        console.warn('加载退货数据失败:', e);
        state.returns = getMockReturns();
    }
    renderReturns();
    updateStats();
}

/**
 * @private
 * @description 保存退货数据到本地
 */
function saveReturns() {
    try {
        localStorage.setItem('return_history', JSON.stringify(state.returns));
    } catch (e) {
        console.warn('保存退货数据失败:', e);
    }
}

/**
 * @private
 * @description 渲染退货列表
 */
function renderReturns() {
    const container = document.getElementById('returnListBody') || document.getElementById('returnHistoryBody');
    if (!container) return;
    
    // 应用筛选
    let filtered = state.returns;
    
    if (state.filters.status !== 'all') {
        filtered = filtered.filter(r => r.status === state.filters.status);
    }
    
    if (state.filters.startDate) {
        filtered = filtered.filter(r => r.date >= state.filters.startDate);
    }
    
    if (state.filters.endDate) {
        filtered = filtered.filter(r => r.date <= state.filters.endDate + 'T23:59:59');
    }
    
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(r => 
            r.id.toLowerCase().includes(query) ||
            r.orderId.toLowerCase().includes(query) ||
            (r.customer && r.customer.includes(query))
        );
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;padding:40px;color:#9CA3AF;">
                    <i class="fas fa-inbox" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                    暂无退货记录
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(record => {
        const status = STATUS_MAP[record.status] || STATUS_MAP.pending;
        const itemsSummary = record.items.map(i => i.name).join('、');
        
        return `
            <tr style="border-bottom:1px solid #F3F4F6;transition:background 0.2s;"
                onmouseover="this.style.background='#F9FAFB'"
                onmouseout="this.style.background=''">
                <td style="padding:12px;font-family:monospace;font-weight:500;">${record.id}</td>
                <td style="padding:12px;font-family:monospace;">${record.orderId}</td>
                <td style="padding:12px;">${record.customer || '-'}</td>
                <td style="padding:12px;text-align:right;font-weight:600;">¥${formatCurrency(record.amount)}</td>
                <td style="padding:12px;font-size:13px;color:#6B7280;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    ${itemsSummary}
                </td>
                <td style="padding:12px;">
                    <span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${status.bg};color:${status.color};">
                        <i class="fas ${status.icon}" style="margin-right:4px;"></i>
                        ${status.label}
                    </span>
                </td>
                <td style="padding:12px;font-size:13px;color:#6B7280;">${formatDate(record.date)}</td>
                <td style="padding:12px;text-align:center;">
                    <button class="btn btn-sm btn-outline" onclick="window.ReturnsModule.viewDetail('${record.id}')" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${record.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="window.ReturnsModule.updateStatus('${record.id}', 'processing')" title="处理">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="window.ReturnsModule.updateStatus('${record.id}', 'rejected')" title="拒绝">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                    ${record.status === 'processing' ? `
                        <button class="btn btn-sm btn-success" onclick="window.ReturnsModule.updateStatus('${record.id}', 'completed')" title="完成">
                            <i class="fas fa-check-circle"></i>
                        </button>
                    ` : ''}
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
    const total = state.returns.length;
    const pending = state.returns.filter(r => r.status === 'pending').length;
    const processing = state.returns.filter(r => r.status === 'processing').length;
    const completed = state.returns.filter(r => r.status === 'completed').length;
    const rejected = state.returns.filter(r => r.status === 'rejected').length;
    const totalAmount = state.returns.reduce((sum, r) => sum + r.amount, 0);
    
    const elements = {
        'statTotal': total,
        'statPending': pending,
        'statProcessing': processing,
        'statCompleted': completed,
        'statRejected': rejected,
        'statTotalAmount': '¥' + formatCurrency(totalAmount)
    };
    
    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    });
}

/**
 * @private
 * @param {string} id - 退货单号
 * @description 查看退货详情
 */
function viewDetail(id) {
    const record = getReturnById(id);
    if (!record) {
        showToast('退货记录不存在', 'error');
        return;
    }
    
    const status = STATUS_MAP[record.status] || STATUS_MAP.pending;
    
    // 如果有详情弹窗，使用弹窗
    const modal = document.getElementById('returnDetailModal');
    if (modal) {
        const content = document.getElementById('returnDetailContent');
        if (content) {
            content.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div><span style="color:#6B7280;">退货单号</span><br><strong>${record.id}</strong></div>
                    <div><span style="color:#6B7280;">原订单</span><br><strong>${record.orderId}</strong></div>
                    <div><span style="color:#6B7280;">客户</span><br><strong>${record.customer || '-'}</strong></div>
                    <div><span style="color:#6B7280;">电话</span><br><strong>${record.customerPhone || '-'}</strong></div>
                    <div><span style="color:#6B7280;">退货金额</span><br><strong style="color:#EF4444;">¥${formatCurrency(record.amount)}</strong></div>
                    <div><span style="color:#6B7280;">状态</span><br><span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:12px;font-weight:500;background:${status.bg};color:${status.color};">${status.label}</span></div>
                    <div><span style="color:#6B7280;">原因</span><br><strong>${record.reason}</strong></div>
                    <div><span style="color:#6B7280;">退款方式</span><br><strong>${record.method}</strong></div>
                    <div style="grid-column:span 2;"><span style="color:#6B7280;">日期</span><br><strong>${formatDate(record.date)}</strong></div>
                    <div style="grid-column:span 2;"><span style="color:#6B7280;">备注</span><br><strong>${record.note || '无'}</strong></div>
                    <div style="grid-column:span 2;">
                        <span style="color:#6B7280;">商品明细</span><br>
                        ${record.items.map(i => 
                            `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #F3F4F6;font-size:13px;">
                                <span>${i.name} × ${i.qty}</span>
                                <span>¥${formatCurrency(i.subtotal || i.price * i.qty)}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
        modal.style.display = 'flex';
        return;
    }
    
    // 降级方案：使用alert
    const itemsSummary = record.items.map(i => `${i.name} × ${i.qty} ¥${formatCurrency(i.subtotal || i.price * i.qty)}`).join('\n');
    alert(`退货详情：
退货单号: ${record.id}
原订单: ${record.orderId}
客户: ${record.customer || '-'}
日期: ${formatDate(record.date)}
状态: ${status.label}
退货金额: ¥${formatCurrency(record.amount)}
原因: ${record.reason}
退款方式: ${record.method}
备注: ${record.note || '无'}

商品明细:
${itemsSummary}`);
}

/**
 * @private
 * @param {string} id - 退货单号
 * @param {string} status - 新状态
 * @description 更新退货状态
 */
async function updateStatus(id, status) {
    const record = getReturnById(id);
    if (!record) {
        showToast('退货记录不存在', 'error');
        return;
    }
    
    try {
        // 尝试调用API
        const response = await apiClient.put(`/returns/${id}/status`, { status });
        if (response && response.success) {
            record.status = status;
            saveReturns();
            renderReturns();
            updateStats();
            showToast('退货状态已更新为: ' + (STATUS_MAP[status]?.label || status), 'success');
        } else {
            // 如果API失败，直接更新本地
            record.status = status;
            saveReturns();
            renderReturns();
            updateStats();
            showToast('退货状态已更新为: ' + (STATUS_MAP[status]?.label || status), 'success');
        }
    } catch (error) {
        console.warn('API更新失败，使用本地更新:', error);
        record.status = status;
        saveReturns();
        renderReturns();
        updateStats();
        showToast('退货状态已更新为: ' + (STATUS_MAP[status]?.label || status), 'success');
    }
}

/**
 * @private
 * @description 创建新退货
 */
function newReturn() {
    const orderId = prompt('输入原订单号：', 'ORD-2024-001');
    if (!orderId) return;
    
    const reason = prompt('输入退货原因（1-质量问题 2-发错商品 3-运输损坏 4-客户不满意 5-其他）：', '1');
    const reasonMap = {
        '1': '质量问题',
        '2': '发错商品', 
        '3': '运输损坏',
        '4': '客户不满意',
        '5': '其他原因'
    };
    const reasonText = reasonMap[reason] || reason || '其他原因';
    
    const amount = parseFloat(prompt('输入退货金额：', '100'));
    if (isNaN(amount) || amount <= 0) {
        showToast('请输入有效金额', 'error');
        return;
    }
    
    const customer = prompt('输入客户名称：', '客户') || '客户';
    
    const record = {
        id: 'RTN-' + Date.now().toString().slice(-8),
        orderId: orderId,
        customer: customer,
        customerPhone: '',
        items: [{ name: '退货商品', price: amount, qty: 1, subtotal: amount }],
        amount: amount,
        reason: reasonText,
        method: '原路返回',
        note: '手动创建',
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    state.returns.push(record);
    saveReturns();
    renderReturns();
    updateStats();
    showToast('退货已创建: ' + record.id, 'success');
}

/**
 * @private
 * @description 搜索退货
 */
function searchReturns(query) {
    state.searchQuery = query;
    renderReturns();
}

/**
 * @private
 * @description 应用筛选
 */
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    state.filters.status = statusFilter ? statusFilter.value : 'all';
    state.filters.startDate = startDate ? startDate.value : '';
    state.filters.endDate = endDate ? endDate.value : '';
    
    renderReturns();
}

/**
 * @private
 * @description 重置筛选
 */
function resetFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const searchInput = document.getElementById('searchInput');
    
    if (statusFilter) statusFilter.value = 'all';
    if (startDate) startDate.value = '';
    if (endDate) endDate.value = '';
    if (searchInput) searchInput.value = '';
    
    state.filters = { status: 'all', startDate: '', endDate: '' };
    state.searchQuery = '';
    renderReturns();
}

/**
 * @private
 * @description 关闭详情弹窗
 */
function closeDetail() {
    const modal = document.getElementById('returnDetailModal');
    if (modal) modal.style.display = 'none';
}

/**
 * @private
 * @description 刷新数据
 */
function refresh() {
    loadReturns();
    showToast('数据已刷新', 'success');
}

/**
 * @private
 * @description 导出退货数据
 */
function exportData() {
    if (state.returns.length === 0) {
        showToast('暂无数据可导出', 'warning');
        return;
    }
    
    const headers = ['退货单号', '原订单', '客户', '金额', '原因', '方式', '状态', '日期', '备注'];
    const rows = state.returns.map(r => [
        r.id,
        r.orderId,
        r.customer || '',
        r.amount.toFixed(2),
        r.reason,
        r.method,
        STATUS_MAP[r.status]?.label || r.status,
        formatDate(r.date),
        r.note || ''
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '退货记录_' + new Date().toISOString().split('T')[0] + '.csv';
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
                searchReturns(this.value);
            }, 300);
        });
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    if (startDate) startDate.addEventListener('change', applyFilters);
    if (endDate) endDate.addEventListener('change', applyFilters);
    
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    const refreshBtn = document.getElementById('refreshReturns');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refresh);
    }
    
    const newBtn = document.getElementById('newReturn');
    if (newBtn) {
        newBtn.addEventListener('click', newReturn);
    }
    
    const exportBtn = document.getElementById('exportReturns');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    // 点击弹窗外关闭
    const modal = document.getElementById('returnDetailModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDetail();
            }
        });
    }
    
    // ESC关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDetail();
        }
    });
}

/**
 * @public
 * @param {Object} options - 初始化选项
 * @param {ReturnRecord[]} options.data - 初始数据
 * @returns {Promise<void>}
 * @description 初始化退货管理
 */
export async function init(options) {
    console.log('↩️ 退货管理 初始化...');
    
    // 如果传入了数据，使用传入数据
    if (options?.data) {
        state.returns = options.data;
        saveReturns();
    } else {
        loadReturns();
    }
    
    // 渲染统计
    updateStats();
    
    // 绑定事件
    bindEvents();
    
    // 暴露全局方法
    window.ReturnsModule = {
        state,
        loadReturns,
        renderReturns,
        updateStats,
        viewDetail,
        updateStatus,
        newReturn,
        searchReturns,
        applyFilters,
        resetFilters,
        closeDetail,
        refresh,
        exportData,
        getReturnById,
        getPendingReturns,
        saveReturns
    };
    
    console.log('✅ 退货管理 初始化完成');
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export default {
    init,
    loadReturns,
    renderReturns,
    viewDetail,
    updateStatus,
    newReturn,
    searchReturns,
    applyFilters,
    resetFilters,
    refresh,
    exportData,
    getReturnById,
    getPendingReturns,
    saveReturns
};
  },
  methods: {}
}
</script>

<style scoped>

</style>
