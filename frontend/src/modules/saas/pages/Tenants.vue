<!-- 
  文件路径: frontend/src/modules/saas/pages/Tenants.vue
  功能: 租户管理 - 管理所有租户
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="租户名称">
              <el-input v-model="searchForm.name" placeholder="请输入租户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="激活" value="active" />
                <el-option label="冻结" value="frozen" />
                <el-option label="已停用" value="disabled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="套餐">
              <el-select v-model="searchForm.plan" placeholder="请选择套餐" clearable style="width: 100%">
                <el-option label="企业版" value="enterprise" />
                <el-option label="专业版" value="professional" />
                <el-option label="标准版" value="standard" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 创建租户</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in tenantStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="租户名称" min-width="150" />
        <el-table-column prop="code" label="租户代码" width="120" />
        <el-table-column prop="plan" label="套餐" width="100">
          <template #default="{ row }">
            <el-tag :type="row.plan === 'enterprise' ? 'danger' : row.plan === 'professional' ? 'primary' : 'info'">
              {{ row.plan === 'enterprise' ? '企业版' : row.plan === 'professional' ? '专业版' : '标准版' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="users" label="用户数" align="center" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'frozen' ? 'warning' : 'danger'">
              {{ row.status === 'active' ? '激活' : row.status === 'frozen' ? '冻结' : '已停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)" v-if="row.status !== 'active'"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchForm = reactive({ name: '', status: '', plan: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tenantStats = ref([
  { label: '总租户数', value: '286', type: 'primary' },
  { label: '激活租户', value: '256', type: 'success' },
  { label: '冻结租户', value: '18', type: 'warning' },
  { label: '已停用', value: '12', type: 'danger' },
])

const tableData = ref([
  { id: 1, name: '沙特电信公司', code: 'STC_001', plan: 'enterprise', users: 286, status: 'active', createdAt: '2024-11-20 10:30' },
  { id: 2, name: '阿尔拉吉银行', code: 'ALRAJHI_001', plan: 'professional', users: 156, status: 'active', createdAt: '2024-11-19 14:20' },
  { id: 3, name: '沙特阿美', code: 'ARAMCO_001', plan: 'enterprise', users: 86, status: 'frozen', createdAt: '2024-11-18 09:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.status = ''; searchForm.plan = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { router.push('/saas/tenants/create') }
const handleView = (row: any) => { router.push(`/saas/tenants/detail/${row.id}`) }
const handleEdit = (row: any) => { router.push(`/saas/tenants/edit/${row.id}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除租户 "${row.name}" 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
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
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>