<template>
  <div class="pos-">
    



    <div class="kitchen-container">
        
        <div class="kitchen-header">
            <div class="title">
                <i class="fas fa-tools"></i>
                工位看板
            </div>
            <div class="stats">
                <span>⏳ 待处理: <span class="num" id="pendingCount">3</span></span>
                <span>🔧 进行中: <span class="num" id="processingCount">2</span></span>
                <span>✅ 已完成: <span class="num" id="completedCount">12</span></span>
                <span>📅 <span id="kitchenDate">2024-07-11</span></span>
            </div>
        </div>

        
        <div class="order-grid" id="orderGrid">
            
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">#ORD-2024-001</span>
                    <span class="order-time">14:30</span>
                </div>
                <div class="order-items">
                    <div class="item"><span><span class="qty">×2</span>标准洗车</span> <span>¥178</span></div>
                    <div class="item"><span><span class="qty">×1</span>内饰清洁</span> <span>¥299</span></div>
                </div>
                <div class="order-footer">
                    <span class="status pending">⏳ 待处理</span>
                    <span class="timer"><i class="fas fa-clock"></i> 等待 5分钟</span>
                    <button class="action-btn primary">开始</button>
                </div>
            </div>

            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">#ORD-2024-002</span>
                    <span class="order-time">14:15</span>
                </div>
                <div class="order-items">
                    <div class="item"><span><span class="qty">×1</span>全车镀晶</span> <span>¥899</span></div>
                </div>
                <div class="order-footer">
                    <span class="status processing">🔧 进行中</span>
                    <span class="timer"><i class="fas fa-clock"></i> 已做 12分钟</span>
                    <button class="action-btn success">完成</button>
                </div>
            </div>

            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">#ORD-2024-003</span>
                    <span class="order-time">13:50</span>
                </div>
                <div class="order-items">
                    <div class="item"><span><span class="qty">×1</span>精致洗车</span> <span>¥159</span></div>
                    <div class="item"><span><span class="qty">×2</span>轮胎护理</span> <span>¥120</span></div>
                </div>
                <div class="order-footer">
                    <span class="status pending">⏳ 待处理</span>
                    <span class="timer"><i class="fas fa-clock"></i> 等待 25分钟</span>
                    <button class="action-btn primary">开始</button>
                </div>
            </div>

            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">#ORD-2024-004</span>
                    <span class="order-time">13:20</span>
                </div>
                <div class="order-items">
                    <div class="item"><span><span class="qty">×1</span>VIP洗车套餐</span> <span>¥599</span></div>
                </div>
                <div class="order-footer">
                    <span class="status completed">✅ 已完成</span>
                    <span class="timer"><i class="fas fa-check-circle"></i> 完成于 13:45</span>
                    <button class="action-btn success" style="opacity:0.6;" disabled>已完成</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 日期显示
        document.getElementById('kitchenDate').textContent = new Date().toLocaleDateString('zh-CN');

        // 模拟订单更新
        setInterval(() => {
            const orderCards = document.querySelectorAll('.order-card');
            const pending = document.querySelectorAll('.order-card .status.pending').length;
            const processing = document.querySelectorAll('.order-card .status.processing').length;
            const completed = document.querySelectorAll('.order-card .status.completed').length;

            document.getElementById('pendingCount').textContent = pending;
            document.getElementById('processingCount').textContent = processing;
            document.getElementById('completedCount').textContent = completed;
        }, 1000);

        // 按钮点击事件
        document.querySelectorAll('.action-btn.primary').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.order-card');
                const statusEl = card.querySelector('.status');
                statusEl.className = 'status processing';
                statusEl.textContent = '🔧 进行中';
                this.textContent = '进行中...';
                this.className = 'action-btn success';
                this.textContent = '完成';
                // 更新计数
                document.getElementById('pendingCount').textContent = 
                    document.querySelectorAll('.order-card .status.pending').length;
                document.getElementById('processingCount').textContent = 
                    document.querySelectorAll('.order-card .status.processing').length;
            });
        });

        document.querySelectorAll('.action-btn.success:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.textContent === '完成' || this.textContent === '进行中...') {
                    const card = this.closest('.order-card');
                    const statusEl = card.querySelector('.status');
                    statusEl.className = 'status completed';
                    statusEl.textContent = '✅ 已完成';
                    this.textContent = '✅ 已完成';
                    this.disabled = true;
                    this.style.opacity = '0.6';
                    // 更新计数
                    document.getElementById('processingCount').textContent = 
                        document.querySelectorAll('.order-card .status.processing').length;
                    document.getElementById('completedCount').textContent = 
                        document.querySelectorAll('.order-card .status.completed').length;
                }
            });
        });

        console.log('🔧 工位看板已启动');
    </script>


  </div>
</template>

<script>
export default {
  name: 'KitchenDisplay',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    //  (已注释)
export async function render(container) {
    container.innerHTML = `
        <div class="kitchen-display-container">
            <div class="page-header"><h1>🍳 厨房显示屏</h1></div>
            <div class="card"><div class="card-body">
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;" id="kitchenOrders">
                    <div style="text-align:center;padding:20px;color:#9CA3AF;">暂无订单</div>
                </div>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [KitchenDisplay] 已初始化'); }
export default { meta, render, init };
  },
  methods: {}
}
</script>

<style scoped>

</style>

