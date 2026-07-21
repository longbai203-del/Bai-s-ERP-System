<!-- 
  文件路径: frontend/src/modules/saas/pages/PlanDetail.vue
  功能: 套餐详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>套餐详情</h2>
          <p class="subtitle">{{ plan.name }}</p>
        </div>
        <div>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>套餐信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="套餐名称">{{ plan.name }}</el-descriptions-item>
            <el-descriptions-item label="套餐代码">{{ plan.code }}</el-descriptions-item>
            <el-descriptions-item label="价格">{{ formatCurrency(plan.price) }}</el-descriptions-item>
            <el-descriptions-item label="计费周期">{{ plan.period }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="plan.status === 'active' ? 'success' : 'danger'">
                {{ plan.status === 'active' ? '启用' : '停用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="订阅数">{{ plan.subscriptions }} 个</el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">{{ plan.description }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>功能列表</span></template>
          <div v-for="feature in plan.features" :key="feature" class="feature-item">
            <el-icon color="#67C23A"><Check /></el-icon>
            <span>{{ feature }}</span>
          </div>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>使用该套餐的租户</span></template>
          <el-table :data="plan.tenants" style="width: 100%">
            <el-table-column prop="name" label="租户名称" />
            <el-table-column label="状态" align="center">
              <el-tag type="success" size="small">激活</el-tag>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Check } from '@element-plus/icons-vue'

const router = useRouter()

const plan = ref({
  id: 1,
  name: '企业版',
  code: 'PLAN_ENT',
  price: 120000,
  period: '年',
  status: 'active',
  subscriptions: 28,
  description: '完整的企业级功能，包含所有高级特性',
  features: ['无限用户', '所有功能模块', '专属客户支持', 'API完整访问', '定制化开发'],
  tenants: [{ name: '沙特电信公司' }, { name: '沙特阿美' }],
})

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleEdit = () => { router.push(`/saas/plans/edit/${plan.value.id}`) }
const handleBack = () => { router.push('/saas/plans') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.feature-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
.feature-item:last-child { border-bottom: none; }
</style>