<template>
  <div class="cashier-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#4F46E5"><User /></el-icon>
          收银员工作台
        </h1>
        <span class="subtitle">实时收银数据与订单管理</span>
      </div>
      <div class="header-actions">
        <el-tag type="success" size="large" effect="dark">
          <span class="status-dot"></span> 在线
        </el-tag>
        <el-tag type="info" size="large">
          <el-icon><User /></el-icon> {{ currentCashier }}
        </el-tag>
        <el-tag type="warning" size="large">
          <el-icon><Clock /></el-icon> {{ currentTime }}
        </el-tag>
        <el-button type="primary" @click="handleDailyClose">
          <el-icon><Lock /></el-icon> 日结
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon income">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">今日收入</div>
              <div class="stat-value">¥{{ formatNumber(todayStats.income) }}</div>
              <div class="stat-change positive">
                <el-icon><Top /></el-icon>
                {{ todayStats.incomeGrowth }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon orders">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">今日订单</div>
              <div class="stat-value">{{ todayStats.orders }}</div>
              <div class="stat-change positive">
                <el-icon><Top /></el-icon>
                {{ todayStats.ordersGrowth }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon customers">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">服务客户</div>
              <div class="stat-value">{{ todayStats.customers }}</div>
              <div class="stat-change positive">
                <el-icon><Top /></el-icon>
                {{ todayStats.customersGrowth }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon avg">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">客单价</div>
              <div class="stat-value">¥{{ formatNumber(todayStats.avgPrice) }}</div>
              <div class="stat-change positive">
                <el-icon><Top /></el-icon>
                {{ todayStats.avgGrowth }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 支付方式统计 -->
    <el-row :gutter="20" class="payment-row">
      <el-col :span="24">
        <el-card class="payment-card" shadow="hover">
          <template #header>
            <span class="card-title">支付方式统计</span>
            <span class="card-subtitle">今日各支付方式占比</span>
          </template>
          <el-row :gutter="16">
            <el-col :xs="12" :sm="8" :md="4" v-for="method in paymentMethods" :key="method.name">
              <div class="payment-item" :style="{ borderColor: method.color }">
                <div class="payment-icon" :style="{ background: method.color }">
                  <el-icon :size="24"><component :is="method.icon" /></el-icon>
                </div>
                <div class="payment-info">
                  <div class="payment-name">{{ method.name }}</div>
                  <div class="payment-amount">¥{{ formatNumber(method.amount) }}</div>
                  <div class="payment-percent">{{ method.percent }}%</div>
                  <el-progress :percentage="method.percent" :color="method.color" :show-text="false" />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近订单 -->
    <el-card class="orders-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>最近订单</span>
          <div class="header-actions">
            <el-button size="small" @click="handleViewAllOrders">
              查看全部 <el-icon><ArrowRight /></el-icon>
            </el-button>
            <el-button size="small" @click="handleRefresh">
              <el-icon><RefreshRight /></el-icon> 刷新
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="recentOrders"
        style="width: 100%"
        v-loading="loading"
        stripe
        border
      >
        <el-table-column prop="orderNo" label="订单编号" min-width="140">
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewOrder(row.id)">
              {{ row.orderNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="customer" label="客户" min-width="100" />
        <el-table-column prop="amount" label="金额" width="120" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #409eff;">
              ¥{{ formatNumber(row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getPaymentTag(row.paymentMethod)" size="small">
              {{ row.paymentMethod }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" effect="light" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="orderTime" label="时间" width="160" sortable />
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleViewOrder(row.id)">
              <el-icon><View /></el-icon> 查看
            </el-button>
            <el-button size="small" type="warning" link @click="handleEditOrder(row.id)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 日结确认对话框 -->
    <el-dialog
      v-model="dailyCloseDialogVisible"
      title="日结确认"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="daily-close-confirm">
        <el-icon color="#e6a23c" size="56"><Warning /></el-icon>
        <p>确认进行日结操作吗？</p>
        <div class="daily-summary">
          <div class="summary-item">
            <span>今日收入</span>
            <span style="font-weight: 700; color: #409eff;">
              ¥{{ formatNumber(todayStats.income) }}
            </span>
          </div>
          <div class="summary-item">
            <span>今日订单</span>
            <span>{{ todayStats.orders }} 单</span>
          </div>
          <div class="summary-item">
            <span>服务客户</span>
            <span>{{ todayStats.customers }} 人</span>
          </div>
          <div class="summary-item">
            <span>客单价</span>
            <span>¥{{ formatNumber(todayStats.avgPrice) }}</span>
          </div>
        </div>
        <p class="daily-hint">日结后将无法修改当天的交易数据，请确认所有订单已处理完成。</p>
      </div>
      <template #footer>
        <el-button @click="dailyCloseDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="dailyCloseLoading" @click="confirmDailyClose">
          确认日结
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  Money,
  Document,
  TrendCharts,
  Top,
  Clock,
  Lock,
  View,
  Edit,
  RefreshRight,
  ArrowRight,
  CreditCard,
  Wallet,
  Tickets,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()

// ========== 响应式数据 ==========
const loading = ref(false)
const dailyCloseLoading = ref(false)
const dailyCloseDialogVisible = ref(false)
const currentCashier = ref('张伟')
const currentTime = ref('')

// 今日统计数据
const todayStats = reactive({
  income: 12580.50,
  orders: 42,
  customers: 38,
  avgPrice: 299.54,
  incomeGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 5.2,
  avgGrowth: 3.8
})

// 支付方式统计
const paymentMethods = ref([
  { name: '现金', icon: 'Money', amount: 3450, percent: 27, color: '#67c23a' },
  { name: '微信支付', icon: 'Wallet', amount: 5230, percent: 42, color: '#409eff' },
  { name: '支付宝', icon: 'CreditCard', amount: 2900, percent: 23, color: '#e6a23c' },
  { name: '会员卡', icon: 'Tickets', amount: 1000, percent: 8, color: '#8b5cf6' }
])

// 最近订单
const recentOrders = ref([
  {
    id: 1,
    orderNo: 'POS-2026-001',
    customer: '张三',
    amount: 299.00,
    paymentMethod: '微信支付',
    status: 'completed',
    orderTime: '2026-07-22 14:30:00'
  },
  {
    id: 2,
    orderNo: 'POS-2026-002',
    customer: '李四',
    amount: 159.00,
    paymentMethod: '现金',
    status: 'completed',
    orderTime: '2026-07-22 14:15:00'
  },
  {
    id: 3,
    orderNo: 'POS-2026-003',
    customer: '王五',
    amount: 459.00,
    paymentMethod: '支付宝',
    status: 'processing',
    orderTime: '2026-07-22 13:50:00'
  },
  {
    id: 4,
    orderNo: 'POS-2026-004',
    customer: '赵六',
    amount: 89.00,
    paymentMethod: '会员卡',
    status: 'completed',
    orderTime: '2026-07-22 13:20:00'
  },
  {
    id: 5,
    orderNo: 'POS-2026-005',
    customer: '孙七',
    amount: 329.00,
    paymentMethod: '现金',
    status: 'cancelled',
    orderTime: '2026-07-22 12:45:00'
  }
])

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getPaymentTag = (method: string) => {
  const map: Record<string, string> = {
    '现金': 'success',
    '微信支付': 'primary',
    '支付宝': 'warning',
    '信用卡': 'danger',
    '会员卡': 'info'
  }
  return map[method] || 'info'
}

// ========== 时钟更新 ==========
const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

let clockInterval: number | null = null

// ========== 事件处理 ==========
const handleDailyClose = () => {
  dailyCloseDialogVisible.value = true
}

const confirmDailyClose = async () => {
  dailyCloseLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    ElMessage.success('日结完成！今日数据已结算')
    dailyCloseDialogVisible.value = false
  } finally {
    dailyCloseLoading.value = false
  }
}

const handleViewAllOrders = () => {
  router.push('/pos')
}

const handleViewOrder = (id: number) => {
  router.push(`/pos/detail/${id}`)
}

const handleEditOrder = (id: number) => {
  router.push(`/pos/edit/${id}`)
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新')
  }, 500)
}

// ========== 生命周期 ==========
onMounted(() => {
  updateClock()
  clockInterval = window.setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (clockInterval) {
    clearInterval(clockInterval)
  }
})
</script>

<style scoped>
.cashier-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #67c23a;
  margin-right: 6px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  flex-shrink: 0;
  margin-right: 16px;
}

.stat-icon.income {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}
.stat-icon.orders {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}
.stat-icon.customers {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}
.stat-icon.avg {
  background: linear-gradient(135deg, #e6a23c, #f0c78a);
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  line-height: 1.3;
}

.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 2px;
}

.stat-change.positive {
  color: #67c23a;
}
.stat-change.negative {
  color: #f56c6c;
}

.payment-row {
  margin-bottom: 20px;
}

.payment-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
}

.card-subtitle {
  font-size: 13px;
  font-weight: 400;
  color: #909399;
  margin-left: 12px;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  background: #fafbfc;
  transition: all 0.3s ease;
}

.payment-item:hover {
  background: #f0f2f5;
  transform: translateX(4px);
}

.payment-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.payment-info {
  flex: 1;
  min-width: 0;
}

.payment-name {
  font-size: 13px;
  color: #909399;
}

.payment-amount {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.payment-percent {
  font-size: 12px;
  color: #909399;
}

.orders-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.daily-close-confirm {
  text-align: center;
  padding: 12px 0;
}

.daily-close-confirm p {
  margin: 12px 0 0;
  font-size: 16px;
  color: #606266;
}

.daily-close-confirm .daily-hint {
  font-size: 13px;
  color: #909399;
  margin-top: 12px;
}

.daily-summary {
  margin: 16px 0;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  text-align: left;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
}

.summary-item:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .cashier-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .header-actions .el-tag,
  .header-actions .el-button {
    font-size: 12px;
  }

  .stat-cards .el-col {
    margin-bottom: 12px;
  }

  .payment-item {
    margin-bottom: 8px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .header-actions .el-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .stat-value {
    font-size: 18px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
    margin-right: 10px;
  }

  .payment-item {
    padding: 10px 12px;
  }

  .payment-icon {
    width: 36px;
    height: 36px;
  }

  .payment-icon .el-icon {
    font-size: 18px !important;
  }
}
</style>