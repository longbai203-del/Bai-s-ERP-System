<template>
  <div class="kitchen-display-page">
    <!-- 看板头部 -->
    <div class="kitchen-header">
      <div class="header-left">
        <div class="brand">
          <el-icon :size="24"><Tools /></el-icon>
          工位看板
        </div>
        <div class="header-stats">
          <el-tag type="warning" size="large">
            ⏳ 待处理: <strong>{{ stats.pending }}</strong>
          </el-tag>
          <el-tag type="primary" size="large">
            🔧 进行中: <strong>{{ stats.processing }}</strong>
          </el-tag>
          <el-tag type="success" size="large">
            ✅ 已完成: <strong>{{ stats.completed }}</strong>
          </el-tag>
          <el-tag type="info" size="large">
            📅 {{ currentDate }}
          </el-tag>
        </div>
      </div>
      <div class="header-actions">
        <el-button @click="handleRefresh">
          <el-icon><RefreshRight /></el-icon> 刷新
        </el-button>
        <el-button @click="toggleFullscreen">
          <el-icon><FullScreen /></el-icon> 全屏
        </el-button>
      </div>
    </div>

    <!-- 订单网格 -->
    <div class="order-grid" v-loading="loading">
      <div
        v-for="order in tableData"
        :key="order.id"
        class="order-card"
        :class="{
          'order-pending': order.status === 'pending',
          'order-processing': order.status === 'processing',
          'order-completed': order.status === 'completed'
        }"
      >
        <div class="order-header">
          <span class="order-id">#{{ order.orderNo }}</span>
          <span class="order-time">{{ order.orderTime }}</span>
          <el-tag
            :type="order.status === 'pending' ? 'warning' : order.status === 'processing' ? 'primary' : 'success'"
            size="small"
          >
            {{ order.status === 'pending' ? '待处理' : order.status === 'processing' ? '进行中' : '已完成' }}
          </el-tag>
        </div>

        <div class="order-items">
          <div
            v-for="(item, idx) in order.items"
            :key="idx"
            class="item"
          >
            <span>
              <span class="qty">×{{ item.qty }}</span>
              {{ item.name }}
            </span>
            <span>¥{{ formatNumber(item.price * item.qty) }}</span>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-info">
            <span class="customer">
              <el-icon><User /></el-icon>
              {{ order.customer || '散客' }}
            </span>
            <span class="timer" v-if="order.status === 'pending'">
              <el-icon><Clock /></el-icon>
              等待 {{ order.waitTime }}分钟
            </span>
            <span class="timer" v-if="order.status === 'processing'">
              <el-icon><Timer /></el-icon>
              已做 {{ order.processTime }}分钟
            </span>
          </div>
          <div class="order-actions">
            <el-button
              v-if="order.status === 'pending'"
              type="primary"
              size="small"
              @click="handleStart(order.id)"
            >
              <el-icon><Play /></el-icon> 开始
            </el-button>
            <el-button
              v-if="order.status === 'processing'"
              type="success"
              size="small"
              @click="handleComplete(order.id)"
            >
              <el-icon><Check /></el-icon> 完成
            </el-button>
            <el-button
              v-if="order.status === 'completed'"
              type="info"
              size="small"
              disabled
            >
              ✅ 已完成
            </el-button>
          </div>
        </div>

        <!-- 优先级标签 -->
        <div v-if="order.priority === 'high'" class="priority-badge high">
          <el-icon><Warning /></el-icon> 紧急
        </div>
        <div v-else-if="order.priority === 'medium'" class="priority-badge medium">
          <el-icon><Warning /></el-icon> 优先
        </div>
      </div>

      <div v-if="tableData.length === 0" class="empty-state">
        <el-empty description="暂无待处理订单" />
      </div>
    </div>

    <!-- 完成确认对话框 -->
    <el-dialog
      v-model="completeDialogVisible"
      title="完成确认"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="complete-confirm">
        <el-icon color="#67c23a" size="48"><SuccessFilled /></el-icon>
        <p>确定要完成该订单吗？</p>
        <p class="hint">完成后将移出当前看板</p>
      </div>
      <template #footer>
        <el-button @click="completeDialogVisible = false">取消</el-button>
        <el-button type="success" :loading="completeLoading" @click="confirmComplete">
          确认完成
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Tools,
  RefreshRight,
  FullScreen,
  User,
  Clock,
  Timer,
  Play,
  Check,
  Warning,
  SuccessFilled
} from '@element-plus/icons-vue'

// ========== 响应式数据 ==========
const loading = ref(false)
const completeLoading = ref(false)
const completeDialogVisible = ref(false)
const currentDate = ref('')
const completeOrderId = ref<number | null>(null)
const displayScreen = ref<HTMLElement>()

// 统计数据
const stats = reactive({
  pending: 0,
  processing: 0,
  completed: 0
})

// 表格数据
const tableData = ref<any[]>([])
const allData = ref<any[]>([])

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ========== 模拟数据生成 ==========
const generateMockData = () => {
  const customers = ['张三', '李四', '王五', '赵六', '孙七', '周八']
  const items = [
    { name: '标准洗车', price: 89 },
    { name: '精致洗车', price: 159 },
    { name: '全车镀晶', price: 899 },
    { name: '内饰清洁', price: 299 },
    { name: '机油更换', price: 399 },
    { name: '轮胎护理', price: 120 }
  ]
  const statuses = ['pending', 'processing', 'completed']
  const priorities = ['high', 'medium', 'low']

  const data = []
  const now = new Date()
  const total = 12

  for (let i = 1; i <= total; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const itemCount = Math.floor(Math.random() * 3) + 1
    const orderItems = []

    for (let j = 0; j < itemCount; j++) {
      const item = items[Math.floor(Math.random() * items.length)]
      const qty = Math.floor(Math.random() * 2) + 1
      orderItems.push({
        name: item.name,
        price: item.price,
        qty: qty
      })
    }

    const date = new Date(now)
    date.setHours(date.getHours() - Math.floor(Math.random() * 8))
    date.setMinutes(Math.floor(Math.random() * 60))

    data.push({
      id: i,
      orderNo: `ORD-${String(i).padStart(6, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      items: orderItems,
      status: status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      orderTime: date.toISOString().replace('T', ' ').slice(0, 16),
      waitTime: Math.floor(Math.random() * 30) + 5,
      processTime: Math.floor(Math.random() * 20) + 5
    })
  }

  // 按状态排序：待处理 > 进行中 > 已完成
  data.sort((a, b) => {
    const order = { pending: 0, processing: 1, completed: 2 }
    return order[a.status as keyof typeof order] - order[b.status as keyof typeof order]
  })

  return data
}

// ========== 计算统计数据 ==========
const calculateStats = (data: any[]) => {
  stats.pending = data.filter(item => item.status === 'pending').length
  stats.processing = data.filter(item => item.status === 'processing').length
  stats.completed = data.filter(item => item.status === 'completed').length
}

// ========== 初始化数据 ==========
const initData = () => {
  loading.value = true
  setTimeout(() => {
    allData.value = generateMockData()
    calculateStats(allData.value)
    filterData()
    loading.value = false
  }, 500)
}

// ========== 筛选数据 ==========
const filterData = () => {
  // 显示所有状态，按状态排序
  tableData.value = [...allData.value]
}

// ========== 事件处理 ==========
const handleStart = (id: number) => {
  const item = allData.value.find(d => d.id === id)
  if (item && item.status === 'pending') {
    item.status = 'processing'
    item.processTime = 0
    calculateStats(allData.value)
    filterData()
    ElMessage.success(`订单 ${item.orderNo} 已开始处理`)
  }
}

const handleComplete = (id: number) => {
  completeOrderId.value = id
  completeDialogVisible.value = true
}

const confirmComplete = () => {
  if (!completeOrderId.value) return

  const item = allData.value.find(d => d.id === completeOrderId.value)
  if (item && item.status === 'processing') {
    item.status = 'completed'
    calculateStats(allData.value)
    filterData()
    ElMessage.success(`订单 ${item.orderNo} 已完成`)
  }
  completeDialogVisible.value = false
  completeOrderId.value = null
}

const handleRefresh = () => {
  initData()
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

// ========== 日期更新 ==========
const updateDate = () => {
  const now = new Date()
  currentDate.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

let dateInterval: number | null = null

// ========== 模拟数据更新 ==========
const startDataSimulation = () => {
  setInterval(() => {
    // 随机更新订单状态
    const pendingOrders = allData.value.filter(d => d.status === 'pending')
    if (pendingOrders.length > 0 && Math.random() > 0.7) {
      const order = pendingOrders[Math.floor(Math.random() * pendingOrders.length)]
      order.status = 'processing'
      order.processTime = 0
      calculateStats(allData.value)
      filterData()
    }

    // 随机增加等待时间
    allData.value.forEach(d => {
      if (d.status === 'pending') {
        d.waitTime = (d.waitTime || 5) + Math.floor(Math.random() * 2)
      }
      if (d.status === 'processing') {
        d.processTime = (d.processTime || 5) + Math.floor(Math.random() * 2)
      }
    })
  }, 30000)
}

// ========== 生命周期 ==========
onMounted(() => {
  updateDate()
  dateInterval = window.setInterval(updateDate, 1000)
  initData()
  startDataSimulation()
})

onUnmounted(() => {
  if (dateInterval) {
    clearInterval(dateInterval)
  }
})
</script>

<style scoped>
.kitchen-display-page {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

.kitchen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.header-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.header-stats .el-tag {
  font-size: 14px;
  padding: 8px 16px;
}

.header-stats .el-tag strong {
  font-size: 18px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.order-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.order-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.order-card.order-pending {
  border-left: 4px solid #e6a23c;
}

.order-card.order-processing {
  border-left: 4px solid #409eff;
}

.order-card.order-completed {
  border-left: 4px solid #67c23a;
  opacity: 0.85;
}

.order-card.order-completed:hover {
  opacity: 1;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f2f5;
}

.order-id {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.order-time {
  font-size: 12px;
  color: #6b7280;
}

.order-items {
  margin-bottom: 12px;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px dotted #f3f4f6;
}

.item:last-child {
  border-bottom: none;
}

.item .qty {
  display: inline-block;
  min-width: 28px;
  font-weight: 600;
  color: #6b7280;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f0f2f5;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-info .customer {
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.order-info .timer {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.order-actions {
  display: flex;
  gap: 6px;
}

.priority-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.priority-badge.high {
  background: #fef2f2;
  color: #dc2626;
}

.priority-badge.medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-badge.low {
  background: #f3f4f6;
  color: #6b7280;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 60px 0;
}

.complete-confirm {
  text-align: center;
  padding: 16px 0;
}

.complete-confirm p {
  margin: 12px 0 0;
  font-size: 16px;
  color: #606266;
}

.complete-confirm .hint {
  font-size: 13px;
  color: #909399;
}

/* 打印样式 */
@media print {
  .header-actions {
    display: none !important;
  }

  .kitchen-display-page {
    padding: 0;
    background: white;
  }

  .kitchen-header {
    border-radius: 0;
    box-shadow: none;
    padding: 12px 16px;
  }

  .order-card {
    box-shadow: none !important;
    border: 1px solid #e5e7eb;
    break-inside: avoid;
  }

  .order-card:hover {
    transform: none !important;
    box-shadow: none !important;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .kitchen-display-page {
    padding: 12px;
  }

  .kitchen-header {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 16px;
  }

  .header-left {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .header-stats {
    flex-wrap: wrap;
  }

  .header-stats .el-tag {
    font-size: 12px;
    padding: 4px 10px;
  }

  .order-grid {
    grid-template-columns: 1fr;
  }

  .order-card {
    padding: 12px 14px;
  }

  .order-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .order-actions {
    justify-content: flex-end;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .order-id {
    font-size: 14px;
  }

  .item {
    font-size: 13px;
  }

  .order-header .el-tag {
    font-size: 11px;
    padding: 2px 8px;
  }
}
</style>