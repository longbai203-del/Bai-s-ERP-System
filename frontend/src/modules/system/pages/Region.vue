<!-- 
  文件路径: frontend/src/modules/system/pages/Region.vue
  功能: 地区管理 - 管理地区数据
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="地区名称">
              <el-input v-model="searchForm.name" placeholder="请输入地区名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="级别">
              <el-select v-model="searchForm.level" placeholder="请选择级别" clearable style="width: 100%">
                <el-option label="国家" value="country" />
                <el-option label="省/州" value="state" />
                <el-option label="市" value="city" />
                <el-option label="区" value="district" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加地区</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe row-key="id" border default-expand-all>
        <el-table-column prop="name" label="地区名称" />
        <el-table-column prop="code" label="地区编码" width="140" />
        <el-table-column prop="level" label="级别" width="100">
          <template #default="{ row }">
            <el-tag :type="row.level === 'country' ? 'danger' : row.level === 'state' ? 'warning' : row.level === 'city' ? 'primary' : 'info'">
              {{ row.level === 'country' ? '国家' : row.level === 'state' ? '省/州' : row.level === 'city' ? '市' : '区' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="parent" label="所属上级" width="120" />
        <el-table-column prop="sort" label="排序" align="center" width="80" />
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
            <el-button type="success" size="small" @click="handleAddChild(row)"><el-icon><Plus /></el-icon></el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', level: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, name: '沙特阿拉伯', code: 'SA', level: 'country', parent: '-', sort: 1, status: 'active' },
  { id: 2, name: '利雅得省', code: 'SA-RI', level: 'state', parent: '沙特阿拉伯', sort: 1, status: 'active' },
  { id: 3, name: '吉达省', code: 'SA-JE', level: 'state', parent: '沙特阿拉伯', sort: 2, status: 'active' },
  { id: 4, name: '利雅得市', code: 'SA-RI-CITY', level: 'city', parent: '利雅得省', sort: 1, status: 'active' },
  { id: 5, name: '吉达市', code: 'SA-JE-CITY', level: 'city', parent: '吉达省', sort: 1, status: 'active' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.level = '' }
const handleCreate = () => { ElMessage.info('添加地区') }
const handleEdit = (row: any) => { ElMessage.info(`编辑地区: ${row.name}`) }
const handleAddChild = (row: any) => { ElMessage.info(`为 ${row.name} 添加下级地区`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除地区 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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