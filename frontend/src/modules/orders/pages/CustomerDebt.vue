<!-- 
  文件路径: frontend/src/modules/orders/pages/CustomerDebt.vue
  功能: 客户欠款 - 管理客户应收账款
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账龄">
              <el-select v-model="searchForm.aging" placeholder="请选择账龄" clearable style="width: 100%">
                <el-option label="30天内" value="0-30" />
                <el-option label="30-60天" value="30-60" />
                <el-option label="60-90天" value="60-90" />
                <el-option label="90天以上" value="90+" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in statistics" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="totalDebt" label="总欠款" align="right">
          <template #default="{ row }"><span style="font-weight: 600; color: #F56C6C;">{{ formatCurrency(row.totalDebt) }}</span></template>
        </el-table-column>
        <el-table-column prop="days0to30" label="30天内" align="right">
          <template #default="{ row }">{{ formatCurrency(row.days0to30) }}</template>
        </el-table-column>
        <el-table-column prop="days30to60" label="30-60天" align="right">
          <template #default="{ row }">{{ formatCurrency(row.days30to60) }}</template>
        </el-table-column>
        <el-table-column prop="days60to90" label="60-90天" align="right">
          <template #default="{ row }">{{ formatCurrency(row.days60to90) }}</template>
        </el-table-column>
        <el-table-column prop="days90plus" label="90天以上" align="right">
          <template #default="{ row }"><span style="font-weight: 600; color: #F56C6C;">{{ formatCurrency(row.days90plus) }}</span></template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleCollection(row)"><el-icon><Money /></el-icon> 催收</el-button>
            <el-button type="warning" size="small" @click="handleDetail(row)"><el-icon><Document /></el-icon> 明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Money, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ customer: '', aging: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { customer: '沙特电信公司', totalDebt: 1250000, days0to30: 500000, days30to60: 350000, days60to90: 250000, days90plus: 150000 },
  { customer: '阿尔拉吉银行', totalDebt: 980000, days0to30: 400000, days30to60: 280000, days60to90: 200000, days90plus: 100000 },
  { customer: '沙特阿美', totalDebt: 756000, days0to30: 300000, days30to60: 220000, days60to90: 150000, days90plus: 86000 },
  { customer: '利雅得银行', totalDebt: 523000, days0to30: 200000, days30to60: 180000, days60to90: 100000, days90plus: 43000 },
])

const statistics = ref([
  { label: '应收账款总额', value: 'SAR 3,509,000', type: 'primary' },
  { label: '30天内', value: 'SAR 1,400,000', type: 'success' },
  { label: '30-60天', value: 'SAR 1,030,000', type: 'warning' },
  { label: '60-90天', value: 'SAR 700,000', type: 'warning' },
  { label: '90天以上', value: 'SAR 379,000', type: 'danger' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.customer = ''; searchForm.aging = '' }
const handleCollection = (row: any) => { ElMessage.info(`催收: ${row.customer}`) }
const handleDetail = (row: any) => { ElMessage.info(`查看明细: ${row.customer}`) }
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
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>