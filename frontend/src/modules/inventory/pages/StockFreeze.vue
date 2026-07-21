<!-- 
  文件路径: frontend/src/modules/inventory/pages/StockFreeze.vue
  功能: 库存冻结 - 管理库存冻结/锁定
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
            <el-form-item label="冻结类型">
              <el-select v-model="searchForm.freezeType" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="质量问题" value="quality" />
                <el-option label="盘点冻结" value="count" />
                <el-option label="订单预留" value="reserved" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增冻结</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="quantity" label="冻结数量" align="center" width="100">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.quantity }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="freezeType" label="冻结类型" width="120" />
        <el-table-column prop="reason" label="原因" min-width="150" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="freezeDate" label="冻结日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'danger' : 'success'">
              {{ row.status === 'active' ? '已冻结' : '已解冻' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleUnfreeze(row)" v-if="row.status === 'active'"><el-icon><Unlock /></el-icon> 解冻</el-button>
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
import { Search, Plus, View, Unlock, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ product: '', freezeType: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', quantity: 20, freezeType: '质量问题', reason: '批量屏幕缺陷', operator: 'Ahmed', freezeDate: '2024-11-20', status: 'active' },
  { id: 2, product: '三星 Galaxy S24 Ultra', sku: 'SGS-S24-U-512', quantity: 10, freezeType: '盘点冻结', reason: '年度盘点中', operator: 'Mohammed', freezeDate: '2024-11-18', status: 'active' },
  { id: 3, product: 'MacBook Pro 16"', sku: 'MBP-16-M3-512', quantity: 5, freezeType: '订单预留', reason: '客户订单预留', operator: 'Saud', freezeDate: '2024-11-15', status: 'active' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.product = ''; searchForm.freezeType = '' }
const handleCreate = () => { ElMessage.info('新增冻结') }
const handleView = (row: any) => { ElMessage.info(`查看冻结: ${row.product}`) }
const handleUnfreeze = (row: any) => {
  ElMessageBox.confirm(`确定要解冻 ${row.product} 吗？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => ElMessage.success('解冻成功')).catch(() => {})
}
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除冻结记录吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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