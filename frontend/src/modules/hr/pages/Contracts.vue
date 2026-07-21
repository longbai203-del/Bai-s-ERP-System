<!-- 
  文件路径: frontend/src/modules/hr/pages/Contracts.vue
  功能: 合同管理 - 管理员工合同
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="员工姓名">
              <el-input v-model="searchForm.employee" placeholder="请输入员工姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="有效" value="active" />
                <el-option label="即将到期" value="expiring" />
                <el-option label="已到期" value="expired" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建合同</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="employee" label="员工姓名" />
        <el-table-column prop="contractNo" label="合同编号" width="140" />
        <el-table-column prop="type" label="合同类型" width="100" />
        <el-table-column prop="startDate" label="生效日期" width="120" />
        <el-table-column prop="endDate" label="到期日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'expiring' ? 'warning' : 'danger'">
              {{ row.status === 'active' ? '有效' : row.status === 'expiring' ? '即将到期' : '已到期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleRenew(row)" v-if="row.status === 'expiring'"><el-icon><Refresh /></el-icon> 续签</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ employee: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, employee: 'Ahmed Al-Fahd', contractNo: 'CT-2020-001', type: '全职', startDate: '2020-01-15', endDate: '2025-01-14', status: 'active' },
  { id: 2, employee: 'Mohammed Al-Qahtani', contractNo: 'CT-2020-002', type: '全职', startDate: '2020-03-20', endDate: '2024-03-19', status: 'expiring' },
  { id: 3, employee: 'Saud Al-Otaibi', contractNo: 'CT-2019-003', type: '全职', startDate: '2019-06-10', endDate: '2023-06-09', status: 'expired' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.employee = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建合同') }
const handleView = (row: any) => { ElMessage.info(`查看合同: ${row.contractNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑合同: ${row.contractNo}`) }
const handleRenew = (row: any) => { ElMessage.success(`合同 ${row.contractNo} 已续签`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>