<template>
  <div class="daily-close-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#4F46E5"><Lock /></el-icon>
          日结管理
        </h1>
        <span class="subtitle">每日营业数据结算与报表</span>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleDailyClose">
          <el-icon><Lock /></el-icon> 执行日结
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon> 导出报表
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><RefreshRight /></el-icon> 刷新
        </el-button>
      </div>
    </div>

    <!-- 日结统计 -->
    <el-card class="summary-card" shadow="hover">
      <template #header>
        <span class="card-title">
          <el-icon><DataLine /></el-icon> 日结统计
          <span class="date-range">{{ selectedDate }}</span>
        </span>
      </template>

      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :lg="4" v-for="stat in dailyStats" :key="stat.label">
          <div class="stat-item" :class="stat.type">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-change" :class="stat.change > 0 ? 'up' : 'down'">
              {{ stat.change > 0 ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 搜索筛选 -->
    <el-card class="filter-card" shadow="hover">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="日期">
          <el-date-picker
            v-model="filterForm.date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="门店">
          <el-select v-model="filterForm.store" placeholder="全部门店" clearable style="width: 140px">
            <el-option label="全部" value="all" />
            <el-option label="旗舰店" value="flagship" />
            <el-option label="分店一" value="branch1" />
            <el-option label="分店二" value="branch2" />
          </el-select>
        </el-form-item>
        <el-form-item label="收银员">
          <el-select v-model="filterForm.cashier" placeholder="全部收银员" clearable style="width: 140px">
            <el-option label="全部" value="all" />
            <el-option label="张伟" value="张伟" />
            <el-option label="李娜" value="李娜" />
            <el-option label="王强" value="王强" />
            <el-option label="刘洋" value="刘洋" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 销售明细 -->
    <el-card class="table-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>销售明细</span>
          <span class="total-info">共 {{ pagination.total }} 笔交易</span>
        </div>
      </template>

      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        stripe
        border
      >
        <el-table-column prop="time" label="时间" width="160" sortable />
        <el-table-column prop="orderNo" label="订单号" width="140">
          <template #default="{ row }">
            <el-link type="primary">{{ row.orderNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="140" align="right">
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
        <el-table-column prop="cashier" label="收银员" width="100" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'warning'" size="small">
              {{ row.status === 'completed' ? '已完成' : '待结算' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleViewDetail(row)">
              <el-icon><View /></el-icon> 查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 支付汇总 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8" v-for="method in paymentSummary" :key="method.name">
        <el-card class="payment-card" shadow="hover">
          <div class="payment-content">
            <div class="payment-icon" :style="{ background: method.color }">
              <el-icon :size="28"><component :is="method.icon" /></el-icon>
            </div>
            <div class="payment-info">
              <div class="payment-name">{{ method.name }}</div>
              <div class="payment-amount">¥{{ formatNumber(method.amount) }}</div>
              <div class="payment-count">{{ method.count }} 笔交易</div>
            </div>
            <div class="payment-percent">{{ method.percent }}%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 日结确认对话框 -->
    <el-dialog
      v-model="dailyCloseDialogVisible"
      title="日结确认"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="daily-close-confirm">
        <el-icon color="#e6a23c" size="56"><Warning /></el-icon>
        <p>确认执行日结操作吗？</p>
        <p class="hint">日结后将无法修改当天的交易数据</p>

        <div class="daily-summary">
          <div class="summary-item">
            <span>总交易额</span>
            <span style="font-weight: 700; color: #409eff;">
              ¥{{ formatNumber(dailyStats[0]?.rawValue || 0) }}
            </span>
          </div>
          <div class="summary-item">
            <span>总交易笔数</span>
            <span>{{ dailyStats[1]?.rawValue || 0 }} 笔</span>
          </div>
          <div class="summary-item">
            <span>现金收入</span>
            <span>¥{{ formatNumber(paymentSummary[0]?.amount || 0) }}</span>
          </div>
          <div class="summary-item">
            <span>非现金收入</span>
            <span>¥{{ formatNumber((dailyStats[0]?.rawValue || 0) - (paymentSummary[0]?.amount || 0)) }}</span>
          </div>
        </div>

        <el-form :model="dailyCloseForm" label-width="100px" style="margin-top: 12px;">
          <el-form-item label="备注">
            <el-input
              v-model="dailyCloseForm.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入日结备注（可选）"
            />
          </el-form-item>
        </el-form>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Lock,
  Download,
  RefreshRight,
  DataLine,
  Search,
  Refresh,
  View,
  Warning,
  Money,
  CreditCard,
  Wallet,
  Tickets
} from '@element-plus/icons-vue'

// ========== 响应式数据 ==========
const loading = ref(false)
const dailyCloseLoading = ref(false)
const dailyCloseDialogVisible = ref(false)
const selectedDate = ref('')

// 日结统计
const dailyStats = ref([
  { label: '总交易额', value: '¥28,560', type: 'primary', change: 8.5, rawValue: 28560 },
  { label: '交易笔数', value: '86', type: 'success', change: 5.2, rawValue: 86 },
  { label: '客单价', value: '¥332', type: 'warning', change: 3.1, rawValue: 332 },
  { label: '现金收入', value: '¥12,800', type: 'primary', change: 2.3, rawValue: 12800 },
  { label: '会员消费', value: '¥8,560', type: 'info', change: 12.8, rawValue: 8560 },
  { label: '退款金额', value: '¥320', type: 'danger', change: -5.6, rawValue: 320 }
])

// 支付汇总
const paymentSummary = ref([
  { name: '现金', amount: 12800, count: 42, percent: 44.8, color: '#67c23a', icon: 'Money' },
  { name: '微信支付', amount: 9850, count: 28, percent: 34.5, color: '#409eff', icon: 'Wallet' },
  { name: '支付宝', amount: 5910, count: 16, percent: 20.7, color: '#e6a23c', icon: 'CreditCard' }
])

// 筛选表单
const filterForm = reactive({
  date: '',
  store: 'all',
  cashier: 'all'
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref<any[]>([])
const allData = ref<any[]>([])

// 日结表单
const dailyCloseForm = reactive({
  remark: ''
})

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

// ========== 模拟数据生成 ==========
const generateMockData = () => {
  const methods = ['现金', '微信支付', '支付宝', '信用卡', '会员卡']
  const cashiers = ['张伟', '李娜', '王强', '刘洋']
  const statuses = ['completed', 'completed', 'completed', 'pending']

  const data = []
  const now = new Date()
  const total = 45

  for (let i = 1; i <= total; i++) {
    const date = new Date(now)
    date.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60))

    data.push({
      id: i,
      orderNo: `POS-${String(i).padStart(6, '0')}`,
      amount: Math.round((Math.random() * 800 + 50) * 100) / 100,
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      cashier: cashiers[Math.floor(Math.random() * cashiers.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      time: date.toISOString().replace('T', ' ').slice(0, 16)
    })
  }

  data.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  return data
}

// ========== 初始化数据 ==========
const initData = () => {
  loading.value = true
  setTimeout(() => {
    allData.value = generateMockData()
    filterData()
    loading.value = false
  }, 500)

  // 设置默认日期
  const now = new Date()
  selectedDate.value = now.toISOString().split('T')[0]
  filterForm.date = selectedDate.value
}

// ========== 筛选数据 ==========
const filterData = () => {
  let data = [...allData.value]

  if (filterForm.date) {
    data = data.filter(item => item.time.startsWith(filterForm.date))
  }

  pagination.total = data.length
  const start = (pagination.current - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  tableData.value = data.slice(start, end)

  // 更新支付汇总
  updatePaymentSummary(data)
}

const updatePaymentSummary = (data: any[]) => {
  const totals: Record<string, { amount: number; count: number }> = {}

  data.forEach(item => {
    if (!totals[item.paymentMethod]) {
      totals[item.paymentMethod] = { amount: 0, count: 0 }
    }
    totals[item.paymentMethod].amount += item.amount
    totals[item.paymentMethod].count += 1
  })

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)

  const methodMap: Record<string, { name: string; color: string; icon: string }> = {
    '现金': { name: '现金', color: '#67c23a', icon: 'Money' },
    '微信支付': { name: '微信支付', color: '#409eff', icon: 'Wallet' },
    '支付宝': { name: '支付宝', color: '#e6a23c', icon: 'CreditCard' },
    '信用卡': { name: '信用卡', color: '#f56c6c', icon: 'CreditCard' },
    '会员卡': { name: '会员卡', color: '#8b5cf6', icon: 'Tickets' }
  }

  paymentSummary.value = Object.keys(totals).map(key => ({
    ...methodMap[key],
    amount: totals[key].amount,
    count: totals[key].count,
    percent: totalAmount > 0 ? Math.round((totals[key].amount / totalAmount) * 100) : 0
  }))

  // 更新日结统计
  updateDailyStats(data)
}

const updateDailyStats = (data: any[]) => {
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)
  const totalCount = data.length
  const avgPrice = totalCount > 0 ? totalAmount / totalCount : 0
  const cashAmount = data.filter(d => d.paymentMethod === '现金').reduce((sum, d) => sum + d.amount, 0)
  const refundAmount = data.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.amount * 0.1, 0)

  dailyStats.value = [
    { label: '总交易额', value: '¥' + formatNumber(totalAmount), type: 'primary', change: 8.5, rawValue: totalAmount },
    { label: '交易笔数', value: totalCount.toString(), type: 'success', change: 5.2, rawValue: totalCount },
    { label: '客单价', value: '¥' + formatNumber(avgPrice), type: 'warning', change: 3.1, rawValue: avgPrice },
    { label: '现金收入', value: '¥' + formatNumber(cashAmount), type: 'primary', change: 2.3, rawValue: cashAmount },
    { label: '非现金收入', value: '¥' + formatNumber(totalAmount - cashAmount), type: 'info', change: 12.8, rawValue: totalAmount - cashAmount },
    { label: '退款金额', value: '¥' + formatNumber(refundAmount), type: 'danger', change: -5.6, rawValue: refundAmount }
  ]
}

// ========== 事件处理 ==========
const handleSearch = () => {
  pagination.current = 1
  filterData()
}

const handleReset = () => {
  filterForm.date = new Date().toISOString().split('T')[0]
  filterForm.store = 'all'
  filterForm.cashier = 'all'
  pagination.current = 1
  filterData()
}

const handleDailyClose = () => {
  dailyCloseForm.remark = ''
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

const handleViewDetail = (row: any) => {
  ElMessage.info(`查看订单: ${row.orderNo}`)
}

const handleExport = () => {
  ElMessage.success('导出任务已提交')
}

const handleRefresh = () => {
  initData()
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.current = 1
  filterData()
}

const handleCurrentChange = (val: number) => {
  pagination.current = val
  filterData()
}

// ========== 生命周期 ==========
onMounted(() => {
  initData()
})
</script>

<style scoped>
.daily-close-page {
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
}

.summary-card {
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range {
  font-size: 14px;
  font-weight: 400;
  color: #909399;
}

.stat-item {
  text-align: center;
  padding: 12px 8px;
  border-radius: 8px;
  background: #fafbfc;
  border-left: 4px solid #409eff;
}

.stat-item.primary { border-color: #409eff; }
.stat-item.success { border-color: #67c23a; }
.stat-item.warning { border-color: #e6a23c; }
.stat-item.info { border-color: #8b5cf6; }
.stat-item.danger { border-color: #f56c6c; }

.stat-label {
  font-size: 13px;
  color: #909399;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  margin: 4px 0;
}

.stat-change {
  font-size: 12px;
}

.stat-change.up {
  color: #67c23a;
}

.stat-change.down {
  color: #f56c6c;
}

.filter-card {
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 0;
}

.filter-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 12px;
}

.table-card {
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

.total-info {
  font-size: 13px;
  font-weight: 400;
  color: #909399;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  margin-top: 16px;
}

.payment-card {
  border-radius: 12px;
  overflow: hidden;
}

.payment-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0;
}

.payment-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
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
  font-size: 14px;
  color: #909399;
}

.payment-amount {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
}

.payment-count {
  font-size: 12px;
  color: #909399;
}

.payment-percent {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.daily-close-confirm {
  text-align: center;
  padding: 8px 0;
}

.daily-close-confirm p {
  margin: 8px 0 0;
  font-size: 16px;
  color: #606266;
}

.daily-close-confirm .hint {
  font-size: 13px;
  color: #909399;
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
  .daily-close-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .filter-form {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-form :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .filter-form :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .stat-item {
    margin-bottom: 12px;
  }

  .payment-content {
    flex-wrap: wrap;
  }

  .payment-percent {
    margin-left: auto;
  }
}
</style>