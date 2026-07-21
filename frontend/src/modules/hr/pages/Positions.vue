<!-- 
  文件路径: frontend/src/modules/hr/pages/Positions.vue
  功能: 岗位管理 - 管理公司岗位
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="岗位名称">
              <el-input v-model="searchForm.positionName" placeholder="请输入岗位名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门">
              <el-select v-model="searchForm.department" placeholder="请选择部门" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="销售部" value="销售部" />
                <el-option label="采购部" value="采购部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建岗位</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="岗位名称" />
        <el-table-column prop="department" label="所属部门" width="120" />
        <el-table-column prop="level" label="岗位级别" width="100" />
        <el-table-column prop="salaryRange" label="薪资范围" width="150" />
        <el-table-column prop="headcount" label="编制人数" align="center" />
        <el-table-column prop="currentCount" label="在职人数" align="center" />
        <el-table-column prop="vacancy" label="空缺数" align="center">
          <template #default="{ row }">
            <el-tag :type="row.vacancy > 0 ? 'danger' : 'success'">{{ row.vacancy }}</el-tag>
          </template>
        </el-table-column>
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

const searchForm = reactive({ positionName: '', department: 'all' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, name: '销售经理', department: '销售部', level: '经理级', salaryRange: 'SAR 20,000-30,000', headcount: 5, currentCount: 4, vacancy: 1 },
  { id: 2, name: '销售代表', department: '销售部', level: '员工级', salaryRange: 'SAR 8,000-15,000', headcount: 20, currentCount: 18, vacancy: 2 },
  { id: 3, name: '采购主管', department: '采购部', level: '主管级', salaryRange: 'SAR 15,000-22,000', headcount: 3, currentCount: 3, vacancy: 0 },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.positionName = ''; searchForm.department = 'all' }
const handleCreate = () => { ElMessage.info('新建岗位') }
const handleEdit = (row: any) => { ElMessage.info(`编辑岗位: ${row.name}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除岗位 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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