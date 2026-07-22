<template>
  <div class="pos-">
    



    <div class="returns-container">
        
        <div class="page-header">
            <div>
                <h1>
                    <i class="fas fa-undo-alt" style="color:#EF4444;"></i>
                    退货管理
                </h1>
                <div class="subtitle">退货申请处理与退款跟踪</div>
            </div>
            <div class="header-actions">
                <button class="btn btn-success" id="newReturnBtn">
                    <i class="fas fa-plus"></i> 新建退货
                </button>
                <button class="btn btn-outline" id="exportReturnBtn">
                    <i class="fas fa-file-export"></i> 导出
                </button>
                <button class="btn btn-outline" id="refreshReturnBtn">
                    <i class="fas fa-sync"></i>
                </button>
            </div>
        </div>

        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number warning">12</div>
                <div class="stat-label">📋 退货总数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number warning">3</div>
                <div class="stat-label">⏳ 待处理</div>
            </div>
            <div class="stat-card">
                <div class="stat-number success">7</div>
                <div class="stat-label">✅ 已退款</div>
            </div>
            <div class="stat-card">
                <div class="stat-number danger">2</div>
                <div class="stat-label">❌ 已拒绝</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">¥3,280</div>
                <div class="stat-label">💰 退款总额</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">2.8%</div>
                <div class="stat-label">📊 退货率</div>
            </div>
        </div>

        
        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-search" style="color:#4F46E5;"></i> 查询退货</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <div class="field">
                        <label>订单号</label>
                        <input type="text" id="searchOrderId" placeholder="输入订单号...">
                    </div>
                    <div class="field">
                        <label>状态</label>
                        <select id="searchStatus">
                            <option value="">全部</option>
                            <option value="pending">待处理</option>
                            <option value="approved">已批准</option>
                            <option value="refunded">已退款</option>
                            <option value="rejected">已拒绝</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>日期范围</label>
                        <input type="date" id="searchDateFrom">
                    </div>
                    <div style="display:flex;gap:6px;">
                        <button class="btn btn-primary" id="searchBtn">
                            <i class="fas fa-search"></i> 查询
                        </button>
                        <button class="btn btn-outline" id="resetBtn">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        
        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-list" style="color:#4F46E5;"></i> 退货列表</h3>
                <span style="font-size:12px;color:#6B7280;">共 12 条</span>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>退货单号</th>
                            <th>原订单</th>
                            <th>客户</th>
                            <th>金额</th>
                            <th>原因</th>
                            <th>状态</th>
                            <th>申请时间</th>
                            <th style="text-align:center;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="returnTableBody">
                        <tr>
                            <td><strong>RET-2024-001</strong></td>
                            <td>ORD-2024-001</td>
                            <td>王小明</td>
                            <td>¥299</td>
                            <td class="return-reason">服务质量不满意</td>
                            <td><span class="badge badge-warning">待处理</span></td>
                            <td>2024-07-11 14:30</td>
                            <td style="text-align:center;">
                                <button class="btn btn-sm btn-success"><i class="fas fa-check"></i></button>
                                <button class="btn btn-sm btn-danger"><i class="fas fa-times"></i></button>
                                <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>RET-2024-002</strong></td>
                            <td>ORD-2024-003</td>
                            <td>张伟</td>
                            <td>¥459</td>
                            <td class="return-reason">商品与描述不符</td>
                            <td><span class="badge badge-success">已退款</span></td>
                            <td>2024-07-10 16:20</td>
                            <td style="text-align:center;">
                                <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>RET-2024-003</strong></td>
                            <td>ORD-2024-005</td>
                            <td>陈静</td>
                            <td>¥89</td>
                            <td class="return-reason">客户取消订单</td>
                            <td><span class="badge badge-danger">已拒绝</span></td>
                            <td>2024-07-09 11:45</td>
                            <td style="text-align:center;">
                                <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>RET-2024-004</strong></td>
                            <td>ORD-2024-006</td>
                            <td>李小红</td>
                            <td>¥159</td>
                            <td class="return-reason">产品质量问题</td>
                            <td><span class="badge badge-warning">待处理</span></td>
                            <td>2024-07-09 09:30</td>
                            <td style="text-align:center;">
                                <button class="btn btn-sm btn-success"><i class="fas fa-check"></i></button>
                                <button class="btn btn-sm btn-danger"><i class="fas fa-times"></i></button>
                                <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>RET-2024-005</strong></td>
                            <td>ORD-2024-008</td>
                            <td>赵磊</td>
                            <td>¥399</td>
                            <td class="return-reason">客户误下单</td>
                            <td><span class="badge badge-success">已退款</span></td>
                            <td>2024-07-08 15:10</td>
                            <td style="text-align:center;">
                                <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <span class="info">共 12 条，第 1/3 页</span>
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
        import { init } from './returns.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('🔄 退货管理页面加载');
            
            init().catch(err => console.warn('退货管理初始化失败:', err));

            // 新建退货
            document.getElementById('newReturnBtn')?.addEventListener('click', function() {
                const orderId = prompt('请输入原订单号：');
                if (orderId) {
                    const amount = prompt('请输入退款金额：');
                    const reason = prompt('请输入退货原因：');
                    if (amount && reason) {
                        alert('✅ 退货单已创建\n订单: ' + orderId + '\n金额: ¥' + amount + '\n原因: ' + reason);
                    }
                }
            });

            // 搜索
            document.getElementById('searchBtn')?.addEventListener('click', function() {
                const orderId = document.getElementById('searchOrderId').value;
                const status = document.getElementById('searchStatus').value;
                alert('🔍 搜索条件:\n订单号: ' + (orderId || '全部') + '\n状态: ' + (status || '全部'));
            });

            // 重置
            document.getElementById('resetBtn')?.addEventListener('click', function() {
                document.getElementById('searchOrderId').value = '';
                document.getElementById('searchStatus').value = '';
                document.getElementById('searchDateFrom').value = '';
            });

            // 刷新
            document.getElementById('refreshReturnBtn')?.addEventListener('click', function() {
                const icon = this.querySelector('i');
                icon.classList.add('fa-spin');
                setTimeout(() => icon.classList.remove('fa-spin'), 800);
            });

            // 表格中的按钮事件（通过事件委托）
            document.querySelector('#returnTableBody')?.addEventListener('click', function(e) {
                const btn = e.target.closest('button');
                if (!btn) return;
                
                const row = btn.closest('tr');
                const orderId = row?.querySelector('td:nth-child(2)')?.textContent || '';
                
                if (btn.classList.contains('btn-success')) {
                    if (confirm('确认批准退货 ' + orderId + '？')) {
                        alert('✅ 退货已批准');
                        const statusEl = row?.querySelector('.badge');
                        if (statusEl) {
                            statusEl.className = 'badge badge-success';
                            statusEl.textContent = '已退款';
                        }
                    }
                } else if (btn.classList.contains('btn-danger')) {
                    if (confirm('确认拒绝退货 ' + orderId + '？')) {
                        alert('❌ 退货已拒绝');
                        const statusEl = row?.querySelector('.badge');
                        if (statusEl) {
                            statusEl.className = 'badge badge-danger';
                            statusEl.textContent = '已拒绝';
                        }
                    }
                } else if (btn.classList.contains('fa-eye') || btn.querySelector('.fa-eye')) {
                    alert('📋 退货详情\n订单: ' + orderId + '\n请查看完整信息');
                }
            });
        });
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
    //  (已注释)
export async function render(container) {
    container.innerHTML = `
        <div class="returns-container">
            <div class="page-header"><h1>↩️ 退货管理</h1></div>
            <div class="card"><div class="card-body">
                <div style="display:flex;gap:12px;margin-bottom:16px;">
                    <input type="text" class="form-control" placeholder="输入订单号" style="flex:1;" id="returnOrderNo">
                    <button class="btn btn-primary" id="returnSearch">查询</button>
                </div>
                <div id="returnResult"></div>
                <button class="btn btn-danger" id="returnConfirm" style="display:none;">确认退货</button>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [Returns] 已初始化'); }
export default { meta, render, init };
  },
  methods: {}
}
</script>

<style scoped>

</style>

