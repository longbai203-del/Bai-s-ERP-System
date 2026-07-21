<!-- 
  文件路径: frontend/src/modules/production/pages/ProductionPlan.vue
  功能: 生产计划 - 管理生产计划
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="计划编号">
              <el-input v-model="searchForm.planNo" placeholder="请输入计划编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="已发布" value="published" />
                <el-option label="执行中" value="executing" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建计划</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="planNo" label="计划编号" width="140" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="period" label="计划周期" width="120" />
        <el-table-column prop="plannedQuantity" label="计划产量" align="center" />
        <el-table-column prop="actualQuantity" label="实际产量" align="center" />
        <el-table-column label="完成率" align="center" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.completionRate" :color="row.completionRate === 100 ? '#67C23A' : '#409EFF'" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'executing' ? 'warning' : row.status === 'published' ? 'primary' : 'info'">
              {{ row.status === 'draft' ? '草稿' : row.status === 'published' ? '已发布' : row.status === 'executing' ? '执行中' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handlePublish(row)" v-if="row.status === 'draft'"><el-icon><Share /></el-icon> 发布</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Share } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ planNo: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, planNo: 'PP-2024-001', product: 'iPhone 15 Pro Max', period: '2024-11', plannedQuantity: 5000, actualQuantity: 3800, completionRate: 76, status: 'executing' },
  { id: 2, planNo: 'PP-2024-002', product: '三星 Galaxy S24 Ultra', period: '2024-11', plannedQuantity: 3000, actualQuantity: 0, completionRate: 0, status: 'published' },
  { id: 3, planNo: 'PP-2024-003', product: 'MacBook Pro 16"', period: '2024-10', plannedQuantity: 1500, actualQuantity: 1500, completionRate: 100, status: 'completed' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.planNo = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建计划') }
const handleView = (row: any) => { ElMessage.info(`查看计划: ${row.planNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑计划: ${row.planNo}`) }
const handlePublish = (row: any) => {
  ElMessageBox.confirm(`确认发布计划 ${row.planNo}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'published'; ElMessage.success('计划已发布') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>