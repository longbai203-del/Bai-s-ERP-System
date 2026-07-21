<!-- 
  文件路径: frontend/src/modules/production/pages/EquipmentMaintenance.vue
  功能: 设备维修 - 设备维修记录
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input v-model="searchForm.equipment" placeholder="请输入设备名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="维修类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="预防性维护" value="preventive" />
                <el-option label="故障维修" value="breakdown" />
                <el-option label="大修" value="overhaul" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建维修</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="maintenanceNo" label="维修编号" width="140" />
        <el-table-column prop="equipment" label="设备名称" />
        <el-table-column prop="type" label="维修类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === 'preventive' ? 'success' : row.type === 'breakdown' ? 'danger' : 'warning'">
              {{ row.type === 'preventive' ? '预防性维护' : row.type === 'breakdown' ? '故障维修' : '大修' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="故障描述" min-width="150" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'processing' ? 'warning' : 'info'">
              {{ row.status === 'pending' ? '待维修' : row.status === 'processing' ? '维修中' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="完成日期" width="120" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleProcess(row)" v-if="row.status === 'pending'"><el-icon><Edit /></el-icon> 处理</el-button>
            <el-button type="success" size="small" @click="handleComplete(row)" v-if="row.status === 'processing'"><el-icon><Check /></el-icon> 完成</el-button>
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

const searchForm = reactive({ equipment: '', type: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, maintenanceNo: 'MT-2024-001', equipment: '注塑机', type: 'preventive', description: '季度保养', status: 'completed', startDate: '2024-11-10', endDate: '2024-11-12' },
  { id: 2, maintenanceNo: 'MT-2024-002', equipment: 'SMT贴片机', type: 'breakdown', description: '贴片头故障', status: 'processing', startDate: '2024-11-18', endDate: '' },
  { id: 3, maintenanceNo: 'MT-2024-003', equipment: '组装流水线', type: 'overhaul', description: '传送带更换', status: 'pending', startDate: '', endDate: '' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.equipment = ''; searchForm.type = '' }
const handleCreate = () => { ElMessage.info('新建维修') }
const handleView = (row: any) => { ElMessage.info(`查看维修: ${row.maintenanceNo}`) }
const handleProcess = (row: any) => { ElMessage.info(`处理维修: ${row.maintenanceNo}`) }
const handleComplete = (row: any) => {
  ElMessageBox.confirm(`确认完成维修 ${row.maintenanceNo}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'completed'; row.endDate = '2024-11-20'; ElMessage.success('维修已完成') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>