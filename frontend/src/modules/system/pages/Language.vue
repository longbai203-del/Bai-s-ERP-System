<!-- 
  文件路径: frontend/src/modules/system/pages/Language.vue
  功能: 语言管理 - 管理多语言
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="语言代码">
              <el-input v-model="searchForm.code" placeholder="请输入语言代码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="语言名称">
              <el-input v-model="searchForm.name" placeholder="请输入语言名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加语言</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="code" label="语言代码" width="100" />
        <el-table-column prop="name" label="语言名称" />
        <el-table-column prop="nativeName" label="本地名称" />
        <el-table-column prop="locale" label="区域" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="primary" size="small" @click="handleSetDefault(row)" v-if="row.code !== 'en'"><el-icon><Star /></el-icon> 设为默认</el-button>
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
import { Search, Plus, Edit, Star, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ code: '', name: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, code: 'en', name: 'English', nativeName: 'English', locale: 'en_US', status: 'active' },
  { id: 2, code: 'ar', name: 'Arabic', nativeName: 'العربية', locale: 'ar_SA', status: 'active' },
  { id: 3, code: 'zh', name: 'Chinese', nativeName: '中文', locale: 'zh_CN', status: 'active' },
  { id: 4, code: 'fr', name: 'French', nativeName: 'Français', locale: 'fr_FR', status: 'inactive' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.code = ''; searchForm.name = '' }
const handleCreate = () => { ElMessage.info('添加语言') }
const handleEdit = (row: any) => { ElMessage.info(`编辑语言: ${row.name}`) }
const handleSetDefault = (row: any) => { ElMessage.success(`已设置 ${row.name} 为默认语言`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除语言 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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