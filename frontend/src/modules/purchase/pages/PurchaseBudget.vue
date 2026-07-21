<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseBudget.vue
  功能: 采购预算 - 管理采购预算与控制
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="年份">
              <el-select v-model="searchForm.year" placeholder="请选择年份" style="width: 100%">
                <el-option label="2024" value="2024" />
                <el-option label="2025" value="2025" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门">
              <el-select v-model="searchForm.department" placeholder="请选择部门" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="销售部" value="销售部" />
                <el-option label="运营部" value="运营部" />
                <el-option label="财务部" value="财务部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 设置预算</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 预算概览 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in budgetStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="annualBudget" label="年度预算" align="right">
          <template #default="{ row }">{{ formatCurrency(row.annualBudget) }}</template>
        </el-table-column>
        <el-table-column prop="usedAmount" label="已使用" align="right">
          <template #default="{ row }">{{ formatCurrency(row.usedAmount) }}</template>
        </el-table-column>
        <el-table-column prop="remaining" label="剩余预算" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.remaining > 0 ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ formatCurrency(row.remaining) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="使用率" align="center" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.usageRate" :color="row.usageRate < 70 ? '#67C23A' : row.usageRate < 90 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.usageRate < 70 ? 'success' : row.usageRate < 90 ? 'warning' : 'danger'">
              {{ row.usageRate < 70 ? '正常' : row.usageRate < 90 ? '预警' : '超支' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon> 调整</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ year: '2024', department: 'all' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const budgetStats = ref([
  { label: '总预算', value: 'SAR 8,500,000', type: 'primary' },
  { label: '已使用', value: 'SAR 5,856,000', type: 'warning' },
  { label: '剩余预算', value: 'SAR 2,644,000', type: 'success' },
  { label: '预算执行率', value: '68.9%', type: 'primary' },
])

const tableData = ref([
  { department: '销售部', annualBudget: 3000000, usedAmount: 1856000, remaining: 1144000, usageRate: 61.9 },
  { department: '采购部', annualBudget: 2500000, usedAmount: 1987000, remaining: 513000, usageRate: 79.5 },
  { department: '运营部', annualBudget: 2000000, usedAmount: 1765000, remaining: 235000, usageRate: 88.3 },
  { department: '财务部', annualBudget: 1000000, usedAmount: 450000, remaining: 550000, usageRate: 45.0 },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.department = 'all' }
const handleCreate = () => { ElMessage.info('设置预算') }
const handleEdit = (row: any) => { ElMessage.info(`调整 ${row.department} 预算`) }
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