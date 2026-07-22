<!-- 
  文件路径: frontend/src/modules/finance/pages/Edit.vue
  功能: 编辑财务交易 - 修改交易记录
-->

<template>
  <div class="finance-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>✏️ 编辑交易</h1>
          <p class="header-subtitle">修改交易记录 - ID: {{ form.transactionNo || 'TRX-001' }}</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          <el-icon><Check /></el-icon> 保存更改
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 编辑表单 -->
    <el-card v-else class="main-card" shadow="hover">
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
              <el-form-item label="交易编号" prop="transactionNo">
                <el-input
                  v-model="form.transactionNo"
                  disabled
                  style="background: #F9FAFB;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交易类型" prop="type" required>
                <el-select v-model="form.type" placeholder="请选择交易类型" style="width: 100%">
                  <el-option label="📈 收入" value="income" />
                  <el-option label="📉 支出" value="expense" />
                  <el-option label="🔄 转账" value="transfer" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="交易日期" prop="transactionDate" required>
                <el-date-picker
                  v-model="form.transactionDate"
                  type="date"
                  placeholder="请选择交易日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交易金额" prop="amount" required>
                <el-input-number
                  v-model="form.amount"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  style="width: 100%"
                />
                <div class="form-hint">SAR 沙特里亚尔</div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="客户/供应商" prop="counterparty">
                <el-select
                  v-model="form.counterparty"
                  placeholder="请选择或输入名称"
                  style="width: 100%"
                  filterable
                  allow-create
                >
                  <el-option label="沙特电信公司" value="沙特电信公司" />
                  <el-option label="Apple Supplier" value="Apple Supplier" />
                  <el-option label="阿尔拉吉银行" value="阿尔拉吉银行" />
                  <el-option label="沙特阿美" value="沙特阿美" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付方式" prop="paymentMethod">
                <el-select v-model="form.paymentMethod" placeholder="请选择支付方式" style="width: 100%">
                  <el-option label="银行转账" value="bank_transfer" />
                  <el-option label="现金" value="cash" />
                  <el-option label="信用卡" value="credit_card" />
                  <el-option label="支票" value="cheque" />
                  <el-option label="在线支付" value="online" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 财务分类 -->
        <div class="form-section">
          <div class="section-title">
            <span>📊 财务分类</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="会计科目" prop="account">
                <el-select v-model="form.account" placeholder="请选择会计科目" style="width: 100%" filterable>
                  <el-option label="1001 库存现金" value="1001" />
                  <el-option label="1002 银行存款" value="1002" />
                  <el-option label="1122 应收账款" value="1122" />
                  <el-option label="2001 应付账款" value="2001" />
                  <el-option label="6001 主营业务收入" value="6001" />
                  <el-option label="6401 主营业务成本" value="6401" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成本中心" prop="costCenter">
                <el-select v-model="form.costCenter" placeholder="请选择成本中心" style="width: 100%">
                  <el-option label="CC-001 销售成本中心" value="CC-001" />
                  <el-option label="CC-002 采购成本中心" value="CC-002" />
                  <el-option label="CC-003 市场营销中心" value="CC-003" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="发票号码" prop="invoiceNo">
                <el-input
                  v-model="form.invoiceNo"
                  placeholder="请输入发票号码"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                  <el-option label="已完成" value="completed" />
                  <el-option label="待处理" value="pending" />
                  <el-option label="已取消" value="cancelled" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 详细说明 -->
        <div class="form-section">
          <div class="section-title">
            <span>📝 详细说明</span>
          </div>

          <el-form-item label="交易说明" prop="description" required>
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请详细说明交易内容..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="备注" prop="remark">
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
                  支持 PDF、图片、Excel 格式，单个文件不超过10MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </div>

        <!-- 更新信息 -->
        <div class="update-info">
          <span>创建时间: {{ form.createdAt || '2024-10-15 14:30' }}</span>
          <span>最后更新: {{ form.updatedAt || '2024-10-20 10:00' }}</span>
          <span>创建人: {{ form.createdBy || '系统管理员' }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button size="large" @click="handleCancel">取消</el-button>
          <el-button size="large" @click="handlePreview">
            <el-icon><View /></el-icon> 预览
          </el-button>
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
            <el-icon><Check /></el-icon> 保存更改
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="交易预览"
      width="700px"
      top="5vh"
      :destroy-on-close="true"
    >
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-icon">
            <span class="icon-large">{{ getTypeIcon(form.type) }}</span>
          </div>
          <div class="preview-info">
            <div class="preview-name">{{ form.transactionNo || '新交易' }}</div>
            <div class="preview-meta">
              <el-tag :type="form.type === 'income' ? 'success' : form.type === 'expense' ? 'danger' : 'info'">
                {{ getTypeLabel(form.type) }}
              </el-tag>
              <el-tag :type="getStatusTag(form.status)">
                {{ getStatusLabel(form.status) }}
              </el-tag>
              <span>金额: <strong>{{ formatCurrency(form.amount) }}</strong></span>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="preview-body">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="客户/供应商">{{ form.counterparty || '-' }}</el-descriptions-item>
            <el-descriptions-item label="支付方式">{{ getPaymentMethodLabel(form.paymentMethod) }}</el-descriptions-item>
            <el-descriptions-item label="会计科目">{{ form.account || '-' }}</el-descriptions-item>
            <el-descriptions-item label="成本中心">{{ form.costCenter || '-' }}</el-descriptions-item>
            <el-descriptions-item label="发票号码">{{ form.invoiceNo || '-' }}</el-descriptions-item>
            <el-descriptions-item label="交易日期">{{ formatDate(form.transactionDate) }}</el-descriptions-item>
            <el-descriptions-item label="交易说明" :span="2">{{ form.description || '-' }}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">{{ form.remark || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSubmit; previewVisible = false">
          <el-icon><Check /></el-icon> 确认保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Check, View, Upload } from '@element-plus/icons-vue'

// ============================================================
// 路由
// ============================================================

const router = useRouter()
const route = useRoute()

// ============================================================
// 响应式数据
// ============================================================

const formRef = ref()
const loading = ref(false)
const submitting = ref(false)
const previewVisible = ref(false)
const fileList = ref<any[]>([])

// ============================================================
// 表单数据
// ============================================================

const form = reactive({
  transactionNo: 'TRX-2024-001',
  type: 'income',
  counterparty: '沙特电信公司',
  amount: 285600,
  transactionDate: new Date('2024-10-15'),
  paymentMethod: 'bank_transfer',
  account: '1002 银行存款',
  costCenter: 'CC-001 销售成本中心',
  invoiceNo: 'INV-2024-001',
  status: 'completed',
  description: '沙特电信公司 2024年Q3技术服务费',
  remark: '发票已收到，付款已完成',
  createdBy: 'Ahmed Al-Fahd',
  createdAt: '2024-10-15 14:30',
  updatedAt: '2024-10-20 10:00'
})

// ============================================================
// 表单验证规则
// ============================================================

const rules = {
  type: [
    { required: true, message: '请选择交易类型', trigger: 'change' }
  ],
  transactionDate: [
    { required: true, message: '请选择交易日期', trigger: 'change' }
  ],
  amount: [
    { required: true, message: '请输入交易金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '金额必须大于0', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入交易说明', trigger: 'blur' },
    { min: 5, message: '说明至少5个字符', trigger: 'blur' }
  ]
}

// ============================================================
// 工具函数
// ============================================================

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    income: '收入',
    expense: '支出',
    transfer: '转账'
  }
  return map[type] || type
}

const getTypeIcon = (type: string) => {
  const map: Record<string, string> = {
    income: '📈',
    expense: '📉',
    transfer: '🔄'
  }
  return map[type] || '💰'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    pending: '待处理',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    completed: 'success',
    pending: 'warning',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const getPaymentMethodLabel = (method: string) => {
  const map: Record<string, string> = {
    bank_transfer: '银行转账',
    cash: '现金',
    credit_card: '信用卡',
    cheque: '支票',
    online: '在线支付'
  }
  return map[method] || method
}

const formatCurrency = (value: number) => {
  if (!value) return '—'
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0
  }).format(value)
}

const formatDate = (date: Date | null) => {
  if (!date) return '未选择'
  return date.toLocaleDateString('zh-CN')
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  if (formRef.value?.isDirty) {
    ElMessageBox.confirm('确定要返回吗？未保存的更改将丢失。', '确认返回', {
      type: 'warning'
    }).then(() => {
      router.push('/finance')
    }).catch(() => {})
  } else {
    router.push('/finance')
  }
}

const handleCancel = () => {
  handleBack()
}

const handleReset = () => {
  ElMessageBox.confirm('确定要重置所有更改吗？', '确认重置', {
    type: 'warning'
  }).then(() => {
    loadDetail()
    ElMessage.success('已重置所有更改')
  }).catch(() => {})
}

const handlePreview = () => {
  if (!form.description) {
    ElMessage.warning('请先填写交易说明')
    return
  }
  if (form.amount <= 0) {
    ElMessage.warning('请输入有效金额')
    return
  }
  previewVisible.value = true
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
        message: `✅ 交易 "${form.transactionNo}" 已更新！`,
        duration: 3000
      })
      router.push('/finance')
    } catch (error) {
      ElMessage.error('更新失败，请重试')
    } finally {
      submitting.value = false
    }
  })
}

const handleExceed = () => {
  ElMessage.warning('最多上传5个附件')
}

// ============================================================
// 加载数据
// ============================================================

const loadDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    // 实际项目中调用 API
    // const res = await api.get(`/finance/transactions/${id}`)
    // Object.assign(form, res.data)
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.finance-edit-page {
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
   加载状态
   ============================================================ */

.loading-container {
  padding: 20px 0;
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

:deep(.el-input.is-disabled .el-input__wrapper) {
  background: #F9FAFB;
}

/* ============================================================
   预览对话框
   ============================================================ */

.preview-container {
  padding: 4px 0;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-large {
  font-size: 36px;
}

.preview-name {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.preview-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
}

.preview-body {
  padding: 8px 0;
}

/* ============================================================
   更新信息
   ============================================================ */

.update-info {
  display: flex;
  gap: 24px;
  padding: 12px 0;
  font-size: 13px;
  color: #9CA3AF;
  border-top: 1px solid #F3F4F6;
}

/* ============================================================
   操作按钮
   ============================================================ */

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #F3F4F6;
  margin-top: 8px;
}

.form-actions .el-button {
  padding: 10px 28px;
  font-weight: 500;
}

/* ============================================================
   暗色模式
   ============================================================ */

[data-theme="dark"] .finance-edit-page {
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

[data-theme="dark"] :deep(.el-input.is-disabled .el-input__wrapper) {
  background: #3A3A3C;
}

[data-theme="dark"] .update-info {
  border-color: #3A3A3C;
  color: #6B7280;
}

[data-theme="dark"] .form-actions {
  border-color: #3A3A3C;
}

[data-theme="dark"] .preview-name {
  color: #F5F5F7;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .finance-edit-page {
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

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
    justify-content: center;
  }

  .update-info {
    flex-direction: column;
    gap: 4px;
  }

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>