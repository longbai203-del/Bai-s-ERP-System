<template>
  <div class="pos-">
    



    <div class="exchange-container">
        <div class="page-header">
            <h1>
                <i class="fas fa-exchange-alt" style="color:#F59E0B;"></i>
                兑换管理
            </h1>
            <div>
                <button class="btn btn-success" onclick="alert('✅ 新建兑换单')">
                    <i class="fas fa-plus"></i> 新建兑换
                </button>
                <button class="btn btn-outline" onclick="alert('📥 导出数据')">
                    <i class="fas fa-file-export"></i> 导出
                </button>
            </div>
        </div>

        
        <div class="card">
            <h3><i class="fas fa-search" style="color:#4F46E5;"></i> 查询兑换</h3>
            <div class="form-group">
                <label>会员卡号</label>
                <input type="text" placeholder="请输入会员卡号...">
                <label style="min-width:60px;">状态</label>
                <select>
                    <option value="">全部</option>
                    <option value="pending">待处理</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                </select>
                <button class="btn btn-primary"><i class="fas fa-search"></i> 查询</button>
                <button class="btn btn-outline"><i class="fas fa-undo"></i> 重置</button>
            </div>
        </div>

        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>兑换单号</th>
                        <th>会员</th>
                        <th>兑换商品</th>
                        <th>所需积分</th>
                        <th>状态</th>
                        <th>时间</th>
                        <th style="text-align:center;">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>EXC-2024-001</strong></td>
                        <td>王小明</td>
                        <td>洗车券 × 2</td>
                        <td>500</td>
                        <td><span class="badge badge-success">已完成</span></td>
                        <td>2024-07-11 14:30</td>
                        <td style="text-align:center;">
                            <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>EXC-2024-002</strong></td>
                        <td>李小红</td>
                        <td>内饰清洁券</td>
                        <td>300</td>
                        <td><span class="badge badge-warning">待处理</span></td>
                        <td>2024-07-11 13:15</td>
                        <td style="text-align:center;">
                            <button class="btn btn-sm btn-success"><i class="fas fa-check"></i></button>
                            <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>EXC-2024-003</strong></td>
                        <td>张伟</td>
                        <td>全车镀晶</td>
                        <td>1200</td>
                        <td><span class="badge badge-secondary">已取消</span></td>
                        <td>2024-07-10 16:20</td>
                        <td style="text-align:center;">
                            <button class="btn btn-sm btn-outline"><i class="fas fa-eye"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <script type="module">
        import { init } from './exchange.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('🔄 兑换管理页面加载');
            init().catch(err => console.warn('兑换模块初始化失败:', err));
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'Exchange',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    //  (已注释)
export async function render(container) {
    container.innerHTML = `
        <div class="exchange-container">
            <div class="page-header"><h1>🔄 换货管理</h1></div>
            <div class="card"><div class="card-body">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                    <div>
                        <h4>原订单</h4>
                        <input type="text" class="form-control" placeholder="输入订单号" id="exchangeOrderNo">
                        <button class="btn btn-primary" style="margin-top:8px;" id="exchangeSearchOrder">查询</button>
                        <div id="exchangeOrderInfo" style="margin-top:12px;"></div>
                    </div>
                    <div>
                        <h4>换货商品</h4>
                        <div id="exchangeItems"></div>
                        <button class="btn btn-success" style="margin-top:12px;" id="exchangeConfirm">确认换货</button>
                    </div>
                </div>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [Exchange] 已初始化'); }
export default { meta, render, init };
  },
  methods: {}
}
</script>

<style scoped>

</style>

