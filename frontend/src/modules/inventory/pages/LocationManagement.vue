<!-- 
  文件路径: frontend/src/modules/inventory/pages/LocationManagement.vue
  功能: 货位管理 - 管理仓库货位
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="货位编码">
              <el-input v-model="searchForm.locationCode" placeholder="请输入货位编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="区域">
              <el-select v-model="searchForm.area" placeholder="请选择区域" clearable style="width: 100%">
                <el-option label="A区" value="A" />
                <el-option label="B区" value="B" />
                <el-option label="C区" value="C" />
                <el-option label="D区" value="D" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="可用" value="available" />
                <el-option label="占用" value="occupied" />
                <el-option label="维护中" value="maintenance" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增货位</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="code" label="货位编码" width="120" />
        <el-table-column prop="area" label="区域" width="80" />
        <el-table-column prop="row" label="排" width="60" />
        <el-table-column prop="column" label="列" width="60" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="capacity" label="容量" align="center" />
        <el-table-column prop="currentUsage" label="当前占用" align="center" />
        <el-table-column label="使用率" align="center" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.usageRate" :color="row.usageRate < 70 ? '#67C23A' : row.usageRate < 90 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'available' ? 'success' : row.status === 'occupied' ? 'warning' : 'danger'">
              {{ row.status === 'available' ? '可用' : row.status === 'occupied' ? '占用' : '维护中' }}
            </el-tag>
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

const searchForm = reactive({ locationCode: '', area: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, code: 'LOC-A01', area: 'A', row: '1', column: '1', type: '标准货架', capacity: 200, currentUsage: 156, usageRate: 78, status: 'occupied' },
  { id: 2, code: 'LOC-A02', area: 'A', row: '1', column: '2', type: '标准货架', capacity: 200, currentUsage: 89, usageRate: 44.5, status: 'available' },
  { id: 3, code: 'LOC-B01', area: 'B', row: '2', column: '1', type: '重型货架', capacity: 100, currentUsage: 34, usageRate: 34, status: 'available' },
  { id: 4, code: 'LOC-C01', area: 'C', row: '3', column: '1', type: '冷库', capacity: 50, currentUsage: 12, usageRate: 24, status: 'maintenance' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.locationCode = ''; searchForm.area = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新增货位') }
const handleEdit = (row: any) => { ElMessage.info(`编辑货位: ${row.code}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除货位 ${row.code} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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