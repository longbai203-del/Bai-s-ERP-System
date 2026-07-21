<!-- 
  文件路径: frontend/src/modules/marketing/pages/LeadGeneration.vue
  功能: 线索生成 - 销售线索管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="线索名称">
              <el-input v-model="searchForm.name" placeholder="请输入线索名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="来源">
              <el-select v-model="searchForm.source" placeholder="请选择来源" clearable style="width: 100%">
                <el-option label="官网" value="website" />
                <el-option label="社交媒体" value="social" />
                <el-option label="线下活动" value="offline" />
                <el-option label="推荐" value="referral" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="新线索" value="new" />
                <el-option label="跟进中" value="contacted" />
                <el-option label="已转化" value="converted" />
                <el-option label="已流失" value="lost" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加线索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in leadStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="线索名称" />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="company" label="公司" />
        <el-table-column prop="source" label="来源" width="100" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'converted' ? 'success' : row.status === 'contacted' ? 'warning' : row.status === 'new' ? 'info' : 'danger'">
              {{ row.status === 'new' ? '新线索' : row.status === 'contacted' ? '跟进中' : row.status === 'converted' ? '已转化' : '已流失' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleContact(row)" v-if="row.status === 'new'"><el-icon><Edit /></el-icon> 跟进</el-button>
            <el-button type="success" size="small" @click="handleConvert(row)" v-if="row.status === 'contacted'"><el-icon><Check /></el-icon> 转化</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Plus, View, Edit, Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchForm = reactive({ name: '', source: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const leadStats = ref([
  { label: '总线索数', value: '286', type: 'primary' },
  { label: '新线索', value: '45', type: 'info' },
  { label: '跟进中', value: '86', type: 'warning' },
  { label: '转化率', value: '32.5%', type: 'success' },
])

const tableData = ref([
  { id: 1, name: 'STC采购需求', contact: 'Ahmed', company: '沙特电信公司', source: '官网', status: 'new', createdAt: '2024-11-20 10:30' },
  { id: 2, name: '银行系统升级', contact: 'Mohammed', company: '阿尔拉吉银行', source: '社交媒体', status: 'contacted', createdAt: '2024-11-19 14:20' },
  { id: 3, name: '数据中心建设', contact: 'Saud', company: '沙特阿美', source: '推荐', status: 'converted', createdAt: '2024-11-18 09:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.source = ''; searchForm.status = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { router.push('/marketing/leads/create') }
const handleView = (row: any) => { router.push(`/marketing/leads/detail/${row.id}`) }
const handleContact = (row: any) => { row.status = 'contacted'; ElMessage.success('已开始跟进') }
const handleConvert = (row: any) => {
  ElMessageBox.confirm(`确认将线索 "${row.name}" 转化为客户？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'converted'; ElMessage.success('已转化为客户') }).catch(() => {})
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
.stat-card.info { border-left: 4px solid #909399; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>