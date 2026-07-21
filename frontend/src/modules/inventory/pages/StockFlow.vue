<!-- 
  文件路径: frontend/src/modules/inventory/pages/StockFlow.vue
  功能: 库存流水 - 查看所有库存变动记录
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.product" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="变动类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="采购入库" value="purchase_in" />
                <el-option label="销售出库" value="sales_out" />
                <el-option label="调拨" value="transfer" />
                <el-option label="盘点调整" value="adjustment" />
                <el-option label="退货入库" value="return_in" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="日期范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="id" label="流水号" width="100" />
        <el-table-column prop="product" label="产品名称" min-width="160" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="type" label="变动类型" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" align="center" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.quantity > 0 ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ row.quantity > 0 ? '+' : '' }}{{ row.quantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="beforeQty" label="变动前" align="center" width="80" />
        <el-table-column prop="afterQty" label="变动后" align="center" width="80" />
        <el-table-column prop="reference" label="参考单据" width="140" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="createdAt" label="操作时间" width="160" />
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ product: '', type: '', dateRange: [] as [Date, Date] | [] })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 'FL-001', product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', type: 'purchase_in', quantity: 50, beforeQty: 100, afterQty: 150, reference: 'PO-2024-001', operator: 'Ahmed', createdAt: '2024-11-20 10:30' },
  { id: 'FL-002', product: '三星 Galaxy S24 Ultra', sku: 'SGS-S24-U-512', type: 'sales_out', quantity: -25, beforeQty: 85, afterQty: 60, reference: 'SO-2024-003', operator: 'Mohammed', createdAt: '2024-11-20 10:25' },
  { id: 'FL-003', product: 'MacBook Pro 16"', sku: 'MBP-16-M3-512', type: 'adjustment', quantity: 5, beforeQty: 25, afterQty: 30, reference: 'ADJ-2024-001', operator: 'Saud', createdAt: '2024-11-20 10:20' },
])

const loading = ref(false)

const getTypeTag = (type: string) => {
  const map: Record<string, string> = { purchase_in: 'success', sales_out: 'danger', transfer: 'warning', adjustment: 'info', return_in: 'success' }
  return map[type] || 'info'
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = { purchase_in: '采购入库', sales_out: '销售出库', transfer: '调拨', adjustment: '盘点调整', return_in: '退货入库' }
  return map[type] || type
}

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.product = ''; searchForm.type = ''; searchForm.dateRange = [] }
const handleExport = () => { ElMessage.success('导出完成') }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>