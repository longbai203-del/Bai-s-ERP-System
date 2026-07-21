<!-- 
  文件路径: frontend/src/modules/marketing/pages/Campaigns.vue
  功能: 营销活动 - 管理营销活动列表
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="活动名称">
              <el-input v-model="searchForm.name" placeholder="请输入活动名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="活动类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="促销活动" value="promotion" />
                <el-option label="品牌活动" value="brand" />
                <el-option label="内容营销" value="content" />
                <el-option label="线下活动" value="offline" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="策划中" value="planning" />
                <el-option label="进行中" value="active" />
                <el-option label="已结束" value="ended" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 创建活动</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in campaignStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="活动名称" min-width="160" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'promotion' ? 'danger' : row.type === 'brand' ? 'primary' : row.type === 'content' ? 'success' : 'warning'">
              {{ row.type === 'promotion' ? '促销' : row.type === 'brand' ? '品牌' : row.type === 'content' ? '内容' : '线下' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="budget" label="预算" align="right">
          <template #default="{ row }">{{ formatCurrency(row.budget) }}</template>
        </el-table-column>
        <el-table-column prop="spent" label="已花费" align="right">
          <template #default="{ row }">{{ formatCurrency(row.spent) }}</template>
        </el-table-column>
        <el-table-column label="执行率" align="center" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.executionRate" :color="row.executionRate < 80 ? '#67C23A' : row.executionRate < 95 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'planning' ? 'info' : row.status === 'ended' ? 'primary' : 'danger'">
              {{ row.status === 'planning' ? '策划中' : row.status === 'active' ? '进行中' : row.status === 'ended' ? '已结束' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleLaunch(row)" v-if="row.status === 'planning'"><el-icon><VideoPlay /></el-icon> 启动</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Plus, View, Edit, VideoPlay } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchForm = reactive({ name: '', type: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const campaignStats = ref([
  { label: '总活动数', value: '28', type: 'primary' },
  { label: '进行中', value: '8', type: 'success' },
  { label: '策划中', value: '12', type: 'warning' },
  { label: '总预算', value: 'SAR 5,600,000', type: 'primary' },
])

const tableData = ref([
  { id: 1, name: '双十一大促', type: 'promotion', budget: 2000000, spent: 1500000, executionRate: 75, status: 'active', startDate: '2024-11-01' },
  { id: 2, name: '品牌周年庆', type: 'brand', budget: 1000000, spent: 600000, executionRate: 60, status: 'planning', startDate: '2024-12-01' },
  { id: 3, name: '内容营销计划', type: 'content', budget: 500000, spent: 500000, executionRate: 100, status: 'ended', startDate: '2024-10-01' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.type = ''; searchForm.status = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { router.push('/marketing/campaigns/create') }
const handleView = (row: any) => { router.push(`/marketing/campaigns/detail/${row.id}`) }
const handleEdit = (row: any) => { router.push(`/marketing/campaigns/edit/${row.id}`) }
const handleLaunch = (row: any) => {
  ElMessageBox.confirm(`确认启动活动 "${row.name}"？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'active'; ElMessage.success('活动已启动') }).catch(() => {})
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