<!-- 
  文件路径: frontend/src/modules/pos/pages/DailyClose.vue
  功能: 日结管理 - POS日结报表
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="日期">
              <el-date-picker v-model="searchForm.date" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="门店">
              <el-select v-model="searchForm.store" placeholder="请选择门店" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="利雅得店" value="riyadh" />
                <el-option label="吉达店" value="jeddah" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleClose" style="float: right"><el-icon><Lock /></el-icon> 日结</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 日结统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in dailyStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 销售明细 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header><span>销售明细</span></template>
          <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
            <el-table-column prop="time" label="时间" width="160" />
            <el-table-column prop="orderNo" label="订单号" width="140" />
            <el-table-column prop="amount" label="金额" align="right">
              <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
            </el-table-column>
            <el-table-column prop="method" label="支付方式" width="100">
              <template #default="{ row }">
                <el-tag :type="row.method === 'cash' ? 'success' : row.method === 'card' ? 'primary' : 'warning'">
                  {{ row.method === 'cash' ? '现金' : row.method === 'card' ? '刷卡' : '扫码' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="cashier" label="收银员" width="100" />
            <el-table-column prop="status" label="状态" align="center" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'completed' ? 'success' : 'warning'">
                  {{ row.status === 'completed' ? '已完成' : '待结算' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 支付汇总 -->
    <el-row :gutter="20">
      <el-col :span="8" v-for="method in paymentSummary" :key="method.name">
        <el-card class="payment-card">
          <div class="payment-icon" :style="{ background: method.color }">
            <el-icon :size="32"><component :is="method.icon" /></el-icon>
          </div>
          <div class="payment-info">
            <div class="payment-name">{{ method.name }}</div>
            <div class="payment-amount">{{ formatCurrency(method.amount) }}</div>
            <div class="payment-count">{{ method.count }} 笔</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Lock, Money, CreditCard, Wallet } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ date: new Date(), store: 'all' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const dailyStats = ref([
  { label: '总销售额', value: 'SAR 28,560', type: 'primary' },
  { label: '订单数', value: '86', type: 'success' },
  { label: '客单价', value: 'SAR 332', type: 'warning' },
  { label: '现金收入', value: 'SAR 12,800', type: 'primary' },
])

const paymentSummary = ref([
  { name: '现金', amount: 12800, count: 42, color: '#67C23A', icon: 'Money' },
  { name: '刷卡', amount: 9850, count: 28, color: '#409EFF', icon: 'CreditCard' },
  { name: '扫码', amount: 5910, count: 16, color: '#E6A23C', icon: 'Wallet' },
])

const tableData = ref([
  { id: 1, time: '2024-11-20 10:30', orderNo: 'POS-2024-001', amount: 1250, method: 'cash', cashier: 'Ahmed', status: 'completed' },
  { id: 2, time: '2024-11-20 11:15', orderNo: 'POS-2024-002', amount: 2300, method: 'card', cashier: 'Ahmed', status: 'completed' },
  { id: 3, time: '2024-11-20 14:30', orderNo: 'POS-2024-003', amount: 850, method: 'scan', cashier: 'Mohammed', status: 'pending' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.store = 'all' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleClose = () => {
  ElMessageBox.confirm('确认今日日结？日结后将无法修改当天的交易数据。', '日结确认', { confirmButtonText: '确认日结', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('日结完成')).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.payment-card { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 12px; }
.payment-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
.payment-name { font-weight: 600; font-size: 16px; color: #303133; }
.payment-amount { font-size: 20px; font-weight: 700; color: #303133; }
.payment-count { color: #909399; font-size: 13px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>