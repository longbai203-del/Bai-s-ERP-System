<!-- 
  文件路径: frontend/src/modules/production/pages/ProductionCost.vue
  功能: 生产成本 - 生产成本核算
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-date-picker v-model="searchForm.period" type="month" placeholder="选择计划周期" style="width: 100%" />
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品">
              <el-select v-model="searchForm.product" placeholder="请选择产品" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="iPhone 15 Pro Max" value="iPhone 15 Pro Max" />
                <el-option label="三星 Galaxy S24 Ultra" value="三星 Galaxy S24 Ultra" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 成本统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in costStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="totalQuantity" label="总产量" align="center" />
        <el-table-column prop="materialCost" label="材料成本" align="right">
          <template #default="{ row }">{{ formatCurrency(row.materialCost) }}</template>
        </el-table-column>
        <el-table-column prop="laborCost" label="人工成本" align="right">
          <template #default="{ row }">{{ formatCurrency(row.laborCost) }}</template>
        </el-table-column>
        <el-table-column prop="overheadCost" label="制造费用" align="right">
          <template #default="{ row }">{{ formatCurrency(row.overheadCost) }}</template>
        </el-table-column>
        <el-table-column prop="totalCost" label="总成本" align="right">
          <template #default="{ row }"><span style="font-weight: 700; color: #409EFF;">{{ formatCurrency(row.totalCost) }}</span></template>
        </el-table-column>
        <el-table-column prop="unitCost" label="单位成本" align="right">
          <template #default="{ row }">{{ formatCurrency(row.unitCost) }}</template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ period: new Date(), product: 'all' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const costStats = ref([
  { label: '总生产成本', value: 'SAR 8,560,000', type: 'primary' },
  { label: '材料成本', value: 'SAR 5,200,000', type: 'warning' },
  { label: '人工成本', value: 'SAR 2,100,000', type: 'success' },
  { label: '单位成本', value: 'SAR 425', type: 'primary' },
])

const tableData = ref([
  { id: 1, product: 'iPhone 15 Pro Max', totalQuantity: 5000, materialCost: 3200000, laborCost: 1200000, overheadCost: 800000, totalCost: 5200000, unitCost: 1040 },
  { id: 2, product: '三星 Galaxy S24 Ultra', totalQuantity: 3000, materialCost: 1800000, laborCost: 700000, overheadCost: 500000, totalCost: 3000000, unitCost: 1000 },
  { id: 3, product: 'MacBook Pro 16"', totalQuantity: 1500, materialCost: 1200000, laborCost: 400000, overheadCost: 300000, totalCost: 1900000, unitCost: 1267 },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.product = 'all' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>