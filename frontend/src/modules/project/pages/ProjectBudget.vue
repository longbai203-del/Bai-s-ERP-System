<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectBudget.vue
  功能: 项目预算 - 项目预算管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="项目">
              <el-select v-model="searchForm.project" placeholder="请选择项目" style="width: 100%" filterable>
                <el-option label="STC 5G网络升级" value="STC 5G网络升级" />
                <el-option label="阿尔拉吉银行核心系统" value="阿尔拉吉银行核心系统" />
                <el-option label="沙特阿美数据中心建设" value="沙特阿美数据中心建设" />
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
        <el-table-column prop="category" label="预算科目" />
        <el-table-column prop="planned" label="计划金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.planned) }}</template>
        </el-table-column>
        <el-table-column prop="actual" label="实际金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.actual) }}</template>
        </el-table-column>
        <el-table-column prop="variance" label="差异" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.variance >= 0 ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ formatCurrency(row.variance) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="使用率" align="center" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.usageRate" :color="row.usageRate < 80 ? '#67C23A' : row.usageRate < 95 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ project: '' })

const budgetStats = ref([
  { label: '总预算', value: 'SAR 5,000,000', type: 'primary' },
  { label: '已使用', value: 'SAR 3,800,000', type: 'warning' },
  { label: '剩余预算', value: 'SAR 1,200,000', type: 'success' },
  { label: '预算执行率', value: '76%', type: 'primary' },
])

const tableData = ref([
  { category: '人力成本', planned: 2000000, actual: 1850000, variance: 150000, usageRate: 92.5 },
  { category: '设备采购', planned: 1500000, actual: 1200000, variance: 300000, usageRate: 80 },
  { category: '软件授权', planned: 800000, actual: 750000, variance: 50000, usageRate: 93.8 },
  { category: '运维费用', planned: 700000, actual: 0, variance: 700000, usageRate: 0 },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.project = '' }
const handleExport = () => { ElMessage.success('导出完成') }
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