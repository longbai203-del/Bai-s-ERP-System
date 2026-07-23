<template>
  <div class="offline-pos-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#F59E0B"><WifiOff /></el-icon>
          离线收银
        </h1>
        <span class="subtitle">网络断开时使用，数据将在恢复后同步</span>
      </div>
      <div class="header-actions">
        <el-tag type="danger" size="large" effect="dark">
          <span class="offline-dot"></span> 离线模式
        </el-tag>
        <el-button type="primary" @click="handleSync">
          <el-icon><Sync /></el-icon> 立即同步 ({{ pendingCount }})
        </el-button>
      </div>
    </div>

    <!-- 同步状态 -->
    <el-card class="status-card" shadow="hover">
      <div class="sync-status">
        <div class="status-left">
          <span class="status-dot offline"></span>
          <div class="status-info">
            <strong>当前离线</strong>
            <span>有 <strong>{{ pendingCount }}</strong> 笔订单待同步</span>
          </div>
        </div>
        <div class="status-right">
          <el-button type="primary" @click="handleSync" :loading="syncing">
            <el-icon><Sync /></el-icon> 立即同步
          </el-button>
          <el-button @click="handleClearPending">
            <el-icon><Delete /></el-icon> 清空队列
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 录入订单 -->
    <el-card class="form-card" shadow="hover">
      <template #header>
        <span class="card-title">
          <el-icon><Plus /></el-icon> 录入订单
        </span>
      </template>

      <el-form :model="orderForm" :rules="orderRules" ref="orderFormRef" label-width="100px" size="default">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="客户姓名" prop="customer">
              <el-input v-model="orderForm.customer" placeholder="输入客户姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="orderForm.phone" placeholder="输入电话" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="服务项目" prop="service">
              <el-select v-model="orderForm.service" placeholder="请选择服务项目" style="width: 100%">
                <el-option label="标准洗车" value="标准洗车" />
                <el-option label="精致洗车" value="精致洗车" />
                <el-option label="全车镀晶" value="全车镀晶" />
                <el-option label="内饰清洁" value="内饰清洁" />
                <el-option label="机油更换" value="机油更换" />
                <el-option label="轮胎护理" value="轮胎护理" />
                <el-option label="空调清洗" value="空调清洗" />
                <el-option label="VIP洗车卡" value="VIP洗车卡" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="金额" prop="amount">
              <el-input-number
                v-model="orderForm.amount"
                :min="0.01"
                :precision="2"
                :max="999999.99"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="orderForm.paymentMethod" placeholder="请选择支付方式" style="width: 100%">
                <el-option label="现金" value="现金" />
                <el-option label="微信支付" value="微信支付" />
                <el-option label="支付宝" value="支付宝" />
                <el-option label="会员卡" value="会员卡" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="车牌号" prop="plateNumber">
              <el-input v-model="orderForm.plateNumber" placeholder="如: 京A12345" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <el-form-item label="备注">
              <el-input v-model="orderForm.remark" placeholder="输入备注信息（可选）" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button type="success" @click="handleAddOrder" :loading="addingOrder">
                <el-icon><Save /></el-icon> 保存订单
              </el-button>
              <el-button @click="handleResetForm">
                <el-icon><Refresh /></el-icon> 重置
              </el-button>
              <el-button type="primary" @click="handleAddQuickOrder">
                <el-icon><Plus /></el-icon> 快速添加示例
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 待同步队列 -->
    <el-card class="queue-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Clock /></el-icon> 待同步队列
          </span>
          <span class="queue-count">{{ pendingOrders.length }} 笔待同步</span>
        </div>
      </template>

      <el-table
        :data="pendingOrders"
        style="width: 100%"
        stripe
        border
        v-loading="queueLoading"
      >
        <el-table-column prop="orderNo" label="订单号" width="140" />
        <el-table-column prop="customer" label="客户姓名" min-width="120" />
        <el-table-column prop="service" label="服务项目" min-width="140" />
        <el-table-column prop="amount" label="金额" width="140" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #409eff;">
              ¥{{ formatNumber(row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="120" align="center" />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row, $index }">
            <el-button size="small" type="danger" @click="handleRemovePending($index)">
              <el-icon><Delete /></el-icon>
            </el-button>
            <el-button size="small" type="primary" @click="handleRetry(row, $index)">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="pendingOrders.length === 0" class="empty-queue">
        <el-empty description="暂无待同步订单" :image-size="80" />
      </div>
    </el-card>

    <!-- 已同步记录 -->
    <el-card class="synced-card" shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><SuccessFilled /></el-icon> 已同步记录
          </span>
          <span class="synced-count">{{ syncedOrders.length }} 条</span>
        </div>
      </template>

      <el-table
        :data="syncedOrders"
        style="width: 100%"
        stripe
        border
        v-loading="syncedLoading"
        max-height="200"
      >
        <el-table-column prop="orderNo" label="订单号" width="140" />
        <el-table-column prop="customer" label="客户姓名" min-width="120" />
        <el-table-column prop="service" label="服务项目" min-width="140" />
        <el-table-column prop="amount" label="金额" width="140" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #67c23a;">
              ¥{{ formatNumber(row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="syncedAt" label="同步时间" width="160" />
        <el-table-column label="状态" width="100" align="center">
          <template #default>
            <el-tag type="success" size="small">✅ 已同步</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="syncedOrders.length === 0" class="empty-synced">
        <el-empty description="暂无已同步记录" :image-size="60" />
      </div>
    </el-card>

    <!-- 同步确认对话框 -->
    <el-dialog
      v-model="syncDialogVisible"
      title="同步确认"
      width="450px"
      :close-on-click-modal="false"
    >
      <div class="sync-confirm">
        <el-icon color="#e6a23c" size="48"><Warning /></el-icon>
        <p>确定要同步 <strong>{{ pendingOrders.length }}</strong> 笔订单吗？</p>
        <p class="hint">同步后将数据上传至服务器，请确保网络已恢复</p>
        <div class="sync-list" v-if="pendingOrders.length <= 5">
          <el-tag
            v-for="order in pendingOrders"
            :key="order.orderNo"
            size="small"
            style="margin: 2px 4px;"
          >
            {{ order.orderNo }}
          </el-tag>
        </div>
        <div v-else class="sync-list">
          <el-tag
            v-for="order in pendingOrders.slice(0, 3)"
            :key="order.orderNo"
            size="small"
            style="margin: 2px 4px;"
          >
            {{ order.orderNo }}
          </el-tag>
          <el-tag size="small" type="info">+{{ pendingOrders.length - 3 }} 笔</el-tag>
        </div>
      </div>
      <template #footer>
        <el-button @click="syncDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="syncing" @click="confirmSync">
          确认同步
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  WifiOff,
  Sync,
  Plus,
  Delete,
  Save,
  Refresh,
  Clock,
  SuccessFilled,
  Warning,
  Document
} from '@element-plus/icons-vue'

// ========== 响应式数据 ==========
const orderFormRef = ref<FormInstance>()
const addingOrder = ref(false)
const syncing = ref(false)
const queueLoading = ref(false)
const syncedLoading = ref(false)
const syncDialogVisible = ref(false)

// 订单表单
const orderForm = reactive({
  customer: '',
  phone: '',
  service: '标准洗车',
  amount: 89,
  paymentMethod: '现金',
  plateNumber: '',
  remark: ''
})

// 表单验证规则
const orderRules: FormRules = {
  customer: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  service: [{ required: true, message: '请选择服务项目', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '金额必须大于0', trigger: 'blur' }
  ],
  paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'change' }]
}

// 待同步队列
const pendingOrders = ref<Array<{
  orderNo: string;
  customer: string;
  phone: string;
  service: string;
  amount: number;
  paymentMethod: string;
  plateNumber: string;
  remark: string;
  createdAt: string;
}>>([])

// 已同步记录
const syncedOrders = ref<Array<{
  orderNo: string;
  customer: string;
  service: string;
  amount: number;
  syncedAt: string;
}>>([])

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const pendingCount = computed(() => {
  return pendingOrders.value.length
})

// ========== 生成订单号 ==========
const generateOrderNo = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `OFF-${year}${month}${day}-${random}`
}

// ========== 添加订单 ==========
const handleAddOrder = async () => {
  if (!orderFormRef.value) return
  try {
    await orderFormRef.value.validate()
  } catch {
    return
  }

  addingOrder.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    const newOrder = {
      orderNo: generateOrderNo(),
      ...orderForm,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    pendingOrders.value.unshift(newOrder)
    ElMessage.success(`订单 ${newOrder.orderNo} 已保存，等待同步`)

    // 重置表单
    orderForm.customer = ''
    orderForm.phone = ''
    orderForm.service = '标准洗车'
    orderForm.amount = 89
    orderForm.paymentMethod = '现金'
    orderForm.plateNumber = ''
    orderForm.remark = ''
  } finally {
    addingOrder.value = false
  }
}

// ========== 快速添加示例 ==========
const handleAddQuickOrder = () => {
  const customers = ['张三', '李四', '王五', '赵六']
  const services = ['标准洗车', '精致洗车', '内饰清洁', 'VIP洗车卡']
  const payments = ['现金', '微信支付', '支付宝']

  const randomCustomer = customers[Math.floor(Math.random() * customers.length)]
  const randomService = services[Math.floor(Math.random() * services.length)]
  const randomPayment = payments[Math.floor(Math.random() * payments.length)]
  const randomAmount = [89, 159, 299, 599, 999][Math.floor(Math.random() * 5)]

  orderForm.customer = randomCustomer
  orderForm.phone = `138${String(Math.floor(Math.random() * 90000000) + 10000000)}`
  orderForm.service = randomService
  orderForm.amount = randomAmount
  orderForm.paymentMethod = randomPayment
  orderForm.plateNumber = `京A${String(Math.floor(Math.random() * 90000) + 10000)}`
  orderForm.remark = '快速录入'

  handleAddOrder()
}

// ========== 重置表单 ==========
const handleResetForm = () => {
  orderForm.customer = ''
  orderForm.phone = ''
  orderForm.service = '标准洗车'
  orderForm.amount = 89
  orderForm.paymentMethod = '现金'
  orderForm.plateNumber = ''
  orderForm.remark = ''
  ElMessage.info('表单已重置')
}

// ========== 同步操作 ==========
const handleSync = () => {
  if (pendingOrders.value.length === 0) {
    ElMessage.warning('暂无待同步订单')
    return
  }
  syncDialogVisible.value = true
}

const confirmSync = async () => {
  syncing.value = true
  try {
    // 模拟同步过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 将待同步订单移到已同步
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
    pendingOrders.value.forEach(order => {
      syncedOrders.value.unshift({
        orderNo: order.orderNo,
        customer: order.customer,
        service: order.service,
        amount: order.amount,
        syncedAt: now
      })
    })

    const count = pendingOrders.value.length
    pendingOrders.value = []
    syncDialogVisible.value = false
    ElMessage.success(`成功同步 ${count} 笔订单！`)
  } catch (error) {
    ElMessage.error('同步失败，请检查网络后重试')
  } finally {
    syncing.value = false
  }
}

// ========== 删除待同步订单 ==========
const handleRemovePending = (index: number) => {
  const order = pendingOrders.value[index]
  ElMessageBox.confirm(`确定要删除订单 ${order.orderNo} 吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    pendingOrders.value.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// ========== 重试同步 ==========
const handleRetry = (row: any, index: number) => {
  ElMessage.info(`正在重试同步 ${row.orderNo}`)
  setTimeout(() => {
    const order = pendingOrders.value[index]
    if (order) {
      // 模拟重试成功
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
      syncedOrders.value.unshift({
        orderNo: order.orderNo,
        customer: order.customer,
        service: order.service,
        amount: order.amount,
        syncedAt: now
      })
      pendingOrders.value.splice(index, 1)
      ElMessage.success(`订单 ${order.orderNo} 同步成功`)
    }
  }, 1500)
}

// ========== 清空队列 ==========
const handleClearPending = () => {
  if (pendingOrders.value.length === 0) {
    ElMessage.warning('队列已空')
    return
  }
  ElMessageBox.confirm(`确定要清空 ${pendingOrders.value.length} 笔待同步订单吗？`, '清空确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    pendingOrders.value = []
    ElMessage.success('已清空队列')
  }).catch(() => {})
}

// ========== 模拟数据初始化 ==========
const initMockData = () => {
  // 模拟已有待同步订单
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
  pendingOrders.value = [
    {
      orderNo: 'OFF-202607-0001',
      customer: '张三',
      phone: '13800001001',
      service: '标准洗车',
      amount: 178,
      paymentMethod: '现金',
      plateNumber: '京A12345',
      remark: '客户要求尽快处理',
      createdAt: now
    },
    {
      orderNo: 'OFF-202607-0002',
      customer: '李四',
      phone: '13800001002',
      service: '内饰清洁',
      amount: 299,
      paymentMethod: '微信支付',
      plateNumber: '京B67890',
      remark: '',
      createdAt: now
    },
    {
      orderNo: 'OFF-202607-0003',
      customer: '王五',
      phone: '13800001003',
      service: 'VIP洗车卡',
      amount: 999,
      paymentMethod: '会员卡',
      plateNumber: '京C13579',
      remark: '充值会员',
      createdAt: now
    }
  ]

  // 模拟已同步记录
  syncedOrders.value = [
    {
      orderNo: 'OFF-202607-0000',
      customer: '赵六',
      service: '精致洗车',
      amount: 159,
      syncedAt: now
    }
  ]
}

// ========== 生命周期 ==========
onMounted(() => {
  initMockData()
})
</script>

<style scoped>
.offline-pos-page {
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
  align-items: center;
}

.offline-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f56c6c;
  margin-right: 6px;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-card {
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
}

.sync-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.status-dot.online {
  background: #67c23a;
}

.status-dot.offline {
  background: #f56c6c;
  animation: blink 1s ease-in-out infinite;
}

.status-info {
  display: flex;
  flex-direction: column;
}

.status-info strong {
  font-size: 16px;
  color: #303133;
}

.status-info span {
  font-size: 13px;
  color: #909399;
}

.status-right {
  display: flex;
  gap: 8px;
}

.form-card {
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.queue-count,
.synced-count {
  font-size: 13px;
  font-weight: 400;
  color: #909399;
}

.queue-card,
.synced-card {
  border-radius: 12px;
  overflow: hidden;
}

.empty-queue,
.empty-synced {
  padding: 20px 0;
}

.sync-confirm {
  text-align: center;
  padding: 12px 0;
}

.sync-confirm p {
  margin: 12px 0 0;
  font-size: 16px;
  color: #606266;
}

.sync-confirm .hint {
  font-size: 13px;
  color: #909399;
}

.sync-list {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .offline-pos-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-tag,
  .header-actions .el-button {
    flex: 1;
  }

  .sync-status {
    flex-direction: column;
    align-items: stretch;
  }

  .status-right {
    flex-direction: column;
  }

  .status-right .el-button {
    width: 100%;
  }

  .form-card :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  .form-card :deep(.el-col) {
    margin-bottom: 0;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .status-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left h1 {
    font-size: 20px;
  }

  .subtitle {
    font-size: 12px;
  }
}
</style>