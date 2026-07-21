<!-- 
  文件路径: frontend/src/modules/inventory/pages/BatchManagement.vue
  功能: 批次管理 - 管理产品批次
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="批次号">
              <el-input v-model="searchForm.batchNo" placeholder="请输入批次号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.product" placeholder="请输入产品名称" clearable />
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

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="batchNo" label="批次号" width="140" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="quantity" label="数量" align="center" width="100" />
        <el-table-column prop="productionDate" label="生产日期" width="120" />
        <el-table-column prop="expiryDate" label="有效期至" width="120">
          <template #default="{ row }">
            <span :style="{ color: isExpiringSoon(row.expiryDate) ? '#F56C6C' : '#303133' }">
              {{ row.expiryDate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'expiring' ? 'warning' : 'danger'">
              {{ row.status === 'active' ? '正常' : row.status === 'expiring' ? '临期' : '过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="warehouse" label="仓库" width="100" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
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
import { Search, View, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ batchNo: '', product: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, batchNo: 'BATCH-2024-001', product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', quantity: 100, productionDate: '2024-10-15', expiryDate: '2026-10-15', status: 'active', warehouse: '利雅得仓库' },
  { id: 2, batchNo: 'BATCH-2024-002', product: '三星 Galaxy S24 Ultra', sku: 'SGS-S24-U-512', quantity: 50, productionDate: '2024-09-20', expiryDate: '2026-09-20', status: 'active', warehouse: '吉达仓库' },
  { id: 3, batchNo: 'BATCH-2024-003', product: 'AirPods Pro 2', sku: 'APP-2-WH', quantity: 80, productionDate: '2024-01-15', expiryDate: '2025-01-15', status: 'expiring', warehouse: '利雅得仓库' },
])

const loading = ref(false)

const isExpiringSoon = (date: string) => {
  const expiry = new Date(date)
  const now = new Date()
  const daysDiff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return daysDiff < 60 && daysDiff > 0
}

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.batchNo = ''; searchForm.product = '' }
const handleView = (row: any) => { ElMessage.info(`查看批次: ${row.batchNo}`) }
const handleDetail = (row: any) => { ElMessage.info(`查看批次明细: ${row.batchNo}`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>