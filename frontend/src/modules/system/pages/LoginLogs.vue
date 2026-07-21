<!-- 
  文件路径: frontend/src/modules/system/pages/LoginLogs.vue
  功能: 登录日志 - 查看用户登录记录
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="登录状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="成功" value="success" />
                <el-option label="失败" value="failed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in loginStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="ip" label="IP地址" />
        <el-table-column prop="location" label="地理位置" />
        <el-table-column prop="browser" label="浏览器" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="loginTime" label="登录时间" width="180" />
        <el-table-column prop="logoutTime" label="登出时间" width="180" />
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ username: '', status: '', dateRange: [] as [Date, Date] | [] })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const loginStats = ref([
  { label: '今日登录', value: '286', type: 'success' },
  { label: '在线用户', value: '156', type: 'primary' },
  { label: '登录失败', value: '12', type: 'danger' },
  { label: '本月登录', value: '8,560', type: 'primary' },
])

const tableData = ref([
  { id: 1, username: 'Ahmed Al-Fahd', ip: '192.168.1.100', location: '利雅得, SA', browser: 'Chrome 120', status: 'success', loginTime: '2024-11-20 10:30:00', logoutTime: '2024-11-20 18:30:00' },
  { id: 2, username: 'Mohammed Al-Qahtani', ip: '192.168.1.101', location: '吉达, SA', browser: 'Firefox 119', status: 'success', loginTime: '2024-11-20 09:15:00', logoutTime: '-' },
  { id: 3, username: 'Saud Al-Otaibi', ip: '192.168.1.102', location: '达曼, SA', browser: 'Edge 120', status: 'failed', loginTime: '2024-11-20 08:45:00', logoutTime: '-' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.username = ''; searchForm.status = ''; searchForm.dateRange = [] }
const handleExport = () => { ElMessage.success('导出完成') }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>