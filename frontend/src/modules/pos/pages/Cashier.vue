<template>
  <div class="pos-">
    



    <div class="cashier-container">
        <div class="cashier-header">
            <div>
                <h1>
                    <i class="fas fa-user-circle" style="color:#4F46E5;"></i>
                    收银员工作台
                </h1>
            </div>
            <div class="cashier-status">
                <span><span class="status-dot"></span> 在线</span>
                <span>👤 张伟</span>
                <span>📅 今天 14:30</span>
                <button class="btn btn-sm btn-outline" onclick="alert('📊 日结报表')">
                    <i class="fas fa-file-invoice"></i> 日结
                </button>
            </div>
        </div>

        <div class="cashier-grid">
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-chart-simple" style="color:#4F46E5;"></i> 今日统计</h3>
                    <span style="font-size:12px;color:#6B7280;">实时更新</span>
                </div>
                <div class="card-body">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value primary">¥12,580</div>
                            <div class="stat-label">💰 收入</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">42</div>
                            <div class="stat-label">📋 订单数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value success">28</div>
                            <div class="stat-label">🚗 洗车数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value warning">¥299</div>
                            <div class="stat-label">📈 客单价</div>
                        </div>
                    </div>
                    <div style="margin-top:12px;">
                        <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;">
                            <span style="color:#6B7280;">现金支付</span>
                            <span style="font-weight:500;">¥3,450 (27%)</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;">
                            <span style="color:#6B7280;">移动支付</span>
                            <span style="font-weight:500;">¥8,230 (65%)</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;">
                            <span style="color:#6B7280;">会员卡</span>
                            <span style="font-weight:500;">¥900 (8%)</span>
                        </div>
                    </div>
                </div>
            </div>

            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-clock" style="color:#4F46E5;"></i> 最近订单</h3>
                    <span style="font-size:12px;color:#6B7280;">共 12 单</span>
                </div>
                <div class="card-body">
                    <div class="recent-order">
                        <div class="order-info">
                            <div class="order-id">ORD-2024-001</div>
                            <div class="order-time">14:30 · 现金</div>
                        </div>
                        <div>
                            <span class="badge badge-success">已完成</span>
                            <span class="order-amount">¥299</span>
                        </div>
                    </div>
                    <div class="recent-order">
                        <div class="order-info">
                            <div class="order-id">ORD-2024-002</div>
                            <div class="order-time">14:15 · 微信</div>
                        </div>
                        <div>
                            <span class="badge badge-success">已完成</span>
                            <span class="order-amount">¥159</span>
                        </div>
                    </div>
                    <div class="recent-order">
                        <div class="order-info">
                            <div class="order-id">ORD-2024-003</div>
                            <div class="order-time">13:50 · 支付宝</div>
                        </div>
                        <div>
                            <span class="badge badge-warning">处理中</span>
                            <span class="order-amount">¥459</span>
                        </div>
                    </div>
                    <div class="recent-order">
                        <div class="order-info">
                            <div class="order-id">ORD-2024-004</div>
                            <div class="order-time">13:20 · 会员卡</div>
                        </div>
                        <div>
                            <span class="badge badge-success">已完成</span>
                            <span class="order-amount">¥89</span>
                        </div>
                    </div>
                    <div class="recent-order">
                        <div class="order-info">
                            <div class="order-id">ORD-2024-005</div>
                            <div class="order-time">12:45 · 现金</div>
                        </div>
                        <div>
                            <span class="badge badge-secondary">已取消</span>
                            <span class="order-amount">¥329</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import { init } from './cashier.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('👤 收银员页面加载');
            init().catch(err => console.warn('收银员初始化失败:', err));
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'Cashier',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    /**
 * @file pos/submodules/cashier.js
 * @description 收银员管理子模块
 */

import { apiClient } from '@services/api-client.js';
import { datatable } from '@components/datatable.js';
import { modal } from '@components/modal.js';

export const meta = {
    name: '收银员管理',
    path: '/pos/cashier',
    icon: 'fa-user',
    permission: 'pos:cashier'
};

export async function render(container) {
    container.innerHTML = `
        <div class="cashier-container">
            <div class="page-header">
                <h1>👤 收银员管理</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="addCashier"><i class="fas fa-plus"></i> 添加收银员</button>
                </div>
            </div>
            <div class="card">
                <div class="card-body" id="cashierTable">
                    <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
                </div>
            </div>
        </div>
    `;
    
    const result = await apiClient.get('/users', { params: { role: 'cashier' } });
    const data = result.success ? result.data || [] : [];
    
    const columns = [
        { key: 'name', label: '姓名' },
        { key: 'username', label: '用户名' },
        { key: 'phone', label: '电话' },
        { key: 'status', label: '状态', type: 'status' },
        { key: 'createdAt', label: '入职时间', type: 'datetime' }
    ];
    
    const tableContainer = document.getElementById('cashierTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无收银员' });
    
    document.getElementById('addCashier')?.addEventListener('click', () => {
        modal.open({
            title: '添加收银员',
            content: `
                <div class="form-group"><label class="form-label">姓名</label><input type="text" class="form-control" id="cashierName"></div>
                <div class="form-group"><label class="form-label">用户名</label><input type="text" class="form-control" id="cashierUsername"></div>
                <div class="form-group"><label class="form-label">密码</label><input type="password" class="form-control" id="cashierPassword"></div>
                <div class="form-group"><label class="form-label">电话</label><input type="text" class="form-control" id="cashierPhone"></div>
            `,
            buttons: [
                { label: '取消', type: 'secondary' },
                { label: '创建', type: 'primary', onClick: async () => {
                    const name = document.getElementById('cashierName').value.trim();
                    const username = document.getElementById('cashierUsername').value.trim();
                    const password = document.getElementById('cashierPassword').value;
                    const phone = document.getElementById('cashierPhone').value.trim();
                    if (!name || !username || !password) {
                        modal.alert('提示', '请填写完整信息', '知道了', 'warning');
                        return;
                    }
                    await apiClient.post('/users', { name, username, password, phone, role: 'cashier', status: 'active' });
                    modal.alert('成功', '收银员已添加 ✅', '知道了', 'success');
                    render(container);
                }}
            ]
        });
    });
}

export async function init() { console.log('✅ [Cashier] 已初始化'); }
export default { meta, render, init };
  },
  methods: {}
}
</script>

<style scoped>

</style>
