<!-- 
  文件路径: frontend/src/modules/hr/pages/Attendance.vue
  功能: 考勤管理 - 管理员工考勤记录
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
            <el-form-item label="月份">
              <el-date-picker v-model="searchForm.month" type="month" placeholder="选择月份" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 考勤统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in attendanceStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="employeeNo" label="工号" width="120" />
        <el-table-column prop="workDays" label="出勤天数" align="center" />
        <el-table-column prop="absentDays" label="缺勤天数" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.absentDays > 2 ? '#F56C6C' : '#303133' }">{{ row.absentDays }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lateDays" label="迟到天数" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.lateDays > 3 ? '#E6A23C' : '#303133' }">{{ row.lateDays }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overtime" label="加班时长" align="center" />
        <el-table-column prop="attendanceRate" label="出勤率" align="center" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.attendanceRate" :color="row.attendanceRate >= 95 ? '#67C23A' : row.attendanceRate >= 85 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)"><el-icon><View /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ name: '', month: new Date() })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const attendanceStats = ref([
  { label: '总出勤天数', value: '5,720', type: 'primary' },
  { label: '缺勤天数', value: '86', type: 'danger' },
  { label: '迟到次数', value: '142', type: 'warning' },
  { label: '加班总时长', value: '856h', type: 'success' },
])

const tableData = ref([
  { id: 1, name: 'Ahmed Al-Fahd', employeeNo: 'EMP-001', workDays: 22, absentDays: 0, lateDays: 1, overtime: '12h', attendanceRate: 100 },
  { id: 2, name: 'Mohammed Al-Qahtani', employeeNo: 'EMP-002', workDays: 20, absentDays: 1, lateDays: 2, overtime: '8h', attendanceRate: 95 },
  { id: 3, name: 'Saud Al-Otaibi', employeeNo: 'EMP-003', workDays: 18, absentDays: 2, lateDays: 3, overtime: '5h', attendanceRate: 86 },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleDetail = (row: any) => { ElMessage.info(`查看 ${row.name} 考勤详情`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>