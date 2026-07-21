<!-- 
  文件路径: frontend/src/modules/finance/pages/SaudiVat.vue
  功能: 沙特VAT - 沙特增值税管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="申报期间">
              <el-date-picker v-model="searchForm.period" type="month" placeholder="选择期间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待申报" value="pending" />
                <el-option label="已申报" value="declared" />
                <el-option label="已缴纳" value="paid" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCalculate"><el-icon><Monitor /></el-icon> 计算VAT</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- VAT统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in vatStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="period" label="申报期间" width="120" />
        <el-table-column prop="salesAmount" label="销售额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.salesAmount) }}</template>
        </el-table-column>
        <el-table-column prop="vatRate" label="税率" align="center" width="80">{{ row.vatRate }}%</el-table-column>
        <el-table-column prop="outputVat" label="销项税" align="right">
          <template #default="{ row }">{{ formatCurrency(row.outputVat) }}</template>
        </el-table-column>
        <el-table-column prop="inputVat" label="进项税" align="right">
          <template #default="{ row }">{{ formatCurrency(row.inputVat) }}</template>
        </el-table-column>
        <el-table-column prop="netVat" label="应纳税额" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.netVat >= 0 ? '#F56C6C' : '#67C23A', fontWeight: 600 }">
              {{ formatCurrency(row.netVat) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'paid' ? 'success' : row.status === 'declared' ? 'primary' : 'warning'">
              {{ row.status === 'pending' ? '待申报' : row.status === 'declared' ? '已申报' : '已缴纳' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDeclare(row)" v-if="row.status === 'pending'"><el-icon><Document /></el-icon> 申报</el-button>
            <el-button type="success" size="small" @click="handlePay(row)" v-if="row.status === 'declared'"><el-icon><Money /></el-icon> 缴纳</el-button>
            <el-button type="warning" size="small" @click="handleReport(row)"><el-icon><View /></el-icon> 报表</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Monitor, Document, Money, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ period: new Date(), status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const vatStats = ref([
  { label: '应缴VAT总额', value: 'SAR 428,400', type: 'danger' },
  { label: '已缴VAT', value: 'SAR 256,000', type: 'success' },
  { label: '待缴VAT', value: 'SAR 172,400', type: 'warning' },
])

const tableData = ref([
  { id: 1, period: '2024-11', salesAmount: 12856000, vatRate: 15, outputVat: 1928400, inputVat: 1500000, netVat: 428400, status: 'pending' },
  { id: 2, period: '2024-10', salesAmount: 11230000, vatRate: 15, outputVat: 1684500, inputVat: 1428500, netVat: 256000, status: 'paid' },
  { id: 3, period: '2024-09', salesAmount: 9856000, vatRate: 15, outputVat: 1478400, inputVat: 1280000, netVat: 198400, status: 'declared' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.status = '' }
const handleCalculate = () => { ElMessage.success('VAT计算完成') }
const handleDeclare = (row: any) => { ElMessage.success(`期间 ${row.period} VAT已申报`) }
const handlePay = (row: any) => { ElMessage.success(`期间 ${row.period} VAT已缴纳`) }
const handleReport = (row: any) => { ElMessage.info(`查看期间 ${row.period} VAT报表`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>