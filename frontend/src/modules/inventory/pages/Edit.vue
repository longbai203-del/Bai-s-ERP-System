<!--
  文件路径: frontend/src/modules/inventory/pages/Edit.vue
  功能: 编辑库存记录 - 修改产品库存信息
  包含: 多标签编辑、表单验证、草稿保存、变更历史、批量操作
-->

<template>
  <div class="inventory-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-info">
          <h1 class="page-title">✏️ 编辑库存记录</h1>
          <p class="page-subtitle">修改产品 {{ productData.product }} 的库存信息</p>
        </div>
      </div>
      <div class="header-right">
        <el-button @click="handleSaveDraft" :loading="savingDraft">
          <el-icon><Document /></el-icon> 保存草稿
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          <el-icon><Check /></el-icon> 保存修改
        </el-button>
        <el-button type="danger" @click="handleRevert">
          <el-icon><RefreshLeft /></el-icon> 撤销修改
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <template v-else>
      <!-- 变更状态提示 -->
      <el-alert
        v-if="hasChanges"
        type="warning"
        :closable="false"
        show-icon
        class="change-alert"
      >
        <template #title>
          <span>检测到未保存的修改，请点击「保存修改」按钮提交更改</span>
        </template>
      </el-alert>

      <!-- 主编辑卡片 -->
      <el-card class="edit-card" shadow="hover">
        <el-tabs v-model="activeTab" class="edit-tabs" @tab-change="handleTabChange">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-form
              ref="basicFormRef"
              :model="formData"
              :rules="basicRules"
              label-width="130px"
              label-position="right"
            >
              <el-row :gutter="24">
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="产品名称" prop="product">
                    <el-input v-model="formData.product" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="SKU编码" prop="sku">
                    <el-input v-model="formData.sku" disabled>
                      <template #prepend>
                        <el-tag type="info" size="small">只读</el-tag>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="产品分类" prop="category">
                    <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%" filterable>
                      <el-option label="电子产品" value="电子产品" />
                      <el-option label="服装鞋帽" value="服装鞋帽" />
                      <el-option label="食品饮料" value="食品饮料" />
                      <el-option label="家居用品" value="家居用品" />
                      <el-option label="美妆护肤" value="美妆护肤" />
                      <el-option label="运动户外" value="运动户外" />
                      <el-option label="办公用品" value="办公用品" />
                      <el-option label="其他" value="其他" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="品牌" prop="brand">
                    <el-input v-model="formData.brand" placeholder="请输入品牌" clearable />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="型号" prop="model">
                    <el-input v-model="formData.model" placeholder="请输入产品型号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="规格" prop="specification">
                    <el-input v-model="formData.specification" placeholder="请输入规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="单位" prop="unit">
                    <el-select v-model="formData.unit" placeholder="请选择单位" style="width: 100%">
                      <el-option label="个" value="个" />
                      <el-option label="件" value="件" />
                      <el-option label="箱" value="箱" />
                      <el-option label="盒" value="盒" />
                      <el-option label="包" value="包" />
                      <el-option label="千克" value="千克" />
                      <el-option label="克" value="克" />
                      <el-option label="升" value="升" />
                      <el-option label="米" value="米" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="单价" prop="price">
                    <el-input-number
                      v-model="formData.price"
                      :min="0"
                      :precision="2"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="成本价" prop="cost">
                    <el-input-number
                      v-model="formData.cost"
                      :min="0"
                      :precision="2"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24">
                  <el-form-item label="产品描述" prop="description">
                    <el-input
                      v-model="formData.description"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入产品详细描述"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>

          <!-- 库存信息 -->
          <el-tab-pane label="库存信息" name="stock">
            <el-form
              ref="stockFormRef"
              :model="formData"
              :rules="stockRules"
              label-width="130px"
              label-position="right"
            >
              <el-row :gutter="24">
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="当前库存" prop="quantity">
                    <el-input-number
                      v-model="formData.quantity"
                      :min="0"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="安全库存" prop="safetyStock">
                    <el-input-number
                      v-model="formData.safetyStock"
                      :min="0"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="最大库存" prop="maxStock">
                    <el-input-number
                      v-model="formData.maxStock"
                      :min="0"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="仓库" prop="warehouse">
                    <el-select v-model="formData.warehouse" placeholder="请选择仓库" style="width: 100%" filterable>
                      <el-option label="利雅得仓库" value="利雅得仓库" />
                      <el-option label="吉达仓库" value="吉达仓库" />
                      <el-option label="达曼仓库" value="达曼仓库" />
                      <el-option label="麦加分部" value="麦加分部" />
                      <el-option label="麦地那分部" value="麦地那分部" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="货位" prop="location">
                    <el-input v-model="formData.location" placeholder="请输入货位编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="产品状态" prop="status">
                    <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                      <el-option label="正常" value="active" />
                      <el-option label="停用" value="inactive" />
                      <el-option label="待处理" value="pending" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24">
                  <el-form-item label="库存备注" prop="stockRemark">
                    <el-input
                      v-model="formData.stockRemark"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入库存备注"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>

          <!-- 批次管理 -->
          <el-tab-pane label="批次管理" name="batch">
            <div class="batch-actions">
              <el-button type="primary" size="small" @click="addBatch">
                <el-icon><Plus /></el-icon> 添加批次
              </el-button>
              <span class="batch-count">共 {{ formData.batches.length }} 个批次</span>
            </div>
            <el-divider />
            <div
              v-for="(batch, index) in formData.batches"
              :key="index"
              class="batch-item"
            >
              <div class="batch-header">
                <span class="batch-index">批次 #{{ index + 1 }}</span>
                <el-button type="danger" size="small" link @click="removeBatch(index)">
                  <el-icon><Delete /></el-icon> 删除
                </el-button>
              </div>
              <el-row :gutter="24">
                <el-col :xs="24" :sm="12" :md="6">
                  <el-form-item :label="'批次号'" :prop="'batches.' + index + '.batchNo'">
                    <el-input v-model="batch.batchNo" placeholder="请输入批次号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="6">
                  <el-form-item :label="'生产日期'" :prop="'batches.' + index + '.productionDate'">
                    <el-date-picker
                      v-model="batch.productionDate"
                      type="date"
                      placeholder="选择生产日期"
                      style="width: 100%"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="6">
                  <el-form-item :label="'有效期至'" :prop="'batches.' + index + '.expiryDate'">
                    <el-date-picker
                      v-model="batch.expiryDate"
                      type="date"
                      placeholder="选择有效期"
                      style="width: 100%"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="6">
                  <el-form-item :label="'数量'" :prop="'batches.' + index + '.quantity'">
                    <el-input-number
                      v-model="batch.quantity"
                      :min="1"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-empty v-if="formData.batches.length === 0" description="暂无批次信息" :image-size="80" />
          </el-tab-pane>

          <!-- 序列号管理 -->
          <el-tab-pane label="序列号管理" name="serial">
            <div class="serial-actions">
              <el-button type="primary" size="small" @click="addSerialNumber">
                <el-icon><Plus /></el-icon> 添加序列号
              </el-button>
              <el-button size="small" @click="batchGenerateSN">
                <el-icon><Refresh /></el-icon> 批量生成
              </el-button>
              <el-button size="small" type="danger" @click="batchDeleteSN">
                <el-icon><Delete /></el-icon> 批量删除
              </el-button>
              <span class="serial-count">共 {{ formData.serialNumbers.length }} 个序列号</span>
            </div>
            <el-divider />
            <el-table :data="formData.serialNumbers" border style="width: 100%" max-height="400">
              <el-table-column type="selection" width="50" />
              <el-table-column type="index" label="#" width="50" />
              <el-table-column prop="serialNo" label="序列号" min-width="180">
                <template #default="{ row }">
                  <el-input v-model="row.serialNo" placeholder="请输入序列号" size="small" clearable />
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="120" align="center">
                <template #default="{ row }">
                  <el-select v-model="row.status" size="small" style="width: 100%">
                    <el-option label="在库" value="在库" />
                    <el-option label="已售" value="已售" />
                    <el-option label="维修中" value="维修中" />
                    <el-option label="已报废" value="已报废" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center">
                <template #default="{ $index }">
                  <el-button type="danger" size="small" link @click="removeSerialNumber($index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-empty v-if="formData.serialNumbers.length === 0" description="暂无序列号" :image-size="60" />
          </el-tab-pane>

          <!-- 变更历史 -->
          <el-tab-pane label="变更历史" name="history">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in changeHistory"
                :key="index"
                :timestamp="item.time"
                :type="item.type"
                size="large"
              >
                <div class="history-item">
                  <div class="history-user">{{ item.user }}</div>
                  <div class="history-action">{{ item.action }}</div>
                  <div class="history-detail">
                    <span class="history-old">旧值: {{ item.oldValue }}</span>
                    <span class="history-new">新值: {{ item.newValue }}</span>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 底部操作栏 -->
      <div class="form-actions">
        <div class="actions-left">
          <el-button @click="handleBack">
            <el-icon><ArrowLeft /></el-icon> 取消
          </el-button>
          <el-button type="danger" @click="handleRevert">
            <el-icon><RefreshLeft /></el-icon> 撤销修改
          </el-button>
        </div>
        <div class="actions-right">
          <el-button @click="handleSaveDraft" :loading="savingDraft">
            <el-icon><Document /></el-icon> 保存草稿
          </el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            <el-icon><Check /></el-icon> 保存修改
          </el-button>
        </div>
      </div>
    </template>

    <!-- 保存成功对话框 -->
    <el-dialog v-model="showSuccessDialog" title="✅ 修改成功" width="400px">
      <div class="success-content">
        <el-icon class="success-icon" :size="56"><CircleCheck /></el-icon>
        <h3>库存信息已更新</h3>
        <p>{{ productData.product }} 的库存信息已成功保存</p>
        <div class="success-actions">
          <el-button type="primary" @click="showSuccessDialog = false">继续编辑</el-button>
          <el-button @click="handleViewDetail">查看详情</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import {
  ArrowLeft, ArrowRight, Goods, Upload, Files, Tickets, Document,
  Check, Plus, Delete, Refresh, RefreshLeft, CircleCheck, Edit,
  Search, Clock, Warning, InformationFilled, Calendar, Phone, Message,
  Location, OfficeBuilding, Setting, Money, Grid, Promotion, List,
  FolderOpened, Download, Printer, User, Box, Collection, HomeFilled,
  ShoppingCart, Close, CircleClose
} from '@element-plus/icons-vue'

// ==================== Router ====================
const route = useRoute()
const router = useRouter()

// ==================== 引用 ====================
const basicFormRef = ref<FormInstance>()
const stockFormRef = ref<FormInstance>()

// ==================== 状态变量 ====================
const loading = ref(true)
const activeTab = ref('basic')
const submitting = ref(false)
const savingDraft = ref(false)
const showSuccessDialog = ref(false)
const hasChanges = ref(false)
const originalData = ref<any>(null)

// ==================== 表单数据 ====================
const formData = reactive({
  id: '1',
  product: 'iPhone 15 Pro Max 256GB',
  sku: 'IPH-15-PM-256',
  category: '电子产品',
  brand: 'Apple',
  model: 'A2849',
  specification: '256GB / 8GB RAM',
  unit: '件',
  price: 5299,
  cost: 4200,
  description: 'iPhone 15 Pro Max 采用钛金属边框，配备 A17 Pro 芯片，支持 USB-C 接口。',
  quantity: 156,
  safetyStock: 50,
  maxStock: 200,
  warehouse: '利雅得仓库',
  location: 'A-01-01',
  status: 'active',
  stockRemark: '',
  batches: [
    { batchNo: 'BATCH-2024-001', quantity: 100, productionDate: '2024-10-15', expiryDate: '2026-10-15' },
    { batchNo: 'BATCH-2024-002', quantity: 56, productionDate: '2024-11-01', expiryDate: '2026-11-01' }
  ],
  serialNumbers: [
    { serialNo: 'SN-2024-0001', status: '在库' },
    { serialNo: 'SN-2024-0002', status: '在库' },
    { serialNo: 'SN-2024-0003', status: '已售' },
    { serialNo: 'SN-2024-0004', status: '维修中' }
  ]
})

// ==================== 产品数据（用于显示） ====================
const productData = computed(() => ({
  product: formData.product,
  sku: formData.sku,
  category: formData.category,
  quantity: formData.quantity,
  warehouse: formData.warehouse,
  status: formData.status
}))

// ==================== 表单验证规则 ====================
const basicRules: FormRules = {
  product: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '产品名称长度应在2-50字符之间', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', min: 0, message: '单价必须大于等于0', trigger: 'blur' }
  ]
}

const stockRules: FormRules = {
  quantity: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '数量必须大于等于0', trigger: 'blur' }
  ],
  safetyStock: [
    { type: 'number', min: 0, message: '安全库存必须大于等于0', trigger: 'blur' }
  ],
  warehouse: [{ required: true, message: '请选择仓库', trigger: 'change' }]
}

// ==================== 变更历史 ====================
const changeHistory = ref([
  {
    time: '2026-07-22 10:30',
    user: 'Admin',
    action: '更新信息',
    oldValue: '单价: SAR 4,999',
    newValue: '单价: SAR 5,299',
    type: 'primary'
  },
  {
    time: '2026-07-20 14:20',
    user: 'Mohammed',
    action: '库存调整',
    oldValue: '库存: 106',
    newValue: '库存: 156',
    type: 'success'
  },
  {
    time: '2026-07-18 09:00',
    user: 'Admin',
    action: '更新安全库存',
    oldValue: '安全库存: 30',
    newValue: '安全库存: 50',
    type: 'warning'
  },
  {
    time: '2026-07-15 16:30',
    user: 'Saud',
    action: '分类变更',
    oldValue: '分类: 手机',
    newValue: '分类: 电子产品',
    type: 'info'
  }
])

// ==================== 方法 ====================
// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    await new Promise(resolve => setTimeout(resolve, 600))
    originalData.value = JSON.parse(JSON.stringify(formData))
    ElMessage.success('数据加载成功')
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 检测表单变更
watch(
  formData,
  () => {
    if (originalData.value) {
      const current = JSON.stringify(formData)
      const original = JSON.stringify(originalData.value)
      hasChanges.value = current !== original
    }
  },
  { deep: true, immediate: false }
)

// 添加批次
const addBatch = () => {
  formData.batches.push({
    batchNo: `BATCH-${new Date().getFullYear()}-${String(formData.batches.length + 1).padStart(3, '0')}`,
    productionDate: '',
    expiryDate: '',
    quantity: 1
  })
  ElMessage.success('已添加批次')
}

// 删除批次
const removeBatch = (index: number) => {
  if (formData.batches.length <= 1) {
    ElMessage.warning('至少保留一个批次')
    return
  }
  formData.batches.splice(index, 1)
  ElMessage.success('已删除批次')
}

// 添加序列号
const addSerialNumber = () => {
  const sn = `SN-${new Date().getFullYear()}-${String(formData.serialNumbers.length + 1).padStart(4, '0')}`
  formData.serialNumbers.push({ serialNo: sn, status: '在库' })
  ElMessage.success('已添加序列号')
}

// 批量生成序列号
const batchGenerateSN = () => {
  const count = 10
  for (let i = 0; i < count; i++) {
    const sn = `SN-${new Date().getFullYear()}-${String(formData.serialNumbers.length + 1).padStart(4, '0')}`
    formData.serialNumbers.push({ serialNo: sn, status: '在库' })
  }
  ElMessage.success(`已生成 ${count} 个序列号`)
}

// 批量删除序列号
const batchDeleteSN = () => {
  if (formData.serialNumbers.length === 0) {
    ElMessage.warning('没有序列号可删除')
    return
  }
  ElMessageBox.confirm(`确定要删除全部 ${formData.serialNumbers.length} 个序列号吗？`, '警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    formData.serialNumbers = []
    ElMessage.success('已删除所有序列号')
  }).catch(() => {})
}

// 删除单个序列号
const removeSerialNumber = (index: number) => {
  formData.serialNumbers.splice(index, 1)
  ElMessage.success('已删除序列号')
}

// 切换标签页
const handleTabChange = (tab: string) => {}

// 保存草稿
const handleSaveDraft = async () => {
  savingDraft.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    localStorage.setItem('inventory_edit_draft', JSON.stringify(formData))
    ElMessage.success('草稿已保存')
  } catch (error) {
    ElMessage.error('保存草稿失败')
  } finally {
    savingDraft.value = false
  }
}

// 提交修改
const handleSubmit = async () => {
  try {
    await basicFormRef.value?.validate()
    await stockFormRef.value?.validate()
  } catch (error) {
    ElMessage.warning('请完善所有必填字段')
    return
  }

  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    ElMessage.success('库存信息已成功更新')
    showSuccessDialog.value = true
    originalData.value = JSON.parse(JSON.stringify(formData))
    hasChanges.value = false
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 撤销修改
const handleRevert = () => {
  if (!hasChanges.value) {
    ElMessage.info('没有需要撤销的修改')
    return
  }

  ElMessageBox.confirm('确定要撤销所有未保存的修改吗？', '确认撤销', {
    confirmButtonText: '确定撤销',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (originalData.value) {
      Object.assign(formData, JSON.parse(JSON.stringify(originalData.value)))
      hasChanges.value = false
      ElMessage.success('已撤销所有修改')
    }
  }).catch(() => {})
}

// 查看详情
const handleViewDetail = () => {
  showSuccessDialog.value = false
  const id = route.params.id as string || '1'
  router.push(`/inventory/detail/${id}`)
}

// 返回
const handleBack = () => {
  if (hasChanges.value) {
    ElMessageBox.confirm('有未保存的修改，确定要离开吗？', '提示', {
      confirmButtonText: '确定离开',
      cancelButtonText: '继续编辑',
      type: 'warning'
    }).then(() => {
      router.push('/inventory')
    }).catch(() => {})
  } else {
    router.push('/inventory')
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadData()
  const draft = localStorage.getItem('inventory_edit_draft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      if (draftData.id === route.params.id) {
        ElMessageBox.confirm('发现未保存的草稿，是否恢复？', '草稿恢复', {
          confirmButtonText: '恢复草稿',
          cancelButtonText: '丢弃草稿',
          type: 'info'
        }).then(() => {
          Object.assign(formData, draftData)
          originalData.value = JSON.parse(JSON.stringify(formData))
          ElMessage.success('草稿已恢复')
        }).catch(() => {
          localStorage.removeItem('inventory_edit_draft')
        })
      }
    } catch (error) {
      localStorage.removeItem('inventory_edit_draft')
    }
  }
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.inventory-edit-page {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* ==================== 页面头部 ==================== */
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
  gap: 16px;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
}

.page-subtitle {
  margin: 2px 0 0 0;
  color: #909399;
  font-size: 13px;
}

.header-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 加载状态 ==================== */
.loading-container {
  padding: 40px;
  background: white;
  border-radius: 12px;
}

/* ==================== 变更提示 ==================== */
.change-alert {
  margin-bottom: 20px;
  border-radius: 8px;
}

/* ==================== 编辑卡片 ==================== */
.edit-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.edit-tabs :deep(.el-tabs__content) {
  padding-top: 16px;
}

/* ==================== 批次管理 ==================== */
.batch-actions,
.serial-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.batch-count,
.serial-count {
  font-size: 13px;
  color: #909399;
  margin-left: auto;
}

.batch-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.batch-index {
  font-weight: 600;
  color: #409EFF;
  font-size: 14px;
}

/* ==================== 变更历史 ==================== */
.history-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-user {
  font-weight: 600;
  color: #409EFF;
}

.history-action {
  color: #303133;
}

.history-detail {
  display: flex;
  gap: 16px;
  font-size: 13px;
  flex-wrap: wrap;
}

.history-old {
  color: #F56C6C;
}

.history-new {
  color: #67C23A;
}

/* ==================== 底部操作栏 ==================== */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
  gap: 12px;
  position: sticky;
  bottom: 0;
  z-index: 100;
}

.actions-left,
.actions-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 成功对话框 ==================== */
.success-content {
  text-align: center;
  padding: 16px 0;
}

.success-icon {
  color: #67C23A;
  margin-bottom: 16px;
}

.success-content h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #303133;
}

.success-content p {
  margin: 4px 0;
  color: #606266;
}

.success-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .inventory-edit-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
  }

  .header-right .el-button {
    flex: 1;
    font-size: 12px;
    padding: 8px 12px;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-left,
  .actions-right {
    justify-content: center;
  }

  .actions-right .el-button {
    flex: 1;
  }

  .edit-tabs :deep(.el-tabs__item) {
    font-size: 13px;
    padding: 0 12px;
  }

  .batch-item {
    padding: 12px 14px;
  }

  .history-detail {
    flex-direction: column;
    gap: 4px;
  }

  .batch-actions,
  .serial-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .batch-count,
  .serial-count {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .page-subtitle {
    font-size: 12px;
  }

  .form-actions {
    padding: 12px 16px;
  }

  .actions-left .el-button,
  .actions-right .el-button {
    font-size: 12px;
    padding: 6px 10px;
  }

  .edit-tabs :deep(.el-tabs__item) {
    font-size: 12px;
    padding: 0 8px;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .inventory-edit-page {
    background: white;
    padding: 16px;
  }

  .form-actions,
  .header-right,
  .back-btn,
  .change-alert {
    display: none !important;
  }

  .edit-card {
    box-shadow: none !important;
    border: 1px solid #dcdfe6;
  }
}
</style>