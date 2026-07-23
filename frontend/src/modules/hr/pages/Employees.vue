<!-- 
  文件路径: frontend/src/modules/hr/pages/Employees.vue
  功能: 员工管理 - 员工列表与查询
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="员工编号">
              <el-input v-model="searchForm.employeeNo" placeholder="请输入员工编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="部门">
              <el-select v-model="searchForm.department" placeholder="请选择部门" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="销售部" value="销售部" />
                <el-option label="采购部" value="采购部" />
                <el-option label="财务部" value="财务部" />
                <el-option label="运营部" value="运营部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增员工</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in employeeStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-change" :class="stat.trend">{{ stat.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="employeeNo" label="员工编号" width="120" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="position" label="职位" width="120" />
        <el-table-column prop="department" label="部门" width="100" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'probation' ? 'warning' : 'danger'">
              {{ row.status === 'active' ? '在职' : row.status === 'probation' ? '试用期' : '已离职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
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
import {
  Plus,
  Search,
  Refresh,
  View,
  Edit,
  Delete
} from '@element-plus/icons-vue'
// ============================================================
// API 导入
// ============================================================
import {  } from '@/api/modules/hr'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ employeeNo: '', name: '', department: 'all' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const employeeStats = ref([
  { label: '员工总数', value: '286', change: 8.3, trend: 'up', type: 'primary' },
  { label: '在职人数', value: '268', change: 5.2, trend: 'up', type: 'success' },
  { label: '试用期', value: '18', change: -3.5, trend: 'down', type: 'warning' },
  { label: '离职率', value: '4.5%', change: -1.2, trend: 'down', type: 'danger' },
])

const tableData = ref([
  { id: 1, employeeNo: 'EMP-001', name: 'Ahmed Al-Fahd', position: '销售经理', department: '销售部', email: 'ahmed@company.com', phone: '+966 50 123 4567', status: 'active' },
  { id: 2, employeeNo: 'EMP-002', name: 'Mohammed Al-Qahtani', position: '采购主管', department: '采购部', email: 'mohammed@company.com', phone: '+966 50 234 5678', status: 'active' },
  { id: 3, employeeNo: 'EMP-003', name: 'Saud Al-Otaibi', position: '财务总监', department: '财务部', email: 'saud@company.com', phone: '+966 50 345 6789', status: 'active' },
  { id: 4, employeeNo: 'EMP-004', name: 'Faisal Al-Dossary', position: '运营经理', department: '运营部', email: 'faisal@company.com', phone: '+966 50 456 7890', status: 'probation' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.employeeNo = ''; searchForm.name = ''; searchForm.department = 'all' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { ElMessage.info('新增员工') }
const handleView = (row: any) => { ElMessage.info(`查看员工: ${row.name}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑员工: ${row.name}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除员工 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.stat-change { font-size: 12px; }
.stat-change.up { color: #67C23A; }
.stat-change.down { color: #F56C6C; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>
