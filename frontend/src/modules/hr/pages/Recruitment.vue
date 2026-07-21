<!-- 
  文件路径: frontend/src/modules/hr/pages/Recruitment.vue
  功能: 招聘管理 - 管理招聘流程
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="职位">
              <el-input v-model="searchForm.position" placeholder="请输入职位" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="招聘中" value="active" />
                <el-option label="已关闭" value="closed" />
                <el-option label="已暂停" value="paused" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 发布职位</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="position" label="职位名称" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="applicants" label="应聘人数" align="center" />
        <el-table-column prop="interviewed" label="已面试" align="center" />
        <el-table-column prop="offered" label="已发Offer" align="center" />
        <el-table-column prop="hired" label="已录用" align="center" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'paused' ? 'warning' : 'info'">
              {{ row.status === 'active' ? '招聘中' : row.status === 'paused' ? '已暂停' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止日期" width="120" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleCandidates(row)"><el-icon><User /></el-icon> 候选人</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ position: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, position: '销售经理', department: '销售部', applicants: 45, interviewed: 18, offered: 3, hired: 2, status: 'active', deadline: '2024-12-31' },
  { id: 2, position: '采购专员', department: '采购部', applicants: 32, interviewed: 12, offered: 2, hired: 1, status: 'active', deadline: '2024-12-15' },
  { id: 3, position: '财务分析师', department: '财务部', applicants: 28, interviewed: 8, offered: 1, hired: 1, status: 'closed', deadline: '2024-11-30' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.position = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('发布职位') }
const handleView = (row: any) => { ElMessage.info(`查看职位: ${row.position}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑职位: ${row.position}`) }
const handleCandidates = (row: any) => { ElMessage.info(`查看 ${row.position} 候选人`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>