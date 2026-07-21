<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectDocuments.vue
  功能: 文档管理 - 项目文档管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="项目">
              <el-select v-model="searchForm.project" placeholder="请选择项目" style="width: 100%" filterable>
                <el-option label="STC 5G网络升级" value="STC 5G网络升级" />
                <el-option label="阿尔拉吉银行核心系统" value="阿尔拉吉银行核心系统" />
                <el-option label="沙特阿美数据中心建设" value="沙特阿美数据中心建设" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="文档类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="需求文档" value="requirement" />
                <el-option label="设计文档" value="design" />
                <el-option label="测试文档" value="test" />
                <el-option label="用户手册" value="manual" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleUpload" style="float: right"><el-icon><Upload /></el-icon> 上传文档</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="docNo" label="文档编号" width="120" />
        <el-table-column prop="name" label="文档名称" min-width="180" />
        <el-table-column prop="type" label="文档类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'requirement' ? 'primary' : row.type === 'design' ? 'success' : row.type === 'test' ? 'warning' : 'info'">
              {{ row.type === 'requirement' ? '需求' : row.type === 'design' ? '设计' : row.type === 'test' ? '测试' : row.type === 'manual' ? '手册' : '其他' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" align="center" width="80" />
        <el-table-column prop="size" label="大小" width="100" />
        <el-table-column prop="uploadBy" label="上传人" width="100" />
        <el-table-column prop="uploadDate" label="上传日期" width="160" />
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
import { Search, Upload, Download, View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ project: '', type: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, docNo: 'DOC-001', name: '项目需求规格说明书', type: 'requirement', version: 'V2.0', size: '2.5MB', uploadBy: 'Ahmed Al-Fahd', uploadDate: '2024-08-15 10:30' },
  { id: 2, docNo: 'DOC-002', name: '系统架构设计文档', type: 'design', version: 'V1.0', size: '4.8MB', uploadBy: 'Mohammed Al-Qahtani', uploadDate: '2024-09-15 14:20' },
  { id: 3, docNo: 'DOC-003', name: '用户操作手册', type: 'manual', version: 'V0.1', size: '1.2MB', uploadBy: 'Saud Al-Otaibi', uploadDate: '2024-11-10 09:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.project = ''; searchForm.type = '' }
const handleUpload = () => { ElMessage.info('上传文档') }
const handleDownload = (row: any) => { ElMessage.success(`正在下载 ${row.name}`) }
const handleView = (row: any) => { ElMessage.info(`预览文档: ${row.name}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除文档 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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