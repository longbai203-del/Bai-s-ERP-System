<!-- 
  文件路径: frontend/src/modules/inventory/pages/DeadStock.vue
  功能: 呆滞库存 - 管理呆滞/滞销库存
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.product" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="呆滞天数">
              <el-select v-model="searchForm.days" placeholder="请选择天数" clearable style="width: 100%">
                <el-option label="30天以上" value="30" />
                <el-option label="60天以上" value="60" />
                <el-option label="90天以上" value="90" />
                <el-option label="180天以上" value="180" />
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

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in deadStockStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="quantity" label="库存数量" align="center" width="80" />
        <el-table-column prop="value" label="库存金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.value) }}</template>
        </el-table-column>
        <el-table-column prop="daysWithoutMovement" label="未流动天数" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="row.daysWithoutMovement >= 180 ? 'danger' : row.daysWithoutMovement >= 90 ? 'warning' : 'info'">
              {{ row.daysWithoutMovement }}天
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastMovementDate" label="最后流动日期" width="120" />
        <el-table-column label="建议" width="120">
          <template #default="{ row }">
            <el-tag :type="row.suggestion === '促销' ? 'success' : row.suggestion === '退货' ? 'warning' : 'info'">
              {{ row.suggestion }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handlePromotion(row)"><el-icon><ShoppingCart /></el-icon> 促销</el-button>
            <el-button type="warning" size="small" @click="handleReturn(row)"><el-icon><Refresh /></el-icon> 退货</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, View, ShoppingCart, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ product: '', days: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const deadStockStats = ref([
  { label: '呆滞产品数', value: '86', type: 'warning' },
  { label: '呆滞库存金额', value: 'SAR 2,856,000', type: 'danger' },
  { label: '90天以上呆滞', value: '45', type: 'danger' },
  { label: '建议处理数量', value: '86', type: 'primary' },
])

const tableData = ref([
  { id: 1, product: '旧款iPhone 14', sku: 'IPH-14-128', category: '电子产品', quantity: 50, value: 125000, daysWithoutMovement: 185, lastMovementDate: '2024-05-20', suggestion: '促销' },
  { id: 2, product: '三星 S22 Ultra', sku: 'SGS-S22-U-256', category: '电子产品', quantity: 30, value: 72000, daysWithoutMovement: 120, lastMovementDate: '2024-07-20', suggestion: '促销' },
  { id: 3, product: '冬季外套XL', sku: 'COAT-XL-001', category: '服装鞋帽', quantity: 80, value: 48000, daysWithoutMovement: 210, lastMovementDate: '2024-04-20', suggestion: '退货' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.product = ''; searchForm.days = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleView = (row: any) => { ElMessage.info(`查看产品: ${row.product}`) }
const handlePromotion = (row: any) => { ElMessage.info(`为 ${row.product} 创建促销活动`) }
const handleReturn = (row: any) => { ElMessage.info(`为 ${row.product} 创建退货单`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>