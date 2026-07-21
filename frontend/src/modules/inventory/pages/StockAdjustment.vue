<!-- 
  文件路径: frontend/src/modules/inventory/pages/StockAdjustment.vue
  功能: 库存调整 - 管理库存调整单
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="调整单号">
              <el-input v-model="searchForm.adjustNo" placeholder="请输入调整单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="盘盈" value="surplus" />
                <el-option label="盘亏" value="shortage" />
                <el-option label="调整" value="adjust" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建调整</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="adjustNo" label="调整单号" width="140" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="type" label="类型" align="center" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'surplus' ? 'success' : row.type === 'shortage' ? 'danger' : 'warning'">
              {{ row.type === 'surplus' ? '盘盈' : row.type === 'shortage' ? '盘亏' : '调整' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="oldQuantity" label="调整前" align="center" width="80" />
        <el-table-column prop="newQuantity" label="调整后" align="center" width="80">
          <template #default="{ row }">
            <span :style="{ color: row.newQuantity > row.oldQuantity ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ row.newQuantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="difference" label="差异" align="center" width="80">
          <template #default="{ row }">
            <span :style="{ color: row.difference > 0 ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ row.difference > 0 ? '+' : '' }}{{ row.difference }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" min-width="120" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="createdAt" label="日期" width="160" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
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
import { Search, Plus, View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ adjustNo: '', type: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, adjustNo: 'SA-2024-001', product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', type: 'surplus', oldQuantity: 150, newQuantity: 155, difference: 5, reason: '盘点盘盈', operator: 'Ahmed', createdAt: '2024-11-20 10:30' },
  { id: 2, adjustNo: 'SA-2024-002', product: '三星 Galaxy S24 Ultra', sku: 'SGS-S24-U-512', type: 'shortage', oldQuantity: 85, newQuantity: 80, difference: -5, reason: '盘点盘亏', operator: 'Mohammed', createdAt: '2024-11-19 14:20' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.adjustNo = ''; searchForm.type = '' }
const handleCreate = () => { ElMessage.info('新建调整') }
const handleView = (row: any) => { ElMessage.info(`查看调整: ${row.adjustNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除调整 ${row.adjustNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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