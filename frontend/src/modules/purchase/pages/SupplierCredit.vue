<!-- 
  文件路径: frontend/src/modules/purchase/pages/SupplierCredit.vue
  功能: 供应商信用 - 管理供应商信用额度
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
            <el-form-item label="信用等级">
              <el-select v-model="searchForm.creditLevel" placeholder="请选择等级" clearable style="width: 100%">
                <el-option label="A级" value="A" />
                <el-option label="B级" value="B" />
                <el-option label="C级" value="C" />
                <el-option label="D级" value="D" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 设置信用</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="supplier" label="供应商名称" />
        <el-table-column prop="creditLevel" label="信用等级" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.creditLevel === 'A' ? 'success' : row.creditLevel === 'B' ? 'primary' : row.creditLevel === 'C' ? 'warning' : 'danger'">
              {{ row.creditLevel }}级
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creditLimit" label="信用额度" align="right">
          <template #default="{ row }">{{ formatCurrency(row.creditLimit) }}</template>
        </el-table-column>
        <el-table-column prop="usedAmount" label="已使用" align="right">
          <template #default="{ row }">{{ formatCurrency(row.usedAmount) }}</template>
        </el-table-column>
        <el-table-column prop="available" label="可用额度" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.available > 0 ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ formatCurrency(row.available) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="使用率" align="center" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.usageRate" :color="row.usageRate < 70 ? '#67C23A' : row.usageRate < 90 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.usageRate < 70 ? 'success' : row.usageRate < 90 ? 'warning' : 'danger'">
              {{ row.usageRate < 70 ? '正常' : row.usageRate < 90 ? '预警' : '超限' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon> 调整</el-button>
            <el-button type="warning" size="small" @click="handleHistory(row)"><el-icon><Document /></el-icon> 记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Edit, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ supplier: '', creditLevel: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { supplier: 'Apple Supplier', creditLevel: 'A', creditLimit: 5000000, usedAmount: 2856000, available: 2144000, usageRate: 57.1 },
  { supplier: 'Samsung Supplier', creditLevel: 'B', creditLimit: 3000000, usedAmount: 1987000, available: 1013000, usageRate: 66.2 },
  { supplier: 'Dell Supplier', creditLevel: 'B', creditLimit: 2000000, usedAmount: 1765000, available: 235000, usageRate: 88.3 },
  { supplier: 'Sony Supplier', creditLevel: 'C', creditLimit: 1500000, usedAmount: 1450000, available: 50000, usageRate: 96.7 },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.supplier = ''; searchForm.creditLevel = '' }
const handleCreate = () => { ElMessage.info('设置信用') }
const handleEdit = (row: any) => { ElMessage.info(`调整 ${row.supplier} 信用额度`) }
const handleHistory = (row: any) => { ElMessage.info(`查看 ${row.supplier} 信用记录`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>