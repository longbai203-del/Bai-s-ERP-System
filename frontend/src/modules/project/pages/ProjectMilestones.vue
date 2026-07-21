<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectMilestones.vue
  功能: 里程碑 - 项目里程碑管理
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
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建里程碑</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="milestoneNo" label="里程碑编号" width="140" />
        <el-table-column prop="name" label="里程碑名称" min-width="160" />
        <el-table-column prop="project" label="所属项目" />
        <el-table-column prop="targetDate" label="目标日期" width="120" />
        <el-table-column prop="actualDate" label="实际日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'achieved' ? 'success' : row.status === 'active' ? 'warning' : 'info'">
              {{ row.status === 'pending' ? '待达成' : row.status === 'active' ? '进行中' : '已达成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleAchieve(row)" v-if="row.status !== 'achieved'"><el-icon><Check /></el-icon> 达成</el-button>
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

const searchForm = reactive({ project: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, milestoneNo: 'MS-001', name: '项目启动', project: 'STC 5G网络升级', targetDate: '2024-08-01', actualDate: '2024-08-01', status: 'achieved' },
  { id: 2, milestoneNo: 'MS-002', name: '需求确认', project: 'STC 5G网络升级', targetDate: '2024-08-15', actualDate: '2024-08-12', status: 'achieved' },
  { id: 3, milestoneNo: 'MS-003', name: '系统上线', project: 'STC 5G网络升级', targetDate: '2024-12-20', actualDate: '', status: 'active' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.project = '' }
const handleCreate = () => { ElMessage.info('新建里程碑') }
const handleView = (row: any) => { ElMessage.info(`查看里程碑: ${row.name}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑里程碑: ${row.name}`) }
const handleAchieve = (row: any) => {
  ElMessageBox.confirm(`确认达成里程碑 ${row.name}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'achieved'; row.actualDate = '2024-11-20'; ElMessage.success('里程碑已达成') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>