<!-- 
  文件路径: frontend/src/modules/analytics/pages/Create.vue
  功能: 创建分析报告 - 新建分析报告
-->

<template>
  <div class="analytics-create-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>📊 创建分析报告</h1>
          <p class="header-subtitle">选择分析类型，配置参数，生成专业分析报告</p>
        </div>
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
              <el-form-item label="报告名称" prop="name" required>
                <el-input
                  v-model="form.name"
                  placeholder="请输入分析报告名称"
                  clearable
                />
                <div class="form-hint">建议使用清晰明确的名称，便于识别</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分析类型" prop="type" required>
                <el-select v-model="form.type" placeholder="请选择分析类型" style="width: 100%">
                  <el-option label="📈 销售分析" value="sales" />
                  <el-option label="👤 客户分析" value="customer" />
                  <el-option label="📦 产品分析" value="product" />
                  <el-option label="🔗 渠道分析" value="channel" />
                  <el-option label="⚖️ 对比分析" value="comparison" />
                  <el-option label="📊 趋势分析" value="trend" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="分析维度" prop="dimension">
                <el-select v-model="form.dimension" placeholder="请选择分析维度" style="width: 100%">
                  <el-option label="按产品" value="product" />
                  <el-option label="按客户" value="customer" />
                  <el-option label="按地区" value="region" />
                  <el-option label="按时间" value="time" />
                  <el-option label="按渠道" value="channel" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对比周期" prop="compare">
                <el-select v-model="form.compare" placeholder="请选择对比周期" style="width: 100%">
                  <el-option label="环比 (MoM)" value="mom" />
                  <el-option label="同比 (YoY)" value="yoy" />
                  <el-option label="无对比" value="none" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 数据范围 -->
        <div class="form-section">
          <div class="section-title">
            <span>📅 数据范围</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="日期范围" prop="dateRange" required>
                <el-date-picker
                  v-model="form.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据粒度">
                <el-radio-group v-model="form.granularity">
                  <el-radio-button label="day">日</el-radio-button>
                  <el-radio-button label="week">周</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="quarter">季度</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 高级设置 -->
        <div class="form-section">
          <div class="section-title">
            <span>⚙️ 高级设置</span>
            <el-button type="text" @click="showAdvanced = !showAdvanced">
              {{ showAdvanced ? '收起' : '展开' }}
              <el-icon><component :is="showAdvanced ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
            </el-button>
          </div>

          <el-collapse-transition>
            <div v-show="showAdvanced">
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="分析指标">
                    <el-select
                      v-model="form.metrics"
                      multiple
                      placeholder="请选择分析指标"
                      style="width: 100%"
                    >
                      <el-option label="销售额" value="sales" />
                      <el-option label="利润" value="profit" />
                      <el-option label="订单量" value="orders" />
                      <el-option label="客户数" value="customers" />
                      <el-option label="转化率" value="conversion" />
                      <el-option label="客单价" value="avgOrder" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="图表类型">
                    <el-select v-model="form.chartType" placeholder="请选择图表类型" style="width: 100%">
                      <el-option label="柱状图" value="bar" />
                      <el-option label="折线图" value="line" />
                      <el-option label="饼图" value="pie" />
                      <el-option label="散点图" value="scatter" />
                      <el-option label="热力图" value="heatmap" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="数据源">
                    <el-select v-model="form.dataSource" placeholder="请选择数据源" style="width: 100%">
                      <el-option label="业务数据库" value="business" />
                      <el-option label="数据仓库" value="warehouse" />
                      <el-option label="实时数据" value="realtime" />
                      <el-option label="历史数据" value="historical" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="输出格式">
                    <el-radio-group v-model="form.outputFormat">
                      <el-radio-button label="pdf">PDF</el-radio-button>
                      <el-radio-button label="excel">Excel</el-radio-button>
                      <el-radio-button label="html">HTML</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-transition>
        </div>

        <!-- 描述信息 -->
        <div class="form-section">
          <div class="section-title">
            <span>📝 描述信息</span>
          </div>

          <el-form-item label="报告描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请描述分析报告的目的、范围和使用方法..."
              maxlength="500"
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

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button size="large" @click="handleReset">重置</el-button>
          <el-button size="large" @click="handlePreview">
            <el-icon><View /></el-icon> 预览
          </el-button>
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
            <el-icon><Check /></el-icon> 创建分析报告
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="报告预览"
      width="800px"
      top="5vh"
      :destroy-on-close="true"
    >
      <div class="preview-container">
        <div class="preview-header">
          <div>
            <h3>{{ form.name || '未命名分析报告' }}</h3>
            <div class="preview-meta">
              <el-tag :type="getTypeTag(form.type)" size="small">
                {{ getTypeLabel(form.type) }}
              </el-tag>
              <span>维度: {{ getDimensionLabel(form.dimension) }}</span>
              <span>对比: {{ getCompareLabel(form.compare) }}</span>
            </div>
          </div>
          <el-tag :type="form.status === 'active' ? 'success' : 'info'" size="large">
            草稿
          </el-tag>
        </div>

        <el-divider />

        <div class="preview-body">
          <el-row :gutter="20" class="preview-stats">
            <el-col :span="6" v-for="stat in previewStats" :key="stat.label">
              <div class="preview-stat">
                <div class="preview-stat-label">{{ stat.label }}</div>
                <div class="preview-stat-value">{{ stat.value }}</div>
              </div>
            </el-col>
          </el-row>

          <div class="preview-chart-placeholder">
            <el-empty description="图表将在报告生成后显示" />
          </div>
        </div>

        <el-divider />

        <div class="preview-footer">
          <div class="preview-info">
            <span>创建人: {{ form.createdBy || '当前用户' }}</span>
            <span>创建时间: {{ new Date().toLocaleString() }}</span>
            <span>数据范围: {{ formatDateRange(form.dateRange) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSubmit; previewVisible = false">
          <el-icon><Check /></el-icon> 确认创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, ArrowUp, ArrowDown, View, Check
} from '@element-plus/icons-vue'

// ============================================================
// 路由
// ============================================================

const router = useRouter()

// ============================================================
// 响应式数据
// ============================================================

const formRef = ref()
const submitting = ref(false)
const previewVisible = ref(false)
const showAdvanced = ref(false)

// ============================================================
// 表单数据
// ============================================================

const form = reactive({
  name: '',
  type: 'sales',
  dimension: 'product',
  compare: 'mom',
  dateRange: [] as [Date, Date] | [],
  granularity: 'month',
  metrics: ['sales', 'profit', 'orders'],
  chartType: 'bar',
  dataSource: 'business',
  outputFormat: 'pdf',
  description: '',
  remark: '',
  createdBy: '当前用户',
  status: 'draft'
})

// ============================================================
// 预览统计数据
// ============================================================

const previewStats = ref([
  { label: '总销售额', value: 'SAR 12,856,000' },
  { label: '总订单数', value: '1,286' },
  { label: '客单价', value: 'SAR 9,998' },
  { label: '增长率', value: '+12.5%' },
])

// ============================================================
// 表单验证规则
// ============================================================

const rules = {
  name: [
    { required: true, message: '请输入报告名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符之间', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择分析类型', trigger: 'change' }
  ],
  dateRange: [
    { required: true, message: '请选择日期范围', trigger: 'change' }
  ],
  dimension: [
    { required: true, message: '请选择分析维度', trigger: 'change' }
  ]
}

// ============================================================
// 工具函数
// ============================================================

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    sales: '销售分析',
    customer: '客户分析',
    product: '产品分析',
    channel: '渠道分析',
    comparison: '对比分析',
    trend: '趋势分析'
  }
  return map[type] || type
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    sales: 'primary',
    customer: 'success',
    product: 'warning',
    channel: 'danger',
    comparison: 'info',
    trend: 'primary'
  }
  return map[type] || 'info'
}

const getDimensionLabel = (dimension: string) => {
  const map: Record<string, string> = {
    product: '按产品',
    customer: '按客户',
    region: '按地区',
    time: '按时间',
    channel: '按渠道'
  }
  return map[dimension] || dimension
}

const getCompareLabel = (compare: string) => {
  const map: Record<string, string> = {
    mom: '环比 (MoM)',
    yoy: '同比 (YoY)',
    none: '无对比'
  }
  return map[compare] || compare
}

const formatDateRange = (range: [Date, Date] | []) => {
  if (!range || range.length !== 2) return '未选择'
  const start = new Date(range[0]).toLocaleDateString('zh-CN')
  const end = new Date(range[1]).toLocaleDateString('zh-CN')
  return `${start} 至 ${end}`
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  if (form.name || form.description) {
    ElMessageBox.confirm('确定要返回吗？已填写的内容将不会被保存。', '确认返回', {
      type: 'warning'
    }).then(() => {
      router.push('/analytics')
    }).catch(() => {})
  } else {
    router.push('/analytics')
  }
}

const handleReset = () => {
  ElMessageBox.confirm('确定要重置所有表单数据吗？', '确认重置', {
    type: 'warning'
  }).then(() => {
    Object.assign(form, {
      name: '',
      type: 'sales',
      dimension: 'product',
      compare: 'mom',
      dateRange: [],
      granularity: 'month',
      metrics: ['sales', 'profit', 'orders'],
      chartType: 'bar',
      dataSource: 'business',
      outputFormat: 'pdf',
      description: '',
      remark: '',
      createdBy: '当前用户',
      status: 'draft'
    })
    formRef.value?.resetFields()
    ElMessage.success('已重置所有数据')
  }).catch(() => {})
}

const handlePreview = () => {
  if (!form.name) {
    ElMessage.warning('请先填写报告名称')
    return
  }
  if (!form.dateRange || form.dateRange.length !== 2) {
    ElMessage.warning('请选择日期范围')
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
        message: `✅ 分析报告 "${form.name}" 创建成功！`,
        duration: 3000
      })
      router.push('/analytics')
    } catch (error) {
      ElMessage.error('创建失败，请重试')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped>
.analytics-create-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* ============================================================
   页面头部
   ============================================================ */

.page-header {
  margin-bottom: 24px;
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

.section-title .el-button {
  font-size: 14px;
  font-weight: 400;
}

.form-hint {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
  line-height: 1.4;
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

/* ============================================================
   预览对话框
   ============================================================ */

.preview-container {
  padding: 4px 0;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.preview-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #1F2937;
}

.preview-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.preview-meta span {
  font-size: 13px;
  color: #6B7280;
}

.preview-stats {
  margin-bottom: 16px;
}

.preview-stat {
  text-align: center;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
}

.preview-stat-label {
  font-size: 13px;
  color: #6B7280;
}

.preview-stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1F2937;
  margin-top: 4px;
}

.preview-chart-placeholder {
  padding: 20px 0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-info {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #9CA3AF;
  flex-wrap: wrap;
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

[data-theme="dark"] .analytics-create-page {
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

[data-theme="dark"] .form-hint {
  color: #6B7280;
}

[data-theme="dark"] .form-actions {
  border-color: #3A3A3C;
}

[data-theme="dark"] .preview-stat {
  background: #3A3A3C;
}

[data-theme="dark"] .preview-stat-value {
  color: #F5F5F7;
}

[data-theme="dark"] .preview-header h3 {
  color: #F5F5F7;
}

[data-theme="dark"] .preview-meta span {
  color: #9CA3AF;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .analytics-create-page {
    padding: 16px;
  }

  .main-card :deep(.el-card__body) {
    padding: 20px 16px;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
    justify-content: center;
  }

  .preview-header {
    flex-direction: column;
    gap: 12px;
  }

  .preview-footer {
    flex-direction: column;
  }

  .preview-info {
    flex-direction: column;
    gap: 4px;
  }
}
</style>