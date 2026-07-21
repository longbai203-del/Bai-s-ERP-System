<!-- 
  文件路径: frontend/src/modules/hr/pages/Onboarding.vue
  功能: 入职管理 - 管理新员工入职流程
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待入职" value="pending" />
                <el-option label="办理中" value="processing" />
                <el-option label="已入职" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增入职</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in onboardingStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="position" label="职位" />
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="startDate" label="入职日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'processing' ? 'warning' : 'info'">
              {{ row.status === 'pending' ? '待入职' : row.status === 'processing' ? '办理中' : '已入职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度" align="center" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :color="row.progress === 100 ? '#67C23A' : '#409EFF'" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleProcess(row)" v-if="row.status !== 'completed'"><el-icon><Edit /></el-icon> 办理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ name: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const onboardingStats = ref([
  { label: '待入职', value: '12', type: 'info' },
  { label: '办理中', value: '8', type: 'warning' },
  { label: '本月已入职', value: '18', type: 'success' },
  { label: '入职完成率', value: '85%', type: 'primary' },
])

const tableData = ref([
  { id: 1, name: 'Abdullah Al-Shammari', position: '销售代表', department: '销售部', startDate: '2024-12-01', status: 'pending', progress: 20 },
  { id: 2, name: 'Nasser Al-Harbi', position: '采购专员', department: '采购部', startDate: '2024-11-25', status: 'processing', progress: 60 },
  { id: 3, name: 'Sultan Al-Mutairi', position: '财务助理', department: '财务部', startDate: '2024-11-20', status: 'completed', progress: 100 },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新增入职') }
const handleView = (row: any) => { ElMessage.info(`查看入职: ${row.name}`) }
const handleProcess = (row: any) => { ElMessage.info(`办理入职: ${row.name}`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.info { border-left: 4px solid #909399; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>