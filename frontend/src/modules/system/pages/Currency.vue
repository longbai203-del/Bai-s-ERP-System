<!-- 
  文件路径: frontend/src/modules/system/pages/Currency.vue
  功能: 币种管理 - 管理币种与汇率
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="币种代码">
              <el-input v-model="searchForm.code" placeholder="请输入币种代码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="币种名称">
              <el-input v-model="searchForm.name" placeholder="请输入币种名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加币种</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="code" label="币种代码" width="100" />
        <el-table-column prop="name" label="币种名称" />
        <el-table-column prop="symbol" label="符号" align="center" width="80">
          <template #default="{ row }">
            <span style="font-size: 18px; font-weight: 700;">{{ row.symbol }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="汇率 (SAR)" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.code === 'SAR' ? '#409EFF' : '#303133', fontWeight: row.code === 'SAR' ? 700 : 400 }">
              {{ row.rate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="decimalPlaces" label="小数位" align="center" width="100" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleUpdateRate(row)"><el-icon><Refresh /></el-icon> 更新汇率</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Edit, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ code: '', name: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, code: 'SAR', name: '沙特里亚尔', symbol: '﷼', rate: 1.0000, decimalPlaces: 2, status: 'active' },
  { id: 2, code: 'USD', name: '美元', symbol: '$', rate: 3.7500, decimalPlaces: 2, status: 'active' },
  { id: 3, code: 'EUR', name: '欧元', symbol: '€', rate: 4.0800, decimalPlaces: 2, status: 'active' },
  { id: 4, code: 'GBP', name: '英镑', symbol: '£', rate: 4.7500, decimalPlaces: 2, status: 'active' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.code = ''; searchForm.name = '' }
const handleCreate = () => { ElMessage.info('添加币种') }
const handleEdit = (row: any) => { ElMessage.info(`编辑币种: ${row.name}`) }
const handleUpdateRate = (row: any) => { ElMessage.success(`${row.code} 汇率已更新`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>