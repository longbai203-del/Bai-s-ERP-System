<!-- 
  文件路径: frontend/src/modules/inventory/pages/SafetyStock.vue
  功能: 安全库存 - 管理安全库存设置
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
            <el-form-item label="分类">
              <el-select v-model="searchForm.category" placeholder="请选择分类" clearable style="width: 100%">
                <el-option label="电子产品" value="electronics" />
                <el-option label="服装鞋帽" value="clothing" />
                <el-option label="食品饮料" value="food" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 设置安全库存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="safetyStock" label="安全库存" align="center" width="100">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #409EFF;">{{ row.safetyStock }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reorderPoint" label="补货点" align="center" width="100" />
        <el-table-column prop="maxStock" label="最大库存" align="center" width="100" />
        <el-table-column prop="avgDailyUsage" label="日均消耗" align="center" width="100" />
        <el-table-column prop="leadTime" label="采购周期(天)" align="center" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
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
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ product: '', category: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', category: '电子产品', safetyStock: 50, reorderPoint: 40, maxStock: 200, avgDailyUsage: 15, leadTime: 7 },
  { id: 2, product: '三星 Galaxy S24 Ultra', sku: 'SGS-S24-U-512', category: '电子产品', safetyStock: 40, reorderPoint: 30, maxStock: 150, avgDailyUsage: 10, leadTime: 10 },
  { id: 3, product: 'MacBook Pro 16"', sku: 'MBP-16-M3-512', category: '电子产品', safetyStock: 30, reorderPoint: 20, maxStock: 100, avgDailyUsage: 5, leadTime: 14 },
  { id: 4, product: 'AirPods Pro 2', sku: 'APP-2-WH', category: '电子产品', safetyStock: 30, reorderPoint: 25, maxStock: 120, avgDailyUsage: 8, leadTime: 5 },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.product = ''; searchForm.category = '' }
const handleCreate = () => { ElMessage.info('设置安全库存') }
const handleEdit = (row: any) => { ElMessage.info(`编辑 ${row.product} 安全库存`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.product} 的安全库存设置吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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