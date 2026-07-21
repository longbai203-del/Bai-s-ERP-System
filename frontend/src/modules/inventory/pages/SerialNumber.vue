<!-- 
  文件路径: frontend/src/modules/inventory/pages/SerialNumber.vue
  功能: 序列号管理 - 管理产品序列号
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="序列号">
              <el-input v-model="searchForm.sn" placeholder="请输入序列号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.product" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="在库" value="in_stock" />
                <el-option label="已售" value="sold" />
                <el-option label="维修中" value="repair" />
                <el-option label="已报废" value="scrap" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 录入序列号</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="serialNumber" label="序列号" width="180" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="batchNo" label="批次号" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'in_stock' ? 'success' : row.status === 'sold' ? 'info' : row.status === 'repair' ? 'warning' : 'danger'">
              {{ row.status === 'in_stock' ? '在库' : row.status === 'sold' ? '已售' : row.status === 'repair' ? '维修中' : '已报废' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="warehouse" label="仓库" width="100" />
        <el-table-column prop="createdAt" label="录入日期" width="160" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Plus, View, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ sn: '', product: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, serialNumber: 'SN-2024-0001', product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', batchNo: 'BATCH-2024-001', status: 'in_stock', warehouse: '利雅得仓库', createdAt: '2024-11-20 10:30' },
  { id: 2, serialNumber: 'SN-2024-0002', product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', batchNo: 'BATCH-2024-001', status: 'sold', warehouse: '-', createdAt: '2024-11-19 14:20' },
  { id: 3, serialNumber: 'SN-2024-0003', product: 'MacBook Pro 16"', sku: 'MBP-16-M3-512', batchNo: 'BATCH-2024-002', status: 'repair', warehouse: '吉达仓库', createdAt: '2024-11-18 09:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.sn = ''; searchForm.product = ''; searchForm.status = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { ElMessage.info('录入序列号') }
const handleView = (row: any) => { ElMessage.info(`查看序列号: ${row.serialNumber}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑序列号: ${row.serialNumber}`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>