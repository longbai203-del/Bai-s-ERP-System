<!-- 
  文件路径: frontend/src/modules/system/pages/Notification.vue
  功能: 通知管理 - 管理系统通知
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="通知标题">
              <el-input v-model="searchForm.title" placeholder="请输入通知标题" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="未读" value="unread" />
                <el-option label="已读" value="read" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 发送通知</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="title" label="通知标题" min-width="180" />
        <el-table-column prop="content" label="内容" min-width="250" />
        <el-table-column prop="sender" label="发送人" width="100" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'unread' ? 'danger' : 'success'">
              {{ row.status === 'unread' ? '未读' : '已读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发送时间" width="180" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleMarkRead(row)" v-if="row.status === 'unread'"><el-icon><Check /></el-icon> 标记已读</el-button>
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
import { Search, Plus, View, Check, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ title: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, title: '系统升级通知', content: '系统将于2024年12月1日凌晨2:00-5:00进行升级维护', sender: 'System', status: 'unread', createdAt: '2024-11-20 10:30:00' },
  { id: 2, title: '新版本发布', content: 'V3.2版本已发布，请及时更新', sender: 'Admin', status: 'read', createdAt: '2024-11-18 14:20:00' },
  { id: 3, title: '安全提醒', content: '检测到异常登录，请确认是否为本人操作', sender: 'Security', status: 'unread', createdAt: '2024-11-17 09:00:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.title = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('发送通知') }
const handleView = (row: any) => { ElMessage.info(`查看通知: ${row.title}`) }
const handleMarkRead = (row: any) => { row.status = 'read'; ElMessage.success('已标记为已读') }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除通知 "${row.title}" 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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