<!-- 
  文件路径: frontend/src/modules/marketing/pages/EmailMarketing.vue
  功能: 邮件营销 - 邮件营销管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="邮件主题">
              <el-input v-model="searchForm.subject" placeholder="请输入邮件主题" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="已发送" value="sent" />
                <el-option label="已打开" value="opened" />
                <el-option label="已点击" value="clicked" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建邮件</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in emailStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="subject" label="邮件主题" min-width="180" />
        <el-table-column prop="recipients" label="收件人数" align="center" />
        <el-table-column prop="opened" label="打开数" align="center" />
        <el-table-column prop="clicked" label="点击数" align="center" />
        <el-table-column label="打开率" align="center" width="100">
          <template #default="{ row }">
            <el-progress :percentage="row.openRate" :stroke-width="6" :show-text="true" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'sent' ? 'success' : row.status === 'opened' ? 'primary' : row.status === 'clicked' ? 'warning' : 'info'">
              {{ row.status === 'draft' ? '草稿' : row.status === 'sent' ? '已发送' : row.status === 'opened' ? '已打开' : '已点击' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sentAt" label="发送时间" width="160" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleSend(row)" v-if="row.status === 'draft'"><el-icon><Promotion /></el-icon> 发送</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Promotion } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchForm = reactive({ subject: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const emailStats = ref([
  { label: '邮件总数', value: '286', type: 'primary' },
  { label: '已发送', value: '186', type: 'success' },
  { label: '平均打开率', value: '38.5%', type: 'warning' },
  { label: '平均点击率', value: '12.8%', type: 'primary' },
])

const tableData = ref([
  { id: 1, subject: '双十一大促活动通知', recipients: 856, opened: 328, clicked: 86, openRate: 38.3, status: 'sent', sentAt: '2024-11-20 10:30' },
  { id: 2, subject: '新品上线预告', recipients: 520, opened: 0, clicked: 0, openRate: 0, status: 'draft', sentAt: '-' },
  { id: 3, subject: '会员专属优惠', recipients: 386, opened: 156, clicked: 45, openRate: 40.4, status: 'opened', sentAt: '2024-11-19 14:20' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.subject = ''; searchForm.status = '' }
const handleCreate = () => { router.push('/marketing/email/create') }
const handleView = (row: any) => { router.push(`/marketing/email/detail/${row.id}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑邮件: ${row.subject}`) }
const handleSend = (row: any) => {
  ElMessageBox.confirm(`确认发送邮件 "${row.subject}"？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'sent'; ElMessage.success('邮件已发送') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>