<!-- 
  文件路径: frontend/src/modules/marketing/pages/SocialMedia.vue
  功能: 社交媒体管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="平台">
              <el-select v-model="searchForm.platform" placeholder="全部平台" clearable style="width: 100%">
                <el-option label="Twitter" value="twitter" />
                <el-option label="Instagram" value="instagram" />
                <el-option label="LinkedIn" value="linkedin" />
                <el-option label="TikTok" value="tiktok" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="已发布" value="published" />
                <el-option label="待审核" value="pending" />
                <el-option label="已排期" value="scheduled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 创建内容</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in socialStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="content" label="内容" min-width="200" />
        <el-table-column prop="platform" label="平台" width="100">
          <template #default="{ row }">
            <el-tag :type="row.platform === 'twitter' ? 'primary' : row.platform === 'instagram' ? 'danger' : row.platform === 'linkedin' ? 'success' : 'warning'">
              {{ row.platform }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="engagement" label="互动量" align="center" />
        <el-table-column prop="likes" label="点赞" align="center" />
        <el-table-column prop="shares" label="分享" align="center" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : row.status === 'pending' ? 'warning' : 'info'">
              {{ row.status === 'published' ? '已发布' : row.status === 'pending' ? '待审核' : '已排期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishedAt" label="发布时间" width="160" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handlePublish(row)" v-if="row.status === 'pending'"><el-icon><Check /></el-icon> 发布</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchForm = reactive({ platform: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const socialStats = ref([
  { label: '总内容数', value: '186', type: 'primary' },
  { label: '总互动量', value: '856,000', type: 'success' },
  { label: '平均互动率', value: '4.8%', type: 'warning' },
  { label: '待发布', value: '28', type: 'primary' },
])

const tableData = ref([
  { id: 1, content: '双十一大促活动宣传', platform: 'Twitter', engagement: 2856, likes: 1856, shares: 456, status: 'published', publishedAt: '2024-11-20 10:30' },
  { id: 2, content: '新品上市预告', platform: 'Instagram', engagement: 0, likes: 0, shares: 0, status: 'pending', publishedAt: '-' },
  { id: 3, content: '品牌故事系列', platform: 'LinkedIn', engagement: 1256, likes: 856, shares: 256, status: 'published', publishedAt: '2024-11-19 14:20' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.platform = ''; searchForm.status = '' }
const handleCreate = () => { router.push('/marketing/social/create') }
const handleView = (row: any) => { router.push(`/marketing/social/detail/${row.id}`) }
const handlePublish = (row: any) => {
  ElMessageBox.confirm(`确认发布内容？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'published'; ElMessage.success('已发布') }).catch(() => {})
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