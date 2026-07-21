<!-- 
  文件路径: frontend/src/modules/approval/pages/ApprovalDetail.vue
  功能: 审批详情 - 查看审批详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>审批详情</h2>
          <p class="subtitle">审批编号: {{ approvalNo }}</p>
        </div>
        <div v-if="status === 'pending'">
          <el-button type="success" @click="handleApprove"><el-icon><Check /></el-icon> 批准</el-button>
          <el-button type="danger" @click="handleReject"><el-icon><Close /></el-icon> 驳回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>审批信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="审批编号">{{ approvalNo }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'danger'">
                {{ status === 'pending' ? '待审批' : status === 'approved' ? '已批准' : '已驳回' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="类型">{{ type }}</el-descriptions-item>
            <el-descriptions-item label="关联单据">{{ referenceNo }}</el-descriptions-item>
            <el-descriptions-item label="申请人">{{ applicant }}</el-descriptions-item>
            <el-descriptions-item label="申请金额">{{ formatCurrency(amount) }}</el-descriptions-item>
            <el-descriptions-item label="紧急程度">
              <el-tag :type="urgent === 'critical' ? 'danger' : urgent === 'urgent' ? 'warning' : 'info'">
                {{ urgent === 'normal' ? '普通' : urgent === 'urgent' ? '紧急' : '特急' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="提交时间">{{ submittedAt }}</el-descriptions-item>
            <el-descriptions-item label="审批说明" :span="2">{{ description }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>审批流程</span></template>
          <el-steps direction="vertical" :active="activeStep" finish-status="success">
            <el-step title="提交申请" description="申请人: Ahmed Al-Fahd" />
            <el-step title="部门审批" description="审批人: Mohammed Al-Qahtani" />
            <el-step title="财务审批" description="审批人: Saud Al-Otaibi" />
            <el-step title="总经理审批" description="审批人: Khalid Al-Ghamdi" />
          </el-steps>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>附件</span></template>
          <el-table :data="attachments" style="width: 100%">
            <el-table-column prop="name" label="文件名" />
            <el-table-column label="操作" align="center">
              <el-button type="primary" size="small">下载</el-button>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const approvalNo = ref('AP-2024-001')
const status = ref('pending')
const type = ref('采购审批')
const referenceNo = ref('PR-2024-001')
const applicant = ref('Ahmed Al-Fahd')
const amount = ref(285600)
const urgent = ref('urgent')
const submittedAt = ref('2024-11-20 10:30')
const description = ref('采购iPhone 15 Pro Max 100台用于库存补充')
const activeStep = ref(2)

const attachments = ref([
  { name: '采购申请单.pdf' },
  { name: '报价单_Apple.pdf' },
])

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleApprove = () => {
  ElMessageBox.confirm('确认批准该审批？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { status.value = 'approved'; ElMessage.success('已批准') }).catch(() => {})
}
const handleReject = () => {
  ElMessageBox.confirm('确认驳回该审批？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => { status.value = 'rejected'; ElMessage.warning('已驳回') }).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>