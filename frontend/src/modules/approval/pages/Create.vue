<!-- 
  文件路径: frontend/src/modules/approval/pages/Create.vue
  功能: 发起审批 - 创建新的审批申请
-->

<template>
  <div class="approval-create-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>📋 发起审批</h1>
          <p class="header-subtitle">创建新的审批申请，支持多种审批类型</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button @click="handleSaveDraft" :loading="savingDraft">
          <el-icon><Document /></el-icon> 保存草稿
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          <el-icon><Check /></el-icon> 提交审批
        </el-button>
      </div>
    </div>

    <!-- 主表单 -->
    <el-card class="main-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        label-position="right"
        size="large"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">
            <span>📋 基本信息</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="审批类型" prop="type" required>
                <el-select v-model="form.type" placeholder="请选择审批类型" style="width: 100%">
                  <el-option label="🛒 采购审批" value="purchase" />
                  <el-option label="💳 付款审批" value="payment" />
                  <el-option label="💰 费用审批" value="expense" />
                  <el-option label="📄 合同审批" value="contract" />
                  <el-option label="🏖️ 请假审批" value="leave" />
                  <el-option label="🚗 用车审批" value="vehicle" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审批标题" prop="title" required>
                <el-input
                  v-model="form.title"
                  placeholder="请输入审批标题，如：采购申请-PR-2024-001"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="关联单据" prop="referenceNo">
                <el-input
                  v-model="form.referenceNo"
                  placeholder="请输入关联单据号"
                  clearable
                />
                <div class="form-hint">如：采购单号、合同编号等</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="紧急程度" prop="urgent">
                <el-radio-group v-model="form.urgent">
                  <el-radio-button label="normal">普通</el-radio-button>
                  <el-radio-button label="urgent">紧急</el-radio-button>
                  <el-radio-button label="critical">特急</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 金额与审批人 -->
        <div class="form-section">
          <div class="section-title">
            <span>💰 金额与审批人</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="审批金额" prop="amount" required>
                <el-input-number
                  v-model="form.amount"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="请输入金额"
                />
                <div class="form-hint">SAR 沙特里亚尔</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审批人" prop="approver" required>
                <el-select
                  v-model="form.approver"
                  placeholder="请选择审批人"
                  style="width: 100%"
                  filterable
                >
                  <el-option label="Ahmed Al-Fahd - 采购经理" value="Ahmed Al-Fahd" />
                  <el-option label="Mohammed Al-Qahtani - 财务经理" value="Mohammed Al-Qahtani" />
                  <el-option label="Saud Al-Otaibi - 总经理" value="Saud Al-Otaibi" />
                  <el-option label="Faisal Al-Dossary - 部门主管" value="Faisal Al-Dossary" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="抄送人">
                <el-select
                  v-model="form.cc"
                  multiple
                  placeholder="请选择抄送人"
                  style="width: 100%"
                  filterable
                >
                  <el-option label="Khalid Al-Ghamdi" value="Khalid Al-Ghamdi" />
                  <el-option label="Abdullah Al-Shammari" value="Abdullah Al-Shammari" />
                  <el-option label="Nasser Al-Harbi" value="Nasser Al-Harbi" />
                </el-select>
                <div class="form-hint">抄送人将收到审批通知</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="期望完成日期">
                <el-date-picker
                  v-model="form.expectedDate"
                  type="date"
                  placeholder="请选择期望完成日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 详细说明 -->
        <div class="form-section">
          <div class="section-title">
            <span>📝 详细说明</span>
          </div>

          <el-form-item label="审批说明" prop="description" required>
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请详细说明审批事项的背景、原因和预期结果..."
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="2"
              placeholder="补充信息..."
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <!-- 附件 -->
        <div class="form-section">
          <div class="section-title">
            <span>📎 附件</span>
          </div>

          <el-form-item label="上传附件">
            <el-upload
              v-model:file-list="fileList"
              action="#"
              multiple
              :auto-upload="false"
              :limit="5"
              :on-exceed="handleExceed"
              list-type="text"
            >
              <el-button type="primary" text>
                <el-icon><Upload /></el-icon> 上传附件
              </el-button>
              <template #tip>
                <div class="upload-tip">
                  支持 PDF、DOCX、XLSX、图片格式，单个文件不超过10MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </div>

        <!-- 审批流程预览 -->
        <div class="form-section" v-if="form.type">
          <div class="section-title">
            <span>🔀 审批流程预览</span>
          </div>
          <div class="flow-preview">
            <el-steps :active="0" finish-status="success" align-center>
              <el-step title="提交申请" description="申请人" />
              <el-step title="部门审批" :description="form.approver || '待选择'" />
              <el-step title="财务审批" description="财务经理" />
              <el-step title="完成" description="归档" />
            </el-steps>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Document, Check, Upload } from '@element-plus/icons-vue'

// ============================================================
// 路由
// ============================================================

const router = useRouter()

// ============================================================
// 响应式数据
// ============================================================

const formRef = ref()
const submitting = ref(false)
const savingDraft = ref(false)
const fileList = ref<any[]>([])

// ============================================================
// 表单数据
// ============================================================

const form = reactive({
  type: 'purchase',
  title: '',
  referenceNo: '',
  amount: 0,
  urgent: 'normal',
  approver: '',
  cc: [] as string[],
  expectedDate: null as Date | null,
  description: '',
  remark: '',
})

// ============================================================
// 表单验证规则
// ============================================================

const rules = {
  type: [
    { required: true, message: '请选择审批类型', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入审批标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符之间', trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '请输入审批金额', trigger: 'blur' },
    { type: 'number', min: 0, message: '金额必须大于等于0', trigger: 'blur' }
  ],
  approver: [
    { required: true, message: '请选择审批人', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入审批说明', trigger: 'blur' },
    { min: 10, message: '说明至少10个字符', trigger: 'blur' }
  ]
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  if (form.title || form.description) {
    ElMessageBox.confirm('确定要返回吗？已填写的内容将不会被保存。', '确认返回', {
      type: 'warning'
    }).then(() => {
      router.push('/approval')
    }).catch(() => {})
  } else {
    router.push('/approval')
  }
}

const handleSaveDraft = async () => {
  savingDraft.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success('✅ 草稿已保存')
  } catch (error) {
    ElMessage.error('保存草稿失败，请重试')
  } finally {
    savingDraft.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning('请完善必填信息')
      return
    }

    submitting.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      ElMessage.success({
        message: `✅ 审批 "${form.title}" 已提交成功！`,
        duration: 3000
      })
      router.push('/approval')
    } catch (error) {
      ElMessage.error('提交失败，请重试')
    } finally {
      submitting.value = false
    }
  })
}

const handleExceed = () => {
  ElMessage.warning('最多上传5个附件')
}
</script>

<style scoped>
.approval-create-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* ============================================================
   页面头部
   ============================================================ */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.back-btn {
  margin-top: 4px;
}

.header-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 4px 0;
}

.header-subtitle {
  color: #6B7280;
  margin: 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* ============================================================
   主卡片
   ============================================================ */

.main-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.main-card :deep(.el-card__body) {
  padding: 32px 40px;
}

/* ============================================================
   表单分区
   ============================================================ */

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F3F4F6;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.section-title span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-hint {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
  line-height: 1.4;
}

.upload-tip {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
}

/* ============================================================
   表单样式
   ============================================================ */

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #4B5563;
}

:deep(.el-radio-button__inner) {
  font-weight: 400;
}

/* ============================================================
   审批流程预览
   ============================================================ */

.flow-preview {
  padding: 16px 0;
}

:deep(.el-steps) {
  padding: 8px 0;
}

/* ============================================================
   暗色模式
   ============================================================ */

[data-theme="dark"] .approval-create-page {
  background: #1A1A2E;
}

[data-theme="dark"] .main-card {
  background: #2C2C2E;
}

[data-theme="dark"] .header-title h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .form-section {
  border-color: #3A3A3C;
}

[data-theme="dark"] .section-title {
  color: #F5F5F7;
}

[data-theme="dark"] :deep(.el-form-item__label) {
  color: #9CA3AF;
}

[data-theme="dark"] .form-hint,
[data-theme="dark"] .upload-tip {
  color: #6B7280;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .approval-create-page {
    padding: 16px;
  }

  .main-card :deep(.el-card__body) {
    padding: 20px 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    justify-content: stretch;
  }

  .header-actions .el-button {
    flex: 1;
  }

  :deep(.el-radio-group) {
    display: flex;
    flex-wrap: wrap;
  }

  :deep(.el-radio-button) {
    flex: 1;
  }
}
</style>