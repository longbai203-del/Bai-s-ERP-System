<template>
  <div class="pos-create-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon> 返回列表
        </el-button>
        <h1>
          <el-icon :size="28" color="#4F46E5"><Plus /></el-icon>
          新增 POS 设备
        </h1>
      </div>
      <div class="header-actions">
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          <el-icon><Check /></el-icon> 创建设备
        </el-button>
      </div>
    </div>

    <!-- 表单 -->
    <el-card class="form-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="130px"
        label-position="right"
      >
        <div class="form-section">
          <div class="section-title">
            <span class="section-indicator"></span>
            基本信息
          </div>

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="设备名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入设备名称" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="设备编号" prop="code">
                <el-input v-model="formData.code" placeholder="请输入设备编号">
                  <template #append>
                    <el-button @click="generateCode">生成</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="设备型号" prop="model">
                <el-select v-model="formData.model" placeholder="请选择设备型号" style="width: 100%">
                  <el-option label="POS-2000 标准型" value="POS-2000" />
                  <el-option label="POS-3000 专业型" value="POS-3000" />
                  <el-option label="POS-5000 旗舰型" value="POS-5000" />
                  <el-option label="POS-8000 至尊型" value="POS-8000" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">
            <span class="section-indicator"></span>
            位置信息
          </div>

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="所属门店" prop="store">
                <el-select v-model="formData.store" placeholder="请选择所属门店" style="width: 100%">
                  <el-option label="旗舰店" value="flagship" />
                  <el-option label="分店一" value="branch1" />
                  <el-option label="分店二" value="branch2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="安装位置" prop="location">
                <el-input v-model="formData.location" placeholder="如：一楼收银台" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="IP地址" prop="ipAddress">
                <el-input v-model="formData.ipAddress" placeholder="请输入IP地址" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">
            <span class="section-indicator"></span>
            其他信息
          </div>

          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remark"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注信息（可选）"
                  maxlength="200"
                  show-word-limit
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
          </div>
          <div class="footer-right">
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon> 重置
            </el-button>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">
              <el-icon><Check /></el-icon> 创建设备
            </el-button>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  ArrowLeft,
  Plus,
  Refresh,
  Check,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()

// ========== 响应式数据 ==========
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = reactive({
  name: '',
  code: '',
  model: 'POS-2000',
  store: 'flagship',
  location: '',
  ipAddress: '',
  remark: ''
})

// ========== 表单验证规则 ==========
const formRules: FormRules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
  store: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  location: [{ required: true, message: '请输入安装位置', trigger: 'blur' }],
  ipAddress: [
    { required: true, message: '请输入IP地址', trigger: 'blur' },
    { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: '请输入正确的IP地址', trigger: 'blur' }
  ]
}

// ========== 生成设备编号 ==========
const generateCode = () => {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  formData.code = `POS-${year}${month}${day}-${random}`
}

// ========== 事件处理 ==========
const handleBack = () => {
  router.push('/pos/list')
}

const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？所有数据将被清空', '确认重置', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    formData.name = ''
    formData.code = ''
    formData.model = 'POS-2000'
    formData.store = 'flagship'
    formData.location = ''
    formData.ipAddress = ''
    formData.remark = ''
    ElMessage.success('已重置')
  }).catch(() => {})
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('设备创建成功！')
    router.push('/pos/list')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.pos-create-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.form-card {
  border-radius: 12px;
  overflow: hidden;
}

.form-section {
  padding: 20px 24px;
  margin-bottom: 8px;
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
}

.section-indicator {
  display: inline-block;
  width: 4px;
  height: 18px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  border-radius: 2px;
  margin-right: 10px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 0;
}

.footer-left,
.footer-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .pos-create-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
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
}
</style>