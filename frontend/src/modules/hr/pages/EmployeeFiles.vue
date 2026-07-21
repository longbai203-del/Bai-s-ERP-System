<!-- 
  文件路径: frontend/src/modules/hr/pages/EmployeeFiles.vue
  功能: 员工档案 - 员工档案管理
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
            <el-form-item label="档案类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="个人信息" value="personal" />
                <el-option label="合同" value="contract" />
                <el-option label="薪酬" value="salary" />
                <el-option label="考核" value="performance" />
                <el-option label="培训" value="training" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 上传文件</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="employee" label="员工姓名" />
        <el-table-column prop="fileType" label="档案类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.fileType === 'personal' ? 'primary' : row.fileType === 'contract' ? 'success' : row.fileType === 'salary' ? 'warning' : row.fileType === 'performance' ? 'info' : 'danger'">
              {{ row.fileType === 'personal' ? '个人信息' : row.fileType === 'contract' ? '合同' : row.fileType === 'salary' ? '薪酬' : row.fileType === 'performance' ? '考核' : '培训' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" min-width="180" />
        <el-table-column prop="fileSize" label="文件大小" width="100" />
        <el-table-column prop="uploadDate" label="上传日期" width="160" />
        <el-table-column prop="uploadBy" label="上传人" width="100" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDownload(row)"><el-icon><Download /></el-icon> 下载</el-button>
            <el-button type="warning" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
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
import { Search, Plus, Download, View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ employee: '', type: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, employee: 'Ahmed Al-Fahd', fileType: 'personal', fileName: '员工信息表.pdf', fileSize: '256KB', uploadDate: '2024-11-20 10:30', uploadBy: 'HR Admin' },
  { id: 2, employee: 'Ahmed Al-Fahd', fileType: 'contract', fileName: '劳动合同_2024.pdf', fileSize: '512KB', uploadDate: '2024-11-20 10:32', uploadBy: 'HR Admin' },
  { id: 3, employee: 'Mohammed Al-Qahtani', fileType: 'salary', fileName: '薪资调整表.xlsx', fileSize: '128KB', uploadDate: '2024-11-19 14:20', uploadBy: 'Finance' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.employee = ''; searchForm.type = '' }
const handleCreate = () => { ElMessage.info('上传文件') }
const handleDownload = (row: any) => { ElMessage.success(`正在下载 ${row.fileName}`) }
const handleView = (row: any) => { ElMessage.info(`预览文件: ${row.fileName}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.fileName} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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