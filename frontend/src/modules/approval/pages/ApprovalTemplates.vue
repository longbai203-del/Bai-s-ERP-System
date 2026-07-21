<!-- 
  文件路径: frontend/src/modules/approval/pages/ApprovalTemplates.vue
  功能: 审批模板 - 管理审批流程模板
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="模板名称">
              <el-input v-model="searchForm.name" placeholder="请输入模板名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建模板</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="模板名称" />
        <el-table-column prop="type" label="适用类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'purchase' ? 'primary' : row.type === 'payment' ? 'warning' : row.type === 'leave' ? 'success' : 'info'">
              {{ row.type === 'purchase' ? '采购' : row.type === 'payment' ? '付款' : row.type === 'leave' ? '请假' : row.type === 'expense' ? '费用' : '合同' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="steps" label="审批步骤" width="200">
          <template #default="{ row }">
            <el-tag v-for="step in row.steps" :key="step" size="small" style="margin: 2px;">{{ step }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleUse(row)"><el-icon><Check /></el-icon> 使用</el-button>
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
import { Search, Plus, Edit, Check, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, name: '采购审批流程', type: 'purchase', steps: ['部门主管', '财务经理', '总经理'], status: 'active' },
  { id: 2, name: '付款审批流程', type: 'payment', steps: ['财务主管', '财务经理', '总经理'], status: 'active' },
  { id: 3, name: '请假审批流程', type: 'leave', steps: ['部门主管', 'HR经理'], status: 'inactive' },
  { id: 4, name: '费用报销流程', type: 'expense', steps: ['部门主管', '财务审核', '财务经理'], status: 'active' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建模板') }
const handleEdit = (row: any) => { ElMessage.info(`编辑模板: ${row.name}`) }
const handleUse = (row: any) => { ElMessage.success(`已使用模板: ${row.name}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除模板 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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