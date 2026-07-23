<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <span class="page-title">production管理</span>
          <el-button type="primary" @click="handleCreate">新建</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const tableData = ref([
  { id: 1, name: '示例数据1', status: '启用', createTime: '2026-07-23 10:00' },
  { id: 2, name: '示例数据2', status: '停用', createTime: '2026-07-23 11:00' },
])

const handleCreate = () => {
  router.push('/production/create')
}

const handleEdit = (row: any) => {
  router.push(/production/\/edit)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(确定删除 \ 吗？, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 0; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-title { font-size: 18px; font-weight: bold; }
</style>
