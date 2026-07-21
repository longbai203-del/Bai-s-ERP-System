<!-- 
  文件路径: frontend/src/modules/finance/pages/CostCenter.vue
  功能: 成本中心 - 管理成本中心
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="成本中心">
              <el-input v-model="searchForm.costCenter" placeholder="请输入成本中心" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门">
              <el-select v-model="searchForm.department" placeholder="请选择部门" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="销售部" value="销售部" />
                <el-option label="采购部" value="采购部" />
                <el-option label="市场部" value="市场部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增成本中心</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="code" label="编码" width="120" />
        <el-table-column prop="name" label="成本中心名称" />
        <el-table-column prop="department" label="所属部门" width="100" />
        <el-table-column prop="budget" label="预算" align="right">
          <template #default="{ row }">{{ formatCurrency(row.budget) }}</template>
        </el-table-column>
        <el-table-column prop="actual" label="实际" align="right">
          <template #default="{ row }">{{ formatCurrency(row.actual) }}</template>
        </el-table-column>
        <el-table-column prop="variance" label="差异" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.variance >= 0 ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ formatCurrency(row.variance) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="执行率" align="center" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.executionRate" :color="row.executionRate < 80 ? '#67C23A' : '#E6A23C'" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.executionRate < 80 ? 'success' : 'warning'">
              {{ row.executionRate < 80 ? '正常' : '超预算' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleDetail(row)"><el-icon><View /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Edit, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ costCenter: '', department: 'all' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { code: 'CC-001', name: '销售成本中心', department: '销售部', budget: 3000000, actual: 1856000, variance: 1144000, executionRate: 61.9 },
  { code: 'CC-002', name: '采购成本中心', department: '采购部', budget: 2500000, actual: 1987000, variance: 513000, executionRate: 79.5 },
  { code: 'CC-003', name: '市场营销中心', department: '市场部', budget: 2000000, actual: 1765000, variance: 235000, executionRate: 88.3 },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.costCenter = ''; searchForm.department = 'all' }
const handleCreate = () => { ElMessage.info('新增成本中心') }
const handleEdit = (row: any) => { ElMessage.info(`编辑: ${row.name}`) }
const handleDetail = (row: any) => { ElMessage.info(`查看: ${row.name}`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>