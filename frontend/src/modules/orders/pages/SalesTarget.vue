<!-- 
  文件路径: frontend/src/modules/orders/pages/SalesTarget.vue
  功能: 销售目标 - 管理销售目标与完成情况
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="年份">
              <el-select v-model="searchForm.year" placeholder="请选择年份" style="width: 100%">
                <el-option label="2024" value="2024" />
                <el-option label="2025" value="2025" />
                <el-option label="2026" value="2026" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售员">
              <el-select v-model="searchForm.salesperson" placeholder="请选择销售员" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="Ahmed Al-Fahd" value="ahmed" />
                <el-option label="Mohammed Al-Qahtani" value="mohammed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 设置目标</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="salesperson" label="销售员" />
        <el-table-column prop="annualTarget" label="年度目标" align="right">
          <template #default="{ row }">{{ formatCurrency(row.annualTarget) }}</template>
        </el-table-column>
        <el-table-column prop="actualSales" label="实际完成" align="right">
          <template #default="{ row }">{{ formatCurrency(row.actualSales) }}</template>
        </el-table-column>
        <el-table-column label="完成率" align="center" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.completionRate" :color="row.completionRate >= 90 ? '#67C23A' : row.completionRate >= 70 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column prop="q1" label="Q1" align="right">
          <template #default="{ row }">{{ formatCurrency(row.q1) }}</template>
        </el-table-column>
        <el-table-column prop="q2" label="Q2" align="right">
          <template #default="{ row }">{{ formatCurrency(row.q2) }}</template>
        </el-table-column>
        <el-table-column prop="q3" label="Q3" align="right">
          <template #default="{ row }">{{ formatCurrency(row.q3) }}</template>
        </el-table-column>
        <el-table-column prop="q4" label="Q4" align="right">
          <template #default="{ row }">{{ formatCurrency(row.q4) }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ year: '2024', salesperson: 'all' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { salesperson: 'Ahmed Al-Fahd', annualTarget: 5000000, actualSales: 4856000, completionRate: 97.1, q1: 1200000, q2: 1300000, q3: 1150000, q4: 1206000 },
  { salesperson: 'Mohammed Al-Qahtani', annualTarget: 4000000, actualSales: 3568000, completionRate: 89.2, q1: 900000, q2: 950000, q3: 850000, q4: 868000 },
  { salesperson: 'Saud Al-Otaibi', annualTarget: 3500000, actualSales: 3234000, completionRate: 92.4, q1: 800000, q2: 850000, q3: 780000, q4: 804000 },
  { salesperson: 'Faisal Al-Dossary', annualTarget: 3000000, actualSales: 2587000, completionRate: 86.2, q1: 650000, q2: 700000, q3: 600000, q4: 637000 },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.salesperson = 'all' }
const handleCreate = () => { ElMessage.info('设置目标') }
const handleEdit = (row: any) => { ElMessage.info(`编辑 ${row.salesperson} 的目标`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>