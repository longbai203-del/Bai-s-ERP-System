<template>
  <div class="orders-">
    



    <div class="detail-container">
        
        <div class="page-header">
            <div>
                <h1>
                    <i class="fas fa-file-invoice" style="color:#4F46E5;"></i>
                    订单详情
                    <span class="order-id">#ORD-2024-001</span>
                </h1>
            </div>
            <div class="header-actions">
                <button class="btn btn-outline" onclick="window.location.href='#/03-orders/list'">
                    <i class="fas fa-arrow-left"></i> 返回列表
                </button>
                <button class="btn btn-primary" onclick="alert('✏️ 编辑订单')">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="btn btn-success" onclick="alert('🖨️ 打印订单')">
                    <i class="fas fa-print"></i> 打印
                </button>
            </div>
        </div>

        
        <div class="detail-grid">
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-info-circle" style="color:#4F46E5;"></i> 订单信息</h3>
                    <span class="badge badge-success">已完成</span>
                </div>
                <div class="card-body">
                    <div class="info-row">
                        <span class="label">订单号</span>
                        <span class="value">ORD-2024-001</span>
                    </div>
                    <div class="info-row">
                        <span class="label">客户</span>
                        <span class="value">王小明 <span style="font-size:12px;color:#6B7280;">(138****1234)</span></span>
                    </div>
                    <div class="info-row">
                        <span class="label">创建时间</span>
                        <span class="value">2024-07-11 14:30</span>
                    </div>
                    <div class="info-row">
                        <span class="label">完成时间</span>
                        <span class="value">2024-07-11 14:45</span>
                    </div>
                    <div class="info-row">
                        <span class="label">支付方式</span>
                        <span class="value">微信支付</span>
                    </div>
                    <div class="info-row">
                        <span class="label">支付状态</span>
                        <span class="value"><span class="badge badge-success">已支付</span></span>
                    </div>
                    <div class="info-row">
                        <span class="label">备注</span>
                        <span class="value" style="font-weight:400;color:#6B7280;">客户要求精致洗车</span>
                    </div>
                </div>
            </div>

            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-receipt" style="color:#4F46E5;"></i> 订单摘要</h3>
                </div>
                <div class="card-body">
                    <div class="info-row">
                        <span class="label">商品数量</span>
                        <span class="value">3 件</span>
                    </div>
                    <div class="info-row">
                        <span class="label">小计</span>
                        <span class="value">¥280.00</span>
                    </div>
                    <div class="info-row">
                        <span class="label">税费 (6%)</span>
                        <span class="value">¥16.80</span>
                    </div>
                    <div class="info-row">
                        <span class="label">折扣</span>
                        <span class="value" style="color:#10B981;">-¥20.00</span>
                    </div>
                    <div class="total-row">
                        <span class="label">总计</span>
                        <span class="value">¥276.80</span>
                    </div>
                    <div style="margin-top:12px;display:flex;gap:8px;">
                        <button class="btn btn-sm btn-success" style="flex:1;" onclick="alert('✅ 确认订单')">
                            <i class="fas fa-check"></i> 确认
                        </button>
                        <button class="btn btn-sm btn-danger" style="flex:1;" onclick="alert('❌ 取消订单')">
                            <i class="fas fa-times"></i> 取消
                        </button>
                    </div>
                </div>
            </div>

            
            <div class="card" style="grid-column:1/-1;">
                <div class="card-header">
                    <h3><i class="fas fa-shopping-bag" style="color:#4F46E5;"></i> 商品列表</h3>
                    <span style="font-size:12px;color:#6B7280;">共 3 件商品</span>
                </div>
                <div class="card-body">
                    <ul class="item-list">
                        <li class="item">
                            <div class="item-info">
                                <div class="name">🚗 标准洗车</div>
                                <div class="meta">单价: ¥89.00 × 2</div>
                            </div>
                            <div class="item-total">¥178.00</div>
                        </li>
                        <li class="item">
                            <div class="item-info">
                                <div class="name">🧹 内饰清洁</div>
                                <div class="meta">单价: ¥299.00 × 1</div>
                            </div>
                            <div class="item-total">¥299.00</div>
                        </li>
                        <li class="item">
                            <div class="item-info">
                                <div class="name">🛞 轮胎护理</div>
                                <div class="meta">单价: ¥120.00 × 1</div>
                            </div>
                            <div class="item-total">¥120.00</div>
                        </li>
                    </ul>
                </div>
            </div>

            
            <div class="card" style="grid-column:1/-1;">
                <div class="card-header">
                    <h3><i class="fas fa-clock" style="color:#4F46E5;"></i> 订单时间线</h3>
                </div>
                <div class="card-body">
                    <div class="timeline">
                        <div class="event">
                            <span class="event-time">14:30</span>
                            <span class="event-desc">
                                订单创建
                                <span class="badge badge-info status-badge">待处理</span>
                            </span>
                        </div>
                        <div class="event">
                            <span class="event-time">14:32</span>
                            <span class="event-desc">
                                支付完成 (微信支付)
                                <span class="badge badge-success status-badge">已支付</span>
                            </span>
                        </div>
                        <div class="event">
                            <span class="event-time">14:35</span>
                            <span class="event-desc">
                                开始处理
                                <span class="badge badge-info status-badge">处理中</span>
                            </span>
                        </div>
                        <div class="event">
                            <span class="event-time">14:45</span>
                            <span class="event-desc">
                                订单完成
                                <span class="badge badge-success status-badge">已完成</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import { init } from './detail.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('📄 订单详情页面加载');
            init().catch(err => console.warn('订单详情初始化失败:', err));
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    
  },
  methods: {}
}
</script>

<style scoped>

</style>
