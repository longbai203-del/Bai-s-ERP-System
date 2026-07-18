<template>
  <div class="pos-">
    



    <div class="offline-container">
        <div class="page-header">
            <div>
                <h1>
                    <i class="fas fa-wifi-slash" style="color:#F59E0B;"></i>
                    离线收银
                </h1>
                <div style="font-size:14px;color:#6B7280;margin-top:4px;">网络断开时使用，数据将在恢复后同步</div>
            </div>
            <span class="offline-badge warning">
                <i class="fas fa-circle" style="color:#EF4444;font-size:10px;"></i>
                离线模式
            </span>
        </div>

        
        <div class="sync-status">
            <span class="dot offline"></span>
            <div class="info">
                <strong>当前离线</strong> · 有 <strong>3</strong> 笔订单待同步
            </div>
            <button class="btn btn-sm btn-primary" onclick="alert('🔄 开始同步...')">
                <i class="fas fa-sync"></i> 立即同步
            </button>
        </div>

        
        <div class="card">
            <h3><i class="fas fa-plus-circle" style="color:#4F46E5;"></i> 录入订单</h3>
            <div class="offline-form">
                <div>
                    <label>客户姓名</label>
                    <input type="text" placeholder="输入客户姓名">
                </div>
                <div>
                    <label>联系电话</label>
                    <input type="text" placeholder="输入电话">
                </div>
                <div>
                    <label>服务项目</label>
                    <select>
                        <option>标准洗车</option>
                        <option>精致洗车</option>
                        <option>全车镀晶</option>
                        <option>内饰清洁</option>
                        <option>机油更换</option>
                    </select>
                </div>
                <div>
                    <label>金额</label>
                    <input type="number" placeholder="0.00" value="89">
                </div>
                <div>
                    <label>支付方式</label>
                    <select>
                        <option>现金</option>
                        <option>微信支付</option>
                        <option>支付宝</option>
                        <option>会员卡</option>
                    </select>
                </div>
                <div>
                    <label>车牌号</label>
                    <input type="text" placeholder="如: 京A12345">
                </div>
                <div class="full-width" style="display:flex;gap:8px;">
                    <button class="btn btn-success" style="flex:1;">
                        <i class="fas fa-save"></i> 保存订单
                    </button>
                    <button class="btn btn-outline" style="flex:1;">
                        <i class="fas fa-undo"></i> 重置
                    </button>
                </div>
            </div>
        </div>

        
        <div class="card">
            <h3><i class="fas fa-clock" style="color:#F59E0B;"></i> 待同步队列</h3>
            <ul class="queue-list">
                <li class="queue-item">
                    <div class="order-info">
                        <div class="order-id">ORD-OFF-001</div>
                        <div class="order-meta">王小明 · ¥299 · 14:30</div>
                    </div>
                    <div class="order-status">
                        <span class="badge badge-warning">待同步</span>
                        <button class="btn btn-sm btn-outline" style="margin-left:8px;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </li>
                <li class="queue-item">
                    <div class="order-info">
                        <div class="order-id">ORD-OFF-002</div>
                        <div class="order-meta">李小红 · ¥159 · 14:15</div>
                    </div>
                    <div class="order-status">
                        <span class="badge badge-warning">待同步</span>
                        <button class="btn btn-sm btn-outline" style="margin-left:8px;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </li>
                <li class="queue-item">
                    <div class="order-info">
                        <div class="order-id">ORD-OFF-003</div>
                        <div class="order-meta">张伟 · ¥459 · 13:50</div>
                    </div>
                    <div class="order-status">
                        <span class="badge badge-warning">待同步</span>
                        <button class="btn btn-sm btn-outline" style="margin-left:8px;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </li>
            </ul>
        </div>

        
        <div class="card">
            <h3><i class="fas fa-check-circle" style="color:#10B981;"></i> 已同步记录</h3>
            <ul class="queue-list">
                <li class="queue-item">
                    <div class="order-info">
                        <div class="order-id">ORD-OFF-000</div>
                        <div class="order-meta">陈静 · ¥89 · 12:30 · 已同步</div>
                    </div>
                    <div class="order-status">
                        <span class="badge badge-success">✅ 已同步</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <script type="module">
        import { init } from './offline-pos.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('📴 离线收银页面加载');
            init().catch(err => console.warn('离线收银初始化失败:', err));
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'OfflinePos',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    export const meta = { name: '离线收银', path: '/pos/offline-pos', icon: 'fa-wifi-slash', permission: 'pos:offline' };
export async function render(container) {
    container.innerHTML = `
        <div class="offline-pos-container">
            <div class="page-header"><h1>📴 离线收银</h1></div>
            <div class="card"><div class="card-body">
                <div style="text-align:center;padding:40px;">
                    <i class="fas fa-wifi-slash" style="font-size:48px;color:#F59E0B;"></i>
                    <h3 style="margin-top:12px;">离线模式</h3>
                    <p style="color:#6B7280;">当前处于离线状态，数据将在恢复网络后同步</p>
                    <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;">
                        <span style="background:#FEF3C7;padding:4px 12px;border-radius:12px;font-size:12px;">待同步: 3 单</span>
                        <button class="btn btn-primary" id="syncOffline">同步数据</button>
                    </div>
                </div>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [OfflinePOS] 已初始化'); }
export default { meta, render, init };
  },
  methods: {}
}
</script>

<style scoped>

</style>
