<template>
  <div class="finance-edit">
    <el-card class="form-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button type="default" @click="handleBack">
              <el-icon><ArrowLeft /></el-icon> 返回详情
            </el-button>
            <span class="header-title">编辑财务记录</span>
            <el-tag :type="getStatusTag(formData.status)" size="large" effect="dark">
              {{ getStatusLabel(formData.status) }}
            </el-tag>
          </div>
          <div class="header-actions">
            <el-button @click="handleSaveAsDraft" :loading="draftLoading">
              <el-icon><Document /></el-icon> 保存草稿
            </el-button>
            <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
              <el-icon><Check /></el-icon> 提交审核
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
        class="edit-form"
        size="default"
        v-loading="loading"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-indicator"></span>
            基本信息
          </div>

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="交易类型" prop="type" required>
                <el-select v-model="formData.type" placeholder="请选择交易类型" @change="handleTypeChange">
                  <el-option label="收入" value="income">
                    <span style="color:#67c23a;">收入</span>
                  </el-option>
                  <el-option label="支出" value="expense">
                    <span style="color:#f56c6c;">支出</span>
                  </el-option>
                  <el-option label="转账" value="transfer">
                    <span style="color:#409eff;">转账</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="交易编号" prop="transactionNo">
                <el-input v-model="formData.transactionNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="交易日期" prop="date" required>
                <el-date-picker
                  v-model="formData.date"
                  type="date"
                  placeholder="选择日期"
                  value-format="YYYY-MM-DD"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 金额与分类 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-indicator"></span>
            金额与分类
          </div>

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="金额" prop="amount" required>
                <el-input-number
                  v-model="formData.amount"
                  :precision="2"
                  :min="0.01"
                  :max="999999999.99"
                  placeholder="请输入金额"
                  style="width:100%"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="分类" prop="category" required>
                <el-select v-model="formData.category" placeholder="请选择分类" filterable style="width:100%">
                  <el-option-group label="收入分类">
                    <el-option label="销售收入" value="销售收入" />
                    <el-option label="投资收益" value="投资收益" />
                    <el-option label="服务收入" value="服务收入" />
                    <el-option label="利息收入" value="利息收入" />
                    <el-option label="其他收入" value="其他收入" />
                  </el-option-group>
                  <el-option-group label="支出分类">
                    <el-option label="办公费用" value="办公费用" />
                    <el-option label="人员工资" value="人员工资" />
                    <el-option label="市场推广" value="市场推广" />
                    <el-option label="技术支持" value="技术支持" />
                    <el-option label="设备采购" value="设备采购" />
                    <el-option label="租金" value="租金" />
                    <el-option label="水电费" value="水电费" />
                  </el-option-group>
                  <el-option-group label="转账分类">
                    <el-option label="银行转账" value="银行转账" />
                    <el-option label="账户调拨" value="账户调拨" />
                    <el-option label="跨境汇款" value="跨境汇款" />
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="状态" prop="status">
                <el-select v-model="formData.status" disabled style="width:100%">
                  <el-option label="已完成" value="completed" />
                  <el-option label="待审核" value="pending" />
                  <el-option label="已拒绝" value="rejected" />
                  <el-option label="草稿" value="draft" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 描述与备注 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-indicator"></span>
            描述与备注
          </div>

          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="交易描述" prop="description">
                <el-input
                  v-model="formData.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入交易描述信息"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remarks">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注信息（可选）"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 附件管理 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-indicator"></span>
            附件管理
            <span class="section-tip">支持上传图片、PDF、Excel等文件</span>
          </div>

          <el-row>
            <el-col :span="24">
              <el-upload
                ref="uploadRef"
                action="#"
                :auto-upload="false"
                :file-list="fileList"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                :on-preview="handleFilePreview"
                :limit="10"
                :on-exceed="handleExceed"
                multiple
                drag
                class="upload-area"
              >
                <el-icon class="upload-icon"><UploadFilled /></el-icon>
                <div class="upload-text">
                  <span>将文件拖到此处，或点击上传</span>
                  <span class="upload-hint">支持 .pdf, .jpg, .png, .xlsx, .docx 等格式</span>
                </div>
              </el-upload>
            </el-col>
          </el-row>

          <!-- 已上传文件列表 -->
          <div v-if="existingFiles.length > 0" class="existing-files">
            <div class="file-section-title">已上传文件</div>
            <div v-for="(file, index) in existingFiles" :key="index" class="file-item">
              <div class="file-info">
                <el-icon :size="20" :color="getFileIconColor(file.type)">
                  <component :is="getFileIcon(file.type)" />
                </el-icon>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ file.size }}</span>
                <span class="file-time">{{ file.uploadTime }}</span>
              </div>
              <div class="file-actions">
                <el-button type="primary" link size="small" @click="handleDownload(file)">
                  <el-icon><Download /></el-icon>
                </el-button>
                <el-button type="danger" link size="small" @click="handleRemoveExisting(index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 审批信息 -->
        <div v-if="formData.status === 'pending' || formData.status === 'rejected'" class="form-section">
          <div class="section-title">
            <span class="section-indicator"></span>
            审批信息
          </div>

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12">
              <el-form-item label="审批状态">
                <el-tag :type="getStatusTag(formData.status)" size="large">
                  {{ getStatusLabel(formData.status) }}
                </el-tag>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" v-if="formData.status === 'rejected'">
              <el-form-item label="驳回原因">
                <el-input
                  v-model="formData.rejectReason"
                  type="textarea"
                  :rows="2"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 表单底部 -->
        <el-divider />
        <div class="form-footer">
          <div class="footer-left">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon> 返回
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon> 重置
            </el-button>
          </div>
          <div class="footer-right">
            <el-button @click="handleSaveAsDraft" :loading="draftLoading">
              <el-icon><Document /></el-icon> 保存草稿
            </el-button>
            <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
              <el-icon><Check /></el-icon> 提交审核
            </el-button>
          </div>
        </div>
      </el-form>
    </el-card>

    <!-- 提交确认对话框 -->
    <el-dialog
      v-model="submitDialogVisible"
      title="提交审核确认"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="submit-confirm">
        <el-icon color="#e6a23c" size="56"><Warning /></el-icon>
        <p>确定要提交该记录进行审核吗？</p>
        <p class="submit-hint">提交后将进入审批流程，请确保信息准确无误</p>
      </div>
      <template #footer>
        <el-button @click="submitDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="confirmSubmit">
          确定提交
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadInstance, UploadFile } from 'element-plus'
import {
  ArrowLeft,
  Document,
  Check,
  Refresh,
  Download,
  Delete,
  UploadFilled,
  Warning,
  Files,
  Picture,
  VideoCamera,
  Headset,
  Grid,
  Fold,
  Expand
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// ========== 响应式数据 ==========
const loading = ref(false)
const draftLoading = ref(false)
const submitLoading = ref(false)
const submitDialogVisible = ref(false)

const formRef = ref<FormInstance>()
const uploadRef = ref<UploadInstance>()

// 表单数据
const formData = reactive({
  id: 0,
  transactionNo: '',
  type: '',
  category: '',
  amount: 0,
  status: 'draft',
  date: '',
  description: '',
  remarks: '',
  rejectReason: '',
  createdBy: '',
  createdAt: '',
  updatedAt: ''
})

// 文件列表
const fileList = ref<UploadFile[]>([])
const existingFiles = ref([
  {
    name: '财务凭证_20260701.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadTime: '2026-07-01 10:30:00'
  }
])

// ========== 表单验证规则 ==========
const formRules: FormRules = {
  type: [
    { required: true, message: '请选择交易类型', trigger: 'change' }
  ],
  date: [
    { required: true, message: '请选择交易日期', trigger: 'change' }
  ],
  amount: [
    { required: true, message: '请输入交易金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '金额必须大于0', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择交易分类', trigger: 'change' }
  ],
  description: [
    { max: 500, message: '描述不能超过500个字符', trigger: 'blur' }
  ],
  remarks: [
    { max: 200, message: '备注不能超过200个字符', trigger: 'blur' }
  ]
}

// ========== 计算属性方法 ==========
const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    completed: 'success',
    pending: 'warning',
    rejected: 'danger',
    draft: 'info'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    pending: '待审核',
    rejected: '已拒绝',
    draft: '草稿'
  }
  return map[status] || status
}

const getFileIcon = (type: string) => {
  const map: Record<string, any> = {
    pdf: Files,
    image: Picture,
    video: VideoCamera,
    audio: Headset,
    excel: Grid,
    word: Document
  }
  return map[type] || Document
}

const getFileIconColor = (type: string) => {
  const map: Record<string, string> = {
    pdf: '#f56c6c',
    image: '#67c23a',
    video: '#409eff',
    audio: '#e6a23c',
    excel: '#67c23a',
    word: '#409eff'
  }
  return map[type] || '#909399'
}

// ========== 获取详情数据 ==========
const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('无效的记录ID')
    router.push('/marketing')
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // 模拟数据
    const mockData = {
      id: parseInt(id),
      transactionNo: `TRX${String(id).padStart(6, '0')}`,
      type: 'income',
      category: '销售收入',
      amount: 12580.50,
      status: 'pending',
      date: '2026-07-22',
      description: '月度服务费 - 企业客户A',
      remarks: '合同编号：CT-2026-001，服务周期：2026年6月',
      createdBy: '张三',
      createdAt: '2026-07-22 09:00:00',
      updatedAt: '2026-07-22 10:30:00',
      rejectReason: ''
    }
    
    Object.assign(formData, mockData)
  } catch (error) {
    ElMessage.error('加载数据失败，请重试')
  } finally {
    loading.value = false
  }
}

// ========== 事件处理 ==========
const handleBack = () => {
  router.push(`/marketing/detail/${formData.id}`)
}

const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？所有未保存的数据将丢失', '确认重置', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fetchDetail()
    fileList.value = []
    ElMessage.success('已重置')
  }).catch(() => {})
}

const handleTypeChange = () => {
  // 清空分类选择
  formData.category = ''
}

// 表单提交前验证
const validateForm = async (): Promise<boolean> => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    ElMessage.warning('请完善表单信息')
    return false
  }
}

// 保存草稿
const handleSaveAsDraft = async () => {
  const valid = await validateForm()
  if (!valid) return

  draftLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    formData.status = 'draft'
    ElMessage.success('草稿保存成功！')
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    draftLoading.value = false
  }
}

// 提交审核
const handleSubmit = async () => {
  const valid = await validateForm()
  if (!valid) return

  if (formData.status === 'completed') {
    ElMessage.warning('该记录已完成审批，不可再次提交')
    return
  }

  submitDialogVisible.value = true
}

const confirmSubmit = async () => {
  submitLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    formData.status = 'pending'
    ElMessage.success('提交审核成功！')
    submitDialogVisible.value = false
  } catch (error) {
    ElMessage.error('提交失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

// 附件处理
const handleFileChange = (file: UploadFile, fileList: UploadFile[]) => {
  // 检查文件大小（限制10MB）
  if (file.size && file.size > 10 * 1024 * 1024) {
    ElMessage.warning('文件大小不能超过10MB')
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    return
  }
  
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  
  if (file.raw && !allowedTypes.includes(file.raw.type)) {
    ElMessage.warning('不支持的文件格式，请上传图片、PDF、Excel或Word文件')
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    return
  }
}

const handleFileRemove = (file: UploadFile, fileList: UploadFile[]) => {
  // 文件移除处理
}

const handleFilePreview = (file: UploadFile) => {
  if (file.url) {
    window.open(file.url, '_blank')
  }
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传10个文件')
}

const handleDownload = (file: any) => {
  ElMessage.success(`正在下载：${file.name}`)
}

const handleRemoveExisting = (index: number) => {
  ElMessageBox.confirm('确定要删除该文件吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    existingFiles.value.splice(index, 1)
    ElMessage.success('文件删除成功')
  }).catch(() => {})
}

// ========== 生命周期 ==========
onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.finance-edit {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.form-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.edit-form {
  padding: 8px 0;
}

/* 表单分区 */
.form-section {
  background: #fafbfc;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.form-section:last-of-type {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 8px;
}

.section-indicator {
  display: inline-block;
  width: 4px;
  height: 18px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  border-radius: 2px;
  margin-right: 10px;
}

.section-tip {
  font-size: 12px;
  font-weight: 400;
  color: #909399;
  margin-left: 8px;
}

/* 上传区域 */
.upload-area {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  padding: 40px 20px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.upload-area :deep(.el-upload-dragger:hover) {
  border-color: #409eff;
  background: #f0f7ff;
}

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 12px;
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #606266;
}

.upload-hint {
  font-size: 12px;
  color: #909399;
}

/* 已有文件列表 */
.existing-files {
  margin-top: 16px;
}

.file-section-title {
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 12px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #ebeef5;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.file-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  color: #303133;
  word-break: break-all;
}

.file-size,
.file-time {
  font-size: 12px;
  color: #909399;
}

.file-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

/* 表单底部 */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 8px;
}

.footer-left,
.footer-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 提交确认 */
.submit-confirm {
  text-align: center;
  padding: 20px 0;
}

.submit-confirm p {
  margin: 12px 0 0;
  font-size: 16px;
  color: #606266;
}

.submit-confirm .submit-hint {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .finance-edit {
    padding: 12px;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    flex-wrap: wrap;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .form-section {
    padding: 16px;
  }

  .form-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .footer-left,
  .footer-right {
    justify-content: stretch;
  }

  .footer-left .el-button,
  .footer-right .el-button {
    flex: 1;
  }

  .file-item {
    flex-wrap: wrap;
    gap: 8px;
  }

  .file-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .upload-area :deep(.el-upload-dragger) {
    padding: 24px 16px;
  }
}

@media (max-width: 480px) {
  .file-info {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .file-size,
  .file-time {
    font-size: 11px;
  }
}
</style>