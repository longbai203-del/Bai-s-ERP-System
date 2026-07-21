<!-- 
  文件路径: frontend/src/modules/system/pages/SystemParameters.vue
  功能: 系统参数 - 管理系统配置参数
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="参数分组">
              <el-select v-model="searchForm.group" placeholder="请选择分组" clearable style="width: 100%">
                <el-option label="系统设置" value="system" />
                <el-option label="业务设置" value="business" />
                <el-option label="通知设置" value="notification" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="参数名称">
              <el-input v-model="searchForm.name" placeholder="请输入参数名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加参数</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="code" label="参数编码" width="160" />
        <el-table-column prop="name" label="参数名称" />
        <el-table-column prop="group" label="分组" width="120" />
        <el-table-column prop="value" label="参数值" min-width="200" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
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
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ group: '', name: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, code: 'SYS_APP_NAME', name: '应用名称', group: '系统设置', value: 'Bai\'s ERP System', type: '字符串', status: 'active' },
  { id: 2, code: 'SYS_TIMEZONE', name: '时区', group: '系统设置', value: 'Asia/Riyadh', type: '字符串', status: 'active' },
  { id: 3, code: 'BIZ_CURRENCY', name: '默认币种', group: '业务设置', value: 'SAR', type: '字符串', status: 'active' },
  { id: 4, code: 'BIZ_VAT_RATE', name: 'VAT税率', group: '业务设置', value: '15%', type: '数字', status: 'active' },
  { id: 5, code: 'NOTIFY_EMAIL', name: '通知邮箱', group: '通知设置', value: 'admin@bai-erp.com', type: '字符串', status: 'active' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.group = ''; searchForm.name = '' }
const handleCreate = () => { ElMessage.info('添加参数') }
const handleEdit = (row: any) => { ElMessage.info(`编辑参数: ${row.name}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除参数 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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