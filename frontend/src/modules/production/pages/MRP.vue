<!-- 
  文件路径: frontend/src/modules/production/pages/MRP.vue
  功能: MRP运算 - 物料需求计划
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="计划周期">
              <el-date-picker v-model="searchForm.period" type="month" placeholder="选择计划周期" style="width: 100%" />
            </el-form-item>
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
              <el-button type="primary" @click="handleCalculate"><el-icon><Monitor /></el-icon> 运行MRP</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- MRP统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in mrpStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>MRP运算结果</span>
          <el-tag type="warning" size="small">最后运算: 2024-11-20 10:30</el-tag>
        </div>
      </template>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="materialNo" label="物料编号" width="120" />
        <el-table-column prop="materialName" label="物料名称" />
        <el-table-column prop="requiredQuantity" label="需求数量" align="center" />
        <el-table-column prop="currentStock" label="当前库存" align="center" />
        <el-table-column prop="safetyStock" label="安全库存" align="center" />
        <el-table-column prop="netRequirement" label="净需求" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.netRequirement > 0 ? '#F56C6C' : '#67C23A', fontWeight: 700 }">
              {{ row.netRequirement }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="suggestedOrder" label="建议采购" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.suggestedOrder > 0 ? '#409EFF' : '#909399' }">
              {{ row.suggestedOrder > 0 ? row.suggestedOrder : '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="leadTime" label="采购周期(天)" align="center" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleCreateOrder(row)" v-if="row.suggestedOrder > 0">
              <el-icon><Document /></el-icon> 生成采购单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Monitor, Download, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ period: new Date(), product: 'all' })

const mrpStats = ref([
  { label: '总物料需求', value: '28,560件', type: 'primary' },
  { label: '需要采购物料', value: '86项', type: 'warning' },
  { label: '建议采购总额', value: 'SAR 856,000', type: 'danger' },
  { label: '库存满足率', value: '68%', type: 'success' },
])

const tableData = ref([
  { id: 1, materialNo: 'MT-001', materialName: '屏幕总成', requiredQuantity: 500, currentStock: 200, safetyStock: 100, netRequirement: 300, suggestedOrder: 400, leadTime: 7 },
  { id: 2, materialNo: 'MT-002', materialName: '主板', requiredQuantity: 500, currentStock: 150, safetyStock: 80, netRequirement: 350, suggestedOrder: 430, leadTime: 10 },
  { id: 3, materialNo: 'MT-003', materialName: '电池', requiredQuantity: 500, currentStock: 300, safetyStock: 150, netRequirement: 200, suggestedOrder: 350, leadTime: 5 },
  { id: 4, materialNo: 'MT-004', materialName: '后盖', requiredQuantity: 500, currentStock: 250, safetyStock: 120, netRequirement: 250, suggestedOrder: 370, leadTime: 7 },
])

const loading = ref(false)

const handleCalculate = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('MRP运算完成')
  }, 1500)
}

const handleReset = () => { searchForm.product = 'all' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreateOrder = (row: any) => { ElMessage.info(`为 ${row.materialName} 生成采购单`) }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>