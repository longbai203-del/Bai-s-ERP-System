<!-- 
  文件路径: frontend/src/modules/purchase/pages/SupplierQuotation.vue
  功能: 供应商报价 - 管理供应商报价记录
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="供应商">
              <el-input v-model="searchForm.supplier" placeholder="请输入供应商名称" clearable />
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
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增报价</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="supplier" label="供应商" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="spec" label="规格型号" />
        <el-table-column prop="price" label="报价" align="right">
          <template #default="{ row }">{{ formatCurrency(row.price) }}</template>
        </el-table-column>
        <el-table-column prop="moq" label="最小起订量" align="center" />
        <el-table-column prop="leadTime" label="交货期" align="center" />
        <el-table-column prop="currency" label="币种" align="center" width="80" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '有效' : '过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
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

const searchForm = reactive({ supplier: '', product: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, supplier: 'Apple Supplier', product: 'iPhone 15 Pro Max', spec: '256GB 黑色', price: 4800, moq: 50, leadTime: '15天', currency: 'SAR', status: 'active' },
  { id: 2, supplier: 'Samsung Supplier', product: '三星 Galaxy S24 Ultra', spec: '512GB 黑色', price: 4400, moq: 30, leadTime: '20天', currency: 'SAR', status: 'active' },
  { id: 3, supplier: 'Dell Supplier', product: 'MacBook Pro 16"', spec: 'M3 Pro 36GB', price: 9200, moq: 10, leadTime: '25天', currency: 'SAR', status: 'active' },
  { id: 4, supplier: 'Sony Supplier', product: 'WH-1000XM5', spec: '黑色', price: 1200, moq: 20, leadTime: '10天', currency: 'SAR', status: 'expired' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.supplier = ''; searchForm.product = '' }
const handleCreate = () => { ElMessage.info('新增报价') }
const handleView = (row: any) => { ElMessage.info(`查看报价: ${row.supplier} - ${row.product}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑报价: ${row.supplier} - ${row.product}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.supplier} 的报价吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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