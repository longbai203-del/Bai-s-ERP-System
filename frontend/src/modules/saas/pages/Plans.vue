<!-- 
  文件路径: frontend/src/modules/saas/pages/Plans.vue
  功能: 套餐管理 - 管理服务套餐
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="套餐名称">
              <el-input v-model="searchForm.name" placeholder="请输入套餐名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="启用" value="active" />
                <el-option label="停用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 创建套餐</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="8" v-for="plan in tableData" :key="plan.id">
        <el-card class="plan-card" :class="{ 'plan-popular': plan.popular }">
          <div class="plan-header">
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price">{{ formatCurrency(plan.price) }}<span class="plan-period">/{{ plan.period }}</span></div>
          </div>
          <div class="plan-features">
            <div v-for="feature in plan.features" :key="feature" class="feature-item">
              <el-icon color="#67C23A"><Check /></el-icon>
              <span>{{ feature }}</span>
            </div>
          </div>
          <div class="plan-actions">
            <el-tag v-if="plan.popular" type="warning" size="large">热门</el-tag>
            <el-button type="primary" @click="handleEdit(plan)">编辑</el-button>
            <el-button :type="plan.status === 'active' ? 'danger' : 'success'" @click="handleToggle(plan)">
              {{ plan.status === 'active' ? '停用' : '启用' }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchForm = reactive({ name: '', status: '' })

const tableData = ref([
  { id: 1, name: '企业版', price: 120000, period: '年', status: 'active', popular: true, features: ['无限用户', '所有功能', '专属支持', 'API访问'] },
  { id: 2, name: '专业版', price: 8500, period: '月', status: 'active', popular: false, features: ['100用户', '核心功能', '标准支持'] },
  { id: 3, name: '标准版', price: 4500, period: '月', status: 'inactive', popular: false, features: ['50用户', '基础功能', '邮件支持'] },
])

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.name = ''; searchForm.status = '' }
const handleCreate = () => { router.push('/saas/plans/create') }
const handleEdit = (plan: any) => { router.push(`/saas/plans/edit/${plan.id}`) }
const handleToggle = (plan: any) => {
  const action = plan.status === 'active' ? '停用' : '启用'
  ElMessageBox.confirm(`确认${action}套餐 "${plan.name}"？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { plan.status = plan.status === 'active' ? 'inactive' : 'active'; ElMessage.success(`已${action}`) }).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.plan-card { border-radius: 12px; transition: all 0.3s; padding: 16px 0; position: relative; }
.plan-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
.plan-popular { border: 2px solid #E6A23C; }
.plan-header { text-align: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.plan-name { font-size: 20px; font-weight: 700; }
.plan-price { font-size: 28px; font-weight: 700; color: #409EFF; margin: 4px 0; }
.plan-period { font-size: 14px; font-weight: 400; color: #909399; }
.plan-features { padding: 16px 24px; }
.feature-item { display: flex; align-items: center; gap: 8px; padding: 4px 0; color: #606266; }
.plan-actions { display: flex; justify-content: center; gap: 12px; padding: 8px 16px; border-top: 1px solid #f0f0f0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>