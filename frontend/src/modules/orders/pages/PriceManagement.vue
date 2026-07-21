<!-- 
  文件路径: frontend/src/modules/orders/pages/PriceManagement.vue
  功能: 价格管理 - 管理产品价格策略
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
            <el-form-item label="价格类型">
              <el-select v-model="searchForm.priceType" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="标准价" value="standard" />
                <el-option label="促销价" value="promotion" />
                <el-option label="会员价" value="member" />
                <el-option label="批发价" value="wholesale" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建价格</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" width="150" />
        <el-table-column prop="standardPrice" label="标准价" align="right">
          <template #default="{ row }">{{ formatCurrency(row.standardPrice) }}</template>
        </el-table-column>
        <el-table-column prop="promotionPrice" label="促销价" align="right">
          <template #default="{ row }">{{ formatCurrency(row.promotionPrice) }}</template>
        </el-table-column>
        <el-table-column prop="memberPrice" label="会员价" align="right">
          <template #default="{ row }">{{ formatCurrency(row.memberPrice) }}</template>
        </el-table-column>
        <el-table-column prop="wholesalePrice" label="批发价" align="right">
          <template #default="{ row }">{{ formatCurrency(row.wholesalePrice) }}</template>
        </el-table-column>
        <el-table-column prop="effectiveDate" label="生效日期" width="120" />
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

const searchForm = reactive({ product: '', priceType: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', standardPrice: 5200, promotionPrice: 4800, memberPrice: 4900, wholesalePrice: 4500, effectiveDate: '2024-01-01' },
  { id: 2, product: '三星 Galaxy S24 Ultra', sku: 'SGS-S24-U-512', standardPrice: 4800, promotionPrice: 4400, memberPrice: 4500, wholesalePrice: 4100, effectiveDate: '2024-01-01' },
  { id: 3, product: 'MacBook Pro 16"', sku: 'MBP-16-M3-512', standardPrice: 9800, promotionPrice: 9200, memberPrice: 9300, wholesalePrice: 8800, effectiveDate: '2024-01-01' },
  { id: 4, product: 'iPad Pro 12.9"', sku: 'IPP-129-M2-256', standardPrice: 6200, promotionPrice: 5800, memberPrice: 5900, wholesalePrice: 5500, effectiveDate: '2024-01-01' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.product = ''; searchForm.priceType = '' }
const handleCreate = () => { ElMessage.info('新建价格') }
const handleEdit = (row: any) => { ElMessage.info(`编辑价格: ${row.product}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.product} 的价格吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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