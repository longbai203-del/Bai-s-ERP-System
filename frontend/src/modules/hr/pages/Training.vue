<!-- 
  文件路径: frontend/src/modules/hr/pages/Training.vue
  功能: 培训管理 - 管理员工培训
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="培训名称">
              <el-input v-model="searchForm.trainingName" placeholder="请输入培训名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="计划中" value="planned" />
                <el-option label="进行中" value="ongoing" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建培训</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="培训名称" />
        <el-table-column prop="trainer" label="培训师" />
        <el-table-column prop="participants" label="参与人数" align="center" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'ongoing' ? 'warning' : 'info'">
              {{ row.status === 'planned' ? '计划中' : row.status === 'ongoing' ? '进行中' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleComplete(row)" v-if="row.status === 'ongoing'"><el-icon><Check /></el-icon> 完成</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ trainingName: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, name: '领导力培训', trainer: 'Dr. Khalid', participants: 25, startDate: '2024-11-01', endDate: '2024-11-15', status: 'ongoing' },
  { id: 2, name: '销售技能培训', trainer: 'Ahmed Al-Fahd', participants: 30, startDate: '2024-10-20', endDate: '2024-10-25', status: 'completed' },
  { id: 3, name: '财务合规培训', trainer: 'Saud Al-Otaibi', participants: 15, startDate: '2024-12-01', endDate: '2024-12-05', status: 'planned' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.trainingName = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建培训') }
const handleView = (row: any) => { ElMessage.info(`查看培训: ${row.name}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑培训: ${row.name}`) }
const handleComplete = (row: any) => {
  ElMessageBox.confirm(`确认完成培训 "${row.name}"？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'completed'; ElMessage.success('培训已完成') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>