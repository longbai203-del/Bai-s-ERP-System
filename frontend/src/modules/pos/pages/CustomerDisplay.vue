<template>
  <div class="customer-display-page">
    <!-- 显示屏主体 -->
    <div class="display-screen" ref="displayScreen">
      <!-- 顶部品牌标识 -->
      <div class="display-header">
        <div class="brand">
          <el-icon :size="28" color="#fff"><Car /></el-icon>
          <span>Carwash Pro</span>
        </div>
        <div class="display-time" id="displayTime">{{ currentTime }}</div>
      </div>

      <!-- 主内容区域 -->
      <div class="display-main" v-loading="loading">
        <!-- 空闲状态 -->
        <div v-if="displayMode === 'idle'" class="idle-content">
          <div class="welcome-icon">
            <el-icon :size="80" color="#fff"><Bell /></el-icon>
          </div>
          <h2 class="welcome-title">欢迎光临</h2>
          <p class="welcome-sub">请扫码或前往收银台办理业务</p>
          <div class="welcome-tips">
            <span>🚗 优质洗车服务</span>
            <span>✨ 专业汽车美容</span>
            <span>🔧 全面保养服务</span>
          </div>
        </div>

        <!-- 订单展示状态 -->
        <div v-else-if="displayMode === 'order'" class="order-content">
          <div class="order-header-display">
            <div class="order-number">
              <el-icon><Document /></el-icon>
              订单 #{{ currentOrder?.orderNo }}
            </div>
            <div class="order-status">
              <el-tag type="warning" size="large">处理中</el-tag>
            </div>
          </div>
          <div class="order-items-display">
            <div class="items-header">
              <span>商品</span>
              <span>数量</span>
              <span>小计</span>
            </div>
            <div
              v-for="(item, index) in currentOrder?.items"
              :key="index"
              class="item-row"
            >
              <span>{{ item.name }}</span>
              <span>×{{ item.qty }}</span>
              <span>¥{{ formatNumber(item.price * item.qty) }}</span>
            </div>
          </div>
          <div class="order-total-display">
            <span>合计</span>
            <span class="total-amount">¥{{ formatNumber(currentOrder?.total || 0) }}</span>
          </div>
          <div class="order-customer" v-if="currentOrder?.customer">
            <el-icon><User /></el-icon>
            客户：{{ currentOrder.customer }}
          </div>
        </div>

        <!-- 感谢状态 -->
        <div v-else-if="displayMode === 'thankyou'" class="thankyou-content">
          <div class="thankyou-icon">
            <el-icon :size="80" color="#FCD34D"><SuccessFilled /></el-icon>
          </div>
          <h2 class="thankyou-title">感谢您的光临！</h2>
          <p class="thankyou-sub">期待下次为您服务</p>
          <div class="thankyou-rating">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>
          <p class="thankyou-text">您的满意是我们最大的追求</p>
        </div>

        <!-- 结账状态 -->
        <div v-else-if="displayMode === 'checkout'" class="checkout-content">
          <div class="checkout-icon">
            <el-icon :size="80" color="#FCD34D"><CreditCard /></el-icon>
          </div>
          <h2 class="checkout-title">正在结账</h2>
          <p class="checkout-sub">请稍候，正在处理您的支付</p>
          <div class="checkout-amount">
            <span class="amount-label">应付金额</span>
            <span class="amount-value">¥{{ formatNumber(currentOrder?.total || 0) }}</span>
          </div>
          <div class="checkout-methods">
            <span>💳 刷卡</span>
            <span>📱 扫码</span>
            <span>💵 现金</span>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="display-footer">
        <span class="footer-text">
          <el-icon color="#EC4899"><Heart /></el-icon>
          感谢您的光临，祝您生活愉快！
        </span>
        <span class="footer-version">v2.0 · 智能洗车管理系统</span>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <el-card shadow="hover">
        <el-row :gutter="16" align="middle">
          <el-col :xs="24" :sm="8" :lg="6">
            <el-input
              v-model="orderInput"
              placeholder="输入订单号或客户名"
              clearable
              @keyup.enter="loadOrder"
            />
          </el-col>
          <el-col :xs="24" :sm="16" :lg="18">
            <el-button-group>
              <el-button type="primary" @click="loadOrder">
                <el-icon><Search /></el-icon> 加载
              </el-button>
              <el-button @click="clearDisplay">
                <el-icon><Refresh /></el-icon> 清空
              </el-button>
              <el-button type="success" @click="showThankYou">
                <el-icon><Smile /></el-icon> 感谢
              </el-button>
              <el-button type="warning" @click="showCheckout">
                <el-icon><CreditCard /></el-icon> 结账
              </el-button>
              <el-button @click="toggleFullscreen">
                <el-icon><FullScreen /></el-icon> 全屏
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 模拟订单数据对话框 -->
    <el-dialog
      v-model="orderDialogVisible"
      title="选择模拟订单"
      width="500px"
    >
      <el-table :data="mockOrders" @row-click="selectMockOrder" style="cursor: pointer;">
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="customer" label="客户" />
        <el-table-column prop="total" label="金额" align="right">
          <template #default="{ row }">¥{{ formatNumber(row.total) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'warning'" size="small">
              {{ row.status === 'completed' ? '已完成' : '处理中' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="orderDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Car,
  Bell,
  Document,
  User,
  SuccessFilled,
  CreditCard,
  Heart,
  Search,
  Refresh,
  Smile,
  FullScreen,
  Warning
} from '@element-plus/icons-vue'

// ========== 响应式数据 ==========
const loading = ref(false)
const displayMode = ref<'idle' | 'order' | 'thankyou' | 'checkout'>('idle')
const currentTime = ref('')
const orderInput = ref('')
const orderDialogVisible = ref(false)
const displayScreen = ref<HTMLElement>()

// 当前订单
const currentOrder = ref<{
  orderNo: string;
  customer: string;
  total: number;
  items: Array<{ name: string; price: number; qty: number }>;
  status: string;
} | null>(null)

// 模拟订单列表
const mockOrders = ref([
  {
    orderNo: 'ORD-2026-001',
    customer: '张三',
    total: 396,
    status: 'processing',
    items: [
      { name: '标准洗车', price: 68, qty: 2 },
      { name: '内饰清洁', price: 260, qty: 1 }
    ]
  },
  {
    orderNo: 'ORD-2026-002',
    customer: '李四',
    total: 299,
    status: 'processing',
    items: [
      { name: '精致洗车', price: 159, qty: 1 },
      { name: '轮胎护理', price: 140, qty: 1 }
    ]
  },
  {
    orderNo: 'ORD-2026-003',
    customer: '王五',
    total: 899,
    status: 'completed',
    items: [
      { name: '全车镀晶', price: 899, qty: 1 }
    ]
  }
])

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ========== 时钟更新 ==========
const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

let clockInterval: number | null = null

// ========== 显示模式切换 ==========
const showIdle = () => {
  displayMode.value = 'idle'
  currentOrder.value = null
}

const showOrder = (order: any) => {
  currentOrder.value = order
  displayMode.value = 'order'
}

const showThankYou = () => {
  displayMode.value = 'thankyou'
  setTimeout(() => {
    // 5秒后自动回到空闲状态
    if (displayMode.value === 'thankyou') {
      showIdle()
    }
  }, 5000)
}

const showCheckout = () => {
  if (!currentOrder.value) {
    ElMessage.warning('请先加载订单')
    return
  }
  displayMode.value = 'checkout'
  setTimeout(() => {
    if (displayMode.value === 'checkout') {
      showIdle()
    }
  }, 8000)
}

// ========== 订单操作 ==========
const loadOrder = () => {
  if (!orderInput.value) {
    orderDialogVisible.value = true
    return
  }

  const order = mockOrders.value.find(o =>
    o.orderNo.includes(orderInput.value) ||
    o.customer.includes(orderInput.value)
  )

  if (order) {
    showOrder(order)
    ElMessage.success(`已加载订单 ${order.orderNo}`)
  } else {
    ElMessage.warning('未找到匹配的订单')
    orderDialogVisible.value = true
  }
}

const selectMockOrder = (order: any) => {
  showOrder(order)
  orderDialogVisible.value = false
  ElMessage.success(`已加载订单 ${order.orderNo}`)
}

const clearDisplay = () => {
  showIdle()
  orderInput.value = ''
  ElMessage.success('已清空显示')
}

// ========== 全屏切换 ==========
const toggleFullscreen = () => {
  if (!displayScreen.value) return
  if (!document.fullscreenElement) {
    displayScreen.value.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

// ========== 模拟数据更新 ==========
const startDataSimulation = () => {
  setInterval(() => {
    // 模拟数据变化
    if (displayMode.value === 'idle') {
      // 随机显示订单
      if (Math.random() > 0.85) {
        const randomOrder = mockOrders.value[Math.floor(Math.random() * mockOrders.value.length)]
        showOrder(randomOrder)
        setTimeout(() => {
          if (displayMode.value === 'order') {
            showIdle()
          }
        }, 8000)
      }
    }
  }, 10000)
}

// ========== 生命周期 ==========
onMounted(() => {
  updateClock()
  clockInterval = window.setInterval(updateClock, 1000)
  showIdle()
  startDataSimulation()
})

onUnmounted(() => {
  if (clockInterval) {
    clearInterval(clockInterval)
  }
})
</script>

<style scoped>
.customer-display-page {
  padding: 20px;
  background: #1a1a2e;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 显示屏 */
.display-screen {
  flex: 1;
  min-height: 500px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 16px;
  padding: 30px 40px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.display-screen::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 60%;
  height: 80%;
  background: radial-gradient(ellipse, rgba(64, 158, 255, 0.05), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.display-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  opacity: 0.8;
}

.display-time {
  font-size: 18px;
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}

.display-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 20px 0;
}

/* 空闲状态 */
.idle-content {
  text-align: center;
  animation: fadeIn 0.6s ease;
}

.welcome-icon {
  margin-bottom: 20px;
}

.welcome-title {
  font-size: 36px;
  font-weight: 300;
  margin: 0 0 12px 0;
}

.welcome-sub {
  font-size: 18px;
  opacity: 0.6;
  margin: 0 0 24px 0;
}

.welcome-tips {
  display: flex;
  gap: 30px;
  font-size: 16px;
  opacity: 0.5;
}

/* 订单状态 */
.order-content {
  width: 100%;
  max-width: 500px;
  animation: fadeIn 0.6s ease;
}

.order-header-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.order-number {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-items-display {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
}

.items-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  opacity: 0.5;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 8px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.item-row:last-child {
  border-bottom: none;
}

.order-total-display {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  margin-top: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;
}

.order-total-display .total-amount {
  color: #FCD34D;
}

.order-customer {
  margin-top: 12px;
  font-size: 14px;
  opacity: 0.6;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 感谢状态 */
.thankyou-content {
  text-align: center;
  animation: fadeIn 0.6s ease;
}

.thankyou-icon {
  margin-bottom: 16px;
}

.thankyou-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.thankyou-sub {
  font-size: 18px;
  opacity: 0.7;
  margin: 0 0 16px 0;
}

.thankyou-rating {
  font-size: 32px;
  letter-spacing: 8px;
  margin-bottom: 12px;
}

.thankyou-text {
  font-size: 14px;
  opacity: 0.5;
}

/* 结账状态 */
.checkout-content {
  text-align: center;
  animation: fadeIn 0.6s ease;
}

.checkout-icon {
  margin-bottom: 16px;
}

.checkout-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.checkout-sub {
  font-size: 18px;
  opacity: 0.7;
  margin: 0 0 20px 0;
}

.checkout-amount {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px 24px;
  display: inline-block;
}

.amount-label {
  display: block;
  font-size: 14px;
  opacity: 0.5;
}

.amount-value {
  font-size: 36px;
  font-weight: 700;
  color: #FCD34D;
}

.checkout-methods {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  font-size: 14px;
  opacity: 0.5;
}

/* 底部 */
.display-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  opacity: 0.3;
  position: relative;
  z-index: 1;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-version {
  opacity: 0.5;
}

/* 控制面板 */
.control-panel {
  position: relative;
  z-index: 10;
}

.control-panel .el-card {
  border-radius: 12px;
}

.control-panel .el-button-group {
  flex-wrap: wrap;
  gap: 4px;
}

.control-panel .el-button-group .el-button {
  margin: 2px;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .customer-display-page {
    padding: 12px;
    gap: 12px;
  }

  .display-screen {
    padding: 20px;
    min-height: 400px;
  }

  .brand {
    font-size: 16px;
  }

  .display-time {
    font-size: 14px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .welcome-sub {
    font-size: 14px;
  }

  .welcome-tips {
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
  }

  .order-content {
    max-width: 100%;
  }

  .order-number {
    font-size: 15px;
  }

  .order-total-display {
    font-size: 16px;
  }

  .thankyou-title {
    font-size: 24px;
  }

  .checkout-title {
    font-size: 24px;
  }

  .checkout-amount .amount-value {
    font-size: 28px;
  }

  .display-footer {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }

  .control-panel .el-card :deep(.el-card__body) {
    padding: 12px;
  }

  .control-panel .el-button-group {
    display: flex;
    flex-wrap: wrap;
  }

  .control-panel .el-button-group .el-button {
    flex: 1;
    min-width: 60px;
    font-size: 12px;
    padding: 8px 10px;
  }

  .control-panel .el-col {
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  .display-screen {
    padding: 14px;
    min-height: 350px;
  }

  .welcome-title {
    font-size: 20px;
  }

  .welcome-icon .el-icon {
    font-size: 48px !important;
  }

  .thankyou-icon .el-icon {
    font-size: 48px !important;
  }

  .checkout-icon .el-icon {
    font-size: 48px !important;
  }

  .item-row {
    font-size: 13px;
  }

  .order-total-display {
    font-size: 14px;
    padding: 10px 12px;
  }

  .checkout-amount .amount-value {
    font-size: 24px;
  }
}

@media print {
  .control-panel {
    display: none !important;
  }

  .customer-display-page {
    padding: 0;
    background: white;
  }

  .display-screen {
    border-radius: 0;
    min-height: auto;
    padding: 20px;
  }
}
</style>