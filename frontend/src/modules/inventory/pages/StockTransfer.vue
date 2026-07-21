<!-- 
  文件路径: frontend/src/modules/inventory/pages/StockTransfer.vue
  功能: 库存调拨 - 管理仓库间库存调拨
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="调拨单号">
              <el-input v-model="searchForm.transferNo" placeholder="请输入调拨单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待审核" value="pending" />
                <el-option label="进行中" value="processing" />
                <el-option label="已完成" value="completed" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建调拨</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="transferNo" label="调拨单号" width="140" />
        <el-table-column prop="fromWarehouse" label="源仓库" width="120" />
        <el-table-column prop="toWarehouse" label="目标仓库" width="120" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="quantity" label="数量" align="center" width="80" />
        <el-table-column prop="totalValue" label="调拨金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.totalValue) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'processing' ? 'warning' : row.status === 'pending' ? 'info' : 'danger'">
              {{ row.status === 'pending' ? '待审核' : row.status === 'processing' ? '进行中' : row.status === 'completed' ? '已完成' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ transferNo: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, transferNo: 'ST-2024-001', fromWarehouse: '利雅得仓库', toWarehouse: '吉达仓库', product: 'iPhone 15 Pro Max', quantity: 30, totalValue: 156000, status: 'completed', createdAt: '2024-11-20 10:30' },
  { id: 2, transferNo: 'ST-2024-002', fromWarehouse: '达曼仓库', toWarehouse: '利雅得仓库', product: 'MacBook Pro 16"', quantity: 15, totalValue: 147000, status: 'processing', createdAt: '2024-11-19 14:20' },
  { id: 3, transferNo: 'ST-2024-003', fromWarehouse: '吉达仓库', toWarehouse: '达曼仓库', product: 'iPad Pro 12.9"', quantity: 20, totalValue: 124000, status: 'pending', createdAt: '2024-11-18 09:00' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.transferNo = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建调拨单') }
const handleView = (row: any) => { ElMessage.info(`查看调拨单: ${row.transferNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑调拨单: ${row.transferNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除调拨单 ${row.transferNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>