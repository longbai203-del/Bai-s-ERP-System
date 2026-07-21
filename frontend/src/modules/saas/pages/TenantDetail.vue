<!-- 
  文件路径: frontend/src/modules/saas/pages/TenantDetail.vue
  功能: 租户详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>{{ tenant.name }}</h2>
          <p class="subtitle">租户详情</p>
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
          <template #header><span>租户信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="租户名称">{{ tenant.name }}</el-descriptions-item>
            <el-descriptions-item label="租户代码">{{ tenant.code }}</el-descriptions-item>
            <el-descriptions-item label="套餐">
              <el-tag :type="tenant.plan === 'enterprise' ? 'danger' : 'primary'">
                {{ tenant.plan === 'enterprise' ? '企业版' : tenant.plan === 'professional' ? '专业版' : '标准版' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="tenant.status === 'active' ? 'success' : 'warning'">
                {{ tenant.status === 'active' ? '激活' : '冻结' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="联系人">{{ tenant.contact }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ tenant.phone }}</el-descriptions-item>
            <el-descriptions-item label="用户数">{{ tenant.users }} 人</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ tenant.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="地址" :span="2">{{ tenant.address }}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">{{ tenant.remark }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>订阅信息</span></template>
          <div class="sub-item"><span>当前套餐</span><span class="sub-value">{{ tenant.plan }}</span></div>
          <div class="sub-item"><span>开始日期</span><span class="sub-value">{{ tenant.subscriptionStart }}</span></div>
          <div class="sub-item"><span>到期日期</span><span class="sub-value">{{ tenant.subscriptionEnd }}</span></div>
          <div class="sub-item"><span>状态</span><el-tag type="success">有效</el-tag></div>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>使用统计</span></template>
          <div class="usage-item">
            <span>存储使用</span>
            <el-progress :percentage="45" :stroke-width="10" />
          </div>
          <div class="usage-item">
            <span>API调用</span>
            <el-progress :percentage="32" :stroke-width="10" />
          </div>
          <div class="usage-item">
            <span>用户活跃度</span>
            <el-progress :percentage="78" :stroke-width="10" color="#67C23A" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const tenant = ref({
  id: 1,
  name: '沙特电信公司',
  code: 'STC_001',
  plan: 'enterprise',
  status: 'active',
  contact: 'Ahmed Al-Fahd',
  phone: '+966 50 123 4567',
  address: '利雅得，沙特阿拉伯',
  remark: '重要客户，年付订阅',
  users: 286,
  createdAt: '2024-11-20 10:30',
  subscriptionStart: '2024-11-01',
  subscriptionEnd: '2025-10-31',
})

const handleEdit = () => { router.push(`/saas/tenants/edit/${tenant.value.id}`) }
const handleBack = () => { router.push('/saas/tenants') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.sub-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.sub-item:last-child { border-bottom: none; }
.sub-value { font-weight: 600; }
.usage-item { margin-bottom: 12px; }
.usage-item span { display: block; color: #909399; font-size: 13px; margin-bottom: 4px; }
</style>