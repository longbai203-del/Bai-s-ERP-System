<template>
  <div class="pos-edit-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon> 返回详情
        </el-button>
        <h1>
          <el-icon :size="28" color="#4F46E5"><Edit /></el-icon>
          编辑设备
        </h1>
        <el-tag :type="getStatusTag(formData.status)" size="large" effect="dark">
          {{ getStatusLabel(formData.status) }}
        </el-tag>
      </div>
      <div class="header-actions">
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          <el-icon><Check /></el-icon> 更新设备
        </el-button>
      </div>
    </div>

    <!-- 表单 -->
    <el-card class="form-card" shadow="hover" v-loading="loading">
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
                <el-input v-model="formData.code" disabled />
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
            设备状态
          </div>

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="设备状态" prop="status">
                <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                  <el-option label="在线" value="online" />
                  <el-option label="离线" value="offline" />
                  <el-option label="维护中" value="maintenance" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="当前收银员">
                <el-input v-model="formData.cashier" placeholder="输入收银员姓名" />
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
              <el-icon><Check /></el-icon> 更新设备
            </el-button>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  ArrowLeft,
  Edit,
  Refresh,
  Check,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// ========== 响应式数据 ==========
const formRef = ref<FormInstance>()
const loading = ref(false)
const submitting = ref(false)

// 表单数据
const formData = reactive({
  id: 0,
  name: '',
  code: '',
  model: 'POS-2000',
  store: 'flagship',
  location: '',
  ipAddress: '',
  status: 'offline',
  cashier: '',
  remark: ''
})

// ========== 表单验证规则 ==========
const formRules: FormRules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  store: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  location: [{ required: true, message: '请输入安装位置', trigger: 'blur' }],
  ipAddress: [
    { required: true, message: '请输入IP地址', trigger: 'blur' },
    { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: '请输入正确的IP地址', trigger: 'blur' }
  ]
}

// ========== 计算属性 ==========
const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    online: 'success',
    offline: 'danger',
    maintenance: 'warning'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    online: '在线',
    offline: '离线',
    maintenance: '维护中'
  }
  return map[status] || status
}

// ========== 获取详情数据 ==========
const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('无效的设备ID')
    router.push('/pos/list')
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))

    const mockData = {
      id: parseInt(id),
      name: `前台收银 ${id}`,
      code: `POS-${String(id).padStart(3, '0')}`,
      model: 'POS-3000',
      store: 'flagship',
      location: '一楼收银台',
      ipAddress: `192.168.1.${100 + parseInt(id)}`,
      status: ['online', 'offline', 'maintenance'][parseInt(id) % 3],
      cashier: '张伟',
      remark: ''
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
  router.push(`/pos/detail/${formData.id}`)
}

const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？所有未保存的数据将丢失', '确认重置', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fetchDetail()
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
    ElMessage.success('设备更新成功！')
    router.push(`/pos/detail/${formData.id}`)
  } finally {
    submitting.value = false
  }
}

// ========== 生命周期 ==========
onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.pos-edit-page {
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
  .pos-edit-page {
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