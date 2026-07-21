<!-- 
  文件路径: frontend/src/modules/marketing/pages/LeadGenerationDetail.vue
  功能: 线索生成详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>线索详情</h2>
          <p class="subtitle">{{ lead.name }}</p>
        </div>
        <div>
          <el-button type="primary" @click="handleConvert" v-if="lead.status === 'contacted'"><el-icon><Check /></el-icon> 转化为客户</el-button>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>线索信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="线索名称">{{ lead.name }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="lead.status === 'converted' ? 'success' : 'warning'">{{ lead.status }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="联系人">{{ lead.contact }}</el-descriptions-item>
            <el-descriptions-item label="公司">{{ lead.company }}</el-descriptions-item>
            <el-descriptions-item label="来源">{{ lead.source }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ lead.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">{{ lead.description }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>跟进记录</span></template>
          <el-timeline>
            <el-timeline-item v-for="record in followups" :key="record.id" :timestamp="record.time" :type="record.type">
              {{ record.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const lead = ref({
  id: 2,
  name: '银行系统升级',
  contact: 'Mohammed',
  company: '阿尔拉吉银行',
  source: '社交媒体',
  status: 'contacted',
  createdAt: '2024-11-19 14:20',
  description: '银行系统升级需求，需要新一代银行管理系统，预算充足，决策周期约3个月',
})

const followups = ref([
  { id: 1, content: '初步接触，了解客户需求', time: '2024-11-19 14:30', type: 'primary' },
  { id: 2, content: '发送产品介绍资料', time: '2024-11-20 10:00', type: 'success' },
  { id: 3, content: '约定下周技术演示', time: '2024-11-20 15:00', type: 'warning' },
])

const handleBack = () => { router.push('/marketing/leads') }
const handleConvert = () => {
  ElMessageBox.confirm(`确认将线索 "${lead.value.name}" 转化为客户？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { lead.value.status = 'converted'; ElMessage.success('已转化为客户') }).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>