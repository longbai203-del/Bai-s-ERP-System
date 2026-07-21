<!-- 
  文件路径: frontend/src/modules/production/pages/EquipmentManagement.vue
  功能: 设备管理 - 生产设备管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input v-model="searchForm.equipmentNo" placeholder="请输入设备编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input v-model="searchForm.name" placeholder="请输入设备名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="运行中" value="running" />
                <el-option label="停机" value="stopped" />
                <el-option label="维修中" value="maintenance" />
                <el-option label="闲置" value="idle" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加设备</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="equipmentNo" label="设备编号" width="120" />
        <el-table-column prop="name" label="设备名称" />
        <el-table-column prop="model" label="型号" />
        <el-table-column prop="location" label="位置" width="100" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'running' ? 'success' : row.status === 'idle' ? 'info' : row.status === 'maintenance' ? 'warning' : 'danger'">
              {{ row.status === 'running' ? '运行中' : row.status === 'idle' ? '闲置' : row.status === 'maintenance' ? '维修中' : '停机' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastMaintenance" label="上次维护" width="120" />
        <el-table-column prop="nextMaintenance" label="下次维护" width="120" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleMaintain(row)"><el-icon><Tools /></el-icon> 维护</el-button>
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
import { Search, Plus, View, Tools, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ equipmentNo: '', name: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, equipmentNo: 'EQ-001', name: '注塑机', model: 'INJ-2000', location: '车间A', status: 'running', lastMaintenance: '2024-10-15', nextMaintenance: '2025-01-15' },
  { id: 2, equipmentNo: 'EQ-002', name: 'SMT贴片机', model: 'SMT-1000', location: '车间B', status: 'maintenance', lastMaintenance: '2024-11-01', nextMaintenance: '2024-12-01' },
  { id: 3, equipmentNo: 'EQ-003', name: '组装流水线', model: 'ASM-500', location: '车间A', status: 'running', lastMaintenance: '2024-11-10', nextMaintenance: '2025-02-10' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.equipmentNo = ''; searchForm.name = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('添加设备') }
const handleView = (row: any) => { ElMessage.info(`查看设备: ${row.name}`) }
const handleMaintain = (row: any) => { ElMessage.info(`维护设备: ${row.name}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除设备 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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