<!--
  文件路径: frontend/src/modules/inventory/pages/Create.vue
  功能: 创建库存记录 - 多步骤表单创建库存记录
  包含: 基本信息、入库信息、批次信息、序列号、附加信息、提交审核
-->

<template>
  <div class="inventory-create-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-info">
          <h1 class="page-title">📦 新建库存记录</h1>
          <p class="page-subtitle">录入完整的库存信息，支持多步骤填写</p>
        </div>
      </div>
      <div class="header-right">
        <el-button @click="handleSaveDraft" :loading="savingDraft">
          <el-icon><Document /></el-icon> 保存草稿
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          <el-icon><Check /></el-icon> 提交入库
        </el-button>
      </div>
    </div>

    <!-- 步骤条 -->
    <el-card class="step-card" shadow="hover">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="基本信息" description="产品与分类" icon="Goods" />
        <el-step title="入库信息" description="仓库与数量" icon="Upload" />
        <el-step title="批次信息" description="批次与保质期" icon="Files" />
        <el-step title="序列号" description="序列号管理" icon="Tickets" />
        <el-step title="附加信息" description="备注与附件" icon="Document" />
        <el-step title="确认提交" description="审核信息" icon="Check" />
      </el-steps>
    </el-card>

    <!-- 表单内容 -->
    <el-card class="form-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="130px"
        label-position="right"
        size="default"
      >
        <!-- ========== 步骤1: 基本信息 ========== -->
        <div v-show="activeStep === 0" class="step-content">
          <div class="step-header">
            <h3><el-icon><Goods /></el-icon> 产品基本信息</h3>
            <span class="step-required">* 为必填项</span>
          </div>
          <el-divider />

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="产品名称" prop="product">
                <el-input v-model="formData.product" placeholder="请输入产品名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="SKU编码" prop="sku">
                <el-input v-model="formData.sku" placeholder="请输入SKU编码" clearable>
                  <template #append>
                    <el-button @click="generateSKU" size="small">生成</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="产品分类" prop="category">
                <el-select v-model="formData.category" placeholder="请选择产品分类" style="width: 100%" filterable>
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
                  placeholder="请输入单价"
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
                  placeholder="请输入成本价"
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
        </div>

        <!-- ========== 步骤2: 入库信息 ========== -->
        <div v-show="activeStep === 1" class="step-content">
          <div class="step-header">
            <h3><el-icon><Upload /></el-icon> 入库信息</h3>
            <span class="step-required">* 为必填项</span>
          </div>
          <el-divider />

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="入库类型" prop="stockType">
                <el-select v-model="formData.stockType" placeholder="请选择入库类型" style="width: 100%">
                  <el-option label="采购入库" value="purchase" />
                  <el-option label="退货入库" value="return" />
                  <el-option label="调拨入库" value="transfer" />
                  <el-option label="生产入库" value="production" />
                  <el-option label="其他入库" value="other" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="目标仓库" prop="warehouse">
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
              <el-form-item label="入库数量" prop="quantity">
                <el-input-number
                  v-model="formData.quantity"
                  :min="1"
                  :max="999999"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="请输入数量"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="入库日期" prop="stockDate">
                <el-date-picker
                  v-model="formData.stockDate"
                  type="date"
                  placeholder="选择入库日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="相关单据" prop="referenceNo">
                <el-input v-model="formData.referenceNo" placeholder="采购单号/退货单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="供应商" prop="supplier">
                <el-select v-model="formData.supplier" placeholder="请选择供应商" style="width: 100%" filterable>
                  <el-option label="Apple Inc." value="Apple Inc." />
                  <el-option label="Samsung Electronics" value="Samsung Electronics" />
                  <el-option label="Sony Corporation" value="Sony Corporation" />
                  <el-option label="Local Supplier Co." value="Local Supplier Co." />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="安全库存" prop="safetyStock">
                <el-input-number
                  v-model="formData.safetyStock"
                  :min="0"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="设置安全库存"
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
                  placeholder="设置最大库存"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="入库备注" prop="stockRemark">
                <el-input
                  v-model="formData.stockRemark"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入入库备注"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- ========== 步骤3: 批次信息 ========== -->
        <div v-show="activeStep === 2" class="step-content">
          <div class="step-header">
            <h3><el-icon><Files /></el-icon> 批次信息</h3>
            <el-button type="primary" size="small" @click="addBatch">
              <el-icon><Plus /></el-icon> 添加批次
            </el-button>
          </div>
          <el-divider />

          <div v-for="(batch, index) in formData.batches" :key="index" class="batch-item">
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
                    placeholder="数量"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-empty v-if="formData.batches.length === 0" description="暂无批次信息，点击上方按钮添加" :image-size="80" />
        </div>

        <!-- ========== 步骤4: 序列号 ========== -->
        <div v-show="activeStep === 3" class="step-content">
          <div class="step-header">
            <h3><el-icon><Tickets /></el-icon> 序列号管理</h3>
            <div class="step-actions">
              <el-button type="primary" size="small" @click="addSerialNumber">
                <el-icon><Plus /></el-icon> 添加序列号
              </el-button>
              <el-button size="small" @click="batchGenerateSN">
                <el-icon><Refresh /></el-icon> 批量生成
              </el-button>
            </div>
          </div>
          <el-divider />

          <div class="serial-number-area">
            <el-alert
              type="info"
              :closable="false"
              show-icon
              style="margin-bottom: 16px;"
            >
              <template #title>
                序列号用于追踪单个产品的生命周期，可手动输入或批量生成
              </template>
            </el-alert>

            <el-table :data="formData.serialNumbers" border style="width: 100%" max-height="300">
              <el-table-column type="index" label="#" width="50" />
              <el-table-column prop="serialNo" label="序列号" min-width="180">
                <template #default="{ row, $index }">
                  <el-input
                    v-model="row.serialNo"
                    placeholder="请输入序列号"
                    size="small"
                    clearable
                  />
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="120" align="center">
                <template #default>
                  <el-tag type="success" size="small">在库</el-tag>
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
            <el-empty v-if="formData.serialNumbers.length === 0" description="暂无序列号，请添加" :image-size="60" style="padding: 20px 0;" />
          </div>
        </div>

        <!-- ========== 步骤5: 附加信息 ========== -->
        <div v-show="activeStep === 4" class="step-content">
          <div class="step-header">
            <h3><el-icon><Document /></el-icon> 附加信息</h3>
            <span class="step-required">选填信息</span>
          </div>
          <el-divider />

          <el-row :gutter="24">
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="质检状态" prop="qualityStatus">
                <el-radio-group v-model="formData.qualityStatus">
                  <el-radio label="合格">✅ 合格</el-radio>
                  <el-radio label="待检">⏳ 待检</el-radio>
                  <el-radio label="不合格">❌ 不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="质检员" prop="inspector">
                <el-input v-model="formData.inspector" placeholder="请输入质检员姓名" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="质检日期" prop="inspectionDate">
                <el-date-picker
                  v-model="formData.inspectionDate"
                  type="date"
                  placeholder="选择质检日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="质检结论" prop="inspectionResult">
                <el-input v-model="formData.inspectionResult" placeholder="请输入质检结论" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="其他备注" prop="extraRemark">
                <el-input
                  v-model="formData.extraRemark"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入其他备注信息"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="附件上传">
                <el-upload
                  action="#"
                  :auto-upload="false"
                  :limit="5"
                  list-type="text"
                  :on-change="handleFileChange"
                  :on-remove="handleFileRemove"
                >
                  <el-button size="small" type="primary">
                    <el-icon><Upload /></el-icon> 选择文件
                  </el-button>
                  <template #tip>
                    <div style="font-size: 12px; color: #909399;">
                      支持 .pdf, .doc, .jpg, .png 文件，每个文件不超过10MB
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- ========== 步骤6: 确认提交 ========== -->
        <div v-show="activeStep === 5" class="step-content">
          <div class="step-header">
            <h3><el-icon><Check /></el-icon> 确认提交</h3>
          </div>
          <el-divider />

          <div class="confirm-content">
            <el-alert type="success" :closable="false" show-icon style="margin-bottom: 20px;">
              <template #title>
                请仔细核对以下信息，确认无误后提交
              </template>
            </el-alert>

            <el-descriptions :column="3" border>
              <el-descriptions-item label="产品名称">{{ formData.product || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="SKU">{{ formData.sku || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="分类">{{ formData.category || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="品牌">{{ formData.brand || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="型号">{{ formData.model || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="单位">{{ formData.unit || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="单价">{{ formatCurrency(formData.price) }}</el-descriptions-item>
              <el-descriptions-item label="成本价">{{ formatCurrency(formData.cost) }}</el-descriptions-item>
              <el-descriptions-item label="入库数量">{{ formData.quantity || 0 }}</el-descriptions-item>
              <el-descriptions-item label="目标仓库">{{ formData.warehouse || '未选择' }}</el-descriptions-item>
              <el-descriptions-item label="入库类型">{{ getStockTypeLabel(formData.stockType) }}</el-descriptions-item>
              <el-descriptions-item label="入库日期">{{ formData.stockDate || '未选择' }}</el-descriptions-item>
              <el-descriptions-item label="批次数量">{{ formData.batches.length }}</el-descriptions-item>
              <el-descriptions-item label="序列号数量">{{ formData.serialNumbers.length }}</el-descriptions-item>
              <el-descriptions-item label="质检状态">{{ formData.qualityStatus || '未设置' }}</el-descriptions-item>
            </el-descriptions>

            <div class="confirm-stats">
              <el-row :gutter="20" style="margin-top: 20px;">
                <el-col :span="8">
                  <el-statistic title="总入库数量" :value="formData.quantity || 0" suffix="件" />
                </el-col>
                <el-col :span="8">
                  <el-statistic title="总金额" :value="formData.quantity * formData.price || 0" suffix="SAR" :formatter="formatCurrency" />
                </el-col>
                <el-col :span="8">
                  <el-statistic title="总批次" :value="formData.batches.length" suffix="批" />
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>

    <!-- 底部操作栏 -->
    <div class="form-actions">
      <div class="actions-left">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon> 取消
        </el-button>
        <el-button @click="handleSaveDraft" :loading="savingDraft">
          <el-icon><Document /></el-icon> 保存草稿
        </el-button>
      </div>
      <div class="actions-right">
        <el-button @click="prevStep" :disabled="activeStep === 0">
          <el-icon><ArrowLeft /></el-icon> 上一步
        </el-button>
        <el-button type="primary" @click="nextStep" v-if="activeStep < 5">
          下一步 <el-icon><ArrowRight /></el-icon>
        </el-button>
        <el-button type="success" @click="handleSubmit" :loading="submitting" v-if="activeStep === 5">
          <el-icon><Check /></el-icon> 确认入库
        </el-button>
      </div>
    </div>

    <!-- 提交成功对话框 -->
    <el-dialog v-model="showSuccessDialog" title="🎉 入库成功" width="420px" :close-on-click-modal="false">
      <div class="success-content">
        <el-icon class="success-icon" :size="64"><CircleCheck /></el-icon>
        <h3>产品已成功入库</h3>
        <p><strong>{{ formData.product }}</strong> 已成功入库 {{ formData.quantity }} 件</p>
        <p class="success-id">入库单号: {{ submittedId || 'IN-2026-001' }}</p>
        <el-alert type="info" :closable="false" show-icon>
          <template #title>
            库存已更新，可在库存列表中查看
          </template>
        </el-alert>
      </div>
      <template #footer>
        <el-button @click="showSuccessDialog = false">继续录入</el-button>
        <el-button type="primary" @click="handleViewDetail">查看库存</el-button>
        <el-button type="success" @click="handleCreateAnother">录入下一个</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import {
  ArrowLeft, ArrowRight, Goods, Upload, Files, Tickets, Document,
  Check, Plus, Delete, Refresh, CircleCheck, Edit, Search, Clock,
  Warning, InformationFilled, Calendar, Phone, Message, Location,
  OfficeBuilding, Setting, Money, Grid, Promotion, List, FolderOpened,
  Download, Printer, User, Box, Collection, HomeFilled, ShoppingCart
} from '@element-plus/icons-vue'

// ==================== Router ====================
const router = useRouter()

// ==================== 引用 ====================
const formRef = ref<FormInstance>()
const activeStep = ref(0)
const submitting = ref(false)
const savingDraft = ref(false)
const showSuccessDialog = ref(false)
const submittedId = ref('')

// ==================== 表单数据 ====================
const formData = reactive({
  // 基本信息
  product: '',
  sku: '',
  category: '',
  brand: '',
  model: '',
  specification: '',
  unit: '个',
  price: 0,
  cost: 0,
  description: '',

  // 入库信息
  stockType: 'purchase',
  warehouse: '',
  location: '',
  quantity: 1,
  stockDate: '',
  referenceNo: '',
  supplier: '',
  safetyStock: 50,
  maxStock: 200,
  stockRemark: '',

  // 批次信息
  batches: [] as Batch[],

  // 序列号
  serialNumbers: [] as SerialNumber[],

  // 附加信息
  qualityStatus: '合格',
  inspector: '',
  inspectionDate: '',
  inspectionResult: '',
  extraRemark: '',
  attachments: [] as File[]
})

// ==================== 类型定义 ====================
interface Batch {
  batchNo: string
  productionDate: string
  expiryDate: string
  quantity: number
}

interface SerialNumber {
  serialNo: string
  status: string
}

// ==================== 表单验证规则 ====================
const formRules: FormRules = {
  product: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '产品名称长度应在2-50字符之间', trigger: 'blur' }
  ],
  sku: [
    { required: true, message: '请输入SKU编码', trigger: 'blur' },
    { pattern: /^[A-Z0-9\-]{4,20}$/, message: 'SKU格式不正确，请使用大写字母、数字和连字符', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', min: 0, message: '单价必须大于等于0', trigger: 'blur' }
  ],
  stockType: [{ required: true, message: '请选择入库类型', trigger: 'change' }],
  warehouse: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  quantity: [
    { required: true, message: '请输入入库数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
  ],
  stockDate: [{ required: true, message: '请选择入库日期', trigger: 'change' }]
}

// ==================== 方法 ====================
// 格式化货币
const formatCurrency = (value: number) => {
  if (!value) return 'SAR 0'
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0
  }).format(value)
}

// 获取入库类型标签
const getStockTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    purchase: '采购入库',
    return: '退货入库',
    transfer: '调拨入库',
    production: '生产入库',
    other: '其他入库'
  }
  return map[type] || type
}

// 生成SKU
const generateSKU = () => {
  const prefix = formData.category ? formData.category.slice(0, 3).toUpperCase() : 'PRD'
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  formData.sku = `${prefix}-${year}${month}-${random}`
  ElMessage.success(`已生成SKU: ${formData.sku}`)
}

// 添加上一步
const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

// 下一步
const nextStep = async () => {
  const stepFields = getStepFields(activeStep.value)
  if (stepFields.length > 0) {
    try {
      await formRef.value?.validateFields(stepFields)
      if (activeStep.value < 5) {
        activeStep.value++
      }
    } catch (error) {
      ElMessage.warning('请完善当前步骤的必填信息')
    }
  } else {
    if (activeStep.value < 5) {
      activeStep.value++
    }
  }
}

// 获取当前步骤的字段
const getStepFields = (step: number): string[] => {
  const fieldMap: Record<number, string[]> = {
    0: ['product', 'sku', 'category', 'unit', 'price'],
    1: ['stockType', 'warehouse', 'quantity', 'stockDate'],
    2: [],
    3: [],
    4: [],
    5: []
  }
  return fieldMap[step] || []
}

// 添加批次
const addBatch = () => {
  formData.batches.push({
    batchNo: `BATCH-${new Date().getFullYear()}-${String(formData.batches.length + 1).padStart(3, '0')}`,
    productionDate: '',
    expiryDate: '',
    quantity: 1
  })
}

// 删除批次
const removeBatch = (index: number) => {
  formData.batches.splice(index, 1)
}

// 添加序列号
const addSerialNumber = () => {
  const sn = `SN-${new Date().getFullYear()}-${String(formData.serialNumbers.length + 1).padStart(4, '0')}`
  formData.serialNumbers.push({ serialNo: sn, status: '在库' })
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

// 删除序列号
const removeSerialNumber = (index: number) => {
  formData.serialNumbers.splice(index, 1)
}

// 文件上传
const handleFileChange = (file: any) => {
  formData.attachments.push(file.raw)
  ElMessage.success(`已添加文件: ${file.name}`)
}

const handleFileRemove = (file: any) => {
  const index = formData.attachments.indexOf(file.raw)
  if (index > -1) {
    formData.attachments.splice(index, 1)
  }
}

// 保存草稿
const handleSaveDraft = async () => {
  savingDraft.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    localStorage.setItem('inventory_draft_data', JSON.stringify(formData))
    ElMessage.success('草稿已保存')
  } catch (error) {
    ElMessage.error('保存草稿失败')
  } finally {
    savingDraft.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))

    submittedId.value = `IN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

    ElMessage.success('入库提交成功！')
    showSuccessDialog.value = true
    localStorage.removeItem('inventory_draft_data')
  } catch (error) {
    ElMessage.error('提交失败，请检查表单')
  } finally {
    submitting.value = false
  }
}

// 查看详情
const handleViewDetail = () => {
  showSuccessDialog.value = false
  router.push('/inventory')
}

// 创建另一个
const handleCreateAnother = () => {
  showSuccessDialog.value = false
  Object.assign(formData, {
    product: '',
    sku: '',
    category: '',
    brand: '',
    model: '',
    specification: '',
    unit: '个',
    price: 0,
    cost: 0,
    description: '',
    stockType: 'purchase',
    warehouse: '',
    location: '',
    quantity: 1,
    stockDate: '',
    referenceNo: '',
    supplier: '',
    safetyStock: 50,
    maxStock: 200,
    stockRemark: '',
    batches: [],
    serialNumbers: [],
    qualityStatus: '合格',
    inspector: '',
    inspectionDate: '',
    inspectionResult: '',
    extraRemark: '',
    attachments: []
  })
  activeStep.value = 0
  generateSKU()
  ElMessage.success('已重置表单，可继续录入')
}

// 返回
const handleBack = () => {
  if (formData.product || formData.quantity || formData.warehouse) {
    ElMessageBox.confirm('有未保存的数据，确定要离开吗？', '提示', {
      confirmButtonText: '确定离开',
      cancelButtonText: '继续填写',
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
  generateSKU()
  const draft = localStorage.getItem('inventory_draft_data')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      ElMessageBox.confirm('发现未完成的草稿，是否恢复？', '草稿恢复', {
        confirmButtonText: '恢复草稿',
        cancelButtonText: '丢弃草稿',
        type: 'info'
      }).then(() => {
        Object.assign(formData, draftData)
        ElMessage.success('草稿已恢复')
      }).catch(() => {
        localStorage.removeItem('inventory_draft_data')
      })
    } catch (error) {
      localStorage.removeItem('inventory_draft_data')
    }
  }
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.inventory-create-page {
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

.back-btn {
  padding: 8px 16px;
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
}

/* ==================== 步骤条 ==================== */
.step-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.step-card :deep(.el-step__title) {
  font-size: 13px;
}

.step-card :deep(.el-step__description) {
  font-size: 11px;
}

/* ==================== 表单卡片 ==================== */
.form-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.step-content {
  padding: 8px 4px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.step-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-required {
  font-size: 12px;
  color: #F56C6C;
}

.step-actions {
  display: flex;
  gap: 8px;
}

/* ==================== 批次信息 ==================== */
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

/* ==================== 序列号区域 ==================== */
.serial-number-area {
  padding: 4px 0;
}

/* ==================== 确认提交 ==================== */
.confirm-content {
  padding: 4px 0;
}

.confirm-stats {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-top: 12px;
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
  margin-top: -10px;
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

.success-id {
  font-size: 14px;
  color: #409EFF;
  font-weight: 600;
  background: #ecf5ff;
  padding: 4px 16px;
  border-radius: 4px;
  display: inline-block;
  margin: 8px 0 !important;
}

.success-content .el-alert {
  margin-top: 16px;
  text-align: left;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .inventory-create-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    width: 100%;
  }

  .header-right {
    width: 100%;
    justify-content: flex-start;
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

  .step-card :deep(.el-step) {
    padding: 0 4px;
  }

  .step-card :deep(.el-step__title) {
    font-size: 11px;
  }

  .step-card :deep(.el-step__description) {
    display: none;
  }

  .batch-item {
    padding: 12px 14px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .form-actions {
    padding: 12px 16px;
  }

  .actions-left .el-button,
  .actions-right .el-button {
    font-size: 13px;
    padding: 8px 12px;
  }

  .step-header h3 {
    font-size: 16px;
  }

  .confirm-stats .el-col {
    margin-bottom: 12px;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .inventory-create-page {
    background: white;
    padding: 16px;
  }

  .form-actions,
  .header-right,
  .back-btn {
    display: none !important;
  }

  .step-card :deep(.el-step__icon) {
    display: none;
  }

  .page-subtitle {
    color: #303133 !important;
  }
}
</style>